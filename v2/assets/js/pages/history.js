window.CleanTime.registerPage("history", {
  title: "Historik - Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .hero h1 {\n      font-size: clamp(26px, 7vw, 44px);\n      margin-bottom: 12px;\n      font-weight: 850;\n    }\n\n    .hero p {\n      font-size: 17px;\n      opacity: 0.92;\n      line-height: 1.4;\n    }\n\n    .wrap {\n      width: min(100%, 760px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      position: relative;\n      z-index: 11;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n    }\n\n    label {\n      display: block;\n      color: var(--text);\n      font-weight: 700;\n      margin-bottom: 8px;\n    }\n\n    select {\n      display: block;\n      width: 100%;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 18px;\n      background: #fff;\n      color: var(--text);\n      margin-bottom: 14px;\n    }\n\n    .selected-event {\n      background: #eef7ff;\n      border: 1px solid #cfe2ff;\n      color: var(--na-blue-dark);\n      padding: 13px;\n      border-radius: 14px;\n      margin-top: 8px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .event-display-title {\n      text-align: center;\n      color: var(--na-blue);\n      font-size: clamp(28px, 7vw, 42px);\n      font-weight: 900;\n      line-height: 1.15;\n      margin-bottom: 18px;\n      text-transform: uppercase;\n    }\n\n    .stat-card {\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      text-align: center;\n      position: relative;\n      z-index: 11;\n    }\n\n    .stat-title {\n      color: var(--na-blue-dark);\n      font-size: 14px;\n      font-weight: 750;\n      margin-bottom: 8px;\n    }\n\n    .stat-value {\n      color: var(--na-blue);\n      font-size: clamp(28px, 7vw, 42px);\n      font-weight: 900;\n      line-height: 1.15;\n      margin-bottom: 7px;\n    }\n\n    .stat-detail {\n      color: var(--text);\n      font-size: 15px;\n      font-weight: 650;\n      margin-bottom: 6px;\n    }\n\n    .stat-note {\n      color: var(--muted);\n      font-size: 13px;\n      line-height: 1.35;\n    }\n\n    .summary-grid {\n      display: grid;\n      grid-template-columns: repeat(3, 1fr);\n      gap: 12px;\n      margin-top: 16px;\n    }\n\n    .summary-box {\n      background: #f4f7fb;\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 15px;\n      text-align: center;\n    }\n\n    .summary-label {\n      color: var(--muted);\n      font-size: 13px;\n      font-weight: 700;\n      margin-bottom: 6px;\n    }\n\n    .summary-value {\n      color: var(--na-blue);\n      font-size: 25px;\n      font-weight: 850;\n    }\n\n    .table-wrap {\n      overflow-x: auto;\n      border-radius: 16px;\n      border: 1px solid var(--border);\n      margin-top: 14px;\n    }\n\n    table {\n      width: 100%;\n      border-collapse: collapse;\n      background: white;\n      min-width: 360px;\n    }\n\n    th, td {\n      padding: 12px;\n      text-align: left;\n      border-bottom: 1px solid var(--border);\n      font-size: 15px;\n    }\n\n    th {\n      background: #f4f7fb;\n      font-weight: 800;\n      color: var(--text);\n    }\n\n    tr:last-child td { border-bottom: none; }\n    td:last-child, th:last-child { text-align: right; font-weight: 800; }\n\n    .bar-cell { width: 45%; }\n\n    .bar {\n      height: 10px;\n      background: #dbeafe;\n      border-radius: 999px;\n      overflow: hidden;\n    }\n\n    .bar-fill {\n      height: 100%;\n      background: var(--na-blue);\n      border-radius: 999px;\n      min-width: 3px;\n    }\n\n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .back-button {\n      display: block;\n      width: 100%;\n      text-align: center;\n      text-decoration: none;\n      background: #64748b;\n      color: white;\n      padding: 16px 22px;\n      border-radius: 14px;\n      font-size: 17px;\n      font-weight: 750;\n      margin-top: 12px;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 560px) {\n      .hero { padding-top: 34px; padding-bottom: 68px; }\n      .wrap { margin-top: -38px; padding: 0 12px; }\n      .card { border-radius: 18px; padding: 19px; }\n      .summary-grid { grid-template-columns: 1fr; }\n      select { font-size: 17px; padding: 15px; }\n      th, td { font-size: 14px; padding: 10px; }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <h1>Drogfri tid - historik</h1>\n    <p>Arkiverade event och sparade slutresultat</p>\n  </section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\">\n      <h2>Välj arkiverat event</h2>\n      <p class=\"helper-text\">Hämta sparat slutresultat från historiken.</p>\n\n      <label for=\"historySelect\">Arkiverat event</label>\n      <select id=\"historySelect\">\n        <option value=\"\">Laddar historik...</option>\n      </select>\n\n      <div class=\"event-display-title\" id=\"selectedEventInfo\">Välj ett event</div>\n      <div id=\"messageBox\" class=\"message\"></div>\n\n      <a href=\"./\" class=\"back-button\">← Till huvudmenyn</a>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-value\" id=\"statsPersonCount\">0 personer</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Total tid</div>\n      <div class=\"stat-value\" id=\"statsTotalYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsTotalDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsTotalNote\">0 dagar totalt</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Medel</div>\n      <div class=\"stat-value\" id=\"statsAverageYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsAverageDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsAverageNote\">0 dagar i genomsnitt</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Längsta tid</div>\n      <div class=\"stat-value\" id=\"statsLongestYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsLongestDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsLongestNote\">0 dagar</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Kortaste tid</div>\n      <div class=\"stat-value\" id=\"statsShortestYears\">0 dagar</div>\n      <div class=\"stat-detail\" id=\"statsShortestDetail\"></div>\n      <div class=\"stat-note\" id=\"statsShortestNote\">0 dagar</div>\n    </section>\n    <section class=\"card\">\n      <h2>Historik</h2>\n      <p class=\"helper-text\" id=\"historyMeta\">\n        Välj ett arkiverat event för att visa sparat slutresultat.\n      </p>\n    </section>\n\n    <section class=\"card\">\n      <h2>Hur räknas tiden?</h2>\n      <p class=\"helper-text\">\n        Denna sida visar sparad historik från arkiverade event.\n        När ett event arkiveras sparas slutresultatet i databasen.\n        Därefter hämtas antal personer, total tid, medelvärde, längsta tid och kortaste tid från historiktabellen.\n        I statistikrutorna räknas år som 365,25 dagar och en månad som cirka 30,44 dagar.\n      </p>\n    </section>\n\n  </main>\n\n  <div class=\"service-credit\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img\n      src=\"/assets/na-logo.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n  </footer>",
  init: function initHistoryPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
        const selectedEventInfo = document.getElementById("selectedEventInfo");
        const messageBox = document.getElementById("messageBox");
        const historySelect = document.getElementById("historySelect");
        const historyMeta = document.getElementById("historyMeta");
    
        let historyRows = [];
        let selectedHistory = null;
    
        function showError(text) {
          messageBox.textContent = text;
          messageBox.className = "message error";
        }
    
        function clearError() {
          messageBox.textContent = "";
          messageBox.className = "message";
        }
    
        function pluralize(value, singular, plural) {
          return value === 1 ? singular : plural;
        }
    
        function formatDate(value) {
          if (!value) return "-";
          const date = new Date(value + "T00:00:00");
          if (Number.isNaN(date.getTime())) return value;
          return date.toLocaleDateString("sv-SE");
        }
    
        function formatDateTime(value) {
          if (!value) return "-";
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) return "-";
          return date.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });
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
    
        function formatShortValue(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const averageMonthDays = 30.4375;
    
          if (totalDays < averageMonthDays) {
            return totalDays + " " + pluralize(totalDays, "dag", "dagar");
          }
    
          if (totalDays < 365.25) {
            const months = Math.floor(totalDays / averageMonthDays);
            const remainingDays = Math.round(totalDays - (months * averageMonthDays));
    
            let parts = [];
            if (months > 0) parts.push(months + " " + pluralize(months, "månad", "månader"));
            if (remainingDays > 0) parts.push(remainingDays + " " + pluralize(remainingDays, "dag", "dagar"));
    
            return parts.join(" ");
          }
    
          return null;
        }
    
        function formatStatsFromDays(days) {
          const totalDays = Math.max(0, Math.floor(Number(days) || 0));
          const decimalYears = (totalDays / 365.25).toFixed(1).replace(".", ",");
    
          return {
            yearsDecimal: decimalYears + " år",
            detail: "(" + formatDetailFromDays(totalDays) + ")",
            daysText: totalDays.toLocaleString("sv-SE") + " " + pluralize(totalDays, "dag", "dagar")
          };
        }
    
        function resetTopStats() {
          const zero = formatStatsFromDays(0);
    
          document.getElementById("statsPersonCount").innerText = "0 personer";
          document.getElementById("statsTotalYears").innerText = zero.yearsDecimal;
          document.getElementById("statsTotalDetail").innerText = zero.detail;
          document.getElementById("statsTotalNote").innerText = zero.daysText + " totalt";
          document.getElementById("statsAverageYears").innerText = zero.yearsDecimal;
          document.getElementById("statsAverageDetail").innerText = zero.detail;
          document.getElementById("statsAverageNote").innerText = zero.daysText + " i genomsnitt";
          document.getElementById("statsLongestYears").innerText = zero.yearsDecimal;
          document.getElementById("statsLongestDetail").innerText = zero.detail;
          document.getElementById("statsLongestNote").innerText = zero.daysText;
          document.getElementById("statsShortestYears").innerText = "0 dagar";
          document.getElementById("statsShortestDetail").innerText = "";
          document.getElementById("statsShortestNote").innerText = zero.daysText;
        }
    
        function updateTopStatsFromHistory(row) {
          if (!row) {
            resetTopStats();
            return;
          }
    
          const personCount = Number(row.person_count || 0);
          const totalDays = Number(row.total_days || 0);
          const averageDays = Math.floor(Number(row.average_days || 0));
          const longestDays = Number(row.longest_days || 0);
          const shortestDays = Number(row.shortest_days || 0);
    
          const total = formatStatsFromDays(totalDays);
          const average = formatStatsFromDays(averageDays);
          const longest = formatStatsFromDays(longestDays);
          const shortest = formatStatsFromDays(shortestDays);
          const shortestShortValue = formatShortValue(shortestDays);
    
          document.getElementById("statsPersonCount").innerText =
            personCount.toLocaleString("sv-SE") + " " + pluralize(personCount, "person", "personer");
    
          document.getElementById("statsTotalYears").innerText = total.yearsDecimal;
          document.getElementById("statsTotalDetail").innerText = total.detail;
          document.getElementById("statsTotalNote").innerText = total.daysText + " totalt";
    
          document.getElementById("statsAverageYears").innerText = average.yearsDecimal;
          document.getElementById("statsAverageDetail").innerText = average.detail;
          document.getElementById("statsAverageNote").innerText = average.daysText + " i genomsnitt";
    
          document.getElementById("statsLongestYears").innerText = longest.yearsDecimal;
          document.getElementById("statsLongestDetail").innerText = longest.detail;
          document.getElementById("statsLongestNote").innerText = longest.daysText;
    
          if (shortestShortValue !== null) {
            document.getElementById("statsShortestYears").innerText = shortestShortValue;
            document.getElementById("statsShortestDetail").innerText = "";
          } else {
            document.getElementById("statsShortestYears").innerText = shortest.yearsDecimal;
            document.getElementById("statsShortestDetail").innerText = shortest.detail;
          }
    
          document.getElementById("statsShortestNote").innerText = shortest.daysText;
        }
    
        async function loadHistory() {
          clearError();
    
          const { data, error } = await supabaseClient
            .from("event_history")
            .select("id,event_id,event_name,event_slug,start_date,end_date,person_count,total_days,average_days,longest_days,shortest_days,archived_at")
            .order("archived_at", { ascending: false });
    
          if (error) {
            historySelect.innerHTML = '<option value="">Kunde inte hämta historik</option>';
            selectedEventInfo.innerText = "HISTORIK KUNDE INTE HÄMTAS";
            showError("Kunde inte hämta historik: " + error.message);
            resetTopStats();
            return;
          }
    
          historyRows = data || [];
    
          if (historyRows.length === 0) {
            historySelect.innerHTML = '<option value="">Ingen historik finns</option>';
            selectedEventInfo.innerText = "INGEN HISTORIK";
            historyMeta.innerText = "Inga arkiverade event finns ännu.";
            resetTopStats();
            return;
          }
    
          historySelect.innerHTML =
            '<option value="">Välj arkiverat event...</option>' +
            historyRows.map(row => {
              const period = row.start_date && row.end_date
                ? " " + row.start_date + "–" + row.end_date
                : "";
              return `<option value="${row.id}">${row.event_name}${period}</option>`;
            }).join("");
    
          const params = new URLSearchParams(window.location.search);
          const historyId = params.get("history");
          if (historyId && historyRows.some(row => row.id === historyId)) {
            historySelect.value = historyId;
            selectHistory(historyId);
          } else {
            historySelect.value = historyRows[0].id;
            selectHistory(historyRows[0].id);
          }
        }
    
        function selectHistory(id) {
          clearError();
    
          selectedHistory = historyRows.find(row => row.id === id) || null;
    
          if (!selectedHistory) {
            selectedEventInfo.innerText = "VÄLJ ETT EVENT";
            historyMeta.innerText = "Välj ett arkiverat event för att visa sparat slutresultat.";
            resetTopStats();
            return;
          }
    
          selectedEventInfo.innerText = selectedHistory.event_name || "ARKIVERAT EVENT";
          document.title = "Historik - " + (selectedHistory.event_name || "Drogfri tid");
    
          historyMeta.innerHTML =
            "<strong>Event-ID:</strong> " + (selectedHistory.event_slug || "-") + "<br>" +
            "<strong>Startdatum:</strong> " + formatDate(selectedHistory.start_date) + "<br>" +
            "<strong>Slutdatum:</strong> " + formatDate(selectedHistory.end_date) + "<br>" +
            "<strong>Arkiverat:</strong> " + formatDateTime(selectedHistory.archived_at);
    
          updateTopStatsFromHistory(selectedHistory);
        }
    
        historySelect.addEventListener("change", function () {
          selectHistory(this.value);
        });
    
        loadHistory();
  }
});
