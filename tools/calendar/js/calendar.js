import { supabase } from "./api.js";

let allEvents = [];
let currentView = "list";
let selectedMonth = new Date();

const calendar = document.getElementById("calendar");
const status = document.getElementById("status");
const lastUpdated = document.getElementById("lastUpdated");
const refreshCalendarBtn = document.getElementById("refreshCalendarBtn");

document.getElementById("search").addEventListener("input", render);
document.getElementById("typeFilter").addEventListener("change", render);
document.getElementById("monthFilter").addEventListener("change", e => {
  const [year, month] = e.target.value.split("-").map(Number);
  selectedMonth = new Date(year, month - 1, 1);
  currentView = "month";
  render();
});
refreshCalendarBtn?.addEventListener("click", init);

init();

async function init() {
  buildMonthFilter();
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
  const upcomingCount = allEvents.filter(e => !isPastEvent(e)).length;
  status.textContent = `${upcomingCount} kommande händelser`;
  updateLastUpdated();
  render();
}

function buildMonthFilter() {
  const select = document.getElementById("monthFilter");
  const now = new Date();
  select.innerHTML = "";

  for (let i = 0; i < 18; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value =
      d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    const label = d.toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long"
    });

    select.innerHTML += `<option value="${value}">${label}</option>`;
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

function getFilteredEvents(options = {}) {
  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const includePast = options.includePast === true;
  const now = new Date();

  return allEvents.filter(e => {
    // Listvy och veckovy visar bara aktuella/kommande event.
    // Månadsvyn kan visa historiska månader när man väljer dem i filtret.
    if (!includePast && isPastEvent(e, now)) {
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

  // Månadsvy får visa vald månad även om den ligger bakåt i tiden.
  // Listvy och veckovy visar bara pågående/kommande event.
  const events = getFilteredEvents({
    includePast: currentView === "month"
  });

  if (currentView === "month") renderMonth(events);
  else if (currentView === "week") renderWeek(events);
  else renderList(events);
}

function renderList(events) {
  calendar.className = "event-list";

  if (!events.length) {
    calendar.innerHTML = `
      <div class="empty-state">
        <b>Inga händelser hittades</b>
        Prova att ändra sökningen, typen eller månadsvyn.
      </div>
    `;
    return;
  }

  calendar.innerHTML = events.map(eventCard).join("");
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
  return `
    <article class="event-card" id="event-${e.id}">
      <div class="event-card-top">
        <span class="type">${labelType(e.event_type)}</span>
        <span class="event-date-pill">${formatDateShort(e.start_datetime)}</span>
      </div>

      <h2>${escapeHtml(e.title)}</h2>

      <div class="meta">
        ${formatDate(e.start_datetime)}
        ${e.end_datetime ? " – " + formatDate(e.end_datetime) : ""}
        ${e.organizer ? "<br>Arrangör: " + escapeHtml(e.organizer) : ""}
        ${e.address ? "<br>Plats: " + escapeHtml(e.address) : ""}
        ${e.price ? "<br>Kostnad: " + escapeHtml(formatPrice(e.price)) : ""}
      </div>

      ${e.excerpt ? `<div class="rich-text excerpt">${renderFormattedText(e.excerpt)}</div>` : ""}
      ${e.description ? `<details><summary>Mer information</summary><div class="rich-text">${renderFormattedText(e.description)}</div></details>` : ""}

      <div class="actions">
        ${e.web_url ? `<a href="${escapeAttr(e.web_url)}" target="_blank">Öppna länk</a>` : ""}
        <button type="button" onclick="downloadEventIcs('${e.id}')">Lägg till i kalender</button>
        <a href="${googleCalendarUrl(e)}" target="_blank">Google Kalender</a>
      </div>
    </article>
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
      e.address ? `LOCATION:${icsEscape(e.address)}` : "",
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

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title || "",
    dates: `${start}/${end}`,
    details: [e.excerpt, e.description, e.price ? "Kostnad: " + formatPrice(e.price) : "", e.web_url].filter(Boolean).join("\n\n"),
    location: e.address || ""
  });

  return "https://calendar.google.com/calendar/render?" + params.toString();
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
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
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
