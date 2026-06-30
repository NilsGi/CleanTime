/**
 * /functions/mote.js
 *
 * Smart proxy för NA Sveriges mötes-API.
 *
 * Frontend kan nu bara göra:
 *
 *   const res = await fetch("/mote");
 *   const json = await res.json();
 *
 * Svaret innehåller:
 * - data: alla unika möten
 * - filters.districts
 * - filters.cities
 * - filters.groups
 * - filters.days
 * - filters.meetingTypes
 * - stats
 *
 * Filen är tänkt för Cloudflare Pages Functions.
 */

const NA_API_URL = "https://www.nasverige.org/api/posts/";
const CACHE_TTL_SECONDS = 300;
const PAGE_SIZE = 100;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400"
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      ...extraHeaders
    }
  });
}

function errorResponse(message, status = 500, details = null) {
  return jsonResponse(
    {
      ok: false,
      error: message,
      details
    },
    status,
    {
      "Cache-Control": "no-store"
    }
  );
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function cleanDay(day) {
  return String(day || "").replace(/^[a-g]\.\s*/, "");
}

function dayOrder(day) {
  const raw = String(day || "").trim();

  const prefix = raw.match(/^([a-g])\./i);
  if (prefix) return "abcdefg".indexOf(prefix[1].toLowerCase());

  const name = cleanDay(raw).toLowerCase();
  const order = [
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag",
    "söndag"
  ];

  const index = order.indexOf(name);
  return index >= 0 ? index : 99;
}

function timeValue(time) {
  const parts = String(time || "99:99").split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
  return h * 60 + m;
}

function compareMeetings(a, b) {
  return dayOrder(a.days) - dayOrder(b.days)
    || timeValue(a.startTime) - timeValue(b.startTime)
    || timeValue(a.endTime) - timeValue(b.endTime)
    || String(a.title || "").localeCompare(String(b.title || ""), "sv")
    || getCity(a).localeCompare(getCity(b), "sv");
}

function getCity(meeting) {
  return (meeting?.meetingCity || [])
    .map(city => city.city)
    .filter(Boolean)
    .join(", ");
}

function getTypes(meeting) {
  return (meeting?.meetingTypes || [])
    .map(type => type.title)
    .filter(Boolean);
}

function getDistrict(meeting) {
  return meeting?.meetingDistrict?.district || "";
}

function isOnline(meeting) {
  return getTypes(meeting).includes("Virtuellt möte") || !!meeting?.onlineMeeting;
}

function hasCoords(meeting) {
  return meeting?.latitude !== null
    && meeting?.longitude !== null
    && meeting?.latitude !== undefined
    && meeting?.longitude !== undefined
    && !Number.isNaN(Number(meeting.latitude))
    && !Number.isNaN(Number(meeting.longitude));
}

function primaryKey(meeting) {
  if (meeting?.documentId) return `documentId:${meeting.documentId}`;
  if (meeting?.id !== undefined && meeting?.id !== null) return `id:${meeting.id}`;

  return [
    meeting?.title,
    meeting?.days,
    meeting?.startTime,
    meeting?.endTime,
    meeting?.address,
    meeting?.zip
  ]
    .map(normalizeText)
    .join("|");
}

function dedupeMeetings(meetings) {
  const seen = new Set();
  const result = [];
  const duplicates = [];

  for (const meeting of meetings) {
    const key = primaryKey(meeting);

    if (seen.has(key)) {
      duplicates.push(meeting);
      continue;
    }

    seen.add(key);
    result.push(meeting);
  }

  return {
    meetings: result,
    duplicateCount: duplicates.length,
    duplicates
  };
}

function buildEndpoint(page, pageSize, sortMode = "sort_simple") {
  const base = `/meetings?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  if (sortMode === "sort_simple") return `${base}&sort=id:asc`;
  if (sortMode === "sort_array") return `${base}&sort[0]=id:asc`;
  if (sortMode === "sort_encoded") return `${base}&sort%5B0%5D=id%3Aasc`;

  return base;
}

async function callNasverige(endpoint) {
  const response = await fetch(NA_API_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "text/plain;charset=UTF-8",
      "Origin": "https://www.nasverige.org",
      "Referer": "https://www.nasverige.org/moteslista/"
    },
    body: JSON.stringify({ endpoint })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`NA API HTTP ${response.status}: ${text.slice(0, 500)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`NA API svarade inte med JSON: ${text.slice(0, 500)}`);
  }
}

async function fetchPageWithFallback(page, pageSize, preferredSortMode = null) {
  const modes = preferredSortMode
    ? [preferredSortMode]
    : ["sort_simple", "sort_array", "sort_encoded", "none"];

  let lastResponse = null;

  for (const mode of modes) {
    const endpoint = buildEndpoint(page, pageSize, mode);
    const json = await callNasverige(endpoint);
    lastResponse = json;

    if (json && Array.isArray(json.data)) {
      return {
        json,
        sortMode: mode,
        endpoint
      };
    }
  }

  throw new Error(
    `Oväntat API-svar. json.data saknas. Sista svar: ${JSON.stringify(lastResponse).slice(0, 500)}`
  );
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "sv"));
}

function buildFilters(meetings) {
  const districts = uniqueSorted(
    meetings.map(meeting => getDistrict(meeting))
  );

  const cities = uniqueSorted(
    meetings.flatMap(meeting =>
      (meeting.meetingCity || []).map(city => city.city)
    )
  );

  const groups = uniqueSorted(
    meetings.map(meeting => meeting.title)
  );

  const meetingTypes = uniqueSorted(
    meetings.flatMap(meeting => getTypes(meeting))
  );

  const days = uniqueSorted(
    meetings.map(meeting => meeting.days)
  ).sort((a, b) => dayOrder(a) - dayOrder(b));

  return {
    districts,
    cities,
    groups,
    days: days.map(day => ({
      value: day,
      label: cleanDay(day),
      order: dayOrder(day)
    })),
    meetingTypes
  };
}

function buildStats(meetings) {
  const districts = {};
  const groupsByDistrictCityName = new Set();

  for (const meeting of meetings) {
    const district = getDistrict(meeting) || "Okänt distrikt";
    const city = getCity(meeting) || "Okänd ort";
    const group = meeting.title || "Okänd grupp";

    if (!districts[district]) {
      districts[district] = {
        district,
        meetings: 0,
        physical: 0,
        online: 0,
        groups: new Set()
      };
    }

    districts[district].meetings += 1;

    if (isOnline(meeting)) {
      districts[district].online += 1;
    } else {
      districts[district].physical += 1;
    }

    const groupKey = `${normalizeText(city)}|${normalizeText(group)}`;
    districts[district].groups.add(groupKey);

    groupsByDistrictCityName.add(
      `${normalizeText(district)}|${normalizeText(city)}|${normalizeText(group)}`
    );
  }

  return {
    totalMeetings: meetings.length,
    totalGroupsByDistrictCityName: groupsByDistrictCityName.size,
    totalPhysical: meetings.filter(meeting => !isOnline(meeting)).length,
    totalOnline: meetings.filter(isOnline).length,
    totalWithCoordinates: meetings.filter(hasCoords).length,
    totalPhysicalWithCoordinates: meetings.filter(meeting => !isOnline(meeting) && hasCoords(meeting)).length,
    totalPhysicalMissingCoordinates: meetings.filter(meeting => !isOnline(meeting) && !hasCoords(meeting)).length,
    districts: Object.values(districts)
      .map(item => ({
        district: item.district,
        meetings: item.meetings,
        groups: item.groups.size,
        physical: item.physical,
        online: item.online
      }))
      .sort((a, b) => b.meetings - a.meetings || a.district.localeCompare(b.district, "sv"))
  };
}

function simplifyMeeting(meeting) {
  // Behåller originalfält men lägger även till färdiga hjälpfält.
  return {
    ...meeting,
    _city: getCity(meeting),
    _district: getDistrict(meeting),
    _types: getTypes(meeting),
    _isOnline: isOnline(meeting),
    _hasCoords: hasCoords(meeting),
    _dayLabel: cleanDay(meeting.days),
    _dayOrder: dayOrder(meeting.days),
    _startMinutes: timeValue(meeting.startTime),
    _endMinutes: timeValue(meeting.endTime)
  };
}

async function fetchAllMeetings() {
  const raw = [];
  let page = 1;
  let pageCount = 1;
  let apiTotal = 0;
  let chosenSortMode = null;

  do {
    const result = await fetchPageWithFallback(page, PAGE_SIZE, chosenSortMode);
    const json = result.json;

    if (!chosenSortMode) {
      chosenSortMode = result.sortMode;
    }

    raw.push(...json.data);

    pageCount = json.meta?.pagination?.pageCount || pageCount;
    apiTotal = json.meta?.pagination?.total || apiTotal;

    page++;
  } while (page <= pageCount);

  const deduped = dedupeMeetings(raw);
  const meetings = deduped.meetings
    .map(simplifyMeeting)
    .sort(compareMeetings);

  return {
    ok: true,
    source: "nasverige",
    fetchedAt: new Date().toISOString(),
    sortMode: chosenSortMode,
    meta: {
      apiTotal,
      rawCount: raw.length,
      uniqueCount: meetings.length,
      duplicateCount: deduped.duplicateCount,
      pageSize: PAGE_SIZE,
      pageCount
    },
    filters: buildFilters(meetings),
    stats: buildStats(meetings),
    data: meetings
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function onRequestGet(context) {
  try {
    const cache = caches.default;
    const cacheKey = new Request(new URL(context.request.url).origin + "/mote?all=1&v=2");

    const cached = await cache.match(cacheKey);
    if (cached) {
      return new Response(cached.body, {
        status: cached.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
          "X-Cache": "HIT"
        }
      });
    }

    const data = await fetchAllMeetings();

    const response = jsonResponse(data, 200, {
      "X-Cache": "MISS"
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    return errorResponse("Kunde inte hämta alla möten.", 500, String(error?.message || error));
  }
}

export async function onRequestPost(context) {
  try {
    let body = {};

    try {
      body = await context.request.json();
    } catch {
      body = {};
    }

    if (body.all === true || body.endpoint === "/meetings/all") {
      return onRequestGet(context);
    }

    // Bakåtkompatibelt läge om frontend fortfarande skickar en specifik endpoint.
    if (body.endpoint) {
      if (!String(body.endpoint).startsWith("/meetings")) {
        return errorResponse("Endast /meetings-endpoints är tillåtna.", 400);
      }

      const json = await callNasverige(body.endpoint);

      return jsonResponse({
        ok: true,
        source: "nasverige",
        mode: "single-endpoint",
        sentEndpoint: body.endpoint,
        ...json
      });
    }

    return onRequestGet(context);
  } catch (error) {
    return errorResponse("Proxyfel.", 500, String(error?.message || error));
  }
}
