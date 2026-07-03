function meetingDisplayTime(m){
  const day = cleanDay(m.days || "");
  const start = String(m.startTime || "").slice(0,5);
  const end = String(m.endTime || "").slice(0,5);
  return [day, [start, end].filter(Boolean).join("–")].filter(Boolean).join(" ");
}

function meetingAddressParts(m){
  return [m.location, m.address, m.zip, getCity(m)].filter(Boolean).map(cleanSingleLineField).filter(Boolean);
}

function meetingAddressText(m){
  return [...new Set(meetingAddressParts(m))].join(", ");
}

function meetingShareText(m){
  const rows = [
    "Mötesinformation",
    "",
    "Grupp: " + cleanSingleLineField(m.title || "Okänd grupp"),
    "Tid: " + meetingDisplayTime(m),
    "Plats: " + (isOnline(m) ? "Online" : (meetingAddressText(m) || "Ej angiven")),
  ];

  const types = getTypes(m).filter(Boolean).join(", ");
  if (types) rows.push("Mötestyp: " + types);
  if (m.station && !isOnline(m)) rows.push("Närmaste hållplats: " + cleanSingleLineField(m.station));
  if (safeUrl(m.onlineMeeting?.url)) rows.push("Online-länk: " + safeUrl(m.onlineMeeting.url));

  rows.push("", "Hitta fler möten:", "https://www.nasverige.org/");
  return rows.filter(row => row !== null && row !== undefined).join("\n");
}

async function copyTextToClipboard(text){
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

async function shareMeetingByKey(key){
  const m = findMeetingByKey(key);
  if (!m) return;

  const text = meetingShareText(m);
  const title = "Möte: " + cleanSingleLineField(m.title || "Möte");

  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      return;
    }
  } catch (error) {
    if (error && error.name === "AbortError") return;
  }

  try {
    await copyTextToClipboard(text);
    setTemporaryNotice("Mötesinformationen är kopierad.");
  } catch (error) {
    window.location.href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(text);
  }
}

function findMeetingByKey(key){
  return (allMeetings || []).find(m => meetingUniqueKey(m) === key) || null;
}

function directionsUrl(m, service){
  const hasPosition = hasCoords(m);
  const lat = hasPosition ? Number(m.latitude) : null;
  const lng = hasPosition ? Number(m.longitude) : null;
  const address = meetingAddressText(m);
  const query = hasPosition ? (lat + "," + lng) : address;

  if (!query) return "";

  if (service === "google") {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(query);
  }

  if (service === "apple") {
    return "https://maps.apple.com/?daddr=" + encodeURIComponent(query);
  }

  if (service === "waze") {
    if (hasPosition) return "https://waze.com/ul?ll=" + encodeURIComponent(lat + "," + lng) + "&navigate=yes";
    return "https://waze.com/ul?q=" + encodeURIComponent(address) + "&navigate=yes";
  }

  return "";
}

function openDirectionsDialog(key){
  const m = findMeetingByKey(key);
  if (!m || isOnline(m)) return;

  let dialog = document.getElementById("directionsDialog");
  if (!dialog) {
    dialog = document.createElement("div");
    dialog.id = "directionsDialog";
    dialog.className = "directions-dialog-backdrop";
    dialog.innerHTML = `
      <div class="directions-dialog" role="dialog" aria-modal="true" aria-labelledby="directionsDialogTitle">
        <div class="directions-dialog-header">
          <div id="directionsDialogTitle">Vägbeskrivning</div>
          <button type="button" class="directions-dialog-close" aria-label="Stäng">×</button>
        </div>
        <div class="directions-dialog-body"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDirectionsDialog();
    });
    dialog.querySelector(".directions-dialog-close")?.addEventListener("click", closeDirectionsDialog);
  }

  const address = meetingAddressText(m);
  const title = dialog.querySelector("#directionsDialogTitle");
  const body = dialog.querySelector(".directions-dialog-body");
  if (title) title.textContent = "Vägbeskrivning till " + cleanSingleLineField(m.title || "möte");
  if (body) {
    body.innerHTML = `
      <p class="directions-address">${esc(address || "Adress saknas")}</p>
      <a class="directions-choice" href="${esc(directionsUrl(m, "google"))}" target="_blank" rel="noopener">Google Maps</a>
      <a class="directions-choice" href="${esc(directionsUrl(m, "apple"))}" target="_blank" rel="noopener">Apple Kartor</a>
      <a class="directions-choice" href="${esc(directionsUrl(m, "waze"))}" target="_blank" rel="noopener">Waze</a>
      <button type="button" class="directions-choice copy-address" data-address="${esc(address)}">Kopiera adress</button>
    `;
  }

  dialog.classList.add("open");
}

function closeDirectionsDialog(){
  document.getElementById("directionsDialog")?.classList.remove("open");
}

function setTemporaryNotice(message){
  let notice = document.getElementById("temporaryNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "temporaryNotice";
    notice.className = "temporary-notice";
    document.body.appendChild(notice);
  }
  notice.textContent = message;
  notice.classList.add("show");
  clearTimeout(notice._timer);
  notice._timer = setTimeout(() => notice.classList.remove("show"), 2200);
}

function meetingActionLinkHtml(href, label){
  const url = safeUrl(href);
  return url ? `<a class="meeting-action-btn meeting-action-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : "";
}

function meetingQuickLinksHtml(m){
  return [
    meetingActionLinkHtml(m.onlineMeeting?.url, "Online-länk"),
    meetingActionLinkHtml(m.linkMap, "Karta")
  ].filter(Boolean).join("");
}

function meetingActionButtonsHtml(m){
  const key = esc(meetingUniqueKey(m));
  const quickLinks = meetingQuickLinksHtml(m);
  const share = `<button type="button" class="meeting-action-btn share-meeting-btn" data-meeting-key="${key}">Dela</button>`;
  const directions = !isOnline(m) && (hasCoords(m) || meetingAddressText(m))
    ? `<button type="button" class="meeting-action-btn directions-meeting-btn secondary" data-meeting-key="${key}">Vägbeskrivning</button>`
    : "";
  return `<div class="meeting-actions">${quickLinks}${share}${directions}</div>`;
}

document.addEventListener("click", async event => {
  const actionButton = event.target.closest(".share-meeting-btn, .directions-meeting-btn, .copy-address, .meeting-action-link");
  if (!actionButton) return;

  // Knapparna/länkarna ligger inuti klickbara möteskort. Stoppa bubbling
  // så möteskortets/kartans egen klickhändelse inte öppnar popup först.
  event.stopPropagation();
  if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();

  if (actionButton.classList.contains("meeting-action-link")) {
    return;
  }

  event.preventDefault();

  if (actionButton.classList.contains("share-meeting-btn")) {
    await shareMeetingByKey(actionButton.getAttribute("data-meeting-key"));
    return;
  }

  if (actionButton.classList.contains("directions-meeting-btn")) {
    openDirectionsDialog(actionButton.getAttribute("data-meeting-key"));
    return;
  }

  if (actionButton.classList.contains("copy-address")) {
    try {
      await copyTextToClipboard(actionButton.getAttribute("data-address") || "");
      setTemporaryNotice("Adressen är kopierad.");
      closeDirectionsDialog();
    } catch(error) {
      setTemporaryNotice("Kunde inte kopiera adressen.");
    }
  }
}, true);


["touchstart","touchend","pointerdown","pointerup"].forEach(type => {
  document.addEventListener(type, event => {
    const target = event.target.closest(".share-meeting-btn, .directions-meeting-btn, .copy-address, .meeting-action-link, .meeting-actions, .directions-dialog");
    if (!target) return;

    // Stoppa händelsen från att bubbla till möteskortet/kartan, men använd inte
    // preventDefault här. På mobil kan preventDefault på touch/pointer stoppa
    // det efterföljande click-eventet, vilket gör att knapparna inte fungerar.
    event.stopPropagation();
  }, true);
});
