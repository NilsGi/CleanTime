let lastMobilePanelMode = null;

function renderActiveFilters(){
  const el = $("activeFilters");
  if (!el) return;

  const tags = getActiveFilterTags();
  if (!tags.length) {
    el.classList.remove("has-active");
    el.innerHTML = '<span class="active-filter-empty">Inga aktiva filter</span>';
    return;
  }

  el.classList.add("has-active");
  el.innerHTML =
    '<span class="active-filter-title">Aktivt filter:</span>' +
    tags.map(tag =>
      '<span class="active-filter-chip"><b>' +
      esc(tag.label) +
      ':</b> ' +
      esc(tag.value) +
      '</span>'
    ).join("");
}

function appendListLimitNotice(containerId){
  const container = $(containerId);
  if (!container) return;

  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = "Listan visar de första 150 grupperna. Använd sök/filter för att begränsa.";
  container.appendChild(p);
}

function renderDistrictLegend(){
  const el = $("districtLegend");
  if (!el) return;

  const entries = Object.entries(districtColorMap)
    .sort((a,b) => a[0].localeCompare(b[0], "sv"));

  if (!entries.length) {
    el.innerHTML = "";
    return;
  }

  el.innerHTML =
    '<div class="district-legend-title">Färgnyckel distrikt</div>' +
    '<div class="district-legend-items">' +
    entries.map(([district, color]) =>
      '<span class="district-legend-item">' +
      '<span class="district-legend-swatch" style="background:' + esc(color) + '"></span>' +
      '<span>' + esc(district) + '</span>' +
      '</span>'
    ).join("") +
    '</div>';
}

function syncOnlineToggleButton(){
  const button = $("toggleOnlineBtn");
  const type = $("typeFilter");
  if (!button || !type) return;

  if (!includeOnlineMeetings) {
    button.textContent = "Visa online-möten";
    button.classList.remove("online-visible");
    type.value = "physical";
  } else {
    button.textContent = "Dölj online-möten";
    button.classList.add("online-visible");
    if (type.value === "physical") type.value = "";
  }
}

function toggleOnlineMeetings(){
  const type = $("typeFilter");

  includeOnlineMeetings = !includeOnlineMeetings;
  if (type) type.value = includeOnlineMeetings ? "" : "physical";
  renderAll(false);
}

function setMobileMapCollapsed(collapsed){
  const panel = $("meetingsPanel");
  const button = $("toggleMobileMapBtn");
  if (!panel || !button) return;

  panel.classList.toggle("map-collapsed", collapsed);
  button.textContent = collapsed ? "Visa karta" : "Dölj karta";

  if (!collapsed && map) {
    setTimeout(() => {
      map.invalidateSize();
      renderAll(true);
    }, 80);
  } else {
    renderAll(false);
  }
}

function toggleMobileMap(){
  const panel = $("meetingsPanel");
  setMobileMapCollapsed(!panel?.classList.contains("map-collapsed"));
}

function syncResponsivePanels(){
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (lastMobilePanelMode === isMobile) return;
  lastMobilePanelMode = isMobile;

  ["filterSection", "mapFilterSection"].forEach(id => {
    const details = $(id);
    if (details) details.open = !isMobile;
  });

  const stats = $("statsFull");
  if (stats) stats.open = false;

  if (!isMobile) {
    setMobileMapCollapsed(false);
  }
}

async function fetchAllMeetings(){
  if (!map || !markersLayer) {
    if (!initMap()) return;
  }

	  rawMeetings = [];
	  allMeetings = [];
	  districtColorMap = {};
	  markersLayer.clearLayers();

  const list = $("list");
  if (list) list.innerHTML = "";
  const listMobile = $("listMobile");
  if (listMobile) listMobile.innerHTML = "";
  const summary = $("summary");
  if (summary) summary.textContent = "";
	  renderActiveFilters();
	  renderDistrictLegend();

  renderStats([]);
  setStatus("Hämtar möten...");

  try {
    const json = await fetchSmartProxy();

    if (!json.ok || !Array.isArray(json.data)) {
      throw new Error(json.error || "Oväntat svar från /mote. data saknas.");
    }

	    rawMeetings = cleanMeetingsData(json.data);
	    allMeetings = rawMeetings;
	    updateDistrictColorMap(allMeetings);
	    renderDistrictLegend();
	
	    populateFiltersFromSmartProxy(json);
    renderAll(false);
    fitVisible();

    const meta = json.meta || {};
    setStatus(
      '<span class="ok">Klart.</span> Hämtade ' +
      (meta.uniqueCount || allMeetings.length) +
      ' möten.' +
      (meta.duplicateCount ? ' Dubbletter borttagna: ' + meta.duplicateCount + '.' : '')
    );
  } catch(error) {
    setStatus('<span class="bad">Fel:</span> ' + esc(error.message));
    console.error(error);
  }
}

function renderAll(syncFromMap = false){
  if (!markersLayer) return;

  const meetingList = filteredMeetings(syncFromMap);
  const groupList = groupMeetingsForDisplay(meetingList);
  const mapGroups = groupList.filter(groupMatchesMap);
  const searchActive = hasActiveTextSearch();

  const shouldFitMapToFilters =
    !syncFromMap &&
    map &&
    mapGroups.length &&
    !suppressMapMoveRender &&
    !isMobileMapCollapsed();

  if (shouldFitMapToFilters) {
    fitGroupsOnMap(mapGroups);
  }

  const visibleGroupList = shouldUseMapViewForList(syncFromMap)
    ? groupList.filter(isGroupInMapView)
    : groupList;

  const visibleMeetingCount = visibleGroupList.reduce((sum, group) => sum + group.meetings.length, 0);
  const distanceText = userPosition && $("distanceFilter").value
    ? "<br><b>Avstånd:</b> visar grupper inom " + $("distanceFilter").value + " km från din position."
    : userPosition
      ? "<br><b>Position hämtad:</b> välj ett avstånd i filtret för att begränsa resultaten."
      : "";

  const summary = $("summary");
  if (summary) {
    summary.innerHTML =
      "Visar " + visibleGroupList.length + " grupper baserat på " + visibleMeetingCount + " möten i listan.<br>" +
      mapGroups.length + " grupper finns på kartan efter filter." +
      distanceText;
  }
  renderActiveFilters();
  syncOnlineToggleButton();

  renderMarkers(mapGroups);
  renderStats(meetingList);
  renderList(visibleGroupList.slice(0, 150));

  if (visibleGroupList.length > 150) {
    appendListLimitNotice("list");
    appendListLimitNotice("listMobile");
  }
}

function bindUi(){
  $("refreshMeetingsBtn")?.addEventListener("click", fetchAllMeetings);
  $("exportFolderPdfBtn")?.addEventListener("click", exportFolderPdf);
  $("clearFiltersBtn")?.addEventListener("click", clearAllFilters);
  $("search")?.addEventListener("input", () => renderAll(false));
  $("typeFilter")?.addEventListener("change", handleTypeFilterChange);
  $("toggleOnlineBtn")?.addEventListener("click", toggleOnlineMeetings);
  $("distanceFilter")?.addEventListener("change", handleDistanceFilterChange);
  $("listFollowsMap")?.addEventListener("change", toggleListFollowsMap);
  $("toggleMobileMapBtn")?.addEventListener("click", toggleMobileMap);
}

document.addEventListener("DOMContentLoaded", () => {
  bindUi();
  syncResponsivePanels();
  renderActiveFilters();
  syncOnlineToggleButton();
  updateLayoutHeight();
  initMap();
  fetchAllMeetings();
  window.addEventListener("resize", () => {
    syncResponsivePanels();
    updateLayoutHeight();
  });
  setTimeout(updateLayoutHeight, 250);
});

document.addEventListener('click',function(e){
 const b=e.target.closest('button,.action-btn,.filter-btn');
 if(b){ setTimeout(()=>b.blur(),50); }
});
