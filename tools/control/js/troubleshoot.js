const DIAGNOSTIC_TYPES = [
  {
    id: "group-coords",
    title: "Samma grupp har olika koordinater",
    empty: "Inga grupper med tydligt olika koordinater hittades."
  },
  {
    id: "missing-map-link",
    title: "Kartlänk saknas för fysiska möten",
    empty: "Inga fysiska möten utan kartlänk hittades."
  },
  {
    id: "map-link-mismatch",
    title: "Kartlänk överensstämmer inte med koordinater",
    empty: "Inga avvikande kartlänkar med läsbara koordinater hittades."
  },
  {
    id: "geocode-mismatch",
    title: "Adress/kartträff matchar inte koordinater",
    empty: "Inga avvikande adress- eller kartträffar hittades."
  },
  {
    id: "map-link-unchecked",
    title: "Kartlänk behöver manuell kontroll",
    empty: "Inga kartlänkar med oläsbara koordinater hittades."
  },
  {
    id: "missing-coords",
    title: "Koordinater saknas för fysiska möten",
    empty: "Inga fysiska möten utan koordinater hittades."
  },
  {
    id: "geocode-suggestion",
    title: "Kartträff finns för möten utan koordinater",
    empty: "Inga kartträffar för möten utan koordinater har hämtats."
  },
  {
    id: "geocode-unresolved",
    title: "Adress/kartlänk kunde inte hittas",
    empty: "Inga misslyckade adress- eller kartuppslag finns."
  },
  {
    id: "spelling",
    title: "Möjliga stavningsvarianter",
    empty: "Inga tydliga stavningsvarianter hittades."
  }
];

let diagnosticMeetings = [];
let diagnosticIssues = [];
let geocodeRunning = false;
const GEOCODE_CACHE_PREFIX = "moteslistaGeocode:v1:";

function getDiagnosticThreshold(id, fallback){
  const value = Number($(id)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function simplifySpelling(value){
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9åäö]+/gi, "")
    .toLowerCase();
}

function diagnosticGroupKey(m){
  const district = getMeetingDistrict(m);
  const city = getCity(m) || (isOnline(m) ? "Online" : "Okänd ort");
  return district + "|||" + normalizeText(city) + "|||" + normalizeGroupName(m.title);
}

function groupMeetingsForDiagnostics(meetings){
  const groups = new Map();

  meetings.forEach(m => {
    const district = getMeetingDistrict(m);
    const city = getCity(m) || (isOnline(m) ? "Online" : "Okänd ort");
    const key = diagnosticGroupKey(m);

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        district,
        city,
        title: displayGroupName(m.title),
        meetings: []
      });
    }

    groups.get(key).meetings.push(m);
  });

  return [...groups.values()].sort((a, b) =>
    a.district.localeCompare(b.district, "sv") ||
    a.city.localeCompare(b.city, "sv") ||
    a.title.localeCompare(b.title, "sv")
  );
}

function validLatLng(lat, lng){
  return Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;
}

function parseCoordPair(latRaw, lngRaw){
  const lat = Number(String(latRaw).replace(",", "."));
  const lng = Number(String(lngRaw).replace(",", "."));
  return validLatLng(lat, lng) ? { lat, lng } : null;
}

function extractCoordinatesFromMapLink(url){
  const safe = safeUrl(url);
  if (!safe) return null;

  const decoded = decodeURIComponent(safe);
  const patterns = [
    /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
    /[?&#](?:q|ll|center|query|destination|daddr)=\s*(?:loc:)?(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
    /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/i,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
    /[?&]mlat=(-?\d+(?:\.\d+)?).*?[?&]mlon=(-?\d+(?:\.\d+)?)/i,
    /[?&]mlon=(-?\d+(?:\.\d+)?).*?[?&]mlat=(-?\d+(?:\.\d+)?)/i
  ];

  for (const pattern of patterns) {
    const match = decoded.match(pattern);
    if (!match) continue;

    const pair = pattern.source.includes("mlon") && pattern.source.indexOf("mlon") < pattern.source.indexOf("mlat")
      ? parseCoordPair(match[2], match[1])
      : parseCoordPair(match[1], match[2]);

    if (pair) return pair;
  }

  const generic = [...decoded.matchAll(/(-?\d{1,2}\.\d{4,}),\s*(-?\d{1,3}\.\d{4,})/g)]
    .map(match => parseCoordPair(match[1], match[2]))
    .filter(Boolean);

  return generic[0] || null;
}

function formatMeters(km){
  if (!Number.isFinite(km)) return "";
  return km < 1 ? Math.round(km * 1000) + " m" : km.toFixed(1).replace(".", ",") + " km";
}

function formatCoords(lat, lng){
  if (!validLatLng(Number(lat), Number(lng))) return "saknas";
  return Number(lat).toFixed(6) + ", " + Number(lng).toFixed(6);
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function meetingLabel(m){
  return [
    cleanDay(m.days),
    [m.startTime, m.endTime].filter(Boolean).join("-"),
    m.address,
    m.zip
  ].filter(Boolean).join(" · ");
}

function issueSearchText(issue){
  return [
    issue.type,
    issue.title,
    issue.group,
    issue.city,
    issue.district,
    issue.details,
    ...(issue.meetings || []).map(m => [
      m.title,
      meetingLabel(m),
      m.location,
      m.address,
      m.zip,
      m.station,
      m.linkMap
    ].join(" "))
  ].join(" ").toLowerCase();
}

function getCachedGeocode(query){
  try {
    const cached = localStorage.getItem(GEOCODE_CACHE_PREFIX + simplifySpelling(query));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedGeocode(query, value){
  try {
    localStorage.setItem(GEOCODE_CACHE_PREFIX + simplifySpelling(query), JSON.stringify(value));
  } catch {
    // Cache är bara en hastighetsbonus. Sidan ska fungera även om den saknas.
  }
}

function isCoordinateQuery(value){
  const text = String(value || "").trim();
  return /^loc:\s*-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/i.test(text) ||
    /^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/.test(text);
}

function cleanMapSearchText(value){
  const text = String(value || "")
    .replace(/\+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text || isCoordinateQuery(text)) return "";
  return text;
}

function extractSearchTextFromMapLink(url){
  const safe = safeUrl(url);
  if (!safe) return "";

  try {
    const parsed = new URL(safe);
    const params = ["q", "query", "destination", "daddr"];

    for (const param of params) {
      const value = cleanMapSearchText(parsed.searchParams.get(param));
      if (value) return value;
    }

    const decodedPath = decodeURIComponent(parsed.pathname || "");
    const pathMatch = decodedPath.match(/\/maps\/(?:place|search|dir)\/([^/@?]+)/i);
    if (pathMatch) {
      const value = cleanMapSearchText(pathMatch[1]);
      if (value) return value;
    }
  } catch {
    return "";
  }

  return "";
}

function buildMeetingAddressQuery(m){
  const city = getCity(m);
  return [
    m.address,
    m.zip,
    city && city !== "Online" ? city : "",
    "Sverige"
  ].map(value => String(value || "").trim()).filter(Boolean).join(", ");
}

function geocodeCandidatesForMeeting(m){
  const candidates = [
    extractSearchTextFromMapLink(m.linkMap),
    buildMeetingAddressQuery(m)
  ].map(value => String(value || "").trim()).filter(Boolean);

  const seen = new Set();
  return candidates.filter(value => {
    const key = simplifySpelling(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function geocodeQuery(query){
  const cached = getCachedGeocode(query);
  if (cached) return cached.found ? cached : null;

  const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=se&q=" +
    encodeURIComponent(query);

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Karttjänsten svarade HTTP " + response.status + ".");
  }

  const rows = await response.json();
  const first = Array.isArray(rows) ? rows[0] : null;
  const result = first && parseCoordPair(first.lat, first.lon)
    ? {
      found: true,
      lat: Number(first.lat),
      lng: Number(first.lon),
      displayName: first.display_name || "",
      query
    }
    : { found: false, query };

  setCachedGeocode(query, result);
  await sleep(1100);

  return result.found ? result : null;
}

async function geocodeMeeting(m){
  const candidates = geocodeCandidatesForMeeting(m);

  for (const query of candidates) {
    const result = await geocodeQuery(query);
    if (result) return result;
  }

  return null;
}

function makeIssue(type, data){
  return {
    type,
    title: data.title || "",
    group: data.group || "",
    city: data.city || "",
    district: data.district || "",
    details: data.details || "",
    meetings: data.meetings || [],
    distanceKm: data.distanceKm ?? null,
    searchText: ""
  };
}

function findGroupCoordinateIssues(groups, thresholdKm){
  return groups.flatMap(group => {
    const withCoords = group.meetings.filter(m => !isOnline(m) && hasCoords(m));
    if (withCoords.length < 2) return [];

    let maxDistance = 0;
    for (let i = 0; i < withCoords.length; i++) {
      for (let j = i + 1; j < withCoords.length; j++) {
        const distance = haversine(
          Number(withCoords[i].latitude),
          Number(withCoords[i].longitude),
          Number(withCoords[j].latitude),
          Number(withCoords[j].longitude)
        );
        maxDistance = Math.max(maxDistance, distance);
      }
    }

    if (maxDistance <= thresholdKm) return [];

    return makeIssue("group-coords", {
      title: group.title,
      group: group.title,
      city: group.city,
      district: group.district,
      details: "Största skillnad mellan koordinater: " + formatMeters(maxDistance) + ".",
      meetings: withCoords,
      distanceKm: maxDistance
    });
  });
}

function findMeetingMapIssues(meetings, mapLinkThresholdKm){
  const issues = [];

  meetings.filter(m => !isOnline(m)).forEach(m => {
    const district = getMeetingDistrict(m);
    const city = getCity(m) || "Okänd ort";
    const mapUrl = safeUrl(m.linkMap);

    if (!mapUrl) {
      issues.push(makeIssue("missing-map-link", {
        title: displayGroupName(m.title),
        group: displayGroupName(m.title),
        city,
        district,
        details: "Fysiskt möte saknar kartlänk.",
        meetings: [m]
      }));
    }

    if (!hasCoords(m)) {
      issues.push(makeIssue("missing-coords", {
        title: displayGroupName(m.title),
        group: displayGroupName(m.title),
        city,
        district,
        details: "Fysiskt möte saknar koordinater.",
        meetings: [m]
      }));
      return;
    }

    if (!mapUrl) return;

    const linkCoords = extractCoordinatesFromMapLink(mapUrl);
    if (!linkCoords) {
      issues.push(makeIssue("map-link-unchecked", {
        title: displayGroupName(m.title),
        group: displayGroupName(m.title),
        city,
        district,
        details: "Kartlänken innehåller inte koordinater som kan jämföras automatiskt.",
        meetings: [m]
      }));
      return;
    }

    const distance = haversine(
      Number(m.latitude),
      Number(m.longitude),
      linkCoords.lat,
      linkCoords.lng
    );

    if (distance > mapLinkThresholdKm) {
      issues.push(makeIssue("map-link-mismatch", {
        title: displayGroupName(m.title),
        group: displayGroupName(m.title),
        city,
        district,
        details: "Mötets koordinater och kartlänkens koordinater skiljer " + formatMeters(distance) + ".",
        meetings: [{ ...m, _linkLat: linkCoords.lat, _linkLng: linkCoords.lng }],
        distanceKm: distance
      }));
    }
  });

  return issues;
}

function findSpellingIssues(meetings){
  const buckets = new Map();

  function addBucket(kind, scope, original, meeting){
    const simplified = simplifySpelling(original);
    if (!simplified || simplified.length < 3) return;
    const key = kind + "|||" + scope + "|||" + simplified;
    if (!buckets.has(key)) {
      buckets.set(key, { kind, scope, simplified, variants: new Map() });
    }

    const variantKey = normalizeText(original);
    if (!buckets.get(key).variants.has(variantKey)) {
      buckets.get(key).variants.set(variantKey, { label: String(original || "").trim(), meetings: [] });
    }
    buckets.get(key).variants.get(variantKey).meetings.push(meeting);
  }

  meetings.forEach(m => {
    const district = getMeetingDistrict(m);
    const city = getCity(m) || (isOnline(m) ? "Online" : "Okänd ort");
    addBucket("Gruppnamn", district + " / " + city, displayGroupName(m.title), m);
    addBucket("Ort", district, city, m);
    addBucket("Distrikt", "Alla", district, m);
  });

  return [...buckets.values()].flatMap(bucket => {
    const variants = [...bucket.variants.values()];
    if (variants.length < 2) return [];

    const meetings = variants.flatMap(v => v.meetings).slice(0, 12);
    const labels = variants.map(v => v.label).sort((a, b) => a.localeCompare(b, "sv"));

    return makeIssue("spelling", {
      title: bucket.kind + ": " + labels.join(" / "),
      group: bucket.kind,
      city: bucket.scope,
      district: bucket.scope,
      details: "Samma förenklade stavning hittades med flera varianter: " + labels.join(", ") + ".",
      meetings
    });
  });
}

function buildDiagnostics(){
  const groups = groupMeetingsForDiagnostics(diagnosticMeetings);
  const groupCoordThreshold = getDiagnosticThreshold("groupCoordThreshold", 0.15);
  const mapLinkThreshold = getDiagnosticThreshold("mapLinkThreshold", 0.25);

  diagnosticIssues = [
    ...findGroupCoordinateIssues(groups, groupCoordThreshold),
    ...findMeetingMapIssues(diagnosticMeetings, mapLinkThreshold),
    ...findSpellingIssues(diagnosticMeetings)
  ].map(issue => ({
    ...issue,
    searchText: issueSearchText(issue)
  }));

  renderDiagnostics();
}

function renderDiagnosticSummary(filteredIssues){
  const el = $("diagnosticSummary");
  if (!el) return;

  const counts = Object.fromEntries(DIAGNOSTIC_TYPES.map(type => [type.id, 0]));
  filteredIssues.forEach(issue => {
    counts[issue.type] = (counts[issue.type] || 0) + 1;
  });

  el.innerHTML = DIAGNOSTIC_TYPES.map(type => `
    <div class="diagnostic-summary-card">
      <b>${counts[type.id] || 0}</b>
      <span>${esc(type.title)}</span>
    </div>
  `).join("");
}

function renderMeetingRows(issue){
  return issue.meetings.map(m => {
    const mapLink = safeUrl(m.linkMap)
      ? '<a href="' + esc(safeUrl(m.linkMap)) + '" target="_blank" rel="noopener noreferrer">Öppna kartlänk</a>'
      : '<span class="muted">Ingen kartlänk</span>';
    const linkCoords = validLatLng(Number(m._linkLat), Number(m._linkLng))
      ? '<br><span class="muted">Kartlänk: ' + esc(formatCoords(m._linkLat, m._linkLng)) + '</span>'
      : "";

    return `
      <div class="diagnostic-meeting-row">
        <div>
          <b>${esc(displayGroupName(m.title))}</b>
          <span>${esc(meetingLabel(m) || "Ingen tid/adress angiven")}</span>
          <span class="muted">Koordinater: ${esc(formatCoords(m.latitude, m.longitude))}</span>
          ${linkCoords}
          ${validLatLng(Number(m._geocodeLat), Number(m._geocodeLng)) ? '<br><span class="muted">Kartträff: ' + esc(formatCoords(m._geocodeLat, m._geocodeLng)) + '</span>' : ""}
        </div>
        <div>${mapLink}</div>
      </div>
    `;
  }).join("");
}

function renderDiagnostics(){
  const search = normalizeText($("diagnosticSearch")?.value || "");
  const filteredIssues = search
    ? diagnosticIssues.filter(issue => issue.searchText.includes(search))
    : diagnosticIssues;

  renderDiagnosticSummary(filteredIssues);

  const container = $("diagnosticSections");
  if (!container) return;

  container.innerHTML = DIAGNOSTIC_TYPES.map(type => {
    const issues = filteredIssues
      .filter(issue => issue.type === type.id)
      .sort((a, b) =>
        (b.distanceKm || 0) - (a.distanceKm || 0) ||
        a.district.localeCompare(b.district, "sv") ||
        a.city.localeCompare(b.city, "sv") ||
        a.title.localeCompare(b.title, "sv")
      );

    const rows = issues.length
      ? issues.map(issue => `
        <details class="diagnostic-issue">
          <summary>
            <span>${esc(issue.title || issue.group)}</span>
            <small>${esc([issue.city, issue.district].filter(Boolean).join(" · "))}</small>
          </summary>
          <div class="diagnostic-issue-body">
            <p>${esc(issue.details)}</p>
            ${renderMeetingRows(issue)}
          </div>
        </details>
      `).join("")
      : '<p class="muted diagnostic-empty">' + esc(type.empty) + '</p>';

    return `
      <section class="diagnostic-section">
        <h2>${esc(type.title)} <span>${issues.length}</span></h2>
        ${rows}
      </section>
    `;
  }).join("");
}

function exportDiagnosticsCsv(){
  if (!diagnosticIssues.length) return;

  const header = ["typ", "grupp", "ort", "distrikt", "detalj", "möten"];
  const rows = diagnosticIssues.map(issue => [
    DIAGNOSTIC_TYPES.find(type => type.id === issue.type)?.title || issue.type,
    issue.group,
    issue.city,
    issue.district,
    issue.details,
    issue.meetings.map(m => displayGroupName(m.title) + " - " + meetingLabel(m)).join(" | ")
  ]);

  const csv = [header, ...rows].map(row =>
    row.map(value => '"' + String(value ?? "").replace(/"/g, '""') + '"').join(";")
  ).join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "moteslista-felsokning.csv";
  a.click();
  URL.revokeObjectURL(url);
}

async function runGeocodeDiagnostics(){
  if (geocodeRunning || !diagnosticMeetings.length) return;

  geocodeRunning = true;
  const button = $("geocodeDiagnosticsBtn");
  if (button) {
    button.disabled = true;
    button.textContent = "Kontrollerar...";
  }

  diagnosticIssues = diagnosticIssues.filter(issue => !String(issue.type).startsWith("geocode-"));
  renderDiagnostics();

  const physicalMeetings = diagnosticMeetings.filter(m => !isOnline(m));
  const threshold = getDiagnosticThreshold("mapLinkThreshold", 0.25);
  const newIssues = [];

  try {
    for (let i = 0; i < physicalMeetings.length; i++) {
      const m = physicalMeetings[i];
      const candidates = geocodeCandidatesForMeeting(m);

      setStatus(
        '<span class="ok">Kartkontroll:</span> ' +
        (i + 1) +
        " av " +
        physicalMeetings.length +
        " fysiska möten."
      );

      if (!candidates.length) {
        newIssues.push(makeIssue("geocode-unresolved", {
          title: displayGroupName(m.title),
          group: displayGroupName(m.title),
          city: getCity(m) || "Okänd ort",
          district: getMeetingDistrict(m),
          details: "Mötet saknar både tydlig adress och sökbar kartlänk.",
          meetings: [m]
        }));
        continue;
      }

      const result = await geocodeMeeting(m);
      if (!result) {
        newIssues.push(makeIssue("geocode-unresolved", {
          title: displayGroupName(m.title),
          group: displayGroupName(m.title),
          city: getCity(m) || "Okänd ort",
          district: getMeetingDistrict(m),
          details: "Karttjänsten hittade ingen träff för: " + candidates.join(" / ") + ".",
          meetings: [m]
        }));
        continue;
      }

      const meetingWithGeocode = {
        ...m,
        _geocodeLat: result.lat,
        _geocodeLng: result.lng
      };

      if (!hasCoords(m)) {
        newIssues.push(makeIssue("geocode-suggestion", {
          title: displayGroupName(m.title),
          group: displayGroupName(m.title),
          city: getCity(m) || "Okänd ort",
          district: getMeetingDistrict(m),
          details: "Mötet saknar koordinater, men karttjänsten hittade: " + result.displayName + ".",
          meetings: [meetingWithGeocode]
        }));
        continue;
      }

      const distance = haversine(Number(m.latitude), Number(m.longitude), result.lat, result.lng);
      if (distance > threshold) {
        newIssues.push(makeIssue("geocode-mismatch", {
          title: displayGroupName(m.title),
          group: displayGroupName(m.title),
          city: getCity(m) || "Okänd ort",
          district: getMeetingDistrict(m),
          details: "Mötets koordinater och kartträffen skiljer " + formatMeters(distance) + ". Sökning: " + result.query + ". Träff: " + result.displayName + ".",
          meetings: [meetingWithGeocode],
          distanceKm: distance
        }));
      }
    }

    diagnosticIssues = [...diagnosticIssues, ...newIssues].map(issue => ({
      ...issue,
      searchText: issueSearchText(issue)
    }));

    renderDiagnostics();
    setStatus(
      '<span class="ok">Klart.</span> Adress/kartkontrollen hittade ' +
      newIssues.length +
      " punkter att granska."
    );
  } catch (error) {
    setStatus('<span class="bad">Fel vid kartkontroll:</span> ' + esc(error.message));
    console.error(error);
  } finally {
    geocodeRunning = false;
    if (button) {
      button.disabled = false;
      button.textContent = "Kontrollera adress/karta";
    }
  }
}

async function fetchDiagnostics(){
  setStatus("Hämtar möten...");
  $("diagnosticSections").innerHTML = "";
  $("diagnosticSummary").innerHTML = "";

  try {
    const json = await fetchSmartProxy();
    if (!json.ok || !Array.isArray(json.data)) {
      throw new Error(json.error || "Oväntat svar från /mote. data saknas.");
    }

    diagnosticMeetings = cleanMeetingsData(json.data);
    updateDistrictColorMap(diagnosticMeetings);
    buildDiagnostics();

    const meta = json.meta || {};
    setStatus(
      '<span class="ok">Klart.</span> Kontrollerade ' +
      (meta.uniqueCount || diagnosticMeetings.length) +
      ' möten. Hittade ' +
      diagnosticIssues.length +
      ' punkter att granska.'
    );
  } catch (error) {
    setStatus('<span class="bad">Fel:</span> ' + esc(error.message));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("refreshDiagnosticsBtn")?.addEventListener("click", fetchDiagnostics);
  $("geocodeDiagnosticsBtn")?.addEventListener("click", runGeocodeDiagnostics);
  $("exportDiagnosticsCsvBtn")?.addEventListener("click", exportDiagnosticsCsv);
  $("diagnosticSearch")?.addEventListener("input", renderDiagnostics);
  $("groupCoordThreshold")?.addEventListener("change", buildDiagnostics);
  $("mapLinkThreshold")?.addEventListener("change", buildDiagnostics);
  fetchDiagnostics();
});
