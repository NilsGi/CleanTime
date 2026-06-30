// Cloudflare Pages Function
// Route: /event
// Hämtar evenemang från Strapi CMS: https://cms.nasverige.org

const CMS_BASE_URL = "https://cms.nasverige.org";

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": "no-store"
    }
  });
}

function buildCmsUrl(requestUrl) {
  const incoming = new URL(requestUrl);
  const page = incoming.searchParams.get("page") || "1";
  const pageSize = incoming.searchParams.get("pageSize") || "100";

  const cmsUrl = new URL("/api/events", CMS_BASE_URL);
  cmsUrl.searchParams.set("populate", "*");
  cmsUrl.searchParams.set("sort", "startDate:asc");
  cmsUrl.searchParams.set("pagination[page]", page);
  cmsUrl.searchParams.set("pagination[pageSize]", pageSize);

  return cmsUrl.toString();
}

function normalizeEvent(item) {
  const a = item?.attributes || item || {};

  return {
    id: item?.id || a.id || null,
    title: a.title || a.name || a.heading || "Namnlöst event",
    description: a.description || a.text || a.content || "",
    startDate: a.startDate || a.start || a.date || a.startsAt || null,
    endDate: a.endDate || a.end || a.endsAt || null,
    location: a.location || a.place || a.venue || "",
    address: a.address || "",
    city: a.city || "",
    district: a.district || "",
    url: a.url || a.link || "",
    raw: item
  };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "access-control-allow-headers": "content-type, authorization"
    }
  });
}

export async function onRequestGet(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;
  const cmsUrl = buildCmsUrl(context.request.url);

  const headers = {
    accept: "application/json"
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(cmsUrl, { headers });
    const text = await response.text();

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }

    if (!response.ok) {
      return json({
        success: false,
        status: response.status,
        message: response.status === 403
          ? "CMS svarade med 403. Lägg till NASVERIGE_CMS_TOKEN i Cloudflare Pages eller aktivera Public permission för event.find i Strapi."
          : `CMS svarade med ${response.status}`,
        cmsUrl,
        cmsResponse: data
      }, response.status);
    }

    const rawEvents = Array.isArray(data?.data) ? data.data : [];
    const events = rawEvents.map(normalizeEvent);

    return json({
      success: true,
      source: "nasverige-cms",
      count: events.length,
      events,
      meta: data?.meta || null
    });
  } catch (error) {
    return json({
      success: false,
      message: error.message,
      cmsUrl
    }, 500);
  }
}