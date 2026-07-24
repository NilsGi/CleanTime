let swedishPlacesPromise = null;
let activePlaceResults = [];
let placeSearchSequence = 0;
let placeSearchTimer = null;

function normalizePlaceSearchTerm(value){
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function loadSwedishPlaces(){
  if (!swedishPlacesPromise) {
    swedishPlacesPromise = fetch("data/sweden-places.json?v=14.24", {
      method: "GET",
      headers: { "Accept": "application/json" }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }
        return response.json();
      })
      .then(data => Array.isArray(data?.places) ? data.places : [])
      .catch(error => {
        console.warn("Kunde inte läsa den lokala ortslistan.", error);
        return [];
      });
  }

  return swedishPlacesPromise;
}

function getMeetingPlaceOrigins(){
  const grouped = new Map();

  (allMeetings || []).forEach(meeting => {
    if (isOnline(meeting) || !hasCoords(meeting)) return;

    getCities(meeting).forEach(city => {
      const key = normalizePlaceSearchTerm(city);
      if (!key) return;

      if (!grouped.has(key)) {
        grouped.set(key, {
          name: city,
          latTotal: 0,
          lngTotal: 0,
          count: 0,
          districts: new Set()
        });
      }

      const row = grouped.get(key);
      row.latTotal += Number(meeting.latitude);
      row.lngTotal += Number(meeting.longitude);
      row.count++;
      row.districts.add(getMeetingDistrict(meeting));
    });
  });

  return [...grouped.values()].map(row => ({
    name: row.name,
    lat: row.latTotal / row.count,
    lng: row.lngTotal / row.count,
    municipality: "",
    county: "",
    district: [...row.districts].sort((a,b) => a.localeCompare(b, "sv")).join(", "),
    source: "meetings"
  }));
}

function mergePlaceOrigins(places){
  const seenPlaces = new Set();
  const result = (places || []).map(place => ({
    ...place,
    lat: Number(place.lat),
    lng: Number(place.lng),
    source: "places"
  })).filter(place => {
    if (!Number.isFinite(place.lat) || !Number.isFinite(place.lng)) return false;

    const key = [
      normalizePlaceSearchTerm(place.name),
      normalizePlaceSearchTerm(place.municipality),
      normalizePlaceSearchTerm(place.county),
      place.lat.toFixed(5),
      place.lng.toFixed(5)
    ].join("|");

    if (seenPlaces.has(key)) return false;
    seenPlaces.add(key);
    return true;
  });

  const knownNames = new Set(result.map(place => normalizePlaceSearchTerm(place.name)));

  getMeetingPlaceOrigins().forEach(place => {
    if (!knownNames.has(normalizePlaceSearchTerm(place.name))) {
      result.push(place);
    }
  });

  return result;
}

function placeContextParts(place){
  const values = [];

  if (place.municipality) values.push(String(place.municipality).trim());
  if (place.county && !values.some(value => normalizePlaceSearchTerm(value) === normalizePlaceSearchTerm(place.county))) {
    values.push(String(place.county).trim());
  }
  if (!values.length && place.district) values.push(String(place.district).trim());
  if (!values.length && place.source === "meetings") values.push("Ort i möteslistan");

  return values.filter(Boolean);
}

function placeContextLabel(place){
  return placeContextParts(place).join(", ");
}

function placeOriginLabel(place){
  const municipality = String(place.municipality || "").trim();
  const normalizedMunicipality = normalizePlaceSearchTerm(municipality)
    .replace(/\s+(kommun|stad)$/, "");
  const normalizedName = normalizePlaceSearchTerm(place.name);
  const municipalityLabel = normalizedMunicipality && normalizedMunicipality !== normalizedName
    ? municipality
    : /kommun$/i.test(municipality)
      ? municipality
      : "";
  return [place.name, municipalityLabel].filter(Boolean).join(", ");
}

function scorePlaceMatch(place, normalizedQuery){
  const name = normalizePlaceSearchTerm(place.name);
  const context = normalizePlaceSearchTerm(
    [place.name, place.municipality, place.county, place.district].filter(Boolean).join(" ")
  );
  const tokens = normalizedQuery.split(" ").filter(Boolean);

  if (!tokens.length || !tokens.every(token => context.includes(token))) return null;

  if (name === normalizedQuery) return 0;
  if (name.startsWith(normalizedQuery)) return 10 + Math.max(0, name.length - normalizedQuery.length) / 100;
  if (name.split(" ").some(word => word.startsWith(normalizedQuery))) return 20;
  if (name.includes(normalizedQuery)) return 30;
  return 40;
}

async function findPlaceOrigins(query){
  const normalizedQuery = normalizePlaceSearchTerm(query);
  if (normalizedQuery.length < 2) return [];

  const places = mergePlaceOrigins(await loadSwedishPlaces());

  return places
    .map(place => ({ place, score: scorePlaceMatch(place, normalizedQuery) }))
    .filter(row => row.score !== null)
    .sort((a,b) =>
      a.score - b.score ||
      String(a.place.name).localeCompare(String(b.place.name), "sv") ||
      placeContextLabel(a.place).localeCompare(placeContextLabel(b.place), "sv")
    )
    .slice(0, 8)
    .map(row => row.place);
}

function setPlaceResultsExpanded(expanded){
  const input = $("placeSearch");
  if (input) input.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function hidePlaceSearchResults(){
  placeSearchSequence++;
  if (placeSearchTimer) {
    clearTimeout(placeSearchTimer);
    placeSearchTimer = null;
  }

  const input = $("placeSearch");
  const button = $("placeSearchBtn");
  const container = $("placeSearchResults");

  if (input) input.removeAttribute("aria-busy");
  if (button) button.disabled = false;
  if (container) {
    container.hidden = true;
    container.innerHTML = "";
  }
  activePlaceResults = [];
  setPlaceResultsExpanded(false);
}

function renderPlaceSearchResults(results, options = {}){
  const container = $("placeSearchResults");
  if (!container) return;

  activePlaceResults = results || [];
  container.innerHTML = "";

  if (!activePlaceResults.length) {
    if (!options.showEmpty) {
      hidePlaceSearchResults();
      return;
    }

    const empty = document.createElement("div");
    empty.className = "place-search-empty";
    empty.textContent = "Ingen svensk ort hittades.";
    container.appendChild(empty);
    container.hidden = false;
    setPlaceResultsExpanded(true);
    return;
  }

  activePlaceResults.forEach((place, index) => {
    const button = document.createElement("button");
    const name = document.createElement("span");
    const context = document.createElement("span");

    button.type = "button";
    button.className = "place-search-result";
    button.setAttribute("role", "option");
    button.dataset.placeIndex = String(index);

    name.className = "place-search-result-name";
    name.textContent = place.name;
    button.appendChild(name);

    const contextText = placeContextLabel(place);
    if (contextText) {
      context.className = "place-search-result-context";
      context.textContent = contextText;
      button.appendChild(context);
    }

    button.addEventListener("click", () => activatePlaceOrigin(place));
    container.appendChild(button);
  });

  container.hidden = false;
  setPlaceResultsExpanded(true);
}

function removeDistanceOriginMarker(){
  if (userMarker && map) {
    map.removeLayer(userMarker);
    userMarker = null;
  }
}

function updateDistanceOriginUi(){
  const label = $("distanceFilterLabel");
  const distance = $("distanceFilter");
  const selection = $("placeSearchSelection");
  const selectionText = $("placeSearchSelectionText");

  if (label) {
    label.textContent = distanceOriginSource === "place"
      ? "Avstånd från vald ort"
      : distanceOriginSource === "device"
        ? "Avstånd från din position"
        : "Avstånd";
  }

  if (distance?.options?.length) {
    distance.options[0].textContent = userPosition ? "Alla – närmast först" : "Alla avstånd";
  }

  if (selection && selectionText) {
    if (userPosition && distanceOriginLabel) {
      selectionText.textContent = "Utgångspunkt: " + distanceOriginLabel;
      selection.hidden = false;
    } else {
      selectionText.textContent = "";
      selection.hidden = true;
    }
  }
}

function setDistanceOrigin(position, options = {}){
  const lat = Number(position?.lat);
  const lng = Number(position?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;

  userPosition = { lat, lng };
  distanceOriginSource = options.source || "device";
  distanceOriginLabel = options.label || (distanceOriginSource === "device" ? "Din position" : "Vald ort");

  if (options.inputValue !== undefined) {
    const input = $("placeSearch");
    if (input) input.value = options.inputValue;
  }

  updateDistanceOriginUi();
  updateUserPositionMarker();
  return true;
}

function resetDistanceOrigin(options = {}){
  const {
    clearInput = true,
    clearDistance = true,
    render = true,
    quiet = false
  } = options;

  userPosition = null;
  distanceOriginSource = null;
  distanceOriginLabel = "";
  removeDistanceOriginMarker();
  hidePlaceSearchResults();

  if (clearInput) {
    const input = $("placeSearch");
    if (input) input.value = "";
  }

  if (clearDistance) {
    const distance = $("distanceFilter");
    if (distance) distance.value = "";
  }

  updateDistanceOriginUi();

  if (render) renderAll(false);
  if (!quiet) {
    setStatus('<span class="ok">Utgångspunkten rensad.</span>', { temporary: true });
  }
}

function activatePlaceOrigin(place){
  const label = placeOriginLabel(place);

  includePhysicalMeetings = true;
  setDistanceOrigin(
    { lat: place.lat, lng: place.lng },
    {
      source: "place",
      label,
      inputValue: place.name
    }
  );

  hidePlaceSearchResults();
  renderAll(false);

  setStatus(
    '<span class="ok">Utgångspunkt vald:</span> ' +
    esc(label) +
    ". Mötena visas närmast först.",
    { temporary: true, timeout: 5500 }
  );
}

async function runPlaceSearch(options = {}){
  const input = $("placeSearch");
  const button = $("placeSearchBtn");
  const query = input?.value?.trim() || "";
  const preview = !!options.preview;

  if (!preview && placeSearchTimer) {
    clearTimeout(placeSearchTimer);
    placeSearchTimer = null;
  }

  if (normalizePlaceSearchTerm(query).length < 2) {
    hidePlaceSearchResults();
    if (!preview) {
      setStatus('<span class="bad">Skriv minst två tecken i ortsökningen.</span>', { temporary: true });
    }
    return;
  }

  const sequence = ++placeSearchSequence;
  if (input) input.setAttribute("aria-busy", "true");
  if (button && !preview) button.disabled = true;
  if (!preview) setStatus("Söker ort...");

  const results = await findPlaceOrigins(query);

  if (sequence !== placeSearchSequence) return;

  if (input) input.removeAttribute("aria-busy");
  if (button) button.disabled = false;

  const normalizedQuery = normalizePlaceSearchTerm(query);
  const exactResults = results.filter(place => normalizePlaceSearchTerm(place.name) === normalizedQuery);

  if (!preview && (exactResults.length === 1 || (!exactResults.length && results.length === 1))) {
    activatePlaceOrigin(exactResults[0] || results[0]);
    return;
  }

  const displayedResults = !preview && exactResults.length > 1 ? exactResults : results;
  renderPlaceSearchResults(displayedResults, { showEmpty: !preview });

  if (!preview) {
    if (displayedResults.length) {
      setStatus("Välj rätt ort i listan.", { temporary: true });
    } else {
      setStatus('<span class="bad">Ingen svensk ort hittades.</span>', { temporary: true });
    }
  }
}

function schedulePlaceSearchPreview(){
  if (placeSearchTimer) clearTimeout(placeSearchTimer);

  const input = $("placeSearch");
  if (normalizePlaceSearchTerm(input?.value).length < 2) {
    hidePlaceSearchResults();
    return;
  }

  placeSearchTimer = setTimeout(() => {
    runPlaceSearch({ preview: true });
  }, 120);
}

function initPlaceSearch(){
  const input = $("placeSearch");
  const button = $("placeSearchBtn");
  const clearButton = $("clearPlaceSearchBtn");
  const wrapper = document.querySelector(".place-search");

  if (!input || !button) return;
  if (input.dataset.placeSearchInitialized === "true") return;
  input.dataset.placeSearchInitialized = "true";

  input.addEventListener("input", schedulePlaceSearchPreview);
  input.addEventListener("focus", () => {
    loadSwedishPlaces();
    if (normalizePlaceSearchTerm(input.value).length >= 2) {
      schedulePlaceSearchPreview();
    }
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      runPlaceSearch();
    } else if (event.key === "Escape") {
      hidePlaceSearchResults();
    } else if (event.key === "ArrowDown" && !$("placeSearchResults")?.hidden) {
      event.preventDefault();
      $("placeSearchResults")?.querySelector("button")?.focus();
    }
  });

  button.addEventListener("click", () => runPlaceSearch());
  clearButton?.addEventListener("click", () => resetDistanceOrigin());

  document.addEventListener("click", event => {
    if (wrapper && !wrapper.contains(event.target)) {
      hidePlaceSearchResults();
    }
  });

  updateDistanceOriginUi();
}

window.initPlaceSearch = initPlaceSearch;
