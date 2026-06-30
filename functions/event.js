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

  const url =
    "https://cms.nasverige.org/api/events?populate=*&pagination[pageSize]=100&sort=startDate:asc";

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const text = await response.text();

    // Om Strapi svarar med fel, skicka tillbaka hela svaret
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

    // Returnera datan direkt
    return new Response(text, {
      headers: {
        "Content-Type": "application/json"
      }
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