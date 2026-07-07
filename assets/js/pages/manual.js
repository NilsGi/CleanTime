window.CleanTime.registerPage("manual", {
  title: "Manuell registrering - Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .hero h1 {\n      font-size: clamp(22px, 5vw, 34px);\n      letter-spacing: 1px;\n      margin-bottom: 12px;\n      opacity: 0.96;\n    }\n\n    .event-title {\n      font-size: clamp(24px, 6vw, 40px);\n      font-weight: 900;\n      letter-spacing: 1px;\n      text-transform: uppercase;\n      margin-bottom: 14px;\n    }\n\n    .hero p {\n      font-size: 16px;\n      opacity: 0.92;\n    }\n\n    .wrap {\n      width: min(100%, 560px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      position: relative;\n      z-index: 11;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n      text-align: center;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n      text-align: center;\n    }\n\n    label {\n      display: block;\n      text-align: center;\n      color: var(--text);\n      font-weight: 650;\n      margin-bottom: 8px;\n    }\n\n    input[type=\"text\"],\n    input[type=\"password\"],\n    select {\n      display: block;\n      width: calc(100% - 32px);\n      margin-left: auto;\n      margin-right: auto;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 18px;\n      background: #fff;\n      color: var(--text);\n      margin-bottom: 14px;\n      box-sizing: border-box;\n      text-align: center;\n    }\n\n    input:focus,\n    select:focus {\n      outline: 3px solid rgba(30,79,154,0.18);\n      border-color: var(--na-blue);\n    }\n\n    button {\n      width: 100%;\n      background: var(--na-blue);\n      color: white;\n      border: none;\n      padding: 16px 22px;\n      border-radius: 14px;\n      cursor: pointer;\n      font-size: 17px;\n      font-weight: 750;\n      transition: transform 0.15s ease, background 0.15s ease;\n    }\n\n    button:hover {\n      background: var(--na-blue-dark);\n      transform: translateY(-1px);\n    }\n\n    button:disabled {\n      opacity: 0.65;\n      cursor: not-allowed;\n      transform: none;\n    }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n      text-align: center;\n    }\n\n    .message.success {\n      display: block;\n      background: #eef7ff;\n      color: var(--na-blue-dark);\n      border: 1px solid #cfe2ff;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .selected-event {\n      background: #eef7ff;\n      border: 1px solid #cfe2ff;\n      color: var(--na-blue-dark);\n      padding: 13px;\n      border-radius: 14px;\n      margin-top: 12px;\n      margin-bottom: 16px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .result-box {\n      display: none;\n      background: #f4f7fb;\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 18px;\n      margin-top: 16px;\n      text-align: center;\n    }\n\n    .result-days {\n      color: var(--na-blue);\n      font-size: 32px;\n      font-weight: 850;\n      margin-bottom: 6px;\n    }\n\n    .hidden {\n      display: none;\n    }\n\n    .back-button {\n      display: block;\n      width: 100%;\n      text-align: center;\n      text-decoration: none;\n      background: #64748b;\n      color: white;\n      padding: 16px 22px;\n      border-radius: 14px;\n      font-size: 17px;\n      font-weight: 750;\n      margin-top: 12px;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 430px) {\n      .hero {\n        padding-top: 34px;\n        padding-bottom: 68px;\n      }\n\n      .wrap {\n        margin-top: -38px;\n        padding: 0 12px;\n      }\n\n      .card {\n        border-radius: 18px;\n        padding: 19px;\n      }\n\n      input[type=\"text\"],\n      input[type=\"password\"],\n      select,\n      button {\n        font-size: 17px;\n        padding: 15px;\n      }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <div id=\"eventTitle\" class=\"event-title\">MANUELL REGISTRERING</div>\n    <p>Manuell registrering</p>\n  </section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\" id=\"loginCard\">\n      <h2>Logga in</h2>\n      <p class=\"helper-text\">\n        Ange administratörslösenord för att göra en manuell registrering.\n      </p>\n\n      <form id=\"loginForm\">\n        <label for=\"adminPassword\">Lösenord</label>\n        <input type=\"password\" id=\"adminPassword\" placeholder=\"Lösenord\" required />\n        <button type=\"submit\">Logga in</button>\n      </form>\n\n      <a href=\"./\" class=\"back-button\">← Till huvudmenyn</a>\n\n      <div id=\"loginMessage\" class=\"message\"></div>\n    </section>\n    <section class=\"card hidden\" id=\"manualCard\">\n      <h2>Registrera tid</h2>\n\n      <p class=\"helper-text\">\n        Skriv in det datum personen blev drogfri<br>\n        Ange datum som ÅÅÅÅMMDD\n      </p>\n\n      <form id=\"manualForm\">\n        <label for=\"cleanDate\">Datum personen blev drogfri</label>\n        <input type=\"text\" id=\"cleanDate\" placeholder=\"ÅÅÅÅMMDD\" inputmode=\"numeric\" maxlength=\"8\" required />\n\n        <button type=\"submit\" id=\"submitButton\">Registrera manuellt</button>\n      </form>\n\n      <div id=\"messageBox\" class=\"message\"></div>\n\n      <div class=\"result-box\" id=\"manualHistoryBox\" style=\"display:block;margin-top:20px;\">\n        <h3 style=\"margin-bottom:12px;color:#1E4F9A;\">Senaste manuella registreringar</h3>\n        <div id=\"manualHistoryList\">Inga registreringar ännu.</div>\n      </div>\n\n      <a href=\"./\" class=\"back-button\">← Till huvudmenyn</a>\n    </section>\n\n  </main>\n\n  <div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige.<br>Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img\n      src=\"/assets/na-logo.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n  </footer>",
  init: function initManualPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const ADMIN_PASSWORD = atob("cmVnZ2E=");
    
        const supabaseClient = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );
    
        const loginCard = document.getElementById("loginCard");
        const manualCard = document.getElementById("manualCard");
        const loginMessage = document.getElementById("loginMessage");
        const messageBox = document.getElementById("messageBox");
        const cleanDateInput = document.getElementById("cleanDate");
        const eventTitle = document.getElementById("eventTitle");
        const manualHistoryList = document.getElementById("manualHistoryList");
        const eventSelect = document.getElementById("eventSelect");
    
        let events = [];
        let selectedEventId = "";
        let selectedEvent = null;
        let registrationStatus = null;
        let registrationIsOpen = false;
        const MIN_CLEAN_YEAR = 1953;
    
        function showMessage(element, text, type) {
          element.textContent = text;
          element.className = "message " + type;
        }
    
        function clearMessage(element) {
          element.textContent = "";
          element.className = "message";
        }
    
        function pluralize(value, singular, plural) {
          return value === 1 ? singular : plural;
        }
    
        function convertRawDate(rawDate) {
          return rawDate.substring(0,4) + "-" +
                 rawDate.substring(4,6) + "-" +
                 rawDate.substring(6,8);
        }
    
        function isValidDateString(cleanDate) {
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const cleanYear = Number(cleanDate.substring(0, 4));
    
          if (Number.isNaN(selectedDate.getTime())) {
            return false;
          }
    
          if (cleanYear < MIN_CLEAN_YEAR) {
            return false;
          }
    
          return selectedDate <= today;
        }
    
        function isBeforeMinimumCleanYear(cleanDate) {
          return Number(cleanDate.substring(0, 4)) < MIN_CLEAN_YEAR;
        }
    
        function daysBetween(cleanDate) {
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return Math.floor((today - selectedDate) / 86400000) + 1;
        }
    
        function formatDetailFromDays(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const years = Math.floor(totalDays / 365.25);
          const daysAfterYears = totalDays - Math.floor(years * 365.25);
    
          const averageMonthDays = 30.4375;
          const months = Math.floor(daysAfterYears / averageMonthDays);
          const remainingDays = Math.round(daysAfterYears - (months * averageMonthDays));
    
          let parts = [];
          if (years > 0) parts.push(years + " år");
          if (months > 0) parts.push(months + " " + pluralize(months, "månad", "månader"));
          if (remainingDays > 0 || parts.length === 0) {
            parts.push(remainingDays + " " + pluralize(remainingDays, "dag", "dagar"));
          }
    
          return parts.join(" ");
        }
    
        function sanitizeDateInput(input) {
          let value = input.value.replace(/\D/g, "");
          if (value.length > 8) value = value.substring(0, 8);
          input.value = value;
        }
    
        cleanDateInput.addEventListener("input", function () {
          sanitizeDateInput(this);
        });
    
        function updateSelectedEventInfo() {
          selectedEvent = events.find(event => event.id === selectedEventId) || null;
    
          if (!selectedEvent) {
            eventTitle.innerText = "EVENT SAKNAS";
            registrationIsOpen = false;
            return;
          }
    
          registrationStatus = selectedEvent.registration_status;
          registrationIsOpen = registrationStatus === "open";
    
          if (registrationStatus === "not_started") {
            eventTitle.innerText = "REGISTRERINGEN HAR INTE ÖPPNAT";
          } else if (registrationStatus === "closed") {
            eventTitle.innerText = "REGISTRERINGEN ÄR AVSLUTAD";
          } else {
            eventTitle.innerText = selectedEvent.name.toUpperCase();
          }
    
          document.title = "Manuell registrering - " + selectedEvent.name;
        }
    
    
        let editingManualId = null;
    
        async function loadManualHistory() {
          if (!selectedEventId || !manualHistoryList) return;
    
          const { data, error } = await supabaseClient
            .from("clean_time_entries")
            .select("id,clean_date,created_at")
            .eq("event_id", selectedEventId)
            .eq("created_by", "manual")
            .order("created_at", { ascending: false })
            .limit(20);
    
          if (error || !data || data.length === 0) {
            manualHistoryList.innerHTML = "Inga registreringar ännu.";
            return;
          }
    
          manualHistoryList.innerHTML = data.map(row => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #dbe3ef;">
              <div>
                  <div><strong>${row.clean_date}</strong></div>
                  <div style="font-size:12px;color:#64748b;">
                    ${new Date(row.created_at).toLocaleString("sv-SE")}
                  </div>
                </div>
              <div>
                <button type="button" onclick="editManualEntry('${row.id}','${row.clean_date}')" style="width:auto;padding:8px 12px;margin-right:6px;">✏️</button>
                <button type="button" onclick="deleteManualEntry('${row.id}')" style="width:auto;padding:8px 12px;background:#b91c1c;">🗑️</button>
              </div>
            </div>
          `).join("");
        }
    
        window.editManualEntry = function(id, cleanDate) {
          editingManualId = id;
          cleanDateInput.value = cleanDate.replaceAll("-", "");
          document.getElementById("submitButton").innerText = "Uppdatera registrering";
          cleanDateInput.focus();
        };
    
        window.deleteManualEntry = async function(id) {
          if (!confirm("Ta bort registreringen?")) return;
          await supabaseClient.from("clean_time_entries").delete().eq("id", id);
          await loadManualHistory();
        };
    
    
        async function loadEvents() {
          const { data, error } = await supabaseClient
            .from("event_status")
            .select("id,name,slug,is_active,start_date,end_date,registration_status")
            .eq("is_active", true)
            .order("name", { ascending: true });
    
          if (error) {
            eventTitle.innerText = "EVENT KUNDE INTE HÄMTAS";
            showMessage(messageBox, "Kunde inte hämta event: " + error.message, "error");
            console.log(error);
            return;
          }
    
          events = data || [];
    
          const params = new URLSearchParams(window.location.search);
          const eventSlug = params.get("event") || localStorage.getItem("selectedEventSlug");
    
          if (eventSlug) {
            const event = events.find(item => item.slug === eventSlug);
            if (event) {
              selectedEventId = event.id;
              localStorage.setItem("selectedEventSlug", event.slug);
            }
          }
    
          updateSelectedEventInfo();
          await loadManualHistory();
        }
    
        if (eventSelect) {
          eventSelect.addEventListener("change", async function () {
            selectedEventId = this.value;
            selectedEvent = events.find(event => event.id === selectedEventId) || null;
    
            if (selectedEvent) {
              localStorage.setItem("selectedEventSlug", selectedEvent.slug);
            }
    
            updateSelectedEventInfo();
            await loadManualHistory();
          });
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
          manualCard.classList.remove("hidden");
    
          await loadEvents();
        });
    
        document.getElementById("manualForm").addEventListener("submit", async function(e) {
          e.preventDefault();
          clearMessage(messageBox);
          if (!selectedEventId) {
            showMessage(messageBox, "Välj ett event först.", "error");
            return;
          }
    
          if (!registrationIsOpen) {
            if (registrationStatus === "not_started") {
              showMessage(messageBox, "Registreringen har inte öppnat ännu.", "error");
            } else {
              showMessage(messageBox, "Registreringen är avslutad.", "error");
            }
            return;
          }
    
          const rawDate = cleanDateInput.value;
    
          if (rawDate.length !== 8) {
            showMessage(messageBox, "Ange datum som ÅÅÅÅMMDD.", "error");
            return;
          }
    
          const cleanDate = convertRawDate(rawDate);
    
          if (isBeforeMinimumCleanYear(cleanDate)) {
            showMessage(messageBox, "Årtalet måste vara 1953 eller senare.", "error");
            return;
          }
    
          if (!isValidDateString(cleanDate)) {
            showMessage(messageBox, "Datumet är ogiltigt eller ligger i framtiden.", "error");
            return;
          }
    
          const button = document.getElementById("submitButton");
          button.disabled = true;
          button.innerText = "Registrerar...";
    
          let error;
          let updatedEntry = null;
    
          if (editingManualId) {
            const updateResult = await supabaseClient
              .from("clean_time_entries")
              .update({
                clean_date: cleanDate,
                updated_at: new Date().toISOString()
              })
              .eq("id", editingManualId)
              .eq("event_id", selectedEventId)
              .eq("created_by", "manual")
              .select("id,clean_date,updated_at")
              .maybeSingle();
    
            error = updateResult.error;
            updatedEntry = updateResult.data;
    
            if (!error && !updatedEntry) {
              error = {
                message: "Ingen manuell registrering hittades att uppdatera. Ladda om sidan och försök igen."
              };
            }
          } else {
            ({ error } = await supabaseClient
              .from("clean_time_entries")
              .insert([{
                clean_date: cleanDate,
                event_id: selectedEventId,
                device_id: "manual-" + crypto.randomUUID(),
                created_by: "manual"
              }]));
          }
    
          button.disabled = false;
          button.innerText = "Registrera manuellt";
    
          if (error) {
            showMessage(messageBox, "Något gick fel: " + error.message, "error");
            console.log(error);
            return;
          }
    
          showMessage(messageBox,
            editingManualId ? "Registreringen är uppdaterad ❤️" : "Tiden är registrerad ❤️",
            "success");
          document.getElementById("manualForm").reset();
          editingManualId = null;
          button.innerText = "Registrera manuellt";
          await loadManualHistory();
        });
    
    if (typeof editManualEntry === "function") window.editManualEntry = editManualEntry;
    if (typeof deleteManualEntry === "function") window.deleteManualEntry = deleteManualEntry;
  }
});
