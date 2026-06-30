export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  const page = context.request.url
    ? new URL(context.request.url).searchParams.get("page") || "1"
    : "1";

  const url =
    "https://cms.nasverige.org/api/events" +
    "?populate=*" +
    `&pagination%5Bpage%5D=${page}` +
    "&pagination%5BpageSize%5D=100";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const data = await response.json();

  return Response.json(data);
}
