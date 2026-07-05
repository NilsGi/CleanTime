window.CleanTime.registerPage("register", {
  title: "Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      position: relative;\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .language-toggle {\n      position: absolute;\n      top: 16px;\n      right: 16px;\n      z-index: 50;\n      display: flex;\n      gap: 6px;\n      background: rgba(255,255,255,0.14);\n      border: 1px solid rgba(255,255,255,0.25);\n      border-radius: 999px;\n      padding: 5px;\n      backdrop-filter: blur(8px);\n    }\n\n    .language-toggle button {\n      width: auto;\n      padding: 7px 11px;\n      border-radius: 999px;\n      background: transparent;\n      color: white;\n      border: none;\n      font-size: 13px;\n      font-weight: 800;\n      cursor: pointer;\n    }\n\n    .language-toggle button.active {\n      background: white;\n      color: var(--na-blue);\n    }\n\n    .hero h1 {\n      font-size: clamp(15px, 4vw, 21px);\n      letter-spacing: 3px;\n      margin-bottom: 18px;\n      text-transform: uppercase;\n      opacity: 0.96;\n    }\n\n    .event-title {\n      font-size: clamp(20px, 5vw, 30px);\n      font-weight: 800;\n      margin-top: 40px;\n      margin-bottom: 18px;\n      letter-spacing: 1px;\n      text-transform: uppercase;\n      color: white;\n    }\n\n    .counter {\n      font-size: clamp(2.4rem, 11vw, 5rem);\n      font-weight: 800;\n      line-height: 1.12;\n      margin-bottom: 12px;\n      word-break: break-word;\n    }\n\n    .counter-note {\n      font-size: 15px;\n      opacity: 0.88;\n      margin-bottom: 16px;\n    }\n\n    .hero-subtitle {\n      font-size: clamp(17px, 4vw, 22px);\n      opacity: 0.95;\n      margin-bottom: 0;\n    }\n\n    .wrap {\n      width: min(100%, 560px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card,\n    .stat-card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n    }\n\n    .card {\n      padding: 24px;\n      margin-bottom: 18px;\n      position: relative;\n      z-index: 11;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n      text-align: center;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n      text-align: center;\n    }\n\n    label {\n      display: block;\n      text-align: center;\n      color: var(--text);\n      font-weight: 650;\n      margin-bottom: 8px;\n    }\n\n    input[type=\"text\"] {\n    display: block;\n    width: calc(100% - 32px);\n    margin-left: auto;\n    margin-right: auto;\n    padding: 16px;\n    border-radius: 14px;\n    border: 1px solid var(--border);\n    font-size: 18px;\n    background: #fff;\n    color: var(--text);\n    margin-bottom: 14px;\n    box-sizing: border-box;\n    text-align: center;\n}\n\ninput[type=\"text\"]::placeholder {\n    text-align: center;\n}\n\n    input[type=\"text\"]:focus {\n      outline: 3px solid rgba(30,79,154,0.18);\n      border-color: var(--na-blue);\n    }\n\n    button {\n      width: 100%;\n      background: var(--na-blue);\n      color: white;\n      border: none;\n      padding: 16px 22px;\n      border-radius: 14px;\n      cursor: pointer;\n      font-size: 17px;\n      font-weight: 750;\n      transition: transform 0.15s ease, background 0.15s ease;\n    }\n\n    button:hover {\n      background: var(--na-blue-dark);\n      transform: translateY(-1px);\n    }\n\n    button:disabled {\n      opacity: 0.65;\n      cursor: not-allowed;\n      transform: none;\n    }\n\n    .stats-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 14px;\n      width: 100%;\n      margin-bottom: 30px;\n    }\n\n    .stat-card {\n      padding: 22px;\n      text-align: center;\n    }\n\n    .stat-title {\n      color: var(--muted);\n      margin-bottom: 9px;\n      font-size: 15px;\n      font-weight: 650;\n    }\n\n    .stat-value {\n      color: var(--na-blue);\n      font-size: clamp(1.45rem, 6vw, 2.05rem);\n      font-weight: 800;\n      line-height: 1.2;\n    }\n\n    .stat-detail {\n      margin-top: 8px;\n      color: var(--text);\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .stat-note {\n      margin-top: 7px;\n      color: var(--muted);\n      font-size: 13px;\n    }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n      text-align: center;\n    }\n\n    .message.success {\n      display: block;\n      background: #eef7ff;\n      color: var(--na-blue-dark);\n      border: 1px solid #cfe2ff;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 430px) {\n      .hero {\n        padding-top: 34px;\n        padding-bottom: 68px;\n      }\n\n      .wrap {\n        margin-top: -38px;\n        padding: 0 12px;\n      }\n\n      .card,\n      .stat-card {\n        border-radius: 18px;\n      }\n\n      .card {\n        padding: 19px;\n      }\n\n      input[type=\"text\"],\n      button {\n        font-size: 17px;\n        padding: 15px;\n      }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <div class=\"language-toggle\">\n      <button type=\"button\" id=\"langSv\">SV</button>\n      <button type=\"button\" id=\"langEn\">EN</button>\n    </div>\n\n    <div id=\"eventTitle\" class=\"event-title\">\n      Laddar event...\n    </div>\n\n    <h1 id=\"heroTopText\">Tillsammans har vi</h1>\n\n    <div class=\"counter\" id=\"mainCounter\">\n      Laddar...\n    </div>\n\n    <div class=\"hero-subtitle\" id=\"heroBottomText\">\n      dagar av drogfrihet\n    </div>\n</section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\">\n      <h2 id=\"registerHeading\">Registrera din drogfria tid</h2>\n\n      <form id=\"cleanForm\">\n        <label for=\"cleanDate\" id=\"dateLabel\">Skriv in det datum du blev drogfri, ange datum som ÅÅÅÅMMDD</label>\n        <input type=\"text\" id=\"cleanDate\" placeholder=\"ÅÅÅÅMMDD\" inputmode=\"numeric\" maxlength=\"8\" required />\n        <p class=\"helper-text\" id=\"dateHelp\">Skriv endast siffror, exempelvis 20200121</p>\n        <button type=\"submit\" id=\"submitButton\">Registrera</button>\n      </form>\n\n      <div id=\"messageBox\" class=\"message\"></div>\n    </section>\n    <section class=\"stats-grid\">\n\n      <div class=\"stat-card\">\n        <div class=\"stat-value\" id=\"count\">0 personer</div>\n      </div>\n\n    </section>\n\n  </main>\n\n  <div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige.<br>Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img\n      src=\"/assets/na-logo.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n  </footer>",
  init: function initRegisterPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
        const texts = {
          sv: {
            pageTitle: "Drogfri tid",
            heroTopText: "Tillsammans har vi",
            heroBottomText: "dagar av drogfrihet",
            loading: "Laddar...",
            loadingEvent: "Laddar event...",
            eventMissingTitle: "EVENT SAKNAS",
            eventNotFoundTitle: "EVENT HITTADES INTE",
            eventNotStartedTitle: "REGISTRERINGEN HAR INTE ÖPPNAT",
            eventClosedTitle: "REGISTRERINGEN ÄR AVSLUTAD",
            eventNotStartedMessage: "Registreringen har inte öppnat ännu.",
            eventClosedMessage: "Registreringen är avslutad.",
            noEventLink: "Ingen event-länk angiven. Använd exempelvis ?event=na40 i adressen.",
            eventNotFound: "Kunde inte hitta eventet:",
            eventLabel: "Event:",
            registerHeading: "Registrera din drogfria tid",
            dateLabel: "Skriv in det datum du blev drogfri, ange datum som ÅÅÅÅMMDD",
            datePlaceholder: "ÅÅÅÅMMDD",
            dateHelp: "Skriv endast siffror, exempelvis 20200121",
            registerButton: "Registrera",
            registering: "Registrerar...",
            totalTitle: "Total tid",
            averageTitle: "Medel",
            longestTitle: "Längsta tid",
            shortestTitle: "Kortaste tid",
            howHeading: "Hur räknas tiden?",
            howText: "Drogfri tid räknas i databasen utifrån registrerat datum fram till dagens datum. Startdagen räknas med, vilket innebär att första dagen räknas som dag 1. Sidan hämtar färdigräknad statistik från databasen och visar antal dagar, antal personer, total tid, medelvärde, längsta tid och kortaste tid. I statistikrutorna räknas år som 365,25 dagar och en månad som cirka 30,44 dagar.",
            footer: "Bara för idag ❤️",
            person: "person",
            persons: "personer",
            day: "dag",
            days: "dagar",
            month: "månad",
            months: "månader",
            year: "år",
            total: "totalt",
            averageNote: "i genomsnitt",
            errorStats: "Kunde inte hämta statistik för eventet:",
            errorNoEvent: "Event saknas. Kontrollera länken.",
            errorCheckExisting: "Kunde inte kontrollera tidigare registrering:",
            errorAlreadyRegistered: "Denna enhet har redan registrerat drogfri tid för detta event.",
            errorDateFormat: "Ange datum som ÅÅÅÅMMDD",
            errorInvalidDate: "Datumet är ogiltigt.",
            errorFutureDate: "Datumet kan inte ligga i framtiden.",
            errorTooOldDate: "Årtalet måste vara 1953 eller senare.",
            errorOldUniqueIndex: "Denna enhet är redan registrerad i databasen. För flera event behöver databasen ändras till unikt index på device_id + event_id.",
            errorGeneric: "Något gick fel:",
            successRegistered: "Din drogfria tid är registrerad ❤️",
            successUpdated: "Din drogfria tid är uppdaterad ❤️",
            updateButton: "Uppdatera",
            updating: "Uppdaterar..."
          },
          en: {
            pageTitle: "Clean Time",
            heroTopText: "Together we have",
            heroBottomText: "days of clean time",
            loading: "Loading...",
            loadingEvent: "Loading event...",
            eventMissingTitle: "EVENT MISSING",
            eventNotFoundTitle: "EVENT NOT FOUND",
            eventNotStartedTitle: "REGISTRATION HAS NOT OPENED",
            eventClosedTitle: "REGISTRATION IS CLOSED",
            eventNotStartedMessage: "Registration has not opened yet.",
            eventClosedMessage: "Registration is closed.",
            noEventLink: "No event link was provided. Use for example ?event=na40 in the address.",
            eventNotFound: "Could not find event:",
            eventLabel: "Event:",
            registerHeading: "Register your clean time",
            dateLabel: "Enter the date you got clean, use YYYYMMDD",
            datePlaceholder: "YYYYMMDD",
            dateHelp: "Use digits only, for example 20200121",
            registerButton: "Register",
            registering: "Registering...",
            totalTitle: "Total time",
            averageTitle: "Average",
            longestTitle: "Longest time",
            shortestTitle: "Shortest time",
            howHeading: "How is time calculated?",
            howText: "Clean time is calculated in the database from the registered date up to today. The start day is included, which means the first day counts as day 1. The page gets pre-calculated statistics from the database and shows days, number of people, total time, average, longest time and shortest time. In the statistics cards, a year is calculated as 365.25 days and a month as about 30.44 days.",
            footer: "Just for today ❤️",
            person: "person",
            persons: "people",
            day: "day",
            days: "days",
            month: "month",
            months: "months",
            year: "year",
            total: "total",
            averageNote: "on average",
            errorStats: "Could not load statistics for the event:",
            errorNoEvent: "Event is missing. Check the link.",
            errorCheckExisting: "Could not check previous registration:",
            errorAlreadyRegistered: "This device has already registered clean time for this event.",
            errorDateFormat: "Enter the date as YYYYMMDD",
            errorInvalidDate: "The date is invalid.",
            errorFutureDate: "The date cannot be in the future.",
            errorTooOldDate: "The year must be 1953 or later.",
            errorOldUniqueIndex: "This device is already registered in the database. For multiple events, the database needs a unique index on device_id + event_id.",
            errorGeneric: "Something went wrong:",
            successRegistered: "Your clean time has been registered ❤️",
            successUpdated: "Your clean time has been updated ❤️",
            updateButton: "Update",
            updating: "Updating..."
          }
        };
    
        let language = localStorage.getItem("language") || "sv";
        let deviceId = localStorage.getItem("deviceId");
    
        if (!deviceId) {
          deviceId = crypto.randomUUID();
          localStorage.setItem("deviceId", deviceId);
        }
    
        let eventId = null;
        let eventSlug = null;
        let eventName = null;
        let registrationStatus = null;
        let registrationIsOpen = false;
        let existingEntryId = null;
    
        const cleanDateInput = document.getElementById("cleanDate");
        const submitButton = document.getElementById("submitButton");
    
        function t(key) {
          return texts[language][key];
        }
    
        function setText(id, value) {
          const element = document.getElementById(id);
          if (element) element.innerText = value;
        }
    
        function pluralize(value, singular, plural) {
          return value === 1 ? singular : plural;
        }
    
        function setLanguage(lang) {
          language = lang;
          localStorage.setItem("language", lang);
          document.documentElement.lang = lang;
    
          document.getElementById("langSv").classList.toggle("active", lang === "sv");
          document.getElementById("langEn").classList.toggle("active", lang === "en");
    
          setText("heroTopText", t("heroTopText"));
          setText("heroBottomText", t("heroBottomText"));
          setText("registerHeading", t("registerHeading"));
          setText("dateLabel", t("dateLabel"));
          setText("dateHelp", t("dateHelp"));
          setText("submitButton", existingEntryId ? t("updateButton") : t("registerButton"));
    
          cleanDateInput.placeholder = t("datePlaceholder");
    
          if (eventName) {
            document.title = t("pageTitle") + " - " + eventName;
          } else {
            document.title = t("pageTitle");
          }
    
          refreshDisplayedStatsLanguage();
        }
    
        function refreshDisplayedStatsLanguage() {
          if (window.latestStatsRow) {
            updateStatsFromDatabase(window.latestStatsRow);
          } else {
            setEmptyStats();
          }
        }
    
        function formatDetailFromDays(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const years = Math.floor(totalDays / 365.25);
          const daysAfterYears = totalDays - Math.floor(years * 365.25);
          const averageMonthDays = 30.4375;
          const months = Math.floor(daysAfterYears / averageMonthDays);
          const remainingDays = Math.round(daysAfterYears - (months * averageMonthDays));
    
          let parts = [];
          if (years > 0) parts.push(years + " " + t("year"));
          if (months > 0) parts.push(months + " " + pluralize(months, t("month"), t("months")));
          if (remainingDays > 0 || parts.length === 0) {
            parts.push(remainingDays + " " + pluralize(remainingDays, t("day"), t("days")));
          }
          return parts.join(" ");
        }
    
        function formatShortValue(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const averageMonthDays = 30.4375;
    
          if (totalDays < averageMonthDays) {
            return totalDays + " " + pluralize(totalDays, t("day"), t("days"));
          }
    
          if (totalDays < 365.25) {
            const months = Math.floor(totalDays / averageMonthDays);
            const remainingDays = Math.round(totalDays - (months * averageMonthDays));
    
            let parts = [];
            if (months > 0) parts.push(months + " " + pluralize(months, t("month"), t("months")));
            if (remainingDays > 0) parts.push(remainingDays + " " + pluralize(remainingDays, t("day"), t("days")));
    
            return parts.join(" ");
          }
    
          return null;
        }
    
        function formatStatsFromDays(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const decimalYears = (totalDays / 365.25).toFixed(1).replace(".", ",");
    
          return {
            yearsDecimal: decimalYears + " " + t("year"),
            detail: "(" + formatDetailFromDays(totalDays) + ")",
            daysText: totalDays.toLocaleString("sv-SE") + " " + pluralize(totalDays, t("day"), t("days"))
          };
        }
    
        function showMessage(text, type) {
          const box = document.getElementById("messageBox");
          box.textContent = text;
          box.className = "message " + type;
        }
    
        function clearMessage() {
          const box = document.getElementById("messageBox");
          box.textContent = "";
          box.className = "message";
        }
    
        function setEmptyStats() {
          document.getElementById("mainCounter").innerText = "0";
          document.getElementById("count").innerText = "0 " + t("persons");
        }
    
        function updateStatsFromDatabase(row) {
          window.latestStatsRow = row;
    
          const personCount = Number(row.person_count || 0);
          const totalDays = Number(row.total_days || 0);
    
          document.getElementById("mainCounter").innerText = totalDays.toLocaleString("sv-SE");
    
          document.getElementById("count").innerText =
            personCount.toLocaleString("sv-SE") + " " + pluralize(personCount, t("person"), t("persons"));
        }
    
        async function loadEvent() {
          const params = new URLSearchParams(window.location.search);
          eventSlug = params.get("event");
    
          if (!eventSlug) {
            document.getElementById("eventTitle").innerText = t("eventMissingTitle");
            submitButton.disabled = true;
            setEmptyStats();
            return false;
          }
    
          const { data, error } = await supabaseClient
            .from("event_status")
            .select("id,name,slug,is_active,start_date,end_date,registration_status")
            .eq("slug", eventSlug)
            .eq("is_active", true)
            .single();
    
          if (error || !data) {
            document.getElementById("eventTitle").innerText = t("eventNotFoundTitle");
            submitButton.disabled = true;
            setEmptyStats();
            console.log(error);
            return false;
          }
    
          eventId = data.id;
          eventName = data.name;
          registrationStatus = data.registration_status;
          registrationIsOpen = registrationStatus === "open";
    
          document.getElementById("eventTitle").innerText = eventName.toUpperCase();
          document.title = t("pageTitle") + " - " + eventName;
    
          if (!registrationIsOpen) {
            submitButton.disabled = true;
    
            if (registrationStatus === "not_started") {
              document.getElementById("eventTitle").innerText = t("eventNotStartedTitle");
              showMessage(t("eventNotStartedMessage"), "error");
            } else if (registrationStatus === "closed") {
              document.getElementById("eventTitle").innerText = t("eventClosedTitle");
              showMessage(t("eventClosedMessage"), "error");
            } else {
              showMessage(t("errorNoEvent"), "error");
            }
          } else {
            submitButton.disabled = false;
          }
    
          return true;
        }
    
    
        async function loadExistingRegistration() {
          if (!eventId) return;
    
          const { data, error } = await supabaseClient
            .from("clean_time_entries")
            .select("id,clean_date")
            .eq("device_id", deviceId)
            .eq("event_id", eventId)
            .limit(1);
    
          if (error) {
            console.log(error);
            return;
          }
    
          if (data && data.length > 0) {
            existingEntryId = data[0].id;
            cleanDateInput.value = String(data[0].clean_date).replaceAll("-", "");
            submitButton.innerText = t("updateButton");
          } else {
            existingEntryId = null;
          }
        }
    
        async function loadStats() {
          if (!eventId) {
            setEmptyStats();
            return;
          }
    
          const { data, error } = await supabaseClient
            .from("clean_time_summary_by_event")
            .select("person_count,total_days,average_days,longest_days,shortest_days")
            .eq("event_id", eventId)
            .limit(1);
    
          if (error) {
            showMessage(t("errorStats") + " " + error.message, "error");
            console.log(error);
            setEmptyStats();
            return;
          }
    
          const row = data && data.length > 0 ? data[0] : null;
    
          if (!row || Number(row.person_count || 0) === 0) {
            window.latestStatsRow = null;
            setEmptyStats();
            return;
          }
    
          updateStatsFromDatabase(row);
        }
    
        function sanitizeDateInput(input) {
          let value = input.value.replace(/\D/g, "");
          if (value.length > 8) value = value.substring(0, 8);
          input.value = value;
        }
    
        cleanDateInput.addEventListener("input", function () {
          sanitizeDateInput(this);
        });
    
        document.getElementById("cleanForm").addEventListener("submit", async function(e) {
          e.preventDefault();
          clearMessage();
    
          if (!eventId) {
            showMessage(t("errorNoEvent"), "error");
            return;
          }
    
          if (!registrationIsOpen) {
            if (registrationStatus === "not_started") {
              showMessage(t("eventNotStartedMessage"), "error");
            } else if (registrationStatus === "closed") {
              showMessage(t("eventClosedMessage"), "error");
            } else {
              showMessage(t("errorNoEvent"), "error");
            }
            return;
          }
    
          const { data: existingEntry, error: existingError } = await supabaseClient
            .from("clean_time_entries")
            .select("id")
            .eq("device_id", deviceId)
            .eq("event_id", eventId)
            .limit(1);
    
          if (existingError) {
            showMessage(t("errorCheckExisting") + " " + existingError.message, "error");
            console.log(existingError);
            return;
          }
    
          if (existingEntry && existingEntry.length > 0) {
            existingEntryId = existingEntry[0].id;
          }
    
          const rawDate = cleanDateInput.value;
    
          if (rawDate.length !== 8) {
            showMessage(t("errorDateFormat"), "error");
            return;
          }
    
          const cleanDate =
            rawDate.substring(0,4) + "-" +
            rawDate.substring(4,6) + "-" +
            rawDate.substring(6,8);
    
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
          if (Number.isNaN(selectedDate.getTime())) {
            showMessage(t("errorInvalidDate"), "error");
            return;
          }
    
          const inputYear = Number(rawDate.substring(0, 4));
    
          if (inputYear < 1953) {
            showMessage(t("errorTooOldDate"), "error");
            return;
          }
    
          if (selectedDate > today) {
            showMessage(t("errorFutureDate"), "error");
            return;
          }
    
          submitButton.disabled = true;
          submitButton.innerText = existingEntryId ? t("updating") : t("registering");
    
          let result;
    
          if (existingEntryId) {
            result = await supabaseClient
              .from("clean_time_entries")
              .update({
                clean_date: cleanDate,
                updated_at: new Date().toISOString()
              })
              .eq("id", existingEntryId)
              .eq("device_id", deviceId)
              .eq("event_id", eventId);
          } else {
            result = await supabaseClient
              .from("clean_time_entries")
              .insert([{
                clean_date: cleanDate,
                device_id: deviceId,
                event_id: eventId,
                created_by: "user"
              }]);
          }
    
          const { error } = result;
    
          
          submitButton.disabled = false;
          submitButton.innerText = existingEntryId ? t("updateButton") : t("registerButton");
    
          if (error) {
            if (error.message && error.message.includes("clean_time_device_unique")) {
              showMessage(t("errorOldUniqueIndex"), "error");
            } else if (error.message && error.message.includes("clean_time_device_event_unique")) {
              showMessage(t("errorAlreadyRegistered"), "error");
            } else {
              showMessage(t("errorGeneric") + " " + error.message, "error");
            }
            console.log(error);
          } else {
            showMessage(
              existingEntryId ? t("successUpdated") : t("successRegistered"),
              "success"
            );
            await loadExistingRegistration();
            await loadStats();
          }
        });
    
        document.getElementById("langSv").addEventListener("click", () => setLanguage("sv"));
        document.getElementById("langEn").addEventListener("click", () => setLanguage("en"));
    
        async function init() {
          setLanguage(language);
          const eventLoaded = await loadEvent();
          if (eventLoaded) {
            await loadExistingRegistration();
            await loadStats();
          }
        }
    
        init();
  }
});
