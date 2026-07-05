import { supabase } from "./api.js";

let allEvents = [];
let currentView = "list";
let selectedMonth = new Date();
let calendarMode = new URLSearchParams(window.location.search).get("view") === "past"
  ? "past"
  : "upcoming";

const calendar = document.getElementById("calendar");
const status = document.getElementById("status");
const lastUpdated = document.getElementById("lastUpdated");
const refreshCalendarBtn = document.getElementById("refreshCalendarBtn");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const monthFilter = document.getElementById("monthFilter");
const yearFilter = document.getElementById("yearFilter");
const viewSection = document.getElementById("viewSection");
const pageTitle = document.getElementById("pageTitle");
const pageIntro = document.getElementById("pageIntro");

searchInput.addEventListener("input", render);
typeFilter.addEventListener("change", render);
monthFilter.addEventListener("change", e => {
  if (calendarMode === "past") {
    render();
    return;
  }

  const [year, month] = e.target.value.split("-").map(Number);
  selectedMonth = new Date(year, month - 1, 1);
  currentView = "month";
  render();
});
yearFilter?.addEventListener("change", render);
refreshCalendarBtn?.addEventListener("click", init);
window.addEventListener("calendar-mode-change", event => {
  setCalendarMode(event.detail?.mode === "past" ? "past" : "upcoming");
});

init();

async function init() {
  status.textContent = "Hämtar kalender...";

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("is_published", true)
    .eq("is_hidden", false)
    .order("start_datetime", { ascending: true });

  if (error) {
    status.textContent = "Kunde inte hämta kalendern.";
    return;
  }

  allEvents = data || [];
  buildYearFilter(calendarMode === "past");
  buildMonthFilter();
  updateLastUpdated();
  render();
}

function setCalendarMode(mode) {
  if (calendarMode === mode) return;

  calendarMode = mode;
  currentView = "list";
  selectedMonth = new Date();
  resetFiltersForMode();
  buildYearFilter(calendarMode === "past");
  buildMonthFilter();
  render();
}

function resetFiltersForMode() {
  searchInput.value = "";
  typeFilter.value = "";
  monthFilter.value = "";
  if (yearFilter) yearFilter.value = "";
}

function buildYearFilter(defaultToCurrentYear = false) {
  if (!yearFilter) return;

  const selected = yearFilter.value;
  const currentYear = new Date().getFullYear();
  const years = [...new Set(modeBaseEvents()
    .map(e => e.start_datetime ? new Date(e.start_datetime).getFullYear() : null)
    .filter(year => Number.isFinite(year))
    .concat(calendarMode === "past" ? [currentYear] : []))]
    .sort((a, b) => calendarMode === "past" ? b - a : a - b);

  yearFilter.innerHTML = `<option value="">Alla år</option>` +
    years.map(year => `<option value="${year}">${year}</option>`).join("");

  yearFilter.value = defaultToCurrentYear
    ? String(currentYear)
    : (years.includes(Number(selected)) ? selected : "");
}

function buildMonthFilter() {
  const select = document.getElementById("monthFilter");
  const now = new Date();
  const currentMonth = firstOfMonth(now);
  const eventMonths = modeBaseEvents()
    .map(e => e.start_datetime)
    .filter(Boolean)
    .map(value => firstOfMonth(new Date(value)))
    .filter(date => !Number.isNaN(date.getTime()));

  const firstEventMonth = eventMonths.length
    ? new Date(Math.min(...eventMonths.map(date => date.getTime())))
    : currentMonth;
  const lastEventMonth = eventMonths.length
    ? new Date(Math.max(...eventMonths.map(date => date.getTime())))
    : currentMonth;

  const startMonth = calendarMode === "past" ? firstEventMonth : currentMonth;
  const endMonth = calendarMode === "past"
    ? new Date(Math.max(lastEventMonth.getTime(), firstEventMonth.getTime()))
    : new Date(Math.max(
      lastEventMonth.getTime(),
      firstOfMonth(new Date(now.getFullYear(), now.getMonth() + 17, 1)).getTime()
    ));
  const selectedValue = monthValue(selectedMonth);
  const currentValue = monthValue(currentMonth);
  select.innerHTML = calendarMode === "past"
    ? `<option value="">Alla månader</option>`
    : "";

  for (let d = new Date(startMonth); d <= endMonth; d.setMonth(d.getMonth() + 1)) {
    const value = monthValue(d);
    const label = d.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long"
    });

    select.innerHTML += `<option value="${value}">${label}</option>`;
  }

  const values = [...select.options].map(option => option.value);
  select.value = calendarMode === "past"
    ? (values.includes(selectedValue) ? selectedValue : "")
    : (values.includes(selectedValue) ? selectedValue : currentValue);

  if (select.value) {
    const [year, month] = select.value.split("-").map(Number);
    selectedMonth = new Date(year, month - 1, 1);
  }
}

function updateLastUpdated() {
  if (!lastUpdated) return;

  const newest = allEvents
    .map(e => e.updated_at || e.created_at)
    .filter(Boolean)
    .map(value => new Date(value))
    .filter(date => !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a)[0];

  lastUpdated.textContent = newest
    ? "Senast uppdaterad/importerad: " + newest.toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
    : "Senast uppdaterad/importerad: okänt";
}

function updateStatus(filteredCount = null) {
  const upcomingCount = allEvents.filter(e => !isPastEvent(e)).length;
  const pastCount = allEvents.length - upcomingCount;

  if (calendarMode === "past") {
    const count = Number.isFinite(filteredCount) ? filteredCount : pastCount;
    status.textContent = `${count} tidigare händelser i urvalet`;
    return;
  }

  const count = Number.isFinite(filteredCount) ? filteredCount : upcomingCount;
  status.textContent = `${count} kommande händelser`;
}

function modeBaseEvents() {
  return allEvents.filter(event => {
    const past = isPastEvent(event);
    return calendarMode === "past" ? past : !past;
  });
}

window.refreshCalendar = init;

window.setView = function(view) {
  currentView = view;
  render();
};

function updateViewButtons() {
  document.querySelectorAll("[data-view]").forEach(button => {
    const active = button.dataset.view === currentView;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updatePageMode() {
  if (pageTitle) {
    pageTitle.textContent = calendarMode === "past" ? "Tidigare händelser" : "Kommande händelser";
  }

  if (pageIntro) {
    pageIntro.textContent = calendarMode === "past"
      ? "Tidigare event, distriktsmöten, UKSAM och regionsmöten. Filtrera på sökord, typ, månad och år."
      : "Event, distriktsmöten, UKSAM och regionsmöten. Filtrera, växla vy och lägg till händelser i din egen kalender.";
  }

  viewSection?.classList.toggle("is-hidden", calendarMode === "past");
}

function getFilteredEvents() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;
  const selectedYear = yearFilter?.value || "";
  const selectedMonthValue = monthFilter.value;
  const now = new Date();

  return allEvents.filter(e => {
    const past = isPastEvent(e, now);
    if (calendarMode === "past" && !past) return false;
    if (calendarMode !== "past" && past) {
      return false;
    }

    const eventStart = e.start_datetime ? new Date(e.start_datetime) : null;
    if (selectedYear && (!eventStart || eventStart.getFullYear() !== Number(selectedYear))) {
      return false;
    }

    if (calendarMode === "past" && selectedMonthValue && (!eventStart || monthValue(eventStart) !== selectedMonthValue)) {
      return false;
    }

    const text = [
      e.title,
      e.organizer,
      e.address,
      e.price,
      e.excerpt,
      e.description
    ].join(" ").toLowerCase();

    if (search && !text.includes(search)) return false;
    if (type && e.event_type !== type) return false;

    return true;
  });
}

function render() {
  updateViewButtons();
  updatePageMode();

  const events = getFilteredEvents();
  updateStatus(events.length);

  if (calendarMode === "past") renderList(events);
  else if (currentView === "month") renderMonth(events);
  else if (currentView === "week") renderWeek(events);
  else renderList(events);
}

function renderList(events) {
  calendar.className = "event-list";

  if (!events.length) {
    calendar.innerHTML = `
      <div class="empty-state">
        <b>Inga händelser hittades</b>
        ${calendarMode === "past"
          ? "Prova att ändra sökningen, typen, månaden eller året."
          : "Prova att ändra sökningen, typen eller månadsvyn."}
      </div>
    `;
    return;
  }

  if (calendarMode === "past") {
    calendar.innerHTML = sortPastEvents(events).map(eventCard).join("");
    return;
  }

  calendar.innerHTML = sortUpcomingEvents(events).map(eventCard).join("");
}

function renderWeek(events) {
  calendar.className = "week-list";

  const start = startOfWeek(new Date());
  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }

  calendar.innerHTML = days.map(day => {
    const dayEvents = events.filter(e => eventOccursOnDate(e, day));

    return `
      <div class="week-day">
        <h3>${day.toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })}</h3>
        ${dayEvents.length ? dayEvents.map(eventCard).join("") : "<p>Inga händelser.</p>"}
      </div>
    `;
  }).join("");
}

function renderMonth(events) {
  calendar.className = "calendar-grid";

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  const startOffset = (first.getDay() + 6) % 7;
  const totalDays = startOffset + last.getDate();

  const dayNames = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
  const monthLabel = selectedMonth.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long"
  });

  let html = `<div class="month-heading">${monthLabel}</div>`;
  html += dayNames.map(d => `<div class="day-name">${d}</div>`).join("");

  for (let i = 0; i < totalDays; i++) {
    if (i < startOffset) {
      html += `<div class="day empty"></div>`;
      continue;
    }

    const dayNumber = i - startOffset + 1;
    const date = new Date(year, month, dayNumber);
    const todayClass = sameDay(date, new Date()) ? " is-today" : "";

    const dayEvents = events.filter(e =>
      eventOccursOnDate(e, date)
    );

    html += `
      <div class="day${todayClass}">
        <div class="day-number">${dayNumber}</div>
        ${dayEvents.map(e => monthEventPill(e, date)).join("")}
      </div>
    `;
  }

  calendar.innerHTML = html;
}

function monthEventPill(event, date) {
  const placement = getEventDayPlacement(event, date);
  const className = [
    "day-event",
    isPastEvent(event) ? "is-past" : "",
    placement.isMultiDay ? "is-multiday" : "",
    placement.isMultiDay ? `is-${placement.position}` : ""
  ].filter(Boolean).join(" ");

  const startArrow = placement.showBackArrow
    ? `<span class="event-flow" aria-hidden="true">&larr;</span>`
    : "";
  const endArrow = placement.showForwardArrow
    ? `<span class="event-flow" aria-hidden="true">&rarr;</span>`
    : "";
  const displayTime = placement.showStartTime
    ? `${time(event.start_datetime)} `
    : placement.showEndTime
      ? `${time(event.end_datetime)} `
      : "";

  const label = placement.isMultiDay
    ? `${placement.dayLabel}. ${event.title}`
    : event.title;

  return `
    <div class="${className}" onclick="showEvent('${event.id}')" title="${escapeAttr(label)}">
      ${startArrow}
      <span class="event-title">${displayTime}${escapeHtml(event.title)}</span>
      ${endArrow}
    </div>
  `;
}

function eventCard(e) {
  const address = displayAddress(e.address);
  const past = isPastEvent(e);

  return `
    <article class="event-card${past ? " is-past" : ""}" id="event-${e.id}">
      <div class="event-card-main">
        <div class="event-card-top">
          <span class="type">${labelType(e.event_type)}</span>
          <span class="event-date-pill">${formatDateShort(e.start_datetime)}</span>
          ${past ? `<span class="past-pill">Tidigare</span>` : ""}
        </div>

        <h2>${escapeHtml(e.title)}</h2>

        <div class="meta">
          ${formatDate(e.start_datetime)}
          ${e.end_datetime ? " – " + formatDate(e.end_datetime) : ""}
          ${e.organizer ? "<br>Arrangör: " + escapeHtml(e.organizer) : ""}
          ${address ? addressMeta(address, e.address) : ""}
          ${e.price ? "<br>Kostnad: " + escapeHtml(formatPrice(e.price)) : ""}
        </div>

        ${e.excerpt ? `<div class="rich-text excerpt">${renderFormattedText(e.excerpt)}</div>` : ""}
        ${e.description ? `<details><summary>Mer information</summary><div class="rich-text">${renderFormattedText(e.description)}</div></details>` : ""}

        <div class="actions">
          ${e.web_url ? `<a href="${escapeAttr(e.web_url)}" target="_blank">Öppna länk</a>` : ""}
          <button type="button" onclick="shareEvent('${e.id}')">Dela event</button>
          <button type="button" onclick="downloadEventIcs('${e.id}')">Lägg till i kalender</button>
          <a href="${googleCalendarUrl(e)}" target="_blank">Google Kalender</a>
        </div>
      </div>
      ${eventImage(e)}
    </article>
  `;
}

function eventImage(e) {
  if (!e.image_url) return "";

  const url = escapeAttr(e.image_url);

  return `
    <div class="event-image">
      <a href="${url}" target="_blank" aria-label="Öppna stor bild för ${escapeAttr(e.title)}">
        <img src="${url}" alt="" loading="lazy">
      </a>
      <a class="event-image-link" href="${url}" target="_blank">Hämta stor bild</a>
    </div>
  `;
}

function addressMeta(address, rawAddress = address) {
  if (isOnlineAddress(rawAddress)) {
    return `<br>Plats: <span class="online-place">${escapeHtml(address)}</span>`;
  }

  const url = escapeAttr(googleMapsUrl(address));

  return `
    <br>Plats:
    <a class="map-link" href="${url}" target="_blank" rel="noopener">${escapeHtml(address)}</a>
    <a class="map-link map-link-secondary" href="${url}" target="_blank" rel="noopener">Visa karta</a>
  `;
}

window.showEvent = function(id) {
  currentView = "list";
  render();

  setTimeout(() => {
    document.getElementById("event-" + id)?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 50);
};

window.downloadEventIcs = function(id) {
  const event = allEvents.find(e => e.id === id);
  if (!event) return;

  downloadFile(
    slug(event.title) + ".ics",
    createIcs([event])
  );
};

window.shareEvent = async function(id) {
  const event = allEvents.find(e => e.id === id);
  if (!event) return;

  const shareUrl = event.web_url || "";
  const shareText = buildShareText(event);
  const payload = {
    title: event.title || "NA Sverige event",
    text: shareText
  };

  if (shareUrl) {
    payload.url = shareUrl;
  }

  try {
    if (navigator.share) {
      await navigator.share(payload);
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }

  await copyShareText(event);
};

async function copyShareText(event) {
  const text = buildShareText(event, { includePrimaryUrl: true });

  try {
    await navigator.clipboard.writeText(text);
    alert("Eventet är kopierat och kan klistras in.");
  } catch {
    window.prompt("Kopiera eventet:", text);
  }
}

function buildShareText(event, options = {}) {
  const address = displayAddress(event.address);
  const mapAddress = physicalAddress(event.address);
  const lines = [
    event.title || "NA Sverige event",
    labelType(event.event_type),
    "",
    "Tid: " + formatDate(event.start_datetime) + (event.end_datetime ? " - " + formatDate(event.end_datetime) : ""),
    event.organizer ? "Arrangör: " + event.organizer : "",
    address ? "Plats: " + address : "",
    mapAddress ? "Karta: " + googleMapsUrl(mapAddress) : "",
    event.price ? "Kostnad: " + formatPrice(event.price) : "",
    event.excerpt ? "\n" + plainText(event.excerpt) : "",
    event.image_url ? "\nBild: " + event.image_url : "",
    options.includePrimaryUrl && event.web_url ? "\nLänk: " + event.web_url : ""
  ];

  return lines.filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

window.downloadAllIcs = function() {
  downloadFile(
    "na-sverige-kalender.ics",
    createIcs(getFilteredEvents())
  );
};

function createIcs(events) {
  const now = icsDate(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NA Sverige//Kalender//SV",
    "CALSCALE:GREGORIAN",
    ...events.flatMap(e => [
      "BEGIN:VEVENT",
      `UID:${e.id}@nasverige-kalender`,
      `DTSTAMP:${now}`,
      `DTSTART:${icsDate(new Date(e.start_datetime))}`,
      e.end_datetime ? `DTEND:${icsDate(new Date(e.end_datetime))}` : "",
      `SUMMARY:${icsEscape(e.title)}`,
      displayAddress(e.address) ? `LOCATION:${icsEscape(displayAddress(e.address))}` : "",
      `DESCRIPTION:${icsEscape([e.excerpt, e.description, e.price ? "Kostnad: " + formatPrice(e.price) : "", e.web_url].filter(Boolean).join("\\n\\n"))}`,
      e.web_url ? `URL:${e.web_url}` : "",
      "END:VEVENT"
    ].filter(Boolean)),
    "END:VCALENDAR"
  ].join("\r\n");
}

function googleCalendarUrl(e) {
  const start = googleDate(new Date(e.start_datetime));
  const end = e.end_datetime
    ? googleDate(new Date(e.end_datetime))
    : googleDate(new Date(new Date(e.start_datetime).getTime() + 60 * 60 * 1000));

  const address = displayAddress(e.address);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title || "",
    dates: `${start}/${end}`,
    details: [e.excerpt, e.description, e.price ? "Kostnad: " + formatPrice(e.price) : "", e.web_url].filter(Boolean).join("\n\n"),
    location: address || ""
  });

  return "https://calendar.google.com/calendar/render?" + params.toString();
}

function googleMapsUrl(address) {
  return "https://www.google.com/maps/search/?" + new URLSearchParams({
    api: "1",
    query: address || ""
  }).toString();
}

function physicalAddress(address) {
  const value = String(address || "").trim();
  return value && !isOnlineAddress(value) ? value : "";
}

function displayAddress(address) {
  const value = String(address || "").trim();
  if (!value) return "";
  return isOnlineAddress(value) ? "Online" : value;
}

function isOnlineAddress(address) {
  const value = String(address || "").trim().toLowerCase();
  if (!value) return false;

  return /^(online|digitalt?|digital|webb|web|internet|virtuellt?|distans|zoom|teams|microsoft teams|google meet|meet|skype|telefon|phone)(\b|$)/i.test(value) ||
    /\b(online|digitalt?|virtuellt?|zoom|teams|microsoft teams|google meet|webbmöte|webbmode|distansmöte|distansmote)\b/i.test(value);
}

function plainText(value) {
  return String(value || "")
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi, "$2")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi, "$1: $2")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function eventOccursOnDate(event, date) {
  if (!event.start_datetime) return false;

  const start = new Date(event.start_datetime);
  const end = event.end_datetime
    ? new Date(event.end_datetime)
    : new Date(event.start_datetime);

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return start <= dayEnd && end >= dayStart;
}

function getEventDayPlacement(event, date) {
  const start = new Date(event.start_datetime);
  const end = event.end_datetime
    ? new Date(event.end_datetime)
    : new Date(event.start_datetime);

  const isStartDay = sameDay(start, date);
  const isEndDay = sameDay(end, date);
  const isMultiDay = !sameDay(start, end);

  let position = "single";
  if (isMultiDay && isStartDay) position = "start";
  else if (isMultiDay && isEndDay) position = "end";
  else if (isMultiDay) position = "middle";

  return {
    position,
    isMultiDay,
    showBackArrow: isMultiDay && !isStartDay,
    showForwardArrow: isMultiDay && !isEndDay,
    showStartTime: !isMultiDay || isStartDay,
    showEndTime: isMultiDay && isEndDay,
    dayLabel: getEventDayLabel(start, end, date)
  };
}

function getEventDayLabel(start, end, date) {
  const startDay = stripTime(start);
  const endDay = stripTime(end);
  const currentDay = stripTime(date);

  const dayIndex = Math.round((currentDay - startDay) / 86400000) + 1;
  const totalDays = Math.round((endDay - startDay) / 86400000) + 1;

  return `Dag ${dayIndex} av ${totalDays}`;
}

function stripTime(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isPastEvent(event, now = new Date()) {
  if (!event.start_datetime) return true;

  const end = event.end_datetime
    ? new Date(event.end_datetime)
    : new Date(event.start_datetime);

  return end < now;
}

function sortUpcomingEvents(events) {
  return [...events].sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
}

function sortPastEvents(events) {
  return [...events].sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
}

function firstOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthValue(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("sv-SE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDateShort(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short"
  });
}

function time(value) {
  return new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function icsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function googleDate(date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatPrice(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/\bkr\b|kron|gratis|fri|valfri|sjunde tradition/i.test(text)) return text;
  if (/^\d+([,.]\d+)?$/.test(text)) return `${text} kr`;
  return text;
}

function renderFormattedText(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n");

  const html = [];
  let listType = null;
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${paragraph.map(formatInline).join("<br>")}</p>`);
    paragraph = [];
  }

  function closeList() {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  }

  function openList(type) {
    if (listType === type) return;
    closeList();
    listType = type;
    html.push(`<${type}>`);
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }

    const heading = line.match(/^\*\*(.+?)\*\*$/);
    if (heading) {
      flushParagraph();
      closeList();
      html.push(`<h4>${formatInline(heading[1])}</h4>`);
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      openList("ul");
      html.push(`<li>${formatInline(bullet[1])}</li>`);
      continue;
    }

    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      openList("ol");
      html.push(`<li>${formatInline(numbered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(line);
  }

  flushParagraph();
  closeList();

  return html.join("");
}

function formatInline(text) {
  const source = String(text || "");
  const markdownLinkPattern = /(!?)\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi;
  let html = "";
  let lastIndex = 0;
  let match;

  while ((match = markdownLinkPattern.exec(source)) !== null) {
    html += formatPlainInline(source.slice(lastIndex, match.index));
    const href = match[3];
    const label = match[2];
    const isMarkdownImage = match[1] === "!";

    html += isMarkdownImage || isImageUrl(cleanUrlMatch(href).url)
      ? imageLink(href)
      : safeLink(href, label);

    lastIndex = match.index + match[0].length;
  }

  html += formatPlainInline(source.slice(lastIndex));
  return html;
}

function formatPlainInline(text) {
  const urlPattern = /https?:\/\/[^\s<>()]+/gi;
  let html = "";
  let lastIndex = 0;
  let match;

  while ((match = urlPattern.exec(text)) !== null) {
    html += formatStrong(escapeHtml(text.slice(lastIndex, match.index)));
    const { url, suffix } = cleanUrlMatch(match[0]);
    html += safeLink(url, url);
    html += formatStrong(escapeHtml(suffix));
    lastIndex = match.index + match[0].length;
  }

  html += formatStrong(escapeHtml(text.slice(lastIndex)));
  return html;
}

function formatStrong(html) {
  return html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function safeLink(href, label) {
  const url = cleanUrlMatch(href).url;
  if (!/^https?:\/\//i.test(url)) {
    return formatStrong(escapeHtml(label || href));
  }

  if (isImageUrl(url)) {
    return imageLink(url);
  }

  return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${formatStrong(escapeHtml(label || url))}</a>`;
}

function imageLink(href) {
  const url = cleanUrlMatch(href).url;

  return `
    <a class="inline-image-link" href="${escapeAttr(url)}" target="_blank" rel="noopener" aria-label="Öppna bild">
      <img class="inline-image" src="${escapeAttr(url)}" alt="" loading="lazy">
    </a>
  `;
}

function isImageUrl(url) {
  return /\.(svg|png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(url);
}

function cleanUrlMatch(value) {
  let url = String(value || "").trim();
  let suffix = "";

  while (/[.,;:!?"'\]}]+$/.test(url)) {
    suffix = url.slice(-1) + suffix;
    url = url.slice(0, -1);
  }

  return { url, suffix };
}

function icsEscape(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function labelType(type) {
  return {
    event: "Event",
    distrikt: "Distrikt",
    uksam: "UKSAM",
    region: "Region"
  }[type] || type || "Event";
}

function slug(text) {
  return String(text || "event")
    .toLowerCase()
    .replace(/[^a-z0-9åäö]+/gi, "-")
    .replace(/^-|-$/g, "");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}
