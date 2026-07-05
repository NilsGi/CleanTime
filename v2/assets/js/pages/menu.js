window.CleanTime.registerPage("menu", {
  title: "Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.12);\n    }\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n\n    body {\n      min-height: 100vh;\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n    }\n\n    .hero {\n      position: relative;\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 88px;\n    }\n\n    .language-toggle {\n      position: absolute;\n      top: 16px;\n      right: 16px;\n      display: flex;\n      gap: 6px;\n      background: rgba(255,255,255,0.14);\n      border: 1px solid rgba(255,255,255,0.25);\n      border-radius: 999px;\n      padding: 5px;\n      backdrop-filter: blur(8px);\n    }\n\n    .language-toggle button {\n      width: auto;\n      padding: 7px 11px;\n      border-radius: 999px;\n      background: transparent;\n      color: white;\n      border: none;\n      font-size: 13px;\n      font-weight: 800;\n      cursor: pointer;\n    }\n\n    .language-toggle button.active {\n      background: white;\n      color: var(--na-blue);\n    }\n\n    .hero h1 {\n      font-size: clamp(32px, 8vw, 54px);\n      font-weight: 900;\n      letter-spacing: 1px;\n      margin-top: 22px;\n      margin-bottom: 10px;\n    }\n\n    .hero p {\n      font-size: clamp(16px, 4vw, 22px);\n      opacity: 0.92;\n      line-height: 1.35;\n    }\n\n    .wrap {\n      width: min(100%, 560px);\n      margin: -50px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card {\n      background: var(--white);\n      border-radius: 24px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      position: relative;\n      z-index: 11;\n      text-align: center;\n    }\n\n    h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n    }\n\n    label {\n      display: block;\n      font-weight: 750;\n      margin-bottom: 8px;\n      text-align: center;\n    }\n\n    select {\n      display: block;\n      width: 100%;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 17px;\n      background: white;\n      color: var(--text);\n      margin-bottom: 14px;\n      text-align: center;\n      text-align-last: center;\n    }\n\n    select:focus {\n      outline: 3px solid rgba(30,79,154,0.18);\n      border-color: var(--na-blue);\n    }\n\n    .selected-info {\n      background: #eef7ff;\n      color: var(--na-blue-dark);\n      border: 1px solid #cfe2ff;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n      margin-top: 12px;\n      display: none;\n    }\n\n    .button-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 12px;\n      margin-top: 10px;\n    }\n\n    .nav-button {\n      display: block;\n      width: 100%;\n      text-align: center;\n      text-decoration: none;\n      background: var(--na-blue);\n      color: white;\n      border: none;\n      padding: 17px 20px;\n      border-radius: 16px;\n      cursor: pointer;\n      font-size: 17px;\n      font-weight: 800;\n      transition: transform 0.15s ease, background 0.15s ease;\n    }\n\n    .nav-button:hover {\n      background: var(--na-blue-dark);\n      transform: translateY(-1px);\n    }\n\n    .nav-button.secondary { background: #64748b; }\n    .nav-button.secondary:hover { background: #475569; }\n    .nav-button.admin { background: #334155; }\n    .nav-button.admin:hover { background: #1e293b; }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 430px) {\n      .hero { padding-top: 42px; padding-bottom: 78px; }\n      .wrap { margin-top: -44px; padding: 0 12px; }\n      .card { border-radius: 20px; padding: 19px; }\n      .language-toggle { top: 12px; right: 12px; }\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n<div class=\"language-toggle\">\n<button id=\"langSv\" type=\"button\">SV</button>\n<button id=\"langEn\" type=\"button\">EN</button>\n</div>\n<h1 id=\"pageTitle\">Drogfri tid</h1>\n<p id=\"pageSubtitle\">Välj event och gå vidare</p>\n</section>\n<main class=\"wrap\">\n<section class=\"card\">\n<h2 id=\"eventHeading\">Välj event</h2>\n<p class=\"helper-text\" id=\"eventHelp\">\n        Välj vilket event du vill använda. Valet sparas på denna enhet.\n      </p>\n<label for=\"eventSelect\" id=\"eventLabel\">Event</label>\n<select id=\"eventSelect\">\n<option value=\"\">Laddar event...</option>\n</select>\n<div class=\"message\" id=\"messageBox\"></div>\n</section>\n<section class=\"card\">\n<h2 id=\"goHeading\">Gå vidare</h2>\n<div class=\"button-grid\">\n<a class=\"nav-button\" href=\"#\" id=\"registerButton\">Registrera tid</a>\n<a class=\"nav-button\" href=\"#\" id=\"totalButton\">Visa total tid</a>\n<a class=\"nav-button secondary\" href=\"#\" id=\"manualButton\">Manuell registrering</a>\n<a class=\"nav-button secondary\" href=\"#\" id=\"statisticsButton\">Statistik</a>\n<a class=\"nav-button secondary\" href=\"history/\" id=\"historyButton\">Historisk statistik</a>\n<a class=\"nav-button admin\" href=\"create/\" id=\"createButton\">Skapa event / QR-koder</a>\n<a class=\"nav-button admin\" href=\"admin/\" id=\"adminButton\">Administrera event</a>\n<a class=\"nav-button secondary\" href=\"changelog/\" id=\"changelogButton\">Versionshistorik / Changelog</a></div>\n</section>\n</main>\n<div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n<img alt=\"Narcotics Anonymous, Anonyma Narkomaner\" class=\"footer-logo\" src=\"/assets/na-logo.png\"/>\n<div id=\"versionInfo\" style=\"margin-top:16px;font-size:13px;color:#64748b;\">Version v2.2.0</div></footer>",
  init: function initMenuPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const supabaseClient = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );
    
        const texts = {
          sv: {
            pageTitle: "Drogfri tid",
            pageSubtitle: "Välj event och gå vidare",
            eventHeading: "Välj event",
            eventHelp: "Välj vilket event du vill använda. Valet sparas på denna enhet.",
            eventLabel: "Event",
            loading: "Laddar event...",
            choose: "Välj event...",
            selected: "Valt event:",
            goHeading: "Gå vidare",
            register: "Registrera tid",
            total: "Visa total tid",
            manual: "Manuell registrering",
            statistics: "Statistik",
            history: "Historisk statistik",
            create: "Skapa event / QR-koder",
            admin: "Administrera event",
            missingEvent: "Välj ett event först.",
            noEvents: "Inga aktiva event finns ännu.",
            errorLoading: "Kunde inte hämta event:",
            footer: "",
            changelog: "Versionshistorik / Changelog",
            version: "Version"
          },
          en: {
            pageTitle: "Clean Time",
            pageSubtitle: "Choose an event and continue",
            eventHeading: "Choose event",
            eventHelp: "Choose which event you want to use. The choice is saved on this device.",
            eventLabel: "Event",
            loading: "Loading events...",
            choose: "Choose event...",
            selected: "Selected event:",
            goHeading: "Continue",
            register: "Register clean time",
            total: "Show total time",
            manual: "Manual registration",
            statistics: "Statistics",
            history: "Historical statistics",
            create: "Create event / QR codes",
            admin: "Administer events",
            missingEvent: "Please choose an event first.",
            noEvents: "No active events found.",
            errorLoading: "Could not load events:",
            footer: "",
            changelog: "Version history / Changelog",
            version: "Version"
          }
        };
    
        let language = localStorage.getItem("language") || "sv";
        let events = [];
        let selectedSlug = localStorage.getItem("selectedEventSlug") || "";
    
        const eventSelect = document.getElementById("eventSelect");
        const messageBox = document.getElementById("messageBox");
    
        function t(key) {
          return texts[language][key];
        }
    
        function setText(id, value) {
          document.getElementById(id).innerText = value;
        }
    
        function setLanguage(lang) {
          language = lang;
          localStorage.setItem("language", lang);
    
          document.documentElement.lang = lang;
          document.getElementById("langSv").classList.toggle("active", lang === "sv");
          document.getElementById("langEn").classList.toggle("active", lang === "en");
    
          setText("pageTitle", t("pageTitle"));
          setText("pageSubtitle", t("pageSubtitle"));
          setText("eventHeading", t("eventHeading"));
          setText("eventHelp", t("eventHelp"));
          setText("eventLabel", t("eventLabel"));
          setText("goHeading", t("goHeading"));
          setText("registerButton", t("register"));
          setText("totalButton", t("total"));
          setText("manualButton", t("manual"));
          setText("statisticsButton", t("statistics"));
          setText("historyButton", t("history"));
          setText("createButton", t("create"));
          setText("adminButton", t("admin"));
          setText("changelogButton", t("changelog"));
          document.getElementById("versionInfo").innerText = `${t("version")} v2.2.0`;
    
          renderEvents();
          updateSelectedInfo();
        }
    
        function showError(text) {
          messageBox.textContent = text;
          messageBox.className = "message error";
        }
    
        function clearError() {
          messageBox.textContent = "";
          messageBox.className = "message";
        }
    
        function getSelectedEvent() {
          return events.find(event => event.slug === selectedSlug) || null;
        }
    
        function renderEvents() {
          if (events.length === 0) {
            eventSelect.innerHTML = `<option value="">${t("noEvents")}</option>`;
            return;
          }
    
          eventSelect.innerHTML =
            `<option value="">${t("choose")}</option>` +
            events.map(event =>
              `<option value="${event.slug}">${event.name}</option>`
            ).join("");
    
          eventSelect.value = selectedSlug;
        }
    
        function updateSelectedInfo() {
          updateButtons();
        }
    
        function buildUrl(path) {
          if (!selectedSlug) return "#";
          const route = String(path || "").replace(/^\/+|\/+$/g, "");
              return window.CleanTime.routePath(route, { event: selectedSlug });
        }
    
        function updateButtons() {
          document.getElementById("registerButton").href = buildUrl("register/");
          document.getElementById("totalButton").href = buildUrl("total/");
          document.getElementById("manualButton").href = buildUrl("manual/");
          document.getElementById("statisticsButton").href = buildUrl("statistics/");
          document.getElementById("historyButton").href = window.CleanTime.routePath("history");
          document.getElementById("createButton").href = window.CleanTime.routePath("create");
          document.getElementById("adminButton").href = window.CleanTime.routePath("admin");
              document.getElementById("changelogButton").href = window.CleanTime.routePath("changelog");
        }
    
        function handleNavClick(e) {
          const id = e.currentTarget.id;
    
          if (id === "adminButton" || id === "createButton" || id === "historyButton") {
            return;
          }
    
          if (!selectedSlug) {
            e.preventDefault();
            showError(t("missingEvent"));
          }
        }
    
        async function loadEvents() {
          eventSelect.innerHTML = `<option value="">${t("loading")}</option>`;
    
          const { data, error } = await supabaseClient
            .from("events")
            .select("id,name,slug,is_active")
            .eq("is_active", true)
            .order("name", { ascending: true });
    
          if (error) {
            showError(t("errorLoading") + " " + error.message);
            console.log(error);
            events = [];
            renderEvents();
            return;
          }
    
          events = data || [];
    
          if (selectedSlug && !events.some(event => event.slug === selectedSlug)) {
            selectedSlug = "";
            localStorage.removeItem("selectedEventSlug");
          }
    
          renderEvents();
          updateSelectedInfo();
        }
    
        eventSelect.addEventListener("change", function () {
          clearError();
          selectedSlug = this.value;
    
          if (selectedSlug) {
            localStorage.setItem("selectedEventSlug", selectedSlug);
          } else {
            localStorage.removeItem("selectedEventSlug");
          }
    
          updateSelectedInfo();
        });
    
        document.getElementById("langSv").addEventListener("click", () => setLanguage("sv"));
        document.getElementById("langEn").addEventListener("click", () => setLanguage("en"));
    
        document.getElementById("registerButton").addEventListener("click", handleNavClick);
        document.getElementById("totalButton").addEventListener("click", handleNavClick);
        document.getElementById("manualButton").addEventListener("click", handleNavClick);
        document.getElementById("statisticsButton").addEventListener("click", handleNavClick);
    
        setLanguage(language);
        loadEvents();
  }
});
