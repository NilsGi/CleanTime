/**
 * /functions/mote.js
 */

const CACHE_TTL_SECONDS = 300;
const PAGE_SIZE = 100;
const CMS_BASE_URL = "https://cms.nasverige.org";

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
    { ok: false, error: message, details },
    status,
    { "Cache-Control": "no-store" }
  );
}

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function cleanDay(day) {
  return String(day || "").replace(/^[a-g]\.\s*/, "");
}

function dayOrder(day) {
  const raw = String(day || "").trim();
  const prefix = raw.match(/^([a-g])\./i);
  if (prefix) return "abcdefg".indexOf(prefix[1].toLowerCase());

  const order = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
  const index = order.indexOf(cleanDay(raw).toLowerCase());
  return index >= 0 ? index : 99;
}

function timeValue(time) {
  const parts = String(time || "99:99").split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
  return h * 60 + m;
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

function compareMeetings(a, b) {
  return dayOrder(a.days) - dayOrder(b.days)
    || timeValue(a.startTime) - timeValue(b.startTime)
    || timeValue(a.endTime) - timeValue(b.endTime)
    || String(a.title || "").localeCompare(String(b.title || ""), "sv")
    || getCity(a).localeCompare(getCity(b), "sv");
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
  ].map(normalizeText).join("|");
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

function buildEndpoint(page, pageSize) {
  return `/api/meetings?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=id:asc`;
}

async function callStrapi(context, endpoint) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    throw new Error("NASVERIGE_CMS_TOKEN saknas i Cloudflare.");
  }

  const url = `${CMS_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Strapi HTTP ${response.status}: ${text.slice(0, 1000)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Strapi svarade inte med JSON: ${text.slice(0, 1000)}`);
  }
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "sv"));
}

function buildFilters(meetings) {
  const districts = uniqueSorted(meetings.map(meeting => getDistrict(meeting)));

  const cities = uniqueSorted(
    meetings.flatMap(meeting =>
      (meeting.meetingCity || []).map(city => city.city)
    )
  );

  const groups = uniqueSorted(meetings.map(meeting => meeting.title));

  const meetingTypes = uniqueSorted(
    meetings.flatMap(meeting => getTypes(meeting))
  );

  const days = uniqueSorted(meetings.map(meeting => meeting.days))
    .sort((a, b) => dayOrder(a) - dayOrder(b));

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

async function fetchAllMeetings(context) {
  const raw = [];
  let page = 1;
  let pageCount = 1;
  let apiTotal = 0;

  do {
    const endpoint = buildEndpoint(page, PAGE_SIZE);
    const json = await callStrapi(context, endpoint);

    if (!json || !Array.isArray(json.data)) {
      throw new Error(`Oväntat Strapi-svar. json.data saknas: ${JSON.stringify(json).slice(0, 500)}`);
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
    source: "strapi",
    fetchedAt: new Date().toISOString(),
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
    const cacheKey = new Request(new URL(context.request.url).origin + "/mote?all=1&v=4");

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

    const data = await fetchAllMeetings(context);

    const response = jsonResponse(data, 200, {
      "X-Cache": "MISS"
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (error) {
    return errorResponse(
      "Kunde inte hämta alla möten.",
      500,
      String(error?.message || error)
    );
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

    if (body.endpoint) {
      if (!String(body.endpoint).startsWith("/meetings")) {
        return errorResponse("Endast /meetings-endpoints är tillåtna.", 400);
      }

      const endpoint = `/api${body.endpoint}`;
      const json = await callStrapi(context, endpoint);

      return jsonResponse({
        ok: true,
        source: "strapi",
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