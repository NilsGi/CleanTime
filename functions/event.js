export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json(
      { success: false, error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare." },
      { status: 500 }
    );
  }

  const pageSize = 100;
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

      const text = await response.text();

      if (!response.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            status: response.status,
            statusText: response.statusText,
            url,
            response: text
          }, null, 2),
          { status: response.status, headers: { "Content-Type": "application/json" } }
        );
      }

      const json = JSON.parse(text);
      allEvents = allEvents.concat(json.data || []);
      lastMeta = json.meta || null;

      const pagination = json.meta?.pagination;
      if (!pagination || page >= pagination.pageCount) break;

      page++;
    }

    return Response.json({
      success: true,
      count: allEvents.length,
      meta: lastMeta,
      fields: allEvents[0] ? Object.keys(allEvents[0]) : [],
      firstEvent: allEvents[0] || null,
      events: allEvents
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
