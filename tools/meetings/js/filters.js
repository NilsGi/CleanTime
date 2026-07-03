function selectedValues(id){
  const el = $(id);
  if (!el) return [];

  if (el.classList && el.classList.contains("checkbox-filter")) {
    return [...el.querySelectorAll('input[type="checkbox"]:checked')]
      .map(input => input.value)
      .filter(Boolean);
  }

  if (!el.multiple) return el.value ? [el.value] : [];
  return [...el.selectedOptions].map(o => o.value).filter(Boolean);
}

function setSelectedValues(id, values){
  const el = $(id);
  if (!el) return;
  const set = new Set(values || []);

  if (el.classList && el.classList.contains("checkbox-filter")) {
    [...el.querySelectorAll('input[type="checkbox"]')].forEach(input => {
      input.checked = set.has(input.value);
    });
    return;
  }

  [...el.options].forEach(opt => {
    opt.selected = set.has(opt.value);
  });
}

function hasActiveTextSearch(){
  const q = $("search")?.value?.trim();
  return !!q;
}

function getActiveFilterState(){
  return {
    q: ($("search")?.value || "").trim().toLowerCase(),
    cities: selectedValues("cityFilter"),
    districts: selectedValues("districtFilter"),
    days: selectedValues("dayFilter"),
    meetingTypes: selectedValues("meetingTypeFilter"),
    type: $("typeFilter")?.value || "",
    includeOnline: includeOnlineMeetings,
    maxDistance: Number($("distanceFilter")?.value || 0)
  };
}

function meetingMatchesState(m, state, ignore = new Set()){
  if (!ignore.has("search") && state.q && !meetingText(m).includes(state.q)) return false;
  if (!ignore.has("city") && state.cities.length && !state.cities.some(city => getCities(m).includes(city))) return false;
  if (!ignore.has("district") && state.districts.length && !state.districts.includes(getMeetingDistrict(m))) return false;
  if (!ignore.has("day") && state.days.length && !state.days.includes(m.days)) return false;
  if (!ignore.has("meetingType") && state.meetingTypes.length && !state.meetingTypes.some(t => getTypes(m).includes(t))) return false;
  if (!ignore.has("type")) {
    if (!state.includeOnline && isOnline(m)) return false;
    if (state.type === "online" && !isOnline(m)) return false;
    if (state.type === "physical" && isOnline(m)) return false;
  }
  if (!ignore.has("distance") && state.maxDistance && userPosition) {
    const d = distanceToMeeting(m);
    if (d === null || d > state.maxDistance) return false;
  }
  return true;
}

function countValues(meetings, valueGetter){
  const counts = new Map();
  meetings.forEach(m => {
    const values = valueGetter(m);
    (Array.isArray(values) ? values : [values]).forEach(value => {
      if (!value) return;
      counts.set(value, (counts.get(value) || 0) + 1);
    });
  });
  return [...counts.entries()]
    .sort((a,b) => String(a[0]).localeCompare(String(b[0]), "sv"))
    .map(([value,count]) => ({ value, label: value + " (" + count + ")" }));
}

function countDays(meetings){
  const counts = new Map();
  meetings.forEach(m => {
    if (!m.days) return;
    counts.set(m.days, (counts.get(m.days) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a,b) => dayOrder(a[0]) - dayOrder(b[0]))
    .map(([value,count]) => ({ value, label: cleanDay(value) + " (" + count + ")" }));
}

function meetingMatchesCurrentMapView(m){
  if (!listFollowsMap || !map || hasActiveTextSearch()) return true;

  // Listan behåller online-möten och möten utan koordinater även när kartan styr urvalet.
  // Därför gör filtren samma sak.
  if (isOnline(m) || !hasCoords(m)) return true;

  return map.getBounds().contains([Number(m.latitude), Number(m.longitude)]);
}

function fillDynamicSelect(id, items){
  const el = $(id);
  if (!el) return;

  const previous = selectedValues(id);
  const itemMap = new Map(items.map(item => [item.value, item]));

  // Behåll redan ikryssade värden även om de just nu hamnar utanför kartan.
  // De visas då som (0) så användaren själv kan kryssa ur dem.
  previous.forEach(value => {
    if (value && !itemMap.has(value)) {
      itemMap.set(value, { value, label: value + " (0)" });
    }
  });

  const finalItems = [...itemMap.values()].sort((a,b) => {
    if (id.toLowerCase().includes("day")) return dayOrder(a.value) - dayOrder(b.value);
    return String(a.value).localeCompare(String(b.value), "sv");
  });

  el.innerHTML = "";

  if (el.classList && el.classList.contains("checkbox-filter")) {
    if (!finalItems.length) {
      const empty = document.createElement("div");
      empty.className = "checkbox-filter-empty";
      empty.textContent = "Inga val finns för aktuellt urval.";
      el.appendChild(empty);
    }

    finalItems.forEach(item => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      const span = document.createElement("span");

      checkbox.type = "checkbox";
      checkbox.value = item.value;
      checkbox.checked = previous.includes(item.value);
      checkbox.addEventListener("change", () => {
        renderAll(false);
      });

      span.textContent = item.label || item.value;
      label.appendChild(checkbox);
      if (id.toLowerCase().includes("district")) {
        const swatch = document.createElement("span");
        swatch.className = "filter-swatch";
        swatch.style.background = getDistrictColor(item.value);
        label.appendChild(swatch);
      }
      label.appendChild(span);
      el.appendChild(label);
    });

    setSelectedValues(id, previous);
    return;
  }

  finalItems.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.textContent = item.label || item.value;
    el.appendChild(opt);
  });

  setSelectedValues(id, previous);
}

function updateDynamicFilters(applyMapView = false){
  if (!allMeetings.length) return;
  const state = getActiveFilterState();
  const baseMeetings = applyMapView
    ? allMeetings.filter(meetingMatchesCurrentMapView)
    : allMeetings;

  const cityMeetings = baseMeetings.filter(m => meetingMatchesState(m, state, new Set(["city"])));
  const districtMeetings = baseMeetings.filter(m => meetingMatchesState(m, state, new Set(["district"])));
  const dayMeetings = baseMeetings.filter(m => meetingMatchesState(m, state, new Set(["day"])));
  const meetingTypeMeetings = baseMeetings.filter(m => meetingMatchesState(m, state, new Set(["meetingType"])));

  fillDynamicSelect("cityFilter", countValues(cityMeetings, getCities));
  fillDynamicSelect("districtFilter", countValues(districtMeetings, getMeetingDistrict));
  fillDynamicSelect("dayFilter", countDays(dayMeetings));
  fillDynamicSelect("meetingTypeFilter", countValues(meetingTypeMeetings, getTypes));
}

function populateFiltersFromSmartProxy(json){
  updateDynamicFilters();
}

function populateFilters(){
  updateDynamicFilters();
}

function filteredMeetings(applyMapViewToFilters = false){
  updateDynamicFilters(applyMapViewToFilters);
  const state = getActiveFilterState();

  let list = allMeetings.filter(m => meetingMatchesState(m, state));

  if (userPosition) {
    list = list.map(m => ({...m, _distance: distanceToMeeting(m)}))
      .sort((a,b) => (a._distance ?? Infinity) - (b._distance ?? Infinity));
  } else {
    list.sort(compareMeetingsByDayTime);
  }

  return list;
}

function getFilterLabelText(){
  const rows = [];
  const cities = selectedFilterLabels("cityFilter");
  const districts = selectedFilterLabels("districtFilter");
  const days = selectedFilterLabels("dayFilter").map(cleanDay);
  const meetingTypes = selectedFilterLabels("meetingTypeFilter");
  const view = selectedFilterLabels("typeFilter");
  const search = $("search")?.value?.trim();
  const distance = $("distanceFilter")?.value;
  rows.push(["Ort", cities.length ? cities.join(", ") : "Alla"]);
  rows.push(["Distrikt", districts.length ? districts.join(", ") : "Alla"]);
  rows.push(["Dagar", days.length ? days.join(", ") : "Alla"]);
  rows.push(["Mötestyp", meetingTypes.length ? meetingTypes.join(", ") : "Alla"]);
  rows.push(["Visning", view.length ? view.join(", ") : "Alla möten i listan"]);
  if (search) rows.push(["Sökning", search]);
  if (distance) rows.push(["Avstånd", "Inom " + distance + " km"]);
  return rows;
}

function selectedFilterLabels(id){
  const el = $(id);
  if (!el) return [];

  function cleanLabel(label){
    return String(label || "").trim().replace(/\s*\(\d+\)$/, "");
  }

  if (el.classList && el.classList.contains("checkbox-filter")) {
    return [...el.querySelectorAll('input[type="checkbox"]:checked')]
      .map(input => cleanLabel(input.closest("label")?.textContent || input.value))
      .filter(Boolean);
  }

  if (el.multiple) {
    return [...el.selectedOptions]
      .map(option => cleanLabel(option.textContent))
      .filter(Boolean);
  }

  return el.value && el.selectedOptions && el.selectedOptions[0]
    ? [cleanLabel(el.selectedOptions[0].textContent)]
    : [];
}

function summarizeFilterValues(values){
  if (!values.length) return "";
  if (values.length <= 2) return values.join(", ");
  return values.slice(0, 2).join(", ") + " +" + (values.length - 2);
}

function getActiveFilterTags(){
  const tags = [];
  const search = $("search")?.value?.trim();
  const cities = selectedFilterLabels("cityFilter");
  const districts = selectedFilterLabels("districtFilter");
  const days = selectedFilterLabels("dayFilter").map(cleanDay);
  const meetingTypes = selectedFilterLabels("meetingTypeFilter");
  const view = selectedFilterLabels("typeFilter");
  const distance = $("distanceFilter")?.value;

  if (search) tags.push({ label: "Sök", value: search });
  if (cities.length) tags.push({ label: "Ort", value: summarizeFilterValues(cities) });
  if (districts.length) tags.push({ label: "Distrikt", value: summarizeFilterValues(districts) });
  if (days.length) tags.push({ label: "Dag", value: summarizeFilterValues(days) });
  if (meetingTypes.length) tags.push({ label: "Typ", value: summarizeFilterValues(meetingTypes) });
  if ($("typeFilter")?.value === "online") tags.push({ label: "Visning", value: "Endast online i listan" });
  else if (includeOnlineMeetings) tags.push({ label: "Online", value: "visas" });
  else if (view.length && $("typeFilter")?.value) tags.push({ label: "Visning", value: view[0] });
  if (distance) tags.push({ label: "Avstånd", value: "inom " + distance + " km" });

  return tags;
}

function toggleListFollowsMap(){
  const el = $("listFollowsMap");
  listFollowsMap = !!(el && el.checked);
  renderAll(false);
}

function handleTypeFilterChange(){
  const type = $("typeFilter");
  includeOnlineMeetings = type ? type.value !== "physical" : false;
  renderAll(false);
}

function clearAllFilters(){
  ["search"].forEach(id => {
    const el = $(id);
    if (el) el.value = "";
  });

  ["cityFilter","districtFilter","dayFilter","meetingTypeFilter"].forEach(id => {
    setSelectedValues(id, []);
  });

  const distance = $("distanceFilter");
  if (distance) distance.value = "";

  const type = $("typeFilter");
  if (type) type.value = "physical";
  includeOnlineMeetings = false;

  userPosition = null;
  if (userMarker && map) {
    map.removeLayer(userMarker);
    userMarker = null;
  }

  renderAll(false);

  if (map) {
    map.setView([62.0, 15.0], 5);
  }

  setStatus('<span class="ok">Alla filter rensade.</span>');
}

function fitDistanceFilteredMeetings(){
  if (!map || !userPosition) return;

  const maxDistance = Number($("distanceFilter")?.value || 0);
  if (!maxDistance) {
    fitVisible();
    return;
  }

  const meetingList = filteredMeetings();
  const groups = groupMeetingsForDisplay(meetingList)
    .filter(groupMatchesMap)
    .filter(g => g.distance !== null && g.distance !== undefined && g.distance <= maxDistance);

  const points = [];

  if (userPosition) {
    points.push([userPosition.lat, userPosition.lng]);
  }

  groups.forEach(g => {
    points.push([g.latitude, g.longitude]);
  });

  if (points.length > 1) {
    suppressMapMoveRender = true;
    map.fitBounds(points, {
      padding: [35, 35],
      maxZoom: 13
    });
    setTimeout(() => {
      suppressMapMoveRender = false;
      renderAll(true);
    }, 250);
  } else if (points.length === 1) {
    suppressMapMoveRender = true;
    map.setView(points[0], 13);
    setTimeout(() => {
      suppressMapMoveRender = false;
      renderAll(true);
    }, 250);
  }
}

function updateUserPositionMarker(){
  if (!map || !userPosition || typeof L === "undefined") return;

  if (userMarker) {
    map.removeLayer(userMarker);
    userMarker = null;
  }

  userMarker = L.marker([userPosition.lat, userPosition.lng], {
    icon: L.divIcon({
      className: "user-position-marker",
      html: "<div><span>Du</span></div>",
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    }),
    zIndexOffset: 1000
  }).addTo(map).bindPopup("Du är här");
}

function handleDistanceFilterChange(){
  const distanceEl = $("distanceFilter");
  const value = distanceEl ? distanceEl.value : "";

  if (!value) {
    userPosition = null;

    if (userMarker && map) {
      map.removeLayer(userMarker);
      userMarker = null;
    }

    renderAll(false);
    setStatus('<span class="ok">Avståndsfiltret rensat.</span>');
    return;
  }

  if (!navigator.geolocation) {
    setStatus('<span class="bad">Din webbläsare stödjer inte platsdelning.</span>');
    if (distanceEl) distanceEl.value = "";
    renderActiveFilters();
    return;
  }

  setStatus("Hämtar din position...");

  navigator.geolocation.getCurrentPosition(
    pos => {
      userPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      updateUserPositionMarker();

      renderAll(false);
      fitDistanceFilteredMeetings();

      setStatus(
        '<span class="ok">Position hämtad.</span> Visar möten inom ' +
        value +
        ' km.'
      );
    },
    err => {
      userPosition = null;

      if (distanceEl) distanceEl.value = "";
      renderActiveFilters();

      let message = err.message || "Kunde inte hämta position.";

      if (err.code === 1) {
        message = "Platsåtkomst nekades. Tillåt platsdelning i webbläsaren och försök igen.";
      }

      setStatus('<span class="bad">' + esc(message) + '</span>');
      renderAll(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }
  );
}
