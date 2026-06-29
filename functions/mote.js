export async function onRequest(context) {
  const request = context.request;

  const cors = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "x-proxy-hit": "clean-time-mote-proxy"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method === "GET") {
    return new Response("Mote proxy fungerar. Använd POST.", {
      status: 200,
      headers: {
        ...cors,
        "content-type": "text/plain;charset=UTF-8"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response("Fel metod. Använd POST.", {
      status: 405,
      headers: {
        ...cors,
        "content-type": "text/plain;charset=UTF-8"
      }
    });
  }

  let incomingBody = await request.text();

  if (!incomingBody || !incomingBody.trim()) {
    incomingBody = JSON.stringify({
      endpoint: "/meetings?pagination[page]=1&pagination[pageSize]=5"
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(incomingBody);
  } catch (e) {
    return new Response(JSON.stringify({
      ok: false,
      source: "proxy",
      error: "Body är inte giltig JSON",
      receivedBody: incomingBody
    }, null, 2), {
      status: 400,
      headers: {
        ...cors,
        "content-type": "application/json;charset=UTF-8"
      }
    });
  }

  if (!parsed.endpoint) {
    return new Response(JSON.stringify({
      ok: false,
      source: "proxy",
      error: "Saknar endpoint i body",
      receivedBody: parsed
    }, null, 2), {
      status: 400,
      headers: {
        ...cors,
        "content-type": "application/json;charset=UTF-8"
      }
    });
  }

  const naRes = await fetch("https://www.nasverige.org/api/posts/", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "content-type": "text/plain;charset=UTF-8",
      "origin": "https://www.nasverige.org",
      "referer": "https://www.nasverige.org/moteslista/",
      "user-agent": "Mozilla/5.0"
    },
    body: JSON.stringify({
      endpoint: parsed.endpoint
    })
  });

  const naText = await naRes.text();

  const url = new URL(request.url);
  if (url.searchParams.get("debug") === "1") {
    return new Response(JSON.stringify({
      ok: naRes.ok,
      source: "nasverige",
      sentToNasverige: {
        url: "https://www.nasverige.org/api/posts/",
        method: "POST",
        body: { endpoint: parsed.endpoint }
      },
      nasverigeStatus: naRes.status,
      nasverigeStatusText: naRes.statusText,
      nasverigeContentType: naRes.headers.get("content-type"),
      nasverigeResponsePreview: naText.slice(0, 2000)
    }, null, 2), {
      status: 200,
      headers: {
        ...cors,
        "content-type": "application/json;charset=UTF-8"
      }
    });
  }

  return new Response(naText, {
    status: naRes.status,
    headers: {
      ...cors,
      "content-type": naRes.headers.get("content-type") || "application/json;charset=UTF-8",
      "x-nasverige-status": String(naRes.status)
    }
  });
}
