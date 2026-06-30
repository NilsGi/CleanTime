export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json(
      {
        success: false,
        error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare."
      },
      { status: 500 }
    );
  }

  const baseUrl = "https://cms.nasverige.org/api/events";
  const pageSize = 100;

  let page = 1;
  let allEvents = [];
  let meta = null;

  try {
    while (true) {
      const url =
        `${baseUrl}` +
        `?populate=*` +
        `&pagination%5Bpage%5D=${page}` +
        `&pagination%5BpageSize%5D=${pageSize}` +
        `&sort=startDate:asc`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      const text = await response.text();

      if (!response.ok) {
        return new Response(
          JSON.stringify(
            {
              success: false,
              status: response.status,
              statusText: response.statusText,
              response: text
            },
            null,
            2
          ),
          {
            status: response.status,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }

      const json = JSON.parse(text);

      const events = json.data || [];
      meta = json.meta || null;

      allEvents = allEvents.concat(events);

      const pagination = json.meta?.pagination;

      if (!pagination || page >= pagination.pageCount) {
        break;
      }

      page++;
    }

    return Response.json({
      success: true,
      source: "nasverige-cms",
      count: allEvents.length,
      meta,
      events: allEvents
    });

  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}