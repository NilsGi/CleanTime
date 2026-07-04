window.CleanTime.registerPage("create", {
  title: "Skapa event - Clean Time",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .hero h1 {\n      font-size: clamp(22px, 5vw, 34px);\n      letter-spacing: 2px;\n      margin-bottom: 12px;\n      text-transform: uppercase;\n    }\n\n    .hero p { font-size: 16px; opacity: 0.92; }\n\n    .wrap {\n      width: min(100%, 620px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n    }\n\n    label {\n      display: block;\n      text-align: left;\n      color: var(--text);\n      font-weight: 700;\n      margin-bottom: 8px;\n    }\n\n    input[type=\"text\"],\n    input[type=\"password\"],\n    input[type=\"date\"],\n    select {\n      display: block;\n      width: calc(100% - 32px);\n      margin-left: auto;\n      margin-right: auto;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 18px;\n      background: #fff;\n      color: var(--text);\n      margin-bottom: 14px;\n    }\n\n    button,\n    .back-button {\n      width: 100%;\n      background: var(--na-blue);\n      color: white;\n      border: none;\n      padding: 16px 22px;\n      border-radius: 14px;\n      cursor: pointer;\n      font-size: 17px;\n      font-weight: 750;\n      text-decoration: none;\n      text-align: center;\n      display: block;\n      margin-top: 12px;\n    }\n\n    .secondary-button,\n    .back-button { background: #64748b; }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n      text-align: center;\n    }\n\n    .message.success {\n      display: block;\n      background: #eef7ff;\n      color: var(--na-blue-dark);\n      border: 1px solid #cfe2ff;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .hidden { display: none; }\n\n    .event-title {\n      text-align: center;\n      color: var(--na-blue);\n      font-size: clamp(30px, 8vw, 48px);\n      font-weight: 900;\n      text-transform: uppercase;\n      line-height: 1.15;\n      margin-bottom: 14px;\n    }\n\n    .created-note {\n      text-align: center;\n      color: var(--muted);\n      font-size: 14px;\n      margin-bottom: 18px;\n    }\n\n    .link-row {\n      background: #eef7ff;\n      border: 1px solid #cfe2ff;\n      border-radius: 16px;\n      padding: 14px;\n      margin-bottom: 12px;\n    }\n\n    .link-label {\n      color: var(--na-blue-dark);\n      font-weight: 800;\n      margin-bottom: 7px;\n    }\n\n    .link-line {\n      display: grid;\n      grid-template-columns: 1fr 44px;\n      gap: 8px;\n      align-items: center;\n    }\n\n    .link-url {\n      color: var(--na-blue-dark);\n      font-size: 14px;\n      word-break: break-all;\n      line-height: 1.35;\n    }\n\n    .link-url a {\n      color: var(--na-blue-dark);\n      text-decoration: none;\n    }\n\n    .copy-icon-button {\n      width: 44px;\n      height: 44px;\n      min-width: 44px;\n      padding: 0;\n      border-radius: 12px;\n      background: var(--na-blue);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-top: 0;\n    }\n\n    .copy-icon-button svg {\n      width: 23px;\n      height: 23px;\n      stroke: white;\n      stroke-width: 2.4;\n      fill: none;\n    }\n\n    .qr-grid {\n      display: grid;\n      grid-template-columns: 1fr;\n      gap: 16px;\n    }\n\n    .qr-box {\n      background: #f8fafc;\n      border: 1px solid var(--border);\n      border-radius: 18px;\n      padding: 18px;\n      text-align: center;\n    }\n\n    .qr-title {\n      color: var(--na-blue);\n      font-weight: 850;\n      font-size: 18px;\n      margin-bottom: 12px;\n    }\n\n    .qr-holder {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      min-height: 196px;\n      margin-bottom: 12px;\n    }\n\n    .flyer-actions {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 12px;\n      margin-top: 12px;\n    }\n\n    .preview-flyer {\n      background: white;\n      border: 1px solid var(--border);\n      border-radius: 18px;\n      padding: 22px;\n      text-align: center;\n      margin-top: 16px;\n    }\n\n    .preview-title {\n      color: var(--na-blue);\n      font-weight: 900;\n      font-size: 34px;\n      text-transform: uppercase;\n      line-height: 1.15;\n      margin-bottom: 18px;\n    }\n\n    .preview-text {\n      color: var(--text);\n      font-weight: 800;\n      font-size: 22px;\n      line-height: 1.25;\n      margin-bottom: 18px;\n    }\n\n    .preview-help {\n      color: var(--text);\n      font-size: 16px;\n      line-height: 1.35;\n      margin-top: 18px;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 430px) {\n      .wrap { padding: 0 12px; }\n      .card { border-radius: 18px; padding: 19px; }\n      .flyer-actions { grid-template-columns: 1fr; }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <h1>Skapa event</h1>\n    <p>Länkar, QR-koder och flyer</p>\n  </section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\" id=\"loginCard\">\n      <h2>Logga in</h2>\n      <p class=\"helper-text\">Ange lösenord för att skapa event.</p>\n\n      <label for=\"adminPassword\">Lösenord</label>\n      <input type=\"password\" id=\"adminPassword\" placeholder=\"Lösenord\" autocomplete=\"current-password\">\n      <button type=\"button\" id=\"loginButton\">Logga in</button>\n      <a href=\"/\" class=\"back-button\">← Till huvudmenyn</a>\n\n      <div id=\"loginMessage\" class=\"message\"></div>\n    </section>\n\n    <section class=\"card hidden\" id=\"createCard\">\n      <h2>Event</h2>\n      <p class=\"helper-text\">Skapa event och få färdiga länkar, QR-koder och flyer.</p>\n\n      <label for=\"eventName\">Eventnamn</label>\n      <input type=\"text\" id=\"eventName\" placeholder=\"Exempelvis Gullbranna 2027\">\n\n      <label for=\"eventSlug\">Event-ID / slug</label>\n      <input type=\"text\" id=\"eventSlug\" placeholder=\"exempelvis gullbranna-2027\">\n\n      <label for=\"startDate\">Startdatum</label>\n      <input type=\"date\" id=\"startDate\">\n\n      <label for=\"endDate\">Slutdatum</label>\n      <input type=\"date\" id=\"endDate\">\n\n      <button type=\"button\" id=\"createEventButton\">Skapa event</button>\n\n      <a href=\"/\" class=\"back-button\">← Till huvudmenyn</a>\n\n      <div id=\"eventMessage\" class=\"message\"></div>\n    </section>\n\n    <section class=\"card hidden\" id=\"existingEventCard\">\n      <h2>Befintliga event</h2>\n      <p class=\"helper-text\">Välj ett redan skapat event för att få länkar, QR-koder och flyer.</p>\n\n      <label for=\"eventSelect\">Välj event</label>\n      <select id=\"eventSelect\">\n        <option value=\"\">Laddar event...</option>\n      </select>\n\n      <button type=\"button\" class=\"secondary-button\" id=\"loadSelectedEventButton\">\n        Hämta länkar, QR och flyer\n      </button>\n\n      <div id=\"existingEventMessage\" class=\"message\"></div>\n    </section>\n\n    <section class=\"card hidden\" id=\"resultCard\">\n      <div class=\"event-title\" id=\"createdEventTitle\">EVENT</div>\n      <div class=\"created-note\" id=\"createdEventSlug\">Event-ID</div>\n\n      <div class=\"link-row\">\n        <div class=\"link-label\">Registreringslänk</div>\n        <div class=\"link-line\">\n          <div class=\"link-url\" id=\"registerUrl\"></div>\n          <button type=\"button\" class=\"copy-icon-button\" data-copy=\"registerUrl\">\n            <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n              <rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"></rect>\n              <path d=\"M4 16V6a2 2 0 0 1 2-2h10\"></path>\n            </svg>\n          </button>\n        </div>\n      </div>\n\n      <div class=\"link-row\">\n        <div class=\"link-label\">Totalsida</div>\n        <div class=\"link-line\">\n          <div class=\"link-url\" id=\"totalUrl\"></div>\n          <button type=\"button\" class=\"copy-icon-button\" data-copy=\"totalUrl\">\n            <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n              <rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"></rect>\n              <path d=\"M4 16V6a2 2 0 0 1 2-2h10\"></path>\n            </svg>\n          </button>\n        </div>\n      </div>\n\n      <div class=\"link-row\">\n        <div class=\"link-label\">Statistik</div>\n        <div class=\"link-line\">\n          <div class=\"link-url\" id=\"statisticsUrl\"></div>\n          <button type=\"button\" class=\"copy-icon-button\" data-copy=\"statisticsUrl\">\n            <svg viewBox=\"0 0 24 24\" aria-hidden=\"true\">\n              <rect x=\"8\" y=\"8\" width=\"12\" height=\"12\" rx=\"2\"></rect>\n              <path d=\"M4 16V6a2 2 0 0 1 2-2h10\"></path>\n            </svg>\n          </button>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"card hidden\" id=\"qrCard\">\n      <h2>QR-koder</h2>\n      <p class=\"helper-text\">QR-koden för registrering används även i flyern.</p>\n\n      <div class=\"qr-grid\">\n        <div class=\"qr-box\">\n          <div class=\"qr-title\">Registrering</div>\n          <div class=\"qr-holder\" id=\"qrRegister\"></div>\n        </div>\n\n        <div class=\"qr-box\">\n          <div class=\"qr-title\">Total</div>\n          <div class=\"qr-holder\" id=\"qrTotal\"></div>\n        </div>\n\n        <div class=\"qr-box\">\n          <div class=\"qr-title\">Statistik</div>\n          <div class=\"qr-holder\" id=\"qrStatistics\"></div>\n        </div>\n      </div>\n    </section>\n\n    <section class=\"card hidden\" id=\"flyerCard\">\n      <h2>Flyer</h2>\n      <p class=\"helper-text\">Skapa en A4-PDF med eventnamn, text och stor QR-kod.</p>\n\n      <div class=\"flyer-actions\">\n        <button type=\"button\" id=\"flyerSvButton\">Skapa svensk PDF</button>\n        <button type=\"button\" id=\"flyerEnButton\" class=\"secondary-button\">Create English PDF</button>\n      </div>\n\n      <div class=\"preview-flyer\">\n        <div class=\"preview-title\" id=\"previewTitle\">EVENT</div>\n        <div class=\"preview-text\">Registrera din drogfri tid här</div>\n        <div class=\"qr-holder\" id=\"qrPreview\"></div>\n        <div class=\"preview-help\">Behöver du hjälp? Prata med registreringen.</div>\n      </div>\n    </section>\n\n  </main>\n\n  <div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img src=\"/assets/na-logo.png\" alt=\"Narcotics Anonymous, Anonyma Narkomaner\" class=\"footer-logo\">\n  </footer>\n\n  <img id=\"naLogoPdf\" src=\"/assets/na-logo.png\" style=\"display:none\" crossorigin=\"anonymous\">",
  init: function initCreatePage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
        const ADMIN_PASSWORD = atob("c2thcGE=");
    
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
        let currentEvent = null;
        let currentLinks = null;
        let events = [];
    
        const loginCard = document.getElementById("loginCard");
        const createCard = document.getElementById("createCard");
        const existingEventCard = document.getElementById("existingEventCard");
        const resultCard = document.getElementById("resultCard");
        const qrCard = document.getElementById("qrCard");
        const flyerCard = document.getElementById("flyerCard");
    
        const loginMessage = document.getElementById("loginMessage");
        const eventMessage = document.getElementById("eventMessage");
        const existingEventMessage = document.getElementById("existingEventMessage");
        const eventSelect = document.getElementById("eventSelect");
    
        function showMessage(element, text, type) {
          element.textContent = text;
          element.className = "message " + type;
        }
    
        function clearMessage(element) {
          element.textContent = "";
          element.className = "message";
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
    
        function doLogin() {
          clearMessage(loginMessage);
    
          const password = document.getElementById("adminPassword").value;
    
          if (password !== ADMIN_PASSWORD) {
            showMessage(loginMessage, "Fel lösenord.", "error");
            return;
          }
    
          loginCard.classList.add("hidden");
          createCard.classList.remove("hidden");
          existingEventCard.classList.remove("hidden");
          loadExistingEvents();
        }
    
        document.getElementById("loginButton").addEventListener("click", doLogin);
        document.getElementById("adminPassword").addEventListener("keydown", function(event) {
          if (event.key === "Enter") {
            event.preventDefault();
            doLogin();
          }
        });
    
        document.getElementById("eventName").addEventListener("input", function () {
          const slugInput = document.getElementById("eventSlug");
          if (!slugInput.dataset.manual) {
            slugInput.value = sanitizeSlug(this.value);
          }
        });
    
        document.getElementById("eventSlug").addEventListener("input", function () {
          this.dataset.manual = "true";
          this.value = sanitizeSlug(this.value);
        });
    
        async function loadExistingEvents() {
          clearMessage(existingEventMessage);
    
          const { data, error } = await supabaseClient
            .from("events")
            .select("id,name,slug,is_active,start_date,end_date,created_at")
            .eq("is_active", true)
            .order("created_at", { ascending: false });
    
          if (error) {
            eventSelect.innerHTML = '<option value="">Kunde inte hämta event</option>';
            showMessage(existingEventMessage, "Kunde inte hämta event: " + error.message, "error");
            console.log(error);
            return;
          }
    
          events = data || [];
    
          if (events.length === 0) {
            eventSelect.innerHTML = '<option value="">Inga event finns</option>';
            return;
          }
    
          eventSelect.innerHTML =
            '<option value="">Välj event...</option>' +
            events.map(event => `<option value="${event.id}">${event.name} (${event.slug})</option>`).join("");
        }
    
        async function createEvent() {
          clearMessage(eventMessage);
    
          const name = document.getElementById("eventName").value.trim();
          const slug = sanitizeSlug(document.getElementById("eventSlug").value);
          const start_date = document.getElementById("startDate").value;
          const end_date = document.getElementById("endDate").value;
    
          if (!name || !slug || !start_date || !end_date) {
            showMessage(eventMessage, "Ange eventnamn, Event-ID, startdatum och slutdatum.", "error");
            return;
          }
    
          if (new Date(end_date + "T00:00:00") < new Date(start_date + "T00:00:00")) {
            showMessage(eventMessage, "Slutdatum måste vara samma dag eller efter startdatum.", "error");
            return;
          }
    
          const button = document.getElementById("createEventButton");
          button.disabled = true;
          button.innerText = "Skapar...";
    
          const { data, error } = await supabaseClient
            .from("events")
            .insert([{ name, slug, start_date, end_date, is_active: true }])
            .select("id,name,slug,start_date,end_date")
            .single();
    
          button.disabled = false;
          button.innerText = "Skapa event";
    
          if (error) {
            showMessage(eventMessage, "Kunde inte skapa event: " + error.message, "error");
            console.log(error);
            return;
          }
    
          currentEvent = data;
          buildEventAssets(currentEvent);
          await loadExistingEvents();
    
          document.getElementById("eventName").value = "";
          document.getElementById("eventSlug").value = "";
          document.getElementById("startDate").value = "";
          document.getElementById("endDate").value = "";
          document.getElementById("eventSlug").dataset.manual = "";
    
          showMessage(eventMessage, "Eventet är skapat.", "success");
          showAssetCards();
        }
    
        function loadSelectedExistingEvent() {
          clearMessage(existingEventMessage);
    
          const event = events.find(item => item.id === eventSelect.value);
    
          if (!event) {
            showMessage(existingEventMessage, "Välj ett event först.", "error");
            return;
          }
    
          currentEvent = event;
          buildEventAssets(currentEvent);
          showMessage(existingEventMessage, "Eventet är hämtat.", "success");
          showAssetCards();
        }
    
        function showAssetCards() {
          resultCard.classList.remove("hidden");
          qrCard.classList.remove("hidden");
          flyerCard.classList.remove("hidden");
          resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    
        document.getElementById("createEventButton").addEventListener("click", createEvent);
        document.getElementById("loadSelectedEventButton").addEventListener("click", loadSelectedExistingEvent);
    
        function buildEventAssets(event) {
          const registerUrl = window.CleanTime.routeUrl("register", { event: event.slug });
              const totalUrl = window.CleanTime.routeUrl("total", { event: event.slug });
              const statisticsUrl = window.CleanTime.routeUrl("statistics", { event: event.slug });
    
          currentLinks = { registerUrl, totalUrl, statisticsUrl };
    
          document.getElementById("createdEventTitle").innerText = event.name;
          document.getElementById("createdEventSlug").innerHTML =
            "Event-ID: " + event.slug +
            "<br>Startdatum: " + (event.start_date || "-") +
            "<br>Slutdatum: " + (event.end_date || "-");
    
          setLink("registerUrl", registerUrl);
          setLink("totalUrl", totalUrl);
          setLink("statisticsUrl", statisticsUrl);
    
          makeQr("qrRegister", registerUrl, 190);
          makeQr("qrTotal", totalUrl, 190);
          makeQr("qrStatistics", statisticsUrl, 190);
          makeQr("qrPreview", registerUrl, 210);
    
          document.getElementById("previewTitle").innerText = event.name;
        }
    
        function setLink(elementId, url) {
          document.getElementById(elementId).innerHTML =
            '<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>';
        }
    
        function makeQr(elementId, url, size) {
          const element = document.getElementById(elementId);
          element.innerHTML = "";
    
          new QRCode(element, {
            text: url,
            width: size,
            height: size,
            correctLevel: QRCode.CorrectLevel.H
          });
        }
    
        async function copyText(elementId) {
          const element = document.getElementById(elementId);
          const link = element ? element.querySelector("a") : null;
          const text = link ? link.href : "";
    
          if (!text) return;
    
          try {
            await navigator.clipboard.writeText(text);
            showMessage(eventMessage, "Länk kopierad.", "success");
          } catch (error) {
            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            showMessage(eventMessage, "Länk kopierad.", "success");
          }
        }
    
        document.querySelectorAll("[data-copy]").forEach(button => {
          button.addEventListener("click", function() {
            copyText(this.dataset.copy);
          });
        });
    
        function getQrDataUrl(elementId) {
          const element = document.getElementById(elementId);
          const canvas = element.querySelector("canvas");
    
          if (canvas) return canvas.toDataURL("image/png");
    
          const img = element.querySelector("img");
          return img ? img.src : null;
        }
    
        function safeFileName(value) {
          return sanitizeSlug(value || "event") || "event";
        }
    
        function createFlyer(language) {
          if (!currentEvent || !currentLinks) {
            showMessage(eventMessage, "Välj eller skapa ett event först.", "error");
            return;
          }
    
          const qrDataUrl = getQrDataUrl("qrPreview");
    
          if (!qrDataUrl) {
            showMessage(eventMessage, "QR-koden kunde inte hämtas.", "error");
            return;
          }
    
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
          const isSv = language === "sv";
          const title = currentEvent.name.toUpperCase();
    
          const heading = isSv
            ? "Registrera din\ndrogfria tid här"
            : "Register your\nclean time here";
    
          const step1 = isSv
            ? "1. Scanna QR-koden"
            : "1. Scan the QR code";
    
          const step2 = isSv
            ? "2. Skriv in det datumet då du blev drogfri,\n    tex 20260205 (ÅÅÅÅMMDD)"
            : "2. Enter the date you became clean,\n    e.g. 20260205 (YYYYMMDD)";
    
          const infoText = isSv
            ? "Har du inte möjlighet att göra detta själv\nså prata med registreringen så hjälper dom till"
            : "If you are not able to do this yourself,\nplease talk to the registration team\nand they will help you";
    
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, 210, 297, "F");
    
          pdf.setTextColor(30, 79, 154);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(45);
          pdf.text(title, 105, 30, { align: "center", maxWidth: 185 });
    
          pdf.setDrawColor(30, 79, 154);
          pdf.setLineWidth(0.8);
          pdf.line(25, 55, 185, 55);
    
          pdf.setTextColor(31, 41, 55);
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(26);
          pdf.text(heading.split("\n"), 105, 68, { align: "center", lineHeightFactor: 1.2 });
    
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(18);
          pdf.setTextColor(31, 41, 55);
          pdf.text(step1, 45, 95);
          pdf.text(step2.split("\n"), 45, 115, { lineHeightFactor: 1.3 });
    
          pdf.setTextColor(30, 79, 154);
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(17);
          pdf.text(infoText.split("\n"), 105, 140, { align: "center", lineHeightFactor: 1.3 });
    
          pdf.addImage(qrDataUrl, "PNG", 67, 165, 76, 76);
    
          pdf.setDrawColor(30, 79, 154);
          pdf.setLineWidth(0.8);
          pdf.line(25, 250, 185, 250);
    
          const logo = document.getElementById("naLogoPdf");
    
          try {
            const logoWidth = 88;
            const logoHeight = 25;
    
            pdf.addImage(
              logo,
              "PNG",
              (210 - logoWidth) / 2,
              265,
              logoWidth,
              logoHeight
            );
          } catch (e) {
            console.log("Logga kunde inte läggas till i PDF", e);
          }
    
          pdf.save(safeFileName(currentEvent.slug) + "-flyer-" + (isSv ? "SV" : "EN") + ".pdf");
        }
    
        document.getElementById("flyerSvButton").addEventListener("click", () => createFlyer("sv"));
        document.getElementById("flyerEnButton").addEventListener("click", () => createFlyer("en"));
  }
});
