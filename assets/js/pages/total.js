window.CleanTime.registerPage("total", {
  title: "Drogfri tid - Total",
  style: ":root {\n      --blue: #1E4F9A;\n      --blue-dark: #163D78;\n      --white: #ffffff;\n      --soft-white: rgba(255, 255, 255, 0.88);\n      --glass: rgba(255, 255, 255, 0.15);\n      --glass-border: rgba(255, 255, 255, 0.25);\n      --panel: #0f172a;\n      --panel-top: #1f2937;\n    }\n\n    * {\n      margin: 0;\n      padding: 0;\n      box-sizing: border-box;\n    }\n\n    body {\n      min-height: 100vh;\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: radial-gradient(circle at top, #2a66bd, var(--blue-dark));\n      color: var(--white);\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      text-align: center;\n      padding: 24px;\n      overflow-x: hidden;\n    }\n\n    .language-toggle {\n      position: fixed;\n      top: 18px;\n      right: 18px;\n      z-index: 50;\n      display: flex;\n      gap: 6px;\n      background: rgba(255,255,255,0.14);\n      border: 1px solid rgba(255,255,255,0.25);\n      border-radius: 999px;\n      padding: 5px;\n      backdrop-filter: blur(8px);\n    }\n\n    .language-toggle button {\n      width: auto;\n      padding: 9px 14px;\n      border-radius: 999px;\n      background: transparent;\n      color: white;\n      border: none;\n      font-size: 15px;\n      font-weight: 850;\n      cursor: pointer;\n    }\n\n    .language-toggle button.active {\n      background: white;\n      color: var(--blue);\n    }\n\n    .screen {\n      width: min(100%, 1150px);\n    }\n\n    .event-title {\n      font-size: clamp(24px, 5vw, 56px);\n      font-weight: 850;\n      margin-top: 70px;\n      margin-bottom: 28px;\n      text-transform: uppercase;\n      letter-spacing: 1px;\n      color: white;\n    }\n\n    .top-text {\n      font-size: clamp(28px, 5vw, 58px);\n      font-weight: 750;\n      margin-bottom: 28px;\n    }\n\n    .split-counter {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      gap: clamp(4px, 1vw, 12px);\n      flex-wrap: nowrap;\n      margin-bottom: 28px;\n      perspective: 1200px;\n    }\n\n    .digit-card {\n      position: relative;\n      width: clamp(34px, 8.6vw, 104px);\n      height: clamp(54px, 13vw, 152px);\n      background: linear-gradient(180deg, var(--panel-top) 0%, var(--panel) 100%);\n      border-radius: clamp(7px, 1.3vw, 16px);\n      box-shadow:\n        inset 0 1px 0 rgba(255,255,255,0.16),\n        inset 0 -2px 0 rgba(0,0,0,0.45),\n        0 14px 32px rgba(0,0,0,0.34);\n      overflow: hidden;\n      border: 1px solid rgba(255,255,255,0.16);\n    }\n\n    .digit-card::before {\n      content: \"\";\n      position: absolute;\n      left: 0;\n      right: 0;\n      top: 50%;\n      height: 2px;\n      background: rgba(0,0,0,0.72);\n      z-index: 4;\n      box-shadow: 0 -1px 0 rgba(255,255,255,0.08);\n    }\n\n    .digit-card::after {\n      content: \"\";\n      position: absolute;\n      inset: 0;\n      background: linear-gradient(180deg, rgba(255,255,255,0.08), transparent 35%, rgba(0,0,0,0.18));\n      pointer-events: none;\n      z-index: 5;\n    }\n\n    .digit {\n      position: absolute;\n      inset: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      font-size: clamp(32px, 9vw, 116px);\n      font-weight: 950;\n      line-height: 1;\n      letter-spacing: -0.04em;\n      text-shadow: 0 4px 12px rgba(0,0,0,0.42);\n      font-variant-numeric: tabular-nums;\n    }\n\n    .digit-card.flip .digit {\n      animation: flipDigit 0.95s ease-in-out;\n    }\n\n    @keyframes flipDigit {\n      0% {\n        transform: rotateX(0deg);\n        filter: brightness(1);\n      }\n      22% {\n        transform: rotateX(-72deg);\n        filter: brightness(0.72);\n      }\n      46% {\n        transform: rotateX(-92deg);\n        filter: brightness(0.55);\n      }\n      54% {\n        transform: rotateX(92deg);\n        filter: brightness(0.55);\n      }\n      78% {\n        transform: rotateX(28deg);\n        filter: brightness(0.9);\n      }\n      100% {\n        transform: rotateX(0deg);\n        filter: brightness(1);\n      }\n    }\n\n    .bottom-text {\n      font-size: clamp(28px, 5vw, 58px);\n      font-weight: 750;\n      margin-bottom: 30px;\n    }\n\n    .info-row {\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      gap: 18px;\n      flex-wrap: wrap;\n      margin-bottom: 24px;\n      opacity: 1;\n      transition: opacity 0.35s ease;\n    }\n\n    .info-row.hidden-info {\n      opacity: 0;\n      pointer-events: none;\n    }\n\n    .pill {\n      display: inline-block;\n      background: var(--glass);\n      border: 1px solid var(--glass-border);\n      border-radius: 999px;\n      padding: 16px 30px;\n      font-size: clamp(20px, 4vw, 38px);\n      font-weight: 700;\n      backdrop-filter: blur(8px);\n    }\n\n    .updated {\n      color: var(--soft-white);\n      font-size: clamp(13px, 2vw, 18px);\n      opacity: 0.85;\n    }\n\n    .error {\n      margin-top: 22px;\n      display: none;\n      background: rgba(255,255,255,0.15);\n      border: 1px solid rgba(255,255,255,0.25);\n      border-radius: 18px;\n      padding: 14px 18px;\n      font-size: 16px;\n      color: white;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 24px auto 0;\n    }\n\n    @media (max-width: 520px) {\n      body {\n        padding: 18px;\n        overflow: auto;\n        align-items: flex-start;\n      }\n\n      .screen {\n        padding-top: 42px;\n      }\n\n      .split-counter {\n        gap: 4px;\n      }\n\n      .pill {\n        border-radius: 26px;\n        line-height: 1.35;\n        width: 100%;\n      }\n\n      .info-row {\n        gap: 12px;\n      }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }\n\n    body.route-total {\n      min-height: 100svh;\n      height: 100svh;\n      align-items: stretch;\n      padding: clamp(12px, 2.4vh, 24px);\n      overflow: hidden;\n    }\n\n    body.route-total #app {\n      width: 100%;\n      min-height: 0;\n      height: 100%;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      transform: none;\n    }\n\n    body.route-total .screen {\n      width: min(100%, 1150px);\n      margin: 0 auto;\n      padding-top: clamp(42px, 7vh, 76px);\n    }\n\n    body.route-total .language-toggle {\n      top: max(12px, env(safe-area-inset-top));\n      right: 12px;\n    }\n\n    body.route-total .event-title {\n      margin-top: 0;\n      margin-bottom: clamp(12px, 2.8vh, 28px);\n    }\n\n    body.route-total .top-text,\n    body.route-total .split-counter {\n      margin-bottom: clamp(12px, 2.8vh, 28px);\n    }\n\n    body.route-total .bottom-text {\n      margin-bottom: clamp(12px, 3vh, 30px);\n    }\n\n    body.route-total .info-row {\n      gap: clamp(10px, 2vw, 18px);\n      margin-bottom: clamp(10px, 2.4vh, 24px);\n    }\n\n    body.route-total .pill {\n      padding: clamp(10px, 2vh, 16px) clamp(16px, 3vw, 30px);\n      font-size: clamp(18px, 4vw, 38px);\n    }\n\n    body.route-total .updated {\n      font-size: clamp(11px, 1.8vw, 18px);\n      line-height: 1.25;\n    }\n\n    body.route-total .footer-logo {\n      width: min(28vw, 260px);\n      max-width: 260px;\n      margin-top: clamp(8px, 2vh, 20px);\n    }\n\n    body.route-total .service-credit {\n      width: min(100% - 24px, 760px);\n      margin: clamp(8px, 1.8vh, 16px) auto 0;\n      color: rgba(255,255,255,0.74);\n      font-size: clamp(9.5px, 1.45vh, 12px);\n      line-height: 1.22;\n    }\n\n    @media (max-width: 520px) {\n      body.route-total {\n        padding: 12px;\n      }\n\n      body.route-total #app {\n        transform: none;\n      }\n\n      body.route-total .language-toggle {\n        transform: scale(0.9);\n        transform-origin: top right;\n      }\n\n      body.route-total .screen {\n        padding-top: 46px;\n      }\n\n      body.route-total .event-title {\n        font-size: clamp(20px, 6.5vw, 32px);\n      }\n\n      body.route-total .top-text,\n      body.route-total .bottom-text {\n        font-size: clamp(22px, 7.2vw, 34px);\n      }\n\n      body.route-total .split-counter {\n        gap: 3px;\n      }\n\n      body.route-total .digit-card {\n        width: clamp(28px, 11vw, 52px);\n        height: clamp(44px, 15.5vw, 72px);\n      }\n\n      body.route-total .digit {\n        font-size: clamp(28px, 11vw, 54px);\n      }\n\n      body.route-total .pill {\n        width: auto;\n        border-radius: 26px;\n        line-height: 1.25;\n      }\n\n      body.route-total .footer-logo {\n        width: min(42vw, 170px);\n      }\n    }\n\n    @media (max-height: 700px) {\n      body.route-total #app {\n        transform: none;\n      }\n\n      body.route-total .footer-logo,\n      body.route-total .service-credit {\n        display: none;\n      }\n    }",
  html: "<div class=\"language-toggle\">\n    <button type=\"button\" id=\"langSv\">SV</button>\n    <button type=\"button\" id=\"langEn\">EN</button>\n  </div>\n\n  <main class=\"screen\">\n\n    <div id=\"eventTitle\" class=\"event-title\">\n      Laddar event...\n    </div>\n\n    <div class=\"top-text\" id=\"topText\">Tillsammans har vi</div>\n\n    <div class=\"split-counter\" id=\"totalDaysCounter\" aria-label=\"Totalt antal dagar\"></div>\n\n    <div class=\"bottom-text\" id=\"bottomText\">dagar av drogfrihet</div>\n\n    <div class=\"info-row\">\n      <div class=\"pill\" id=\"personCount\">0 personer</div>\n      <div class=\"pill\" id=\"detailTime\">0 dagar</div>\n    </div>\n\n    <div class=\"updated\" id=\"updatedText\">\n      Uppdateras automatiskt var 60:e sekund\n    </div>\n\n    <img\n      src=\"/assets/na-logo-vit.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n\n    <div class=\"error\" id=\"errorBox\"></div>\n  </main>\n<div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige.<br>Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>",
  init: function initTotalPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const supabaseClient = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_KEY
        );
    
        const texts = {
          sv: {
            pageTitle: "Drogfri tid - Total",
            loadingEvent: "Laddar event...",
            allEvents: "ALLA EVENT",
            eventNotFound: "EVENT HITTADES INTE",
            topText: "Tillsammans har vi",
            bottomText: "dagar av drogfrihet",
            person: "person",
            persons: "personer",
            day: "dag",
            days: "dagar",
            month: "månad",
            months: "månader",
            year: "år",
            updatedPrefix: "Senast uppdaterad",
            updatedSuffix: "uppdateras automatiskt var 60:e sekund",
            errorStats: "Kunde inte hämta statistik:"
          },
          en: {
            pageTitle: "Clean Time - Total",
            loadingEvent: "Loading event...",
            allEvents: "ALL EVENTS",
            eventNotFound: "EVENT NOT FOUND",
            topText: "Together we have",
            bottomText: "days of clean time",
            person: "person",
            persons: "people",
            day: "day",
            days: "days",
            month: "month",
            months: "months",
            year: "year",
            updatedPrefix: "Last updated",
            updatedSuffix: "updates automatically every 60 seconds",
            errorStats: "Could not load statistics:"
          }
        };
    
        let language = localStorage.getItem("language") || "sv";
        let eventId = null;
        let eventSlug = null;
        let eventName = null;
    
        let latestTotalDays = 0;
        let latestPersonCount = 0;
        let currentTotalDays = 0;
        let firstRender = false;
        let isAnimating = false;
    
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
    
          setText("topText", t("topText"));
          setText("bottomText", t("bottomText"));
    
          if (eventName) {
            document.title = eventName + " - " + t("pageTitle");
          } else {
            document.title = t("pageTitle");
          }
    
          renderInfo(latestTotalDays, latestPersonCount);
          updateTimeText();
        }
    
        function splitDays(totalDaysInput) {
          const totalDays = Math.max(0, Math.floor(Number(totalDaysInput) || 0));
          const years = Math.floor(totalDays / 365.25);
          const daysAfterYears = totalDays - Math.floor(years * 365.25);
          const months = Math.floor(daysAfterYears / 30.4375);
          const remainingDays = Math.round(daysAfterYears - (months * 30.4375));
    
          return { years, months, days: remainingDays };
        }
    
        function formatDetailFromDays(days) {
          const split = splitDays(days);
          const parts = [];
    
          if (split.years > 0) {
            parts.push(split.years + " " + t("year"));
          }
    
          if (split.months > 0) {
            parts.push(split.months + " " + pluralize(split.months, t("month"), t("months")));
          }
    
          if (split.days > 0 || parts.length === 0) {
            parts.push(split.days + " " + pluralize(split.days, t("day"), t("days")));
          }
    
          return parts.join(" ");
        }
    
        function buildDigitCard(char) {
          const card = document.createElement("div");
          card.className = "digit-card";
    
          const digit = document.createElement("div");
          digit.className = "digit";
          digit.textContent = char;
    
          card.appendChild(digit);
          return card;
        }
    
        function setCounterDigits(text) {
          const counter = document.getElementById("totalDaysCounter");
          counter.innerHTML = "";
    
          for (let i = 0; i < text.length; i++) {
            counter.appendChild(buildDigitCard(text[i]));
          }
        }
    
        function randomDigit() {
          return String(Math.floor(Math.random() * 10));
        }
    
        function spinAllDigits(targetText) {
          const counter = document.getElementById("totalDaysCounter");
          const cards = Array.from(counter.querySelectorAll(".digit-card"));
          const digits = cards.map(card => card.querySelector(".digit"));
    
          const stopped = new Array(targetText.length).fill(false);
    
          const spinSpeed = 60;
          const spinTime = 4500;
          const stopDelay = 850;
          const flipLength = 950;
    
          // Alla siffror snurrar snabbt. Siffror som redan stannat lämnas orörda.
          const spinInterval = setInterval(() => {
            digits.forEach((digit, index) => {
              if (stopped[index]) return;
    
              digit.textContent = randomDigit();
    
              const card = cards[index];
              card.classList.remove("flip");
              void card.offsetWidth;
              card.classList.add("flip");
              setTimeout(() => card.classList.remove("flip"), 360);
            });
          }, spinSpeed);
    
          // Efter första snurrperioden låser vi siffrorna en i taget från höger till vänster.
          setTimeout(() => {
            for (let i = targetText.length - 1; i >= 0; i--) {
              const rightToLeftIndex = (targetText.length - 1) - i;
    
              setTimeout(() => {
                stopped[i] = true;
                digits[i].textContent = targetText[i];
    
                cards[i].classList.remove("flip");
                void cards[i].offsetWidth;
                cards[i].classList.add("flip");
                setTimeout(() => cards[i].classList.remove("flip"), flipLength + 100);
    
                // När vänstersta siffran stannat avslutas snurret.
                if (i === 0) {
                  setTimeout(() => {
                    clearInterval(spinInterval);
                    digits.forEach((digit, index) => {
                      digit.textContent = targetText[index];
                    });
                  }, flipLength);
                }
              }, rightToLeftIndex * stopDelay);
            }
          }, spinTime);
    
          return spinTime + ((targetText.length - 1) * stopDelay) + flipLength + 350;
        }
    
        function renderSplitCounter(value, animate = true) {
          const newText = String(value).padStart(7, "0");
    
          if (!animate) {
            setCounterDigits(newText);
            currentTotalDays = value;
            return Promise.resolve();
          }
    
          isAnimating = true;
          document.querySelector(".info-row").classList.add("hidden-info");
          setCounterDigits(String(currentTotalDays).padStart(7, "0"));
    
          const totalAnimationTime = spinAllDigits(newText);
    
          return new Promise(resolve => {
            setTimeout(() => {
              currentTotalDays = value;
              isAnimating = false;
              resolve();
            }, totalAnimationTime);
          });
        }
    
        function renderInfo(totalDays, personCount) {
          document.getElementById("personCount").innerText =
            personCount.toLocaleString("sv-SE") +
            " " +
            pluralize(personCount, t("person"), t("persons"));
    
          document.getElementById("detailTime").innerText =
            formatDetailFromDays(totalDays);
        }
    
        function updateTimeText() {
          document.getElementById("updatedText").innerText =
            t("updatedPrefix") + " " + new Date().toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            }) + " • " + t("updatedSuffix");
        }
    
        function showError(message) {
          const errorBox = document.getElementById("errorBox");
          errorBox.style.display = "inline-block";
          errorBox.innerText = message;
        }
    
        function hideError() {
          const errorBox = document.getElementById("errorBox");
          errorBox.style.display = "none";
          errorBox.innerText = "";
        }
    
        async function renderAll(totalDays, personCount, animate = true) {
          latestTotalDays = totalDays;
          latestPersonCount = personCount;
    
          await renderSplitCounter(totalDays, animate);
    
          // Informationen visas först efter att alla siffror har snurrat klart.
          renderInfo(totalDays, personCount);
          updateTimeText();
          document.querySelector(".info-row").classList.remove("hidden-info");
        }
    
        async function loadEvent() {
          const params = new URLSearchParams(window.location.search);
          eventSlug = params.get("event");
    
          if (!eventSlug) {
            document.getElementById("eventTitle").innerText = t("allEvents");
            return false;
          }
    
          const { data, error } = await supabaseClient
            .from("events")
            .select("id,name")
            .eq("slug", eventSlug)
            .single();
    
          if (error || !data) {
            document.getElementById("eventTitle").innerText = t("eventNotFound");
            console.log(error);
            return false;
          }
    
          eventId = data.id;
          eventName = data.name;
    
          document.getElementById("eventTitle").innerText = eventName.toUpperCase();
          document.title = eventName + " - " + t("pageTitle");
    
          return true;
        }
    
        async function loadTotalTime() {
          if (isAnimating) return;
    
          let query;
    
          if (eventId) {
            query = supabaseClient
              .from("clean_time_summary_by_event")
              .select("person_count,total_days")
              .eq("event_id", eventId);
          } else {
            query = supabaseClient
              .from("clean_time_summary")
              .select("person_count,total_days");
          }
    
          const { data, error } = await query.limit(1);
    
          if (error) {
            showError(t("errorStats") + " " + error.message);
            await renderAll(0, 0, true);
            return;
          }
    
          hideError();
    
          const row = data && data.length > 0 ? data[0] : null;
    
          const totalDays = Math.max(0, Math.floor(Number(row?.total_days) || 0));
          const personCount = Math.max(0, Math.floor(Number(row?.person_count) || 0));
    
          await renderAll(totalDays, personCount, !firstRender);
          firstRender = false;
        }
    
        async function init() {
          setLanguage(language);
    
          currentTotalDays = 0;
    
          await loadEvent();
    
          await loadTotalTime();
        }
    
        document.getElementById("langSv").addEventListener("click", () => setLanguage("sv"));
        document.getElementById("langEn").addEventListener("click", () => setLanguage("en"));
    
        init();
    
        setInterval(loadTotalTime, 60000);
  }
});
