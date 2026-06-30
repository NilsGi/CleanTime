export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json(
      { success: false, error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare." },
      { status: 500 }
    );
  }

  const pageSize = 10000;
  let page = 1;
  let allEvents = [];
  let lastMeta = null;

  try {
    while (true) {
      const url =
        "https://cms.nasverige.org/api/events" +
        "?populate=*" +
        `&pagination[page]=${page}` +
        `&pagination[pageSize]=${pageSize}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      const json = await response.json();

      if (!response.ok) {
        return Response.json(
          {
            success: false,
            status: response.status,
            page,
            url,
            error: json
          },
          { status: response.status }
        );
      }

      const events = json.data || [];
      allEvents = allEvents.concat(events);
      lastMeta = json.meta || null;

      const pagination = json.meta?.pagination;

      if (!pagination || page >= pagination.pageCount) {
        break;
      }

      page++;
    }

    return Response.json({
      success: true,
      count: allEvents.length,
      pageCount: lastMeta?.pagination?.pageCount || 1,
      totalFromCms: lastMeta?.pagination?.total || allEvents.length,
      events: allEvents
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
