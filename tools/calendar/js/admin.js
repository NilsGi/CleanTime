import { supabase } from "./api.js";
import {
  AUTH_SESSION_KEY,
  AUTO_IMPORT_INTERVAL_HOURS,
  ENCODED_ADMIN_PASSWORD
} from "./config.js";

const log = document.getElementById("log");
const adminAuth = document.getElementById("adminAuth");
const adminTools = document.getElementById("adminTools");
const adminContent = document.getElementById("adminContent");
const authForm = document.getElementById("authForm");
const authPassword = document.getElementById("adminPassword");
const authError = document.getElementById("authError");
const autoImportToggle = document.getElementById("autoImportToggle");
const autoImportStatus = document.getElementById("autoImportStatus");
const autoImportNow = document.getElementById("autoImportNow");
const autoImportEnabledKey = "naCalendarAutoImportEnabled";
const autoImportLastRunKey = "naCalendarAutoImportLastRun";

let editingId = null;
let manualEvents = [];
let autoImportControlsInitialized = false;

function unlockAdmin() {
  adminAuth?.classList.add("is-hidden");
  adminTools?.classList.remove("is-hidden");
  adminContent?.classList.remove("is-hidden");
  initAutoImportControls();
  loadManualEvents();
  runAutoImportIfDue();
}

if (sessionStorage.getItem(AUTH_SESSION_KEY) === "true") {
  unlockAdmin();
} else if (window.location.hash === "#admin") {
  authPassword.focus();
}

window.addEventListener("calendar-admin-view", () => {
  if (sessionStorage.getItem(AUTH_SESSION_KEY) !== "true") {
    authPassword.focus();
  }
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (authPassword.value === atob(ENCODED_ADMIN_PASSWORD)) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    authError.textContent = "";
    unlockAdmin();
    return;
  }

  authError.textContent = "Fel lösenord.";
  authPassword.select();
});

function initAutoImportControls() {
  if (!autoImportToggle || autoImportControlsInitialized) return;

  autoImportControlsInitialized = true;
  autoImportToggle.checked = localStorage.getItem(autoImportEnabledKey) === "true";
  updateAutoImportStatus();

  autoImportToggle.addEventListener("change", () => {
    localStorage.setItem(autoImportEnabledKey, autoImportToggle.checked ? "true" : "false");
    updateAutoImportStatus();

    if (autoImportToggle.checked) {
      runAutoImportIfDue();
    }
  });

  autoImportNow?.addEventListener("click", () => {
    window.importFromNasverige({ manualRun: true });
  });
}

async function runAutoImportIfDue() {
  if (!autoImportToggle?.checked) return;

  const lastRun = Number(localStorage.getItem(autoImportLastRunKey) || 0);
  const intervalMs = AUTO_IMPORT_INTERVAL_HOURS * 60 * 60 * 1000;

  if (lastRun && Date.now() - lastRun < intervalMs) {
    updateAutoImportStatus();
    return;
  }

  await window.importFromNasverige({ automatic: true });
}

function markAutoImportRun() {
  localStorage.setItem(autoImportLastRunKey, String(Date.now()));
  updateAutoImportStatus();
}

function updateAutoImportStatus() {
  if (!autoImportStatus) return;

  const enabled = localStorage.getItem(autoImportEnabledKey) === "true";
  const lastRun = Number(localStorage.getItem(autoImportLastRunKey) || 0);

  if (!enabled) {
    autoImportStatus.textContent = "Automatisk import är avstängd.";
    return;
  }

  autoImportStatus.textContent = lastRun
    ? "Automatisk import är på. Senast körd: " + new Date(lastRun).toLocaleString("sv-SE") + "."
    : "Automatisk import är på. Import körs nästa gång admin öppnas.";
}

window.saveEvent = async function () {
  const title = val("title");
  const startDate = val("start_date");
  const startTime = val("start_time");

  if (!title || !startDate || !startTime) {
    log.textContent = "Titel, startdatum och starttid krävs.";
    return;
  }

  const row = {
    source: "manual",
    event_type: val("event_type"),

    title,
    organizer: val("organizer") || null,
    address: val("address") || null,

    start_datetime: combine(startDate, startTime),
    end_datetime: val("end_date") && val("end_time")
      ? combine(val("end_date"), val("end_time"))
      : null,

    web_url: val("web_url") || null,
    excerpt: val("excerpt") || null,
    description: val("description") || null,

    is_published: true,
    is_hidden: false,
    updated_at: new Date().toISOString()
  };

  let result;

  if (editingId) {
    result = await supabase
      .from("calendar_events")
      .update(row)
      .eq("id", editingId)
      .eq("source", "manual")
      .select("*");
  } else {
    result = await supabase
      .from("calendar_events")
      .insert(row)
      .select("*");
  }

  if (result.error) {
    log.textContent = "FEL vid sparning:\n" + JSON.stringify(result.error, null, 2);
    return;
  }

  if (!result.data || result.data.length === 0) {
    log.textContent =
      "Ingen rad uppdaterades. Trolig orsak: RLS-policy saknas för UPDATE i Supabase, eller så hittades inte eventet.";
    return;
  }

  log.textContent = editingId
    ? "Händelsen uppdaterad."
    : "Händelsen sparad.";

  resetForm();
  await loadManualEvents();
  window.refreshCalendar?.();
};

async function loadManualEvents() {
  const container = document.getElementById("manualEvents");

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("source", "manual")
    .eq("is_hidden", false)
    .order("start_datetime", { ascending: true });

  if (error) {
    container.innerHTML = "Kunde inte hämta manuella event.";
    return;
  }

  manualEvents = data || [];

  if (!manualEvents.length) {
    container.innerHTML = "Inga manuella händelser.";
    return;
  }

  container.innerHTML = manualEvents.map(e => `
    <div class="event-row">
      <strong>${escapeHtml(e.title)}</strong><br>
      ${formatDate(e.start_datetime)}<br>
      ${escapeHtml(e.event_type || "")}
      ${e.address ? " • " + escapeHtml(e.address) : ""}
      <div class="actions">
        <button onclick="editEventById('${e.id}')">Redigera</button>
        <button onclick='hideEvent("${e.id}")'>Dölj</button>
        <button onclick='deleteEvent("${e.id}")'>Ta bort</button>
      </div>
    </div>
  `).join("");
}

window.editEventById = function (id) {
  const event = manualEvents.find(e => e.id === id);

  if (!event) {
    log.textContent = "Kunde inte hitta händelsen.";
    return;
  }

  editEvent(event);
};

window.editEvent = function (e) {
  editingId = e.id;
  log.textContent = "Redigerar: " + (e.title || "");

  document.getElementById("formTitle").textContent = "Redigera händelse";
  document.getElementById("saveBtn").textContent = "Uppdatera händelse";

  setVal("event_type", e.event_type || "distrikt");
  setVal("title", e.title || "");
  setVal("organizer", e.organizer || "");
  setVal("address", e.address || "");
  setVal("web_url", e.web_url || "");
  setVal("excerpt", e.excerpt || "");
  setVal("description", e.description || "");

  fillDateTime("start", e.start_datetime);
  fillDateTime("end", e.end_datetime);

  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.hideEvent = async function (id) {
  if (!confirm("Dölja händelsen?")) return;

  const { error } = await supabase
    .from("calendar_events")
    .update({ is_hidden: true })
    .eq("id", id)
    .eq("source", "manual");

  if (error) {
    log.textContent = "FEL:\n" + JSON.stringify(error, null, 2);
    return;
  }

  log.textContent = "Händelsen dold.";
  await loadManualEvents();
  window.refreshCalendar?.();
};

window.deleteEvent = async function (id) {
  if (!confirm("Ta bort händelsen permanent?")) return;

  const { error } = await supabase
    .from("calendar_events")
    .delete()
    .eq("id", id)
    .eq("source", "manual");

  if (error) {
    log.textContent = "FEL:\n" + JSON.stringify(error, null, 2);
    return;
  }

  log.textContent = "Händelsen borttagen.";
  await loadManualEvents();
  window.refreshCalendar?.();
};

window.importFromNasverige = async function (options = {}) {
  try {
    const automatic = options.automatic === true;
    log.textContent = automatic
      ? "Startar automatisk import från nasverige.org...\n"
      : "Startar import från nasverige.org...\n";

    const events = await fetchAllEvents();

    log.textContent += `\nTotalt hämtade: ${events.length} event\n`;
    log.textContent += "Sparar till Supabase...\n";

    const rows = events
      .filter(event => event.slug)
      .map(event => ({
      source: "nasverige",
      event_type: "event",

      external_id: String(event.id),
      external_slug: event.slug || null,

      title: event.title || "Namnlöst evenemang",
      organizer: event.organizer || null,
      address: event.address || null,
      price: event.price || null,

      start_datetime: event.startDate || null,
      end_datetime: event.endDate || null,

      web_url: event.web || null,
      excerpt: event.excerpt || null,
      description: event.description || null,

      image_url: getImageUrl(event),

      raw_data: event,

      is_published: true,
      is_hidden: false,
      updated_at: new Date().toISOString()
    }));

    const skippedWithoutSlug = events.length - rows.length;
    if (skippedWithoutSlug > 0) {
      log.textContent +=
        `Hoppar över ${skippedWithoutSlug} event utan slug, eftersom slug används som importnyckel.\n`;
    }

    if (!rows.length) {
      log.textContent += "\nInga event med slug hittades att spara.";
      return;
    }

    const { data, error } = await supabase
      .from("calendar_events")
      .upsert(rows, {
        onConflict: "source,external_slug"
      })
      .select();

    if (error) {
      log.textContent += "\nFEL:\n" + JSON.stringify(error, null, 2);
      return;
    }

    log.textContent +=
      `\nKlart!\n` +
      `Sparade/uppdaterade ${data.length} event.`;

    markAutoImportRun();
    await loadManualEvents();
    window.refreshCalendar?.();

  } catch (e) {
    log.textContent += "\nFEL:\n" + e.message;
  }
};

async function fetchAllEvents() {
  let page = 1;
  let allEvents = [];

  while (true) {
    log.textContent += `Hämtar sida ${page}...\n`;

    const res = await fetch(`/event?page=${page}`);

    if (!res.ok) {
      throw new Error(`Fel ${res.status} på sida ${page}`);
    }

    const data = await res.json();

    const events =
      data.events ||
      data.data ||
      [];

    log.textContent += `Sida ${page}: ${events.length} event\n`;

    allEvents = allEvents.concat(events);

    const pagination = data.meta?.pagination;

    if (!pagination) break;
    if (page >= pagination.pageCount) break;

    page++;
  }

  return allEvents;
}

window.resetForm = function () {
  editingId = null;

  document.getElementById("formTitle").textContent = "Lägg till manuell händelse";
  document.getElementById("saveBtn").textContent = "Spara händelse";

  [
    "title",
    "organizer",
    "address",
    "start_date",
    "start_time",
    "end_date",
    "end_time",
    "web_url",
    "excerpt",
    "description"
  ].forEach(id => setVal(id, ""));

  setVal("event_type", "event");
};

function val(id) {
  return document.getElementById(id).value.trim();
}

function setVal(id, value) {
  document.getElementById(id).value = value || "";
}

function combine(date, time) {
  // Inputfältens datum/tid är svensk lokal tid.
  // Vi konverterar till ISO/UTC innan sparning i Supabase timestamptz.
  const localDate = new Date(`${date}T${time}:00`);
  return localDate.toISOString();
}

function fillDateTime(prefix, value) {
  if (!value) {
    setVal(`${prefix}_date`, "");
    setVal(`${prefix}_time`, "");
    return;
  }

  // Värdet från Supabase är en tidpunkt. Visa den som lokal tid i inputfälten.
  // Använd INTE toISOString() här, då hoppar datumet till UTC.
  const d = new Date(value);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");

  setVal(`${prefix}_date`, `${year}-${month}-${day}`);
  setVal(`${prefix}_time`, `${hour}:${minute}`);
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("sv-SE");
}

function getImageUrl(event) {
  const image =
    event.images?.[0] ||
    event.images?.data?.[0];

  if (!image) return null;

  const url =
    image.url ||
    image.attributes?.url;

  if (!url) return null;

  return url.startsWith("http")
    ? url
    : "https://cms.nasverige.org" + url;
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
