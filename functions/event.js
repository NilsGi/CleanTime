export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json({
      success: false,
      error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare."
    }, { status: 500 });
  }

const url =
  "https://cms.nasverige.org/api/events?populate=*&pagination[pageSize]=10";
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const text = await response.text();

    let json = null;
    try {
      json = JSON.parse(text);
    } catch (e) {}

    const firstEvent = json?.data?.[0] || null;

    return Response.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      url,
      rawText: text,
      dataType: Array.isArray(json?.data) ? "array" : typeof json?.data,
      count: json?.data?.length || 0,
      meta: json?.meta || null,
      firstEvent,
      fields: firstEvent ? Object.keys(firstEvent) : [],
      attributeFields: firstEvent?.attributes ? Object.keys(firstEvent.attributes) : []
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}