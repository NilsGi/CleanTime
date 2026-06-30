export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json(
      { success: false, error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare." },
      { status: 500 }
    );
  }

  const url =
    "https://cms.nasverige.org/api/events" +
    "?fields[0]=title" +
    "&fields[1]=slug" +
    "&fields[2]=organizer" +
    "&fields[3]=address" +
    "&fields[4]=price" +
    "&fields[5]=startDate" +
    "&fields[6]=endDate" +
    "&fields[7]=webUrl" +
    "&fields[8]=excerpt" +
    "&fields[9]=description" +
    "&populate=*"+
    "&pagination[pageSize]=100";

  try {
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

    return Response.json({
      success: true,
      count: json.data?.length || 0,
      fields: json.data?.[0] ? Object.keys(json.data[0]) : [],
      firstEvent: json.data?.[0] || null,
      events: json.data || [],
      meta: json.meta || null
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
