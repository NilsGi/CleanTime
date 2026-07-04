const COORD_PATTERNS = [
  /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  /[?&#](?:q|ll|center|query|destination|daddr)=\s*(?:loc:)?(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
  /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/i,
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/i,
  /[?&]mlat=(-?\d+(?:\.\d+)?).*?[?&]mlon=(-?\d+(?:\.\d+)?)/i,
  /[?&]mlon=(-?\d+(?:\.\d+)?).*?[?&]mlat=(-?\d+(?:\.\d+)?)/i
];

const ALLOWED_MAP_HOSTS = [
  "google.com",
  "www.google.com",
  "maps.google.com",
  "goo.gl",
  "maps.app.goo.gl",
  "openstreetmap.org",
  "www.openstreetmap.org",
  "osm.org",
  "www.osm.org"
];

function json(data, init = {}){
  return Response.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {})
    }
  });
}

function parseCoordPair(latRaw, lngRaw){
  const lat = Number(String(latRaw).replace(",", "."));
  const lng = Number(String(lngRaw).replace(",", "."));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

function extractCoordinates(text){
  const decoded = decodeURIComponent(String(text || ""));

  for (const pattern of COORD_PATTERNS) {
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

function safeMapUrl(value){
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol)) return "";

    const hostname = url.hostname.toLowerCase();
    if (!ALLOWED_MAP_HOSTS.some(host => hostname === host || hostname.endsWith("." + host))) return "";

    return url.href;
  } catch {
    return "";
  }
}

function cleanPart(value){
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildAddressQuery(body){
  return [
    body.location,
    body.address,
    body.zip,
    body.city && body.city !== "Online" ? body.city : "",
    "Sverige"
  ].map(cleanPart).filter(Boolean).join(", ");
}

async function geocodeAddress(query){
  if (!query) return null;

  const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=se&q=" +
    encodeURIComponent(query);
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "NA-Sverige-moteslista-kartkoll/1.0"
    }
  });

  if (!response.ok) return null;

  const rows = await response.json();
  const first = Array.isArray(rows) ? rows[0] : null;
  const pair = first ? parseCoordPair(first.lat, first.lon) : null;
  if (!pair) return null;

  return {
    ...pair,
    source: "address",
    query,
    displayName: first.display_name || ""
  };
}

async function resolveMapLink(linkMap){
  const url = safeMapUrl(linkMap);
  if (!url) return null;

  const directCoords = extractCoordinates(url);
  if (directCoords) {
    return {
      ...directCoords,
      source: "map-link",
      finalUrl: url
    };
  }

  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": "Mozilla/5.0 NA-Sverige-moteslista-kartkoll/1.0"
    }
  });

  const finalUrl = response.url || url;
  const finalUrlCoords = extractCoordinates(finalUrl);
  if (finalUrlCoords) {
    return {
      ...finalUrlCoords,
      source: "map-link-final-url",
      finalUrl
    };
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html") || contentType.includes("text/plain")) {
    const html = await response.text();
    const htmlCoords = extractCoordinates(html.slice(0, 500000));
    if (htmlCoords) {
      return {
        ...htmlCoords,
        source: "map-link-page",
        finalUrl
      };
    }
  }

  return {
    source: "map-link-unresolved",
    finalUrl
  };
}

export async function onRequestPost(context){
  let body = {};

  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: "Ogiltig JSON." }, { status: 400 });
  }

  const mapResult = await resolveMapLink(body.linkMap);
  if (mapResult?.lat !== undefined && mapResult?.lng !== undefined) {
    return json({ ok: true, result: mapResult });
  }

  const addressQuery = buildAddressQuery(body);
  const addressResult = await geocodeAddress(addressQuery);
  if (addressResult) {
    return json({
      ok: true,
      result: {
        ...addressResult,
        mapLinkStatus: mapResult?.source || "",
        finalUrl: mapResult?.finalUrl || ""
      }
    });
  }

  return json({
    ok: true,
    result: {
      source: "unresolved",
      query: addressQuery,
      mapLinkStatus: mapResult?.source || "",
      finalUrl: mapResult?.finalUrl || ""
    }
  });
}
