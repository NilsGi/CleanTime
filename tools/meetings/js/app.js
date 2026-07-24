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

function syncMeetingModeButtons(){
  const onlineButton = $("toggleOnlineBtn");
  const physicalButton = $("togglePhysicalBtn");

  syncMeetingModeButton(physicalButton, "Fysiska möten", includePhysicalMeetings);
  syncMeetingModeButton(onlineButton, "Onlinemöten", includeOnlineMeetings);
}

function syncMeetingModeButton(button, label, isOn){
  if (!button) return;

  button.classList.toggle("is-on", isOn);
  button.setAttribute("aria-pressed", isOn ? "true" : "false");
  button.innerHTML =
    '<span class="meeting-mode-label">' + esc(label) + '</span>' +
    '<span class="meeting-mode-switch" aria-hidden="true">' +
      '<span class="meeting-mode-state">' + (isOn ? "På" : "Av") + '</span>' +
    '</span>';
}

function toggleOnlineMeetings(){
  includeOnlineMeetings = !includeOnlineMeetings;
  renderAll(false);
}

function togglePhysicalMeetings(){
  includePhysicalMeetings = !includePhysicalMeetings;
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
      if (userPosition) fitDistanceFilteredMeetings();
      else renderAll(true);
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
    if (!userPosition) fitVisible();

    const meta = json.meta || {};
    setStatus(
      '<span class="ok">Klart.</span> Hämtade ' +
      (meta.uniqueCount || allMeetings.length) +
      ' möten.' +
      (meta.duplicateCount ? ' Dubbletter borttagna: ' + meta.duplicateCount + '.' : ''),
      { temporary: true, timeout: 4500 }
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

  const shouldFitMapToFilters =
    !syncFromMap &&
    map &&
    (mapGroups.length || userPosition) &&
    !suppressMapMoveRender &&
    !isMobileMapCollapsed();

  if (shouldFitMapToFilters) {
    if (userPosition) fitDistanceFilteredMeetings(mapGroups);
    else fitGroupsOnMap(mapGroups);
  }

  const visibleGroupList = shouldUseMapViewForList(syncFromMap)
    ? groupList.filter(isGroupInMapView)
    : groupList;

  const visibleMeetingCount = visibleGroupList.reduce((sum, group) => sum + group.meetings.length, 0);
  const selectedDistance = $("distanceFilter")?.value || "";
  const distanceText = userPosition
    ? selectedDistance
      ? "<br><b>Utgångspunkt:</b> " + esc(distanceOriginLabel || "Vald plats") +
        " · visar grupper inom " + esc(selectedDistance) + " km."
      : "<br><b>Utgångspunkt:</b> " + esc(distanceOriginLabel || "Vald plats") +
        " · mötena sorteras närmast först."
    : "";

  const summary = $("summary");
  if (summary) {
    summary.innerHTML =
      "Visar " + visibleGroupList.length + " grupper baserat på " + visibleMeetingCount + " möten i listan.<br>" +
      mapGroups.length + " grupper finns på kartan efter filter." +
      distanceText;
  }
  renderActiveFilters();
  syncMeetingModeButtons();

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
  $("toggleOnlineBtn")?.addEventListener("click", toggleOnlineMeetings);
  $("togglePhysicalBtn")?.addEventListener("click", togglePhysicalMeetings);
  $("distanceFilter")?.addEventListener("change", handleDistanceFilterChange);
  $("listFollowsMap")?.addEventListener("change", toggleListFollowsMap);
  $("toggleMobileMapBtn")?.addEventListener("click", toggleMobileMap);
}

function ensureAppInfo(){
  const stats = $("statsFull");
  const aside = document.querySelector("#meetingsPanel aside");
  if (!stats || !aside) return;

  let info = $("appInfo");
  if (!info) {
    info = document.createElement("details");
    info.id = "appInfo";
    info.className = "filter-section info-details";
    info.innerHTML =
      '<summary>Info</summary>' +
      '<div class="info-details-body">' +
        '<div class="beta-notice">Beta-version: möteslistan uppdateras och förbättras löpande.</div>' +
        '<div class="service-credit">' +
          'Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. NA® och NA-logotyper används inom NA:s servicestruktur.' +
        '</div>' +
      '</div>';
  }

  info.classList.add("filter-section", "info-details");
  info.open = false;
  stats.insertAdjacentElement("afterend", info);
}

document.addEventListener("DOMContentLoaded", () => {
  ensureAppInfo();
  bindUi();
  initPlaceSearch();
  syncResponsivePanels();
  renderActiveFilters();
  syncMeetingModeButtons();
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
