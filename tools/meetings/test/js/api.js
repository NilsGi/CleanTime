const PROXY_URL = "/mote";

async function fetchSmartProxy(){
  const response = await fetch(PROXY_URL, {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error("HTTP " + response.status + " från /mote: " + text.slice(0, 500));
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Svaret från /mote var inte JSON: " + text.slice(0, 500));
  }
}
