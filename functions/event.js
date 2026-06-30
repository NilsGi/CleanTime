export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json({
      success: false,
      error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare."
    }, { status: 500 });
  }

  const url =
    "https://cms.nasverige.org/api/events" +
    "?populate=*" +
    "&pagination%5BpageSize%5D=5" +
    "&sort=startDate:asc";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const json = await response.json();

  const firstEvent = json.data?.[0];

  return Response.json({
    success: response.ok,
    status: response.status,
    count: json.data?.length || 0,
    meta: json.meta || null,

    // Visar hela första eventet
    firstEvent,

    // Visar vilka fält som finns
    topLevelFields: firstEvent ? Object.keys(firstEvent) : [],
    attributeFields: firstEvent?.attributes
      ? Object.keys(firstEvent.attributes)
      : Object.keys(firstEvent || {})
  });
}