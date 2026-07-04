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
    id: "spelling",
    title: "Möjliga stavningsvarianter",
    empty: "Inga tydliga stavningsvarianter hittades."
  }
];

let diagnosticMeetings = [];
let diagnosticIssues = [];

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
  $("exportDiagnosticsCsvBtn")?.addEventListener("click", exportDiagnosticsCsv);
  $("diagnosticSearch")?.addEventListener("input", renderDiagnostics);
  $("groupCoordThreshold")?.addEventListener("change", buildDiagnostics);
  $("mapLinkThreshold")?.addEventListener("change", buildDiagnostics);
  fetchDiagnostics();
});
