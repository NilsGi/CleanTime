export async function onRequestPost(context) {
  const body = await context.request.text();

  const res = await fetch("https://www.nasverige.org/api/posts/", {
    method: "POST",
    headers: {
      "accept": "*/*",
      "content-type": "text/plain;charset=UTF-8",
      "origin": "https://www.nasverige.org",
      "referer": "https://www.nasverige.org/moteslista/"
    },
    body
  });

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json;charset=UTF-8",
      "access-control-allow-origin": "*"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, accept"
    }
  });
}

export async function onRequestGet() {
  return new Response("Mote proxy fungerar. Använd POST.", {
    status: 200,
    headers: {
      "content-type": "text/plain;charset=UTF-8",
      "access-control-allow-origin": "*"
    }
  });
}
