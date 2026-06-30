export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json(
      { success: false, error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare." },
      { status: 500 }
    );
  }

  const limit = 100;
  let start = 0;
  let allEvents = [];

  try {
    while (true) {
      const url =
        "https://cms.nasverige.org/api/events" +
        "?populate=*" +
        `&pagination[start]=${start}` +
        `&pagination[limit]=${limit}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });

      const json = await response.json();

      if (!response.ok) {
        return Response.json({
          success: false,
          status: response.status,
          url,
          error: json
        }, { status: response.status });
      }

      const events = json.data || [];
      allEvents = allEvents.concat(events);

      if (events.length < limit) {
        break;
      }

      start += limit;
    }

    return Response.json({
      success: true,
      count: allEvents.length,
      events: allEvents
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
