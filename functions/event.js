// Cloudflare Pages Function
// URL blir: /event
// Hämtar event från NA Sveriges Strapi CMS

export async function onRequestGet(context) {
  const url = new URL(context.request.url);

  const pageSize = url.searchParams.get("pageSize") || "100";
  const page = url.searchParams.get("page") || "1";

  const CMS_URL =
    `https://cms.nasverige.org/api/events` +
    `?populate=*` +
    `&sort=startDate:asc` +
    `&pagination[page]=${encodeURIComponent(page)}` +
    `&pagination[pageSize]=${encodeURIComponent(pageSize)}`;

  try {
    const response = await fetch(CMS_URL, {
      headers: {
        "Accept": "application/json"
        // Om API:t kräver token senare:
        // "Authorization": `Bearer ${context.env.NASVERIGE_CMS_TOKEN}`
      }
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        source: "nasverige-cms",
        error: `CMS svarade med ${response.status}`,
        cmsUrl: CMS_URL
      }, { status: response.status });
    }

    const data = await response.json();

    return Response.json({
      success: true,
      source: "nasverige-cms",
      count: data?.data?.length || 0,
      events: data?.data || [],
      meta: data?.meta || null
    }, {
      headers: {
        "Cache-Control": "public, max-age=300"
      }
    });

  } catch (error) {
    return Response.json({
      success: false,
      source: "nasverige-cms",
      error: error.message
    }, { status: 500 });
  }
}
