let rawMeetings = [];
let allMeetings = [];
let userPosition = null;
let map = null;
let markersLayer = null;
let userMarker = null;
let listFollowsMap = true;
let includeOnlineMeetings = false;
let includePhysicalMeetings = true;
let suppressMapMoveRender = false;
let statusTimer = null;

window.addEventListener("error", event => {
  setStatus('<span class="bad">JavaScript-fel:</span> ' + esc(event.message));
});

function $(id){return document.getElementById(id)}

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function setStatus(html, options = {}){
  const status = $("status");
  if (!status) return;

  if (statusTimer) {
    clearTimeout(statusTimer);
    statusTimer = null;
  }

  status.innerHTML = html || "";

  if (options.temporary) {
    statusTimer = setTimeout(() => {
      status.innerHTML = "";
      statusTimer = null;
    }, options.timeout || 4500);
  }
}


function cleanSingleLineField(value){
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanInformationField(value){
  const text = String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map(row => row.replace(/[\t ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  return text.trim();
}

function cleanMeetingFields(meeting){
  return {
    ...meeting,
    location: cleanSingleLineField(meeting.location),
    address: cleanSingleLineField(meeting.address),
    zip: cleanSingleLineField(meeting.zip),
    station: cleanSingleLineField(meeting.station),
    information: cleanInformationField(meeting.information)
  };
}

function cleanMeetingsData(meetings){
  return Array.isArray(meetings) ? meetings.map(cleanMeetingFields) : [];
}

function normalizeText(value){
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function cleanDay(day){ return String(day||"").replace(/^[a-g]\.\s*/,""); }

function dayOrder(day){
  const raw = String(day || "").trim();

  // API:t använder ofta prefix a-g där a = Måndag, b = Tisdag osv.
  const prefix = raw.match(/^([a-g])\./i);
  if (prefix) return "abcdefg".indexOf(prefix[1].toLowerCase());

  const name = cleanDay(raw).toLowerCase().trim();
  const order = [
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag",
    "söndag"
  ];

  const idx = order.indexOf(name);
  return idx >= 0 ? idx : 99;
}

function timeValue(time){
  const parts = String(time || "99:99").split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) return 9999;
  return h * 60 + m;
}

function formatInformation(text){
  const raw = cleanInformationField(text);
  if (!raw) return "";
  return esc(raw)
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
}

function haversine(lat1,lon1,lat2,lon2){
  const R=6371;
  const dLat=(lat2-lat1)*Math.PI/180;
  const dLon=(lon2-lon1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function loadImageAsDataUrl(src){
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height });
      } catch (e) {
        console.warn("Kunde inte läsa bild till PDF", e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function makeQrDataUrl(text){
  if (window.QRCode && typeof window.QRCode.toDataURL === "function") {
    return await window.QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 512,
      color: { dark: "#0a1981", light: "#ffffff" }
    });
  }

  // Enkel fallback via QR-server om biblioteket inte hunnit ladda.
  return "https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=" + encodeURIComponent(text);
}

function drawWrappedText(doc, text, x, y, maxWidth, lineHeight, options = {}){
  const rows = doc.splitTextToSize(String(text || ""), maxWidth);
  rows.forEach(row => {
    doc.text(row, x, y, options);
    y += lineHeight;
  });
  return y;
}

function formatExportMonthYear(date = new Date()){
  const months = [
    "Januari","Februari","Mars","April","Maj","Juni",
    "Juli","Augusti","September","Oktober","November","December"
  ];
  return months[date.getMonth()] + " " + date.getFullYear();
}

function safeUrl(href){
  const raw = String(href ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function textColorForBackground(hexColor){
  const hex = String(hexColor || "").replace("#", "").trim();
  if (!/^[0-9a-f]{6}$/i.test(hex)) return "#ffffff";

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.58 ? "#111111" : "#ffffff";
}

function externalLinkHtml(href, label){
  const url = safeUrl(href);
  return url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(label) + '</a>' : "";
}
