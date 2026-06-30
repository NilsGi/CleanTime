export async function onRequest(context) {
  const token = context.env.NASVERIGE_CMS_TOKEN;

  if (!token) {
    return Response.json({
      success: false,
      error: "NASVERIGE_CMS_TOKEN saknas i Cloudflare."
    }, { status: 500 });
  }

  const url = new URL("https://cms.nasverige.org/api/events");
  url.searchParams.set("populate", "*");
  url.searchParams.set("pagination[page]", "1");
  url.searchParams.set("pagination[pageSize]", "10");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const text = await response.text();

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        requestedUrl: url.toString(),
        rawText: text
      }, null, 2),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}