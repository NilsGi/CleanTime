function isGroupInMapView(g){
  if (isMobileMapCollapsed()) return true;
  if (!listFollowsMap || !map || !groupMatchesMap(g)) return true;
  const bounds = map.getBounds();
  return bounds.contains([g.latitude, g.longitude]);
}

function initMap(){
  if (typeof L === "undefined") {
    setStatus('<span class="bad">Leaflet laddades inte.</span>');
    return false;
  }

  map = L.map("map", { attributionControl: true, keyboard: false }).setView([62.0, 15.0], 5);
  map.attributionControl.setPrefix(false);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }).addTo(map);

  map.on("moveend zoomend", () => {
    if (!suppressMapMoveRender && listFollowsMap && !isMobileMapCollapsed()) {
      renderAll(true);
    }
  });

  if (typeof L.markerClusterGroup === "function") {
    markersLayer = L.markerClusterGroup({
      showCoverageOnHover:false,
      zoomToBoundsOnClick:false,
      spiderfyOnMaxZoom:true,
      disableClusteringAtZoom:14,
      maxClusterRadius:45,
      iconCreateFunction: function(cluster){
        const childMarkers = cluster.getAllChildMarkers();
        const totalMeetings = childMarkers.reduce((sum, m) => sum + (m.meetingCount || 1), 0);
        const districtCounts = {};

        childMarkers.forEach(marker => {
          const district = marker.meetingGroup?.district || "Okänt distrikt";
          districtCounts[district] = (districtCounts[district] || 0) + (marker.meetingCount || 1);
        });

        const dominantDistrict = Object.keys(districtCounts)
          .sort((a,b) => districtCounts[b] - districtCounts[a])[0];
	        const color = getDistrictColor(dominantDistrict || "Okänt distrikt");
	        const textColor = textColorForBackground(color);
	
	        return L.divIcon({
	          html: '<div style="background:' + esc(color) + '!important;color:' + esc(textColor) + '!important"><span>' + totalMeetings + '</span></div>',
	          className: 'district-cluster-marker',
	          iconSize: L.point(40, 40)
	        });
      }
    }).addTo(map);

    markersLayer.on("clusterclick", function(event){
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      if (event.originalEvent) {
        L.DomEvent.stop(event.originalEvent);
      }

      const childGroups = event.layer.getAllChildMarkers()
        .map(marker => marker.meetingGroup)
        .filter(Boolean)
        .sort(compareGroupsByDayTime);

      if (!childGroups.length) return;

      if (window.innerWidth <= 900) {
        showMobileClusterSheet(childGroups);
        requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
        setTimeout(() => window.scrollTo(scrollX, scrollY), 80);
        return;
      }

      suppressMapMoveRender = true;
      L.popup({
        maxWidth: window.innerWidth <= 900 ? 330 : 420,
        maxHeight: window.innerWidth <= 900 ? Math.round(window.innerHeight * 0.5) : 440,
        autoPan: false,
        keepInView: true,
        closeButton: true
      })
        .setLatLng(event.layer.getLatLng())
        .setContent(clusterPopupHtml(childGroups))
        .openOn(map);
      setTimeout(() => {
        suppressMapMoveRender = false;
      }, 150);
    });
  } else {
    markersLayer = L.layerGroup().addTo(map);
  }

  setStatus('<span class="ok">Kartan laddad.</span>');
  return true;
}

function fitGroupsOnMap(groups){
  if (!map || !groups || !groups.length) return;

  const points = groups
    .filter(groupMatchesMap)
    .map(g => [g.latitude, g.longitude]);

  if (!points.length) return;

  suppressMapMoveRender = true;

  if (points.length === 1) {
    map.setView(points[0], 14);
  } else {
    map.fitBounds(points, {
      padding: [35, 35],
      maxZoom: 13
    });
  }

  setTimeout(() => {
    suppressMapMoveRender = false;
    if (listFollowsMap && !isMobileMapCollapsed()) {
      renderAll(true);
    }
  }, 250);
}

function renderMarkers(groups){
  markersLayer.clearLayers();
  const bounds = [];

	  groups.forEach(g => {
	    const color = g.color || getDistrictColor(g.district);
	    const textColor = textColorForBackground(color);
	    const marker = L.marker([g.latitude, g.longitude], {
	      icon: L.divIcon({
	        className: 'meeting-count-marker',
	        html: '<div style="background:' + esc(color) + ';color:' + esc(textColor) + '">' + g.meetings.length + '</div>',
	        iconSize: [32, 32],
	        iconAnchor: [16, 16]
	      })
	    });

    marker.on("click", event => {
      if (window.innerWidth <= 900) {
        if (event.originalEvent) {
          L.DomEvent.stop(event.originalEvent);
        }
        map.closePopup();
        showMobileClusterSheet([g]);
        return;
      }

      L.popup({
        maxWidth: 420,
        maxHeight: 440,
        keepInView: true,
        closeButton: true
      })
        .setLatLng([g.latitude, g.longitude])
        .setContent(groupPopupHtml(g))
        .openOn(map);
    });

    marker.meetingCount = g.meetings.length;
    marker.meetingGroup = g;

    marker.addTo(markersLayer);
    bounds.push([g.latitude,g.longitude]);
  });

  // Kartan zoomas inte automatiskt här, annars kan listan inte följa användarens aktuella kartvy.
}

function clusterPopupHtml(groups){
  const totalMeetings = groups.reduce((sum, g) => sum + g.meetings.length, 0);
  const groupHtml = groups.map(g => {
    const meetingsHtml = [...g.meetings]
      .sort(compareMeetingsByDayTime)
      .map(m => {
        const addressRows = [m.location, [m.address, m.zip].filter(Boolean).join(", ")]
          .filter(Boolean)
          .map(esc);
        const address = addressRows.join("<br>");
        return `
          <div class="meeting-time">
            ${esc(cleanDay(m.days))} ${esc((m.startTime||"").slice(0,5))}–${esc((m.endTime||"").slice(0,5))}
            ${isOnline(m) ? " · Online" : " · Fysiskt"}
            ${address ? "<br>" + address : ""}
            ${m.station ? "<br><span class=\"muted\">Närmaste hållplats: " + esc(m.station) + "</span>" : ""}
            ${meetingActionButtonsHtml(m)}
          </div>
        `;
      }).join("");

    return `
      <div class="cluster-popup-group">
        <div class="cluster-popup-group-title">${esc(g.title)}</div>
        <div class="muted"><span class="district-swatch" style="background:${esc(g.color || getDistrictColor(g.district))}"></span>${esc(g.city)} · ${esc(g.district)}</div>
        ${meetingsHtml}
      </div>
    `;
  }).join("");

  return `
    <div class="cluster-popup">
      <div class="cluster-popup-title">${totalMeetings} möte${totalMeetings === 1 ? "" : "n"} här</div>
      <div class="cluster-popup-list">${groupHtml}</div>
    </div>
  `;
}

function showMobileClusterSheet(groups){
  let backdrop = $("mapClusterSheetBackdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "mapClusterSheetBackdrop";
    backdrop.className = "map-cluster-sheet-backdrop";
    backdrop.innerHTML = `
      <div class="map-cluster-sheet" role="dialog" aria-modal="true" aria-labelledby="mapClusterSheetTitle">
        <div class="map-cluster-sheet-header">
          <div id="mapClusterSheetTitle"></div>
          <button type="button" class="map-cluster-sheet-close" aria-label="Stäng">×</button>
        </div>
        <div class="map-cluster-sheet-body"></div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) closeMobileClusterSheet();
    });

    const closeButton = backdrop.querySelector(".map-cluster-sheet-close");
    if (closeButton) closeButton.addEventListener("click", closeMobileClusterSheet);
  }

  const totalMeetings = groups.reduce((sum, g) => sum + g.meetings.length, 0);
  const title = backdrop.querySelector("#mapClusterSheetTitle");
  const body = backdrop.querySelector(".map-cluster-sheet-body");

  if (title) title.textContent = totalMeetings + " möte" + (totalMeetings === 1 ? "" : "n") + " här";
  if (body) body.innerHTML = clusterPopupHtml(groups).replace(/<div class="cluster-popup-title">[\s\S]*?<\/div>/, "");

  backdrop.classList.add("open");
}

function closeMobileClusterSheet(){
  const backdrop = $("mapClusterSheetBackdrop");
  if (backdrop) backdrop.classList.remove("open");
}

function groupPopupHtml(g){
  const times = g.meetings.map(m => {
    const types = getTypes(m).map(t=>'<span class="pill">'+esc(t)+'</span>').join(" ");
    const address = [m.location,m.address,m.zip].filter(Boolean).join(", ");
    return `
      <div class="meeting-time">
        ${esc(cleanDay(m.days))} ${esc((m.startTime||"").slice(0,5))}–${esc((m.endTime||"").slice(0,5))}
        ${isOnline(m) ? " · Online" : " · Fysiskt"}
        ${address ? "<br>" + esc(address) : ""}
        ${m.station ? "<br><span class=\"muted\">Närmaste hållplats: " + esc(m.station) + "</span>" : ""}
        ${m.information ? "<div class=\"meeting-info\">" + formatInformation(m.information) + "</div>" : ""}
        <br>${types}
        ${meetingActionButtonsHtml(m)}
      </div>
    `;
  }).join("");

  const dist = g.distance != null ? "<br><b>Avstånd:</b> " + g.distance.toFixed(1) + " km" : "";
  const color = g.color || getDistrictColor(g.district);

  return `
    <div style="min-width:260px">
      <b>${esc(g.title)}</b><br>
      <span class="district-swatch" style="background:${esc(color)}"></span>${esc(g.city)} · ${esc(g.district)}<br>
      <b>${g.meetings.length} möte${g.meetings.length === 1 ? "" : "n"}</b>${dist}
      <div>${times}</div>
    </div>
  `;
}

function buildListHtml(groups){
  const sortByDistance = !!userPosition;
  const meetings = groups
    .flatMap(g => g.meetings.map(m => ({
      ...m,
      _groupKey: g.key,
      _groupTitle: g.title,
      _groupCity: g.city,
      _groupDistrict: g.district,
      _groupLat: g.latitude,
      _groupLng: g.longitude,
      _groupDistance: g.distance
    })))
    .sort((a,b) => {
      if (sortByDistance) {
        const distanceOrder = (a._groupDistance ?? Infinity) - (b._groupDistance ?? Infinity);
        if (distanceOrder) return distanceOrder;
      }
      return compareMeetingsByDayTime(a,b);
    });

  if (!meetings.length) {
    return "<p>Inga möten matchar filtret.</p>";
  }

  let currentDay = "";
  let html = "";

  meetings.forEach(m => {
    const day = cleanDay(m.days);

    if (sortByDistance && !html) {
      html += '<h2 class="day-heading">Närmaste möten</h2>';
    } else if (!sortByDistance && day !== currentDay) {
      currentDay = day;
      html += `<h2 class="day-heading">${esc(day)}</h2>`;
    }

    const types = getTypes(m).map(t=>'<span class="pill">'+esc(t)+'</span>').join("");
    const address = [m.location,m.address,m.zip].filter(Boolean).join(", ");
    const dist = m._groupDistance != null ? "<br><b>" + m._groupDistance.toFixed(1) + " km bort</b>" : "";
    const station = m.station ? `<br><span class="muted">Närmaste hållplats: ${esc(m.station)}</span>` : "";
    const info = m.information ? `<div class="meeting-info">${formatInformation(m.information)}</div>` : "";

    html += `
      <div class="meeting" data-lat="${esc(m._groupLat ?? "")}" data-lng="${esc(m._groupLng ?? "")}" data-popup-key="${esc(m._groupKey)}">
        <h3>${esc(m.title || m._groupTitle || "Okänt möte")}</h3>
        <div class="meeting-time-main"><b>${sortByDistance ? esc(day) + " " : ""}${esc((m.startTime||"").slice(0,5))}–${esc((m.endTime||"").slice(0,5))}</b></div>
        <div class="muted"><span class="district-swatch" style="background:${esc(getDistrictColor(getMeetingDistrict(m) || m._groupDistrict || "Okänt distrikt"))}"></span>${esc(getCity(m) || m._groupCity || "")} · ${esc(getMeetingDistrict(m) || m._groupDistrict || "")}</div>
        ${address ? `<div>${esc(address)}</div>` : ""}
        ${station}
        ${dist}
        ${info}
        <div>${types}</div>
        ${meetingActionButtonsHtml(m)}
      </div>
    `;
  });

  return html;
}

function bindListClicks(groups, containerId){
  const container = $(containerId);
  if (!container) return;

  container.querySelectorAll(".meeting[data-lat][data-lng]").forEach(el => {
    const lat = Number(el.getAttribute("data-lat"));
    const lng = Number(el.getAttribute("data-lng"));
    const key = el.getAttribute("data-popup-key");
    const g = groups.find(x => x.key === key);

    if (!isNaN(lat) && !isNaN(lng) && g && groupMatchesMap(g)) {
      el.style.cursor = "pointer";
      el.onclick = event => {
        // Knapparna inne i möteskortet ska inte öppna kartpopup/bottom sheet.
        if (event && event.target && event.target.closest(".meeting-actions, .meeting-action-link, .share-meeting-btn, .directions-meeting-btn, .copy-address, .directions-dialog")) {
          return;
        }
        map.setView([lat, lng], 15);
        if (window.innerWidth <= 900) {
          map.closePopup();
          showMobileClusterSheet([g]);
          return;
        }
        L.popup().setLatLng([lat, lng]).setContent(groupPopupHtml(g)).openOn(map);
      };
    }
  });
}

function renderList(groups){
  const html = buildListHtml(groups);

  const desktop = $("list");
  if (desktop) {
    desktop.innerHTML = html;
    bindListClicks(groups, "list");
  }

  const mobile = $("listMobile");
  if (mobile) {
    mobile.innerHTML = html;
    bindListClicks(groups, "listMobile");
  }
}

function fitVisible(){
  const groups = groupMeetingsForDisplay(filteredMeetings()).filter(groupMatchesMap);
  if (groups.length) {
    suppressMapMoveRender = true;
    map.fitBounds(groups.map(g=>[g.latitude,g.longitude]), {padding:[30,30]});
    setTimeout(() => {
      suppressMapMoveRender = false;
      if (!isMobileMapCollapsed()) renderAll(true);
    }, 250);
  }
}

function updateLayoutHeight(){
  const header = document.querySelector("header");
  const topButtons = document.querySelector(".top-buttons");
  const topHeight = (header?.offsetHeight || 0);
  const controlsHeight = (topButtons?.offsetHeight || 0);

  document.documentElement.style.setProperty("--top-height", topHeight + "px");
  document.documentElement.style.setProperty("--controls-height", controlsHeight + "px");

  if (map) {
    setTimeout(() => map.invalidateSize(), 50);
  }
}
