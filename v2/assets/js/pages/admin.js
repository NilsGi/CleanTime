window.CleanTime.registerPage("admin", {
  title: "Admin - Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .hero h1 {\n      font-size: clamp(18px, 4vw, 28px);\n      letter-spacing: 2px;\n      margin-bottom: 12px;\n      text-transform: uppercase;\n      opacity: 0.96;\n    }\n\n    .hero p {\n      font-size: 16px;\n      opacity: 0.92;\n    }\n\n    .wrap {\n      width: min(100%, 560px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n    }\n\n    .card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n    }\n\n    label {\n      display: block;\n      text-align: left;\n      color: var(--text);\n      font-weight: 650;\n      margin-bottom: 8px;\n    }\n\n    input[type=\"text\"],\n    input[type=\"password\"],\n    select {\n      display: block;\n      width: calc(100% - 32px);\n      margin-left: auto;\n      margin-right: auto;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 18px;\n      background: #fff;\n      color: var(--text);\n      margin-bottom: 14px;\n      box-sizing: border-box;\n    }\n\n    input:focus {\n      outline: 3px solid rgba(30,79,154,0.18);\n      border-color: var(--na-blue);\n    }\n\n    button {\n      width: 100%;\n      background: var(--na-blue);\n      color: white;\n      border: none;\n      padding: 16px 22px;\n      border-radius: 14px;\n      cursor: pointer;\n      font-size: 17px;\n      font-weight: 750;\n      transition: transform 0.15s ease, background 0.15s ease;\n    }\n\n    button:hover {\n      background: var(--na-blue-dark);\n      transform: translateY(-1px);\n    }\n\n    button:disabled {\n      opacity: 0.65;\n      cursor: not-allowed;\n      transform: none;\n    }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .message.success {\n      display: block;\n      background: #eef7ff;\n      color: var(--na-blue-dark);\n      border: 1px solid #cfe2ff;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .hidden {\n      display: none;\n    }\n\n    .dashboard-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 12px;\n      margin-top: 16px;\n    }\n\n    .dashboard-box {\n      background: #f4f7fb;\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 15px;\n      text-align: center;\n    }\n\n    .dashboard-value {\n      color: var(--na-blue);\n      font-size: 24px;\n      font-weight: 800;\n      margin-top: 4px;\n    }\n\n    .admin-actions {\n      display: flex;\n      gap: 10px;\n      flex-wrap: wrap;\n      margin-top: 12px;\n    }\n\n    .admin-actions button {\n      flex: 1;\n      min-width: 130px;\n    }\n\n    .secondary-button {\n      background: #64748b;\n    }\n\n    .secondary-button:hover {\n      background: #475569;\n    }\n\n    .danger-button {\n      background: #dc2626;\n    }\n\n    .danger-button:hover {\n      background: #b91c1c;\n    }\n\n    .small-button {\n      padding: 10px 12px;\n      font-size: 14px;\n      border-radius: 10px;\n      width: auto;\n      min-width: 90px;\n    }\n\n    .table-wrap {\n      overflow-x: auto;\n      margin-top: 16px;\n      border-radius: 16px;\n      border: 1px solid var(--border);\n    }\n\n    table {\n      width: 100%;\n      border-collapse: collapse;\n      min-width: 620px;\n      background: white;\n    }\n\n    th,\n    td {\n      padding: 12px;\n      text-align: left;\n      border-bottom: 1px solid var(--border);\n      font-size: 14px;\n    }\n\n    th {\n      background: #f4f7fb;\n      color: var(--text);\n      font-weight: 750;\n    }\n\n    tr:last-child td {\n      border-bottom: none;\n    }\n\n    .row-actions {\n      display: flex;\n      gap: 8px;\n      flex-wrap: wrap;\n    }\n\n    .edit-input {\n      width: 120px !important;\n      margin: 0 !important;\n      padding: 10px !important;\n      font-size: 14px !important;\n      border-radius: 10px !important;\n    }\n\n\n    .event-row {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 8px;\n      padding: 12px 0;\n      border-bottom: 1px solid var(--border);\n    }\n\n    .event-row:last-child {\n      border-bottom: none;\n    }\n\n    .event-name {\n      font-weight: 750;\n      color: var(--text);\n    }\n\n    .event-slug {\n      color: var(--muted);\n      font-size: 13px;\n      word-break: break-all;\n    }\n\n    .selected-event {\n      background: #eef7ff;\n      border: 1px solid #cfe2ff;\n      color: var(--na-blue-dark);\n      padding: 13px;\n      border-radius: 14px;\n      margin-top: 12px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .event-link-row {\n      margin-top: 10px;\n      padding-top: 10px;\n      border-top: 1px solid #cfe2ff;\n    }\n\n    .event-link-label {\n      font-weight: 750;\n      margin-bottom: 5px;\n    }\n\n    .event-link-url {\n      word-break: break-all;\n      color: var(--na-blue-dark);\n      font-size: 14px;\n      margin-bottom: 8px;\n    }\n\n    .event-link-line {\n      display: grid;\n      grid-template-columns: 1fr 42px;\n      gap: 8px;\n      align-items: center;\n    }\n\n    .event-link-url a {\n      color: var(--na-blue-dark);\n      text-decoration: none;\n      word-break: break-all;\n    }\n\n    .event-link-url a:hover {\n      text-decoration: underline;\n    }\n\n    .copy-icon-button {\n      width: 42px;\n      height: 42px;\n      min-width: 42px;\n      padding: 0;\n      border-radius: 12px;\n      background: var(--na-blue);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    .copy-icon-button svg {\n      width: 23px;\n      height: 23px;\n      stroke: white;\n      stroke-width: 2.4;\n      fill: none;\n    }\n\n    .back-button {\n      display: block;\n      width: 100%;\n      text-align: center;\n      text-decoration: none;\n      background: #64748b;\n      color: white;\n      padding: 16px 22px;\n      border-radius: 14px;\n      font-size: 17px;\n      font-weight: 750;\n      margin-top: 24px;\n      margin-bottom: 18px;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 430px) {\n      .hero {\n        padding-top: 34px;\n        padding-bottom: 68px;\n      }\n\n      .wrap {\n        margin-top: -38px;\n        padding: 0 12px;\n      }\n\n      .card {\n        border-radius: 18px;\n        padding: 19px;\n      }\n\n      input[type=\"text\"],\n      input[type=\"password\"],\n      select,\n      button {\n        font-size: 17px;\n        padding: 15px;\n      }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <h1>Admin</h1>\n    <p>Hantera event och drogfri tid</p>\n  </section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\" id=\"loginCard\">\n      <h2>Logga in</h2>\n      <p class=\"helper-text\">\n        Ange administratörslösenord.\n      </p>\n\n      <form id=\"loginForm\">\n        <label for=\"adminPassword\">Lösenord</label>\n        <input type=\"password\" id=\"adminPassword\" placeholder=\"Lösenord\" required />\n        <button type=\"submit\">Logga in</button>\n      </form>\n\n      <div id=\"loginMessage\" class=\"message\"></div>\n    </section>\n\n    <a href=\"./\" class=\"back-button hidden\" id=\"topHomeButton\">← Till huvudmenyn</a>\n    <section class=\"card hidden\" id=\"eventCard\">\n      <h2>Välj event</h2>\n\n      <p class=\"helper-text\">\n        Välj vilket event du vill arbeta med.\n      </p>\n\n      <div id=\"eventMessage\" class=\"message\"></div>\n\n      <label for=\"eventSelect\">Event</label>\n      <select id=\"eventSelect\">\n        <option value=\"\">Laddar event...</option>\n      </select>\n\n      <div class=\"selected-event\" id=\"selectedEventInfo\">\n        Inget event valt.\n      </div>\n\n      <div class=\"admin-actions\">\n        <button type=\"button\" class=\"secondary-button\" id=\"refreshEventsButton\">Uppdatera event</button>\n        <button type=\"button\" id=\"archiveSelectedEventButton\">Arkivera valt event</button>\n        <button type=\"button\" class=\"danger-button\" id=\"deleteSelectedEventButton\">Radera valt event</button>\n      </div>\n    </section>\n\n    <section class=\"card hidden\" id=\"listCard\">\n      <h2>Alla registreringar för valt event</h2>\n\n      <p class=\"helper-text\">\n        Här kan du redigera datum, ta bort registreringar och exportera listan för det event som är valt.\n      </p>\n\n      <div id=\"listMessage\" class=\"message\"></div>\n\n      <div class=\"table-wrap\">\n        <table>\n          <thead>\n            <tr>\n              <th>Datum</th>\n              <th>Dagar</th>\n              <th>Registrerad av</th>\n              <th>Skapad</th>\n              <th>Uppdaterad</th>\n              <th>Åtgärder</th>\n            </tr>\n          </thead>\n          <tbody id=\"entriesTableBody\">\n            <tr>\n              <td colspan=\"6\">Välj ett event för att läsa in listan.</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n\n    <section class=\"card hidden\" id=\"exportCard\">\n      <h2>Export</h2>\n      <p class=\"helper-text\">\n        Exportera alla registreringar för valt event som CSV-fil.\n      </p>\n\n      <button type=\"button\" class=\"secondary-button\" id=\"exportButton\">Exportera CSV</button>\n    </section>\n\n  </main>\n\n  <div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img\n      src=\"/assets/na-logo.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n  </footer>",
  init: function initAdminPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const ADMIN_PASSWORD = atob("YWRtaW4yMDI2");
    
        const supabaseClient = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );
    
        const loginCard = document.getElementById("loginCard");
        const eventCard = document.getElementById("eventCard");
        const listCard = document.getElementById("listCard");
        const exportCard = document.getElementById("exportCard");
    
        const loginMessage = document.getElementById("loginMessage");
        const eventMessage = document.getElementById("eventMessage");
        const listMessage = document.getElementById("listMessage");
    
        const entriesTableBody = document.getElementById("entriesTableBody");
        const eventSelect = document.getElementById("eventSelect");
        const selectedEventInfo = document.getElementById("selectedEventInfo");
    
        let entries = [];
        let events = [];
        let selectedEventId = "";
        let selectedEvent = null;
    
        function showMessage(element, text, type) {
          element.textContent = text;
          element.className = "message " + type;
        }
    
        function clearMessage(element) {
          element.textContent = "";
          element.className = "message";
        }
    
        function convertRawDate(rawDate) {
          return rawDate.substring(0,4) + "-" +
                 rawDate.substring(4,6) + "-" +
                 rawDate.substring(6,8);
        }
    
        function rawFromCleanDate(cleanDate) {
          return String(cleanDate || "").replaceAll("-", "");
        }
    
        function isValidDateString(cleanDate) {
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
          if (Number.isNaN(selectedDate.getTime())) {
            return false;
          }
    
          return selectedDate <= today;
        }
    
        function daysBetween(cleanDate) {
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return Math.floor((today - selectedDate) / 86400000) + 1;
        }
    
        function formatDateTime(value) {
          if (!value) return "-";
    
          const date = new Date(value);
    
          if (Number.isNaN(date.getTime())) {
            return "-";
          }
    
          return date.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
    
        function sanitizeDateInput(input) {
          let value = input.value.replace(/\D/g, "");
          if (value.length > 8) value = value.substring(0, 8);
          input.value = value;
        }
    
        function sanitizeSlug(value) {
          return value
            .toLowerCase()
            .trim()
            .replace(/å/g, "a")
            .replace(/ä/g, "a")
            .replace(/ö/g, "o")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
    
        function pluralize(value, singular, plural) {
          return value === 1 ? singular : plural;
        }
    
        function requireSelectedEvent() {
          if (!selectedEventId) {
            showMessage(listMessage, "Välj ett event först.", "error");
            return false;
          }
          return true;
        }
    
        function updateSelectedEventInfo() {
          selectedEvent = events.find(event => event.id === selectedEventId) || null;
    
          if (!selectedEvent) {
            selectedEventInfo.innerHTML = "Inget event valt.";
            return;
          }
    
          selectedEventInfo.innerHTML = `
            <div><strong>Valt event:</strong> ${selectedEvent.name}</div>
            <div><strong>Event-ID:</strong> ${selectedEvent.slug}</div>
            <div><strong>Startdatum:</strong> ${selectedEvent.start_date || "-"}</div>
            <div><strong>Slutdatum:</strong> ${selectedEvent.end_date || "-"}</div>
          `;
        }
        async function loadEvents(keepSelection = true) {
          clearMessage(eventMessage);
    
          const previousSelection = selectedEventId;
    
          const { data, error } = await supabaseClient
            .from("events")
            .select("id,name,slug,is_active,start_date,end_date,created_at")
            .order("created_at", { ascending: false });
    
          if (error) {
            showMessage(eventMessage, "Kunde inte hämta event: " + error.message, "error");
            console.log(error);
            return;
          }
    
          events = data || [];
    
          eventSelect.innerHTML = '<option value="">Välj event...</option>' +
            events
              .filter(event => event.is_active !== false)
              .map(event => `<option value="${event.id}">${event.name} (${event.slug})</option>`)
              .join("");
    
          if (keepSelection && previousSelection && events.some(event => event.id === previousSelection)) {
            selectedEventId = previousSelection;
            eventSelect.value = selectedEventId;
          } else if (events.length > 0) {
            const firstActive = events.find(event => event.is_active !== false);
            selectedEventId = firstActive ? firstActive.id : "";
            eventSelect.value = selectedEventId;
          } else {
            selectedEventId = "";
          }
    
          updateSelectedEventInfo();
          await loadEntries();
        }
    
        async function deleteEvent(id) {
          const event = events.find(item => item.id === id);
    
          if (!event) return;
    
          const confirmation = prompt(
            "Detta raderar eventet och alla registreringar kopplade till eventet.\n\nEvent: " +
            event.name +
            "\n\nSkriv RADERA EVENT för att fortsätta."
          );
    
          if (confirmation !== "RADERA EVENT") {
            return;
          }
    
          const { error: entriesError } = await supabaseClient
            .from("clean_time_entries")
            .delete()
            .eq("event_id", id);
    
          if (entriesError) {
            showMessage(eventMessage, "Kunde inte radera registreringar för eventet: " + entriesError.message, "error");
            console.log(entriesError);
            return;
          }
    
          const { error } = await supabaseClient
            .from("events")
            .delete()
            .eq("id", id);
    
          if (error) {
            showMessage(eventMessage, "Kunde inte radera eventet: " + error.message, "error");
            console.log(error);
            return;
          }
    
          if (selectedEventId === id) {
            selectedEventId = "";
          }
    
          showMessage(eventMessage, "Eventet och dess registreringar är raderade.", "success");
          await loadEvents(false);
        }
    
        function renderEntries() {
          if (!selectedEventId) {
            entriesTableBody.innerHTML = `
              <tr>
                <td colspan="6">Välj ett event för att läsa in listan.</td>
              </tr>
            `;
            return;
          }
    
          if (entries.length === 0) {
            entriesTableBody.innerHTML = `
              <tr>
                <td colspan="6">Inga registreringar finns för valt event.</td>
              </tr>
            `;
            return;
          }
    
          entriesTableBody.innerHTML = entries.map(entry => {
            const days = Number(entry.clean_days || 0);
            const rawDate = rawFromCleanDate(entry.clean_date);
            const createdBy = entry.created_by || "user";
    
            return `
              <tr>
                <td>
                  <input
                    type="text"
                    class="edit-input"
                    id="edit-${entry.id}"
                    value="${rawDate}"
                    inputmode="numeric"
                    maxlength="8"
                  />
                </td>
                <td>${days.toLocaleString("sv-SE")}</td>
                <td>${createdBy}</td>
                <td>${formatDateTime(entry.created_at)}</td>
                <td>${formatDateTime(entry.updated_at)}</td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="small-button" onclick="saveEdit('${entry.id}')">Spara</button>
                    <button type="button" class="small-button danger-button" onclick="deleteEntry('${entry.id}')">Ta bort</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("");
    
          entries.forEach(entry => {
            const input = document.getElementById("edit-" + entry.id);
            if (input) {
              input.addEventListener("input", function () {
                sanitizeDateInput(this);
              });
            }
          });
    
        }
    
        async function loadEntries() {
          clearMessage(listMessage);
    
          if (!selectedEventId) {
            entries = [];
            renderEntries();
            return;
          }
    
          const { data, error } = await supabaseClient
            .from("clean_time_stats")
            .select("id, clean_date, clean_days, created_at, updated_at, created_by, device_id, event_id, is_active")
            .eq("event_id", selectedEventId)
            .eq("is_active", true)
            .order("clean_date", { ascending: true });
    
          if (error) {
            showMessage(listMessage, "Kunde inte hämta listan: " + error.message, "error");
            console.log(error);
            return;
          }
    
          entries = data || [];
          renderEntries();
        }
    
        async function saveEdit(id) {
          clearMessage(listMessage);
    
          if (!requireSelectedEvent()) return;
    
          const input = document.getElementById("edit-" + id);
          const rawDate = input ? input.value : "";
    
          if (rawDate.length !== 8) {
            showMessage(listMessage, "Ange datum som ÅÅÅÅMMDD innan du sparar.", "error");
            return;
          }
    
          const cleanDate = convertRawDate(rawDate);
    
          if (!isValidDateString(cleanDate)) {
            showMessage(listMessage, "Datumet är ogiltigt eller ligger i framtiden.", "error");
            return;
          }
    
          const { error } = await supabaseClient
            .from("clean_time_entries")
            .update({ clean_date: cleanDate, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("event_id", selectedEventId);
    
          if (error) {
            showMessage(listMessage, "Kunde inte spara ändringen: " + error.message, "error");
            console.log(error);
            return;
          }
    
          showMessage(listMessage, "Registreringen är uppdaterad.", "success");
          await loadEntries();
        }
    
        async function deleteEntry(id) {
          clearMessage(listMessage);
    
          if (!requireSelectedEvent()) return;
    
          const confirmed = confirm("Är du säker på att du vill ta bort denna registrering?");
    
          if (!confirmed) {
            return;
          }
    
          const { error } = await supabaseClient
            .from("clean_time_entries")
            .delete()
            .eq("id", id)
            .eq("event_id", selectedEventId);
    
          if (error) {
            showMessage(listMessage, "Kunde inte ta bort registreringen: " + error.message, "error");
            console.log(error);
            return;
          }
    
          showMessage(listMessage, "Registreringen är borttagen.", "success");
          await loadEntries();
        }
    
        function exportToExcel() {
          if (!selectedEventId) {
            showMessage(listMessage, "Välj ett event först.", "error");
            return;
          }
    
          if (entries.length === 0) {
            showMessage(listMessage, "Det finns inget att exportera.", "error");
            return;
          }
    
          const header = [
            "Event",
            "Event-ID",
            "Datum",
            "Dagar",
            "Registrerad av",
            "Skapad",
            "Uppdaterad",
            "ID",
            "Device ID"
          ];
    
          const rows = entries.map(entry => [
            selectedEvent?.name || "",
            selectedEvent?.slug || "",
            entry.clean_date,
            Number(entry.clean_days || 0),
            entry.created_by || "user",
            formatDateTime(entry.created_at),
            formatDateTime(entry.updated_at),
            entry.id,
            entry.device_id || ""
          ]);
    
          const csv = [header, ...rows]
            .map(row => row.map(value => {
              const text = String(value ?? "");
              return '"' + text.replaceAll('"', '""') + '"';
            }).join(";"))
            .join("\n");
    
          const blob = new Blob(["\ufeff" + csv], {
            type: "text/csv;charset=utf-8;"
          });
    
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          const today = new Date().toISOString().slice(0, 10);
          const slug = selectedEvent?.slug || "event";
    
          link.href = url;
          link.download = "drogfri_tid_" + slug + "_" + today + ".csv";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
    
          URL.revokeObjectURL(url);
        }
    
        document.getElementById("loginForm").addEventListener("submit", async function(e) {
          e.preventDefault();
          clearMessage(loginMessage);
    
          const password = document.getElementById("adminPassword").value;
    
          if (password !== ADMIN_PASSWORD) {
            showMessage(loginMessage, "Fel lösenord.", "error");
            return;
          }
    
          loginCard.classList.add("hidden");
          document.getElementById("topHomeButton").classList.remove("hidden");
          eventCard.classList.remove("hidden");
          listCard.classList.remove("hidden");
          exportCard.classList.remove("hidden");
    
          await loadEvents();
        });
    
        async function archiveSelectedEvent() {
          if (!selectedEventId || !selectedEvent) {
            showMessage(eventMessage, "Välj ett event först.", "error");
            return;
          }
    
          const confirmation = prompt(
            "Detta arkiverar eventet, sparar slutresultatet i historik och raderar alla registreringar kopplade till eventet.\n\nEvent: " +
            selectedEvent.name +
            "\n\nSkriv ARKIVERA EVENT för att fortsätta."
          );
    
          if (confirmation !== "ARKIVERA EVENT") {
            return;
          }
    
          clearMessage(eventMessage);
    
          const { data: summaryData, error: summaryError } = await supabaseClient
            .from("clean_time_summary_by_event")
            .select("event_id,event_name,event_slug,person_count,total_days,average_days,longest_days,shortest_days")
            .eq("event_id", selectedEventId)
            .limit(1);
    
          if (summaryError) {
            showMessage(eventMessage, "Kunde inte hämta sammanfattning för arkivering: " + summaryError.message, "error");
            console.log(summaryError);
            return;
          }
    
          const summary = summaryData && summaryData.length > 0 ? summaryData[0] : {
            event_id: selectedEventId,
            event_name: selectedEvent.name,
            event_slug: selectedEvent.slug,
            person_count: 0,
            total_days: 0,
            average_days: 0,
            longest_days: 0,
            shortest_days: 0
          };
    
          const historyRow = {
            event_id: selectedEventId,
            event_name: summary.event_name || selectedEvent.name,
            event_slug: summary.event_slug || selectedEvent.slug,
            start_date: selectedEvent.start_date || null,
            end_date: selectedEvent.end_date || null,
            person_count: Number(summary.person_count || 0),
            total_days: Number(summary.total_days || 0),
            average_days: Number(summary.average_days || 0),
            longest_days: Number(summary.longest_days || 0),
            shortest_days: Number(summary.shortest_days || 0)
          };
    
          const { error: historyError } = await supabaseClient
            .from("event_history")
            .insert([historyRow]);
    
          if (historyError) {
            showMessage(eventMessage, "Kunde inte spara historik: " + historyError.message, "error");
            console.log(historyError);
            return;
          }
    
          const { error: entriesError } = await supabaseClient
            .from("clean_time_entries")
            .delete()
            .eq("event_id", selectedEventId);
    
          if (entriesError) {
            showMessage(eventMessage, "Historik sparad, men kunde inte radera registreringar: " + entriesError.message, "error");
            console.log(entriesError);
            return;
          }
    
          const { error: eventError } = await supabaseClient
            .from("events")
            .delete()
            .eq("id", selectedEventId);
    
          if (eventError) {
            showMessage(eventMessage, "Historik och registreringar är sparade/raderade, men kunde inte radera eventet: " + eventError.message, "error");
            console.log(eventError);
            return;
          }
    
          selectedEventId = "";
          selectedEvent = null;
          entries = [];
    
          entriesTableBody.innerHTML = `
            <tr>
              <td colspan="6">Välj ett event för att läsa in listan.</td>
            </tr>
          `;
    
          showMessage(eventMessage, "Eventet är arkiverat. Slutresultatet är sparat i historiken.", "success");
          await loadEvents(false);
        }
    
        async function deleteSelectedEvent() {
          if (!selectedEventId || !selectedEvent) {
            showMessage(eventMessage, "Välj ett event först.", "error");
            return;
          }
    
          await deleteEvent(selectedEventId);
        }
    
        eventSelect.addEventListener("change", async function () {
          selectedEventId = this.value;
          updateSelectedEventInfo();
          await loadEntries();
        });
    
        document.getElementById("refreshEventsButton").addEventListener("click", () => loadEvents(true));
        document.getElementById("archiveSelectedEventButton").addEventListener("click", archiveSelectedEvent);
        document.getElementById("deleteSelectedEventButton").addEventListener("click", deleteSelectedEvent);
        document.getElementById("exportButton").addEventListener("click", exportToExcel);
    
    if (typeof saveEdit === "function") window.saveEdit = saveEdit;
    if (typeof deleteEntry === "function") window.deleteEntry = deleteEntry;
  }
});
