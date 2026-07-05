window.CleanTime.registerPage("statistics", {
  title: "Statistik - Drogfri tid",
  style: ":root {\n      --na-blue: #1E4F9A;\n      --na-blue-dark: #163D78;\n      --text: #1f2937;\n      --muted: #64748b;\n      --bg: #f4f7fb;\n      --white: #ffffff;\n      --border: #dbe3ef;\n      --shadow: 0 10px 30px rgba(15, 23, 42, 0.10);\n    }\n\n    * { margin: 0; padding: 0; box-sizing: border-box; }\n\n    body {\n      font-family: \"Segoe UI\", Arial, sans-serif;\n      background: var(--bg);\n      color: var(--text);\n      min-height: 100vh;\n    }\n\n    .hero {\n      background: linear-gradient(135deg, var(--na-blue-dark), var(--na-blue));\n      color: white;\n      text-align: center;\n      padding: 42px 18px 75px;\n    }\n\n    .hero h1 {\n      font-size: clamp(26px, 7vw, 44px);\n      margin-bottom: 12px;\n      font-weight: 850;\n    }\n\n    .hero p {\n      font-size: 17px;\n      opacity: 0.92;\n      line-height: 1.4;\n    }\n\n    .wrap {\n      width: min(100%, 760px);\n      margin: -45px auto 42px;\n      padding: 0 16px;\n      position: relative;\n      z-index: 10;\n    }\n\n    .card {\n      width: 100%;\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      position: relative;\n      z-index: 11;\n    }\n\n    .card h2 {\n      color: var(--na-blue);\n      font-size: 22px;\n      margin-bottom: 10px;\n    }\n\n    .helper-text {\n      color: var(--muted);\n      line-height: 1.45;\n      margin-bottom: 18px;\n      font-size: 15px;\n    }\n\n    label {\n      display: block;\n      color: var(--text);\n      font-weight: 700;\n      margin-bottom: 8px;\n    }\n\n    select {\n      display: block;\n      width: 100%;\n      padding: 16px;\n      border-radius: 14px;\n      border: 1px solid var(--border);\n      font-size: 18px;\n      background: #fff;\n      color: var(--text);\n      margin-bottom: 14px;\n    }\n\n    .selected-event {\n      background: #eef7ff;\n      border: 1px solid #cfe2ff;\n      color: var(--na-blue-dark);\n      padding: 13px;\n      border-radius: 14px;\n      margin-top: 8px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .event-display-title {\n      text-align: center;\n      color: var(--na-blue);\n      font-size: clamp(28px, 7vw, 42px);\n      font-weight: 900;\n      line-height: 1.15;\n      margin-bottom: 18px;\n      text-transform: uppercase;\n    }\n\n    .stat-card {\n      background: var(--white);\n      border-radius: 22px;\n      box-shadow: var(--shadow);\n      border: 1px solid rgba(30, 79, 154, 0.08);\n      padding: 24px;\n      margin-bottom: 18px;\n      text-align: center;\n      position: relative;\n      z-index: 11;\n    }\n\n    .stat-title {\n      color: var(--na-blue-dark);\n      font-size: 14px;\n      font-weight: 750;\n      margin-bottom: 8px;\n    }\n\n    .stat-value {\n      color: var(--na-blue);\n      font-size: clamp(28px, 7vw, 42px);\n      font-weight: 900;\n      line-height: 1.15;\n      margin-bottom: 7px;\n    }\n\n    .stat-detail {\n      color: var(--text);\n      font-size: 15px;\n      font-weight: 650;\n      margin-bottom: 6px;\n    }\n\n    .stat-note {\n      color: var(--muted);\n      font-size: 13px;\n      line-height: 1.35;\n    }\n\n    .summary-grid {\n      display: grid;\n      grid-template-columns: repeat(3, 1fr);\n      gap: 12px;\n      margin-top: 16px;\n    }\n\n    .summary-box {\n      background: #f4f7fb;\n      border: 1px solid var(--border);\n      border-radius: 16px;\n      padding: 15px;\n      text-align: center;\n    }\n\n    .summary-label {\n      color: var(--muted);\n      font-size: 13px;\n      font-weight: 700;\n      margin-bottom: 6px;\n    }\n\n    .summary-value {\n      color: var(--na-blue);\n      font-size: 25px;\n      font-weight: 850;\n    }\n\n    .table-wrap {\n      overflow-x: auto;\n      border-radius: 16px;\n      border: 1px solid var(--border);\n      margin-top: 14px;\n    }\n\n    table {\n      width: 100%;\n      border-collapse: collapse;\n      background: white;\n      table-layout: fixed;\n    }\n\n    th, td {\n      padding: 12px;\n      text-align: left;\n      border-bottom: 1px solid var(--border);\n      font-size: 15px;\n    }\n\n    th {\n      background: #f4f7fb;\n      font-weight: 800;\n      color: var(--text);\n    }\n\n    tr:last-child td { border-bottom: none; }\n\n    th:first-child,\n    td:first-child {\n      width: auto;\n      word-break: break-word;\n    }\n\n    th:last-child,\n    td:last-child {\n      width: 76px;\n      text-align: center;\n      font-weight: 800;\n      white-space: nowrap;\n    }\n\n    \n    .message {\n      display: none;\n      margin-top: 14px;\n      padding: 13px;\n      border-radius: 14px;\n      font-size: 15px;\n      line-height: 1.35;\n    }\n\n    .message.error {\n      display: block;\n      background: #fff1f2;\n      color: #9f1239;\n      border: 1px solid #fecdd3;\n    }\n\n    .back-button {\n      display: block;\n      width: 100%;\n      text-align: center;\n      text-decoration: none;\n      background: #64748b;\n      color: white;\n      padding: 16px 22px;\n      border-radius: 14px;\n      font-size: 17px;\n      font-weight: 750;\n      margin-top: 12px;\n    }\n\n    .footer {\n      text-align: center;\n      color: var(--muted);\n      padding: 0 16px 34px;\n      font-size: 15px;\n    }\n\n    .footer-logo {\n      display: block;\n      width: min(100%, 360px);\n      max-width: 360px;\n      height: auto;\n      margin: 0 auto;\n    }\n\n    @media (max-width: 560px) {\n      .hero { padding-top: 34px; padding-bottom: 68px; }\n      .wrap { margin-top: -38px; padding: 0 12px; }\n      .card { border-radius: 18px; padding: 19px; }\n      .summary-grid { grid-template-columns: 1fr; }\n      select { font-size: 17px; padding: 15px; }\n      th, td { font-size: 14px; padding: 10px 8px; }\n\n      th:last-child,\n      td:last-child {\n        width: 64px;\n      }\n\n      .footer-logo {\n        width: min(88vw, 310px);\n      }\n    }",
  html: "<section class=\"hero\">\n    <h1>Drogfri tid - statistik</h1>\n    <p>Årtal, milstolpar och fördelning av drogfri tid</p>\n  </section>\n\n  <main class=\"wrap\">\n\n    <section class=\"card\">\n      <div class=\"event-display-title\" id=\"selectedEventInfo\">Laddar event...</div>\n      <div id=\"messageBox\" class=\"message\"></div>\n\n      <a href=\"./\" class=\"back-button\">← Till huvudmenyn</a>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-value\" id=\"statsPersonCount\">0 personer</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Total tid</div>\n      <div class=\"stat-value\" id=\"statsTotalYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsTotalDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsTotalNote\">0 dagar totalt</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Medel</div>\n      <div class=\"stat-value\" id=\"statsAverageYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsAverageDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsAverageNote\">0 dagar i genomsnitt</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Längsta tid</div>\n      <div class=\"stat-value\" id=\"statsLongestYears\">0 år</div>\n      <div class=\"stat-detail\" id=\"statsLongestDetail\">(0 dagar)</div>\n      <div class=\"stat-note\" id=\"statsLongestNote\">0 dagar</div>\n    </section>\n\n    <section class=\"stat-card\">\n      <div class=\"stat-title\">Kortaste tid</div>\n      <div class=\"stat-value\" id=\"statsShortestYears\">0 dagar</div>\n      <div class=\"stat-detail\" id=\"statsShortestDetail\"></div>\n      <div class=\"stat-note\" id=\"statsShortestNote\">0 dagar</div>\n    </section>\n\n    <section class=\"card\">\n      <h2>Milstolpar idag</h2>\n      <p class=\"helper-text\">\n        Antal personer som exakt idag har uppnått en viss drogfri tid.\n        Månader och år räknas som riktiga kalenderdatum. (Kan vara till hjälp vid tex countdown)\n      </p>\n      <div class=\"table-wrap\">\n        <table>\n          <thead>\n            <tr>\n              <th>Milstolpe</th>\n              <th>Antal</th>\n            </tr>\n          </thead>\n          <tbody id=\"milestoneTableBody\">\n            <tr><td colspan=\"2\">Välj ett event.</td></tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n\n    <section class=\"card\">\n      <h2>Fördelning efter drogfri tid</h2>\n      <p class=\"helper-text\">Antal personer grupperat efter varje tidsintervall.</p>\n      <div class=\"table-wrap\">\n        <table>\n          <thead>\n            <tr>\n              <th>Drogfri tid</th>\n              <th>Antal</th>\n            </tr>\n          </thead>\n          <tbody id=\"rangeTableBody\">\n            <tr><td colspan=\"2\">Välj ett event.</td></tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n\n\n\n<section class=\"card\">\n      <h2>Årtal för drogfrihet</h2>\n      <p class=\"helper-text\">Antal personer grupperat efter vilket år de blev drogfria.</p>\n      <div class=\"table-wrap\">\n        <table>\n          <thead>\n            <tr>\n              <th>Årtal</th>\n              <th>Antal</th>\n            </tr>\n          </thead>\n          <tbody id=\"yearTableBody\">\n            <tr><td colspan=\"2\">Välj ett event.</td></tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n\n    <section class=\"card\">\n      <h2>Hur räknas tiden?</h2>\n      <p class=\"helper-text\">\n        Drogfri tid räknas i databasen utifrån registrerat datum fram till dagens datum.\n        Sidan hämtar färdigräknad statistik från databasen och visar antal dagar,\n        antal personer, total tid, medelvärde, längsta tid och kortaste tid.\n        I statistikrutorna räknas år som 365,25 dagar och en månad som cirka 30,44 dagar.\n      </p>\n    </section>\n\n  </main>\n\n  <div class=\"service-credit service-credit-statistics\">Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.</div>\n<footer class=\"footer\">\n    <img\n      src=\"/assets/na-logo.png\"\n      alt=\"Narcotics Anonymous, Anonyma Narkomaner\"\n      class=\"footer-logo\"\n    >\n  </footer>",
  init: function initStatisticsPage() {
    const SUPABASE_URL = "https://kycekthmuiqcqegpqugi.supabase.co";
        const SUPABASE_KEY = "sb_publishable_6ciJsZubiknj8wjbVzb2HQ_q1TJscdo";
    
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
        const selectedEventInfo = document.getElementById("selectedEventInfo");
        const messageBox = document.getElementById("messageBox");
        const yearTableBody = document.getElementById("yearTableBody");
        const rangeTableBody = document.getElementById("rangeTableBody");
        const milestoneTableBody = document.getElementById("milestoneTableBody");
    
        let events = [];
        let selectedEventId = "";
        let selectedEvent = null;
    
        function showError(text) {
          messageBox.textContent = text;
          messageBox.className = "message error";
        }
    
        function clearError() {
          messageBox.textContent = "";
          messageBox.className = "message";
        }
    
        function daysBetween(cleanDate) {
          const selectedDate = new Date(cleanDate + "T00:00:00");
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          return Math.floor((today - selectedDate) / 86400000);
        }
    
        function pluralize(value, singular, plural) {
          return value === 1 ? singular : plural;
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
    
        function updateTopStatsFromSummary(row) {
          if (!row || Number(row.person_count || 0) === 0) {
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
    
    
        function updateSelectedEventInfo() {
          selectedEvent = events.find(event => event.id === selectedEventId) || null;
    
          if (!selectedEvent) {
            selectedEventInfo.innerText = "EVENT SAKNAS";
            return;
          }
    
          selectedEventInfo.innerText = selectedEvent.name;
        }
    
        async function loadEvents() {
          const { data, error } = await supabaseClient
            .from("events")
            .select("id,name,slug,is_active")
            .eq("is_active", true)
            .order("name", { ascending: true });
    
          if (error) {
            selectedEventInfo.innerText = "EVENT KUNDE INTE HÄMTAS";
            showError("Kunde inte hämta event: " + error.message);
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
    
          if (selectedEventId) {
            await loadStatistics();
          } else {
            resetStatistics();
          }
        }
    
        function addMonths(date, months) {
          const result = new Date(date.getTime());
          const originalDay = result.getDate();
    
          result.setMonth(result.getMonth() + months);
    
          // Hantera datum som 31 januari + 1 månad, där JS annars kan hoppa in i mars.
          if (result.getDate() < originalDay) {
            result.setDate(0);
          }
    
          return result;
        }
    
        function addYears(date, years) {
          const result = new Date(date.getTime());
          result.setFullYear(result.getFullYear() + years);
          return result;
        }
    
        function cleanDateToLocalDate(cleanDate) {
          return new Date(cleanDate + "T00:00:00");
        }
    
        function todayLocalDate() {
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
    
        function formatDateKey(date) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return year + "-" + month + "-" + day;
        }
    
        function isSameLocalDate(first, second) {
          return formatDateKey(first) === formatDateKey(second);
        }
    
        function getExactMilestonesToday(entries) {
          const today = todayLocalDate();
    
          const milestones = [];
    
          for (let day = 0; day <= 30; day++) {
            milestones.push({
              label: day + " " + pluralize(day, "dag", "dagar"),
              type: "days",
              value: day,
              sortOrder: day
            });
          }
    
          milestones.push(
            { label: "60 dagar", type: "days", value: 60, sortOrder: 60 },
            { label: "90 dagar", type: "days", value: 90, sortOrder: 90 },
            { label: "6 månader", type: "months", value: 6, sortOrder: 180 },
            { label: "9 månader", type: "months", value: 9, sortOrder: 270 },
            { label: "1 år", type: "years", value: 1, sortOrder: 365 },
            { label: "18 månader", type: "months", value: 18, sortOrder: 545 }
          );
    
          const maxYears = Math.max(
            2,
            ...entries.map(entry => fullYearsSince(entry.clean_date, today))
          );
    
          for (let year = 2; year <= maxYears; year++) {
            milestones.push({
              label: year + " år",
              type: "years",
              value: year,
              sortOrder: 1000 + year
            });
          }
    
          return milestones.map(milestone => {
            const count = entries.filter(entry => {
              const start = cleanDateToLocalDate(entry.clean_date);
    
              if (milestone.type === "days") {
                return daysBetween(entry.clean_date) === milestone.value;
              }
    
              if (milestone.type === "months") {
                return isSameLocalDate(addMonths(start, milestone.value), today);
              }
    
              if (milestone.type === "years") {
                return isSameLocalDate(addYears(start, milestone.value), today);
              }
    
              return false;
            }).length;
    
            return {
              label: milestone.label,
              count,
              sortOrder: milestone.sortOrder
            };
          }).filter(row => row.count > 0)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        }
    
        function fullYearsSince(cleanDate, today) {
          const start = cleanDateToLocalDate(cleanDate);
          let years = today.getFullYear() - start.getFullYear();
    
          const anniversary = addYears(start, years);
    
          if (today < anniversary) {
            years--;
          }
    
          return Math.max(0, years);
        }
    
        function getExactRangeLabel(cleanDate) {
          const start = cleanDateToLocalDate(cleanDate);
          const today = todayLocalDate();
          const days = daysBetween(cleanDate);
    
          if (days <= 29) return "Mindre än 30 dagar";
          if (days <= 59) return "30 dagar";
          if (days <= 89) return "60 dagar";
    
          const sixMonths = addMonths(start, 6);
          const nineMonths = addMonths(start, 9);
          const oneYear = addYears(start, 1);
          const eighteenMonths = addMonths(start, 18);
          const twoYears = addYears(start, 2);
    
          if (today < sixMonths) return "90 dagar";
          if (today < nineMonths) return "6 månader";
          if (today < oneYear) return "9 månader";
          if (today < eighteenMonths) return "1 år";
          if (today < twoYears) return "18 månader";
    
          const years = fullYearsSince(cleanDate, today);
          return years + " år";
        }
    
        function getRangeSortOrder(label) {
          const fixedOrder = {
            "Mindre än 30 dagar": 1,
            "30 dagar": 2,
            "60 dagar": 3,
            "90 dagar": 4,
            "6 månader": 5,
            "9 månader": 6,
            "1 år": 7,
            "18 månader": 8
          };
    
          if (fixedOrder[label]) {
            return fixedOrder[label];
          }
    
          const yearMatch = label.match(/^(\d+) år$/);
          if (yearMatch) {
            return 1000 + Number(yearMatch[1]);
          }
    
          return 9999;
        }
    
        function groupByCleanYear(entries) {
          const map = new Map();
    
          entries.forEach(entry => {
            const year = String(entry.clean_date || "").substring(0, 4);
            if (!year || year.length !== 4) return;
            map.set(year, (map.get(year) || 0) + 1);
          });
    
          return Array.from(map.entries())
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => Number(a.year) - Number(b.year));
        }
    
        function groupByRanges(entries) {
          const map = new Map();
    
          entries.forEach(entry => {
            const label = getExactRangeLabel(entry.clean_date);
            map.set(label, (map.get(label) || 0) + 1);
          });
    
          return Array.from(map.entries())
            .map(([label, count]) => ({
              label,
              count,
              sortOrder: getRangeSortOrder(label)
            }))
            .sort((a, b) => a.sortOrder - b.sortOrder);
        }
    
        function renderRows(target, rows, labelKey, emptyText) {
          if (!rows.length) {
            target.innerHTML = `<tr><td colspan="2">${emptyText}</td></tr>`;
            return;
          }
    
          target.innerHTML = rows.map(row => `
              <tr>
                <td>${row[labelKey]}</td>
                <td>${row.count}</td>
              </tr>
          `).join("");
        }
    
        function resetStatistics() {
          resetTopStats();
          yearTableBody.innerHTML = '<tr><td colspan="2">Välj ett event.</td></tr>';
          rangeTableBody.innerHTML = '<tr><td colspan="2">Välj ett event.</td></tr>';
          milestoneTableBody.innerHTML = '<tr><td colspan="2">Välj ett event.</td></tr>';
        }
    
        async function loadStatistics() {
          clearError();
    
          if (!selectedEventId) {
            resetStatistics();
            return;
          }
    
          yearTableBody.innerHTML = '<tr><td colspan="2">Laddar...</td></tr>';
          rangeTableBody.innerHTML = '<tr><td colspan="2">Laddar...</td></tr>';
          milestoneTableBody.innerHTML = '<tr><td colspan="2">Laddar...</td></tr>';
    
          const { data: summaryData, error: summaryError } = await supabaseClient
            .from("clean_time_summary_by_event")
            .select("person_count,total_days,average_days,longest_days,shortest_days")
            .eq("event_id", selectedEventId)
            .limit(1);
    
          if (summaryError) {
            showError("Kunde inte hämta sammanfattning: " + summaryError.message);
            resetTopStats();
          } else {
            const summaryRow = summaryData && summaryData.length > 0 ? summaryData[0] : null;
            updateTopStatsFromSummary(summaryRow);
          }
    
          const { data, error } = await supabaseClient
            .from("clean_time_entries")
            .select("id, clean_date, event_id, is_active")
            .eq("event_id", selectedEventId)
            .eq("is_active", true)
            .order("clean_date", { ascending: true });
    
          if (error) {
            showError("Kunde inte hämta statistik: " + error.message);
            yearTableBody.innerHTML = '<tr><td colspan="2">Kunde inte hämta statistik.</td></tr>';
            rangeTableBody.innerHTML = '<tr><td colspan="2">Kunde inte hämta statistik.</td></tr>';
            milestoneTableBody.innerHTML = '<tr><td colspan="2">Kunde inte hämta statistik.</td></tr>';
            return;
          }
    
          const entries = data || [];
          const byYear = groupByCleanYear(entries);
          const byRange = groupByRanges(entries);
          const milestonesToday = getExactMilestonesToday(entries);
    
          renderRows(milestoneTableBody, milestonesToday, "label", "Inga milstolpar idag.");
          renderRows(yearTableBody, byYear, "year", "Inga registreringar finns.");
          renderRows(rangeTableBody, byRange, "label", "Inga registreringar finns.");
        }
    
        loadEvents();
  }
});
