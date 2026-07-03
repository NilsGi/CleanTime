function getFilteredPhysicalMeetingsForExport(){
  const seen = new Set();

  return filteredMeetings()
    .filter(m => !isOnline(m))
    .filter(m => {
      const key = meetingUniqueKey(m);

      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort(compareMeetingsByDayTime);
}

function meetingExportAddress(m){
  if (isOnline(m)) {
    const url = m.onlineMeeting?.url || "Online";
    return [url];
  }
  const locationText = String(m.location || "").trim();
  const addressText = [m.address, m.zip]
    .map(value => String(value || "").trim())
    .filter(Boolean)
    .join(", ");
  return [locationText, addressText].filter(Boolean);
}

function formatMeetingTimeForPdf(m){
  const start = (m.startTime || "").slice(0,5);
  const end = (m.endTime || "").slice(0,5);
  return start && end ? start + "–" + end : (start || end || "");
}

async function exportFolderPdf(){
  if (!allMeetings.length) {
    setStatus('<span class="bad">Inga möten hämtade ännu.</span>');
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    setStatus('<span class="bad">PDF-biblioteket kunde inte laddas.</span>');
    return;
  }

  const sortedMeetings = getFilteredPhysicalMeetingsForExport();

  if (sortedMeetings.length > 80) {
    alert("Folderexporten stödjer max 80 fysiska möten i valda filter. Begränsa urvalet och försök igen.");
    return;
  }

  const doc = new window.jspdf.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const blue = [10, 25, 129];
  const panelW = pageWidth / 3;
  const margin = 8;
  const exportDate = new Date().toISOString().slice(0,10);
  const exportMonthYear = formatExportMonthYear(new Date());
  const siteUrl = "https://www.nasverige.org";
  const serviceCreditText = "Denna lista är skapad från ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. NA® och NA-logotyper används inom NA:s servicestruktur.";
  const qrDataUrl = await makeQrDataUrl(siteUrl);
  const logo = await loadImageAsDataUrl("/assets/NA_logo_blue.png");

  function setBlue(){ doc.setTextColor(...blue); }
  function setBlack(){ doc.setTextColor(20,20,20); }
  function panelBorder(){
    doc.setDrawColor(185, 196, 220);
    doc.setLineWidth(0.25);
    doc.line(panelW, 0, panelW, pageHeight);
    doc.line(panelW*2, 0, panelW*2, pageHeight);
  }

  // Sida 1: utsida. Vänster = info, mitten = baksida, höger = framsida.
  doc.setFillColor(255,255,255);
  doc.rect(0,0,pageWidth,pageHeight,"F");
  panelBorder();

  // Vänster panel
  let x = margin;
  let y = 16;
  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Vad är Anonyma Narkomaners program?", x, y);
  y += 8;
  setBlack();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.2);
  const programText = "Anonyma Narkomaner är ett program för tillfrisknande från beroendesjukdomen. Det här programmet är för vilken beroende som helst som vill sluta använda droger.\n\nI Anonyma Narkomaner tror vi att vi kan hjälpa varandra att förbli drogfria genom att använda enkla riktlinjer. NA:s tolv steg och tolv traditioner är våra riktlinjer: de innehåller de principer som vi baserar vårt tillfrisknande på.\n\nEftersom vi tror att beroende bäst kan hjälpa andra beroende, har Anonyma Narkomaner inga professionella behandlare eller terapeuter. Medlemskap är kostnadsfritt. NA-möten – där beroende delar med sig av sin erfarenhet, styrka och hopp – hålls vanligen regelbundet. Detta är ett av våra sätt att stödja varandra i tillfrisknandet.";
  y = drawWrappedText(doc, programText, x, y, panelW - margin*2, 4.5);
  y += 2;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("(Från IP #17 - För dem som är på behandling)", x, y);
  y += 8;
  doc.setDrawColor(...blue);
  doc.setLineWidth(0.4);
  doc.line(x, y, panelW - margin, y);
  y += 5;
  try { doc.addImage(qrDataUrl, "PNG", x, y, 26, 26); } catch(e) {}
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  setBlack();
  doc.text("För den senaste mötesinformationen,", x + 34, y + 7);
  doc.text("skanna QR-koden eller besök:", x + 34, y + 12);
  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("www.nasverige.org", x + 34, y + 20);

  setBlack();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  drawWrappedText(doc, serviceCreditText, margin, pageHeight - 24, panelW - margin*2, 3.2);

  // Mitten panel
  x = panelW + margin;
  y = 22;
  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Här är telefonnummer till dina nya vänner:", x, y);
  y += 12;
  doc.setFontSize(10);
  doc.setDrawColor(150,150,150);
  doc.setLineWidth(0.25);
  for (let i=1; i<=15; i++) {
    doc.line(x, y + 0.5, panelW*2 - margin, y + 0.5);
    y += 10;
  }

  // Höger panel = framsida
  x = panelW*2 + margin;
  y = 14;
  if (logo) {
    const logoW = 38;
    const logoH = logoW * logo.height / logo.width;
    doc.addImage(logo.dataUrl, "PNG", x + (panelW - margin*2 - logoW)/2, y, logoW, logoH);
    y += logoH + 10;
  } else {
    setBlue();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(34);
    doc.text("NA", x + 30, y + 20);
    y += 38;
  }
  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(25);
  doc.text("MÖTESLISTA", x + (panelW - margin*2)/2, y, { align:"center" });
  y += 10;
  y += 4;
  doc.setFontSize(13);
  doc.text("Anonyma Narkomaner", x + (panelW - margin*2)/2, y, { align:"center" });
  y += 4;
  doc.setDrawColor(...blue);
  doc.line(x + 12, y, x + panelW - margin*2 - 12, y);
  y += 11;
  doc.setFontSize(12);
  doc.text("Hjälptelefon", x + (panelW - margin*2)/2, y, { align:"center" });
  y += 9;
  doc.setFontSize(20);
  doc.text("0771-13 80 00", x + (panelW - margin*2)/2, y, { align:"center" });
  y += 10;
  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text(exportMonthYear, x + (panelW - margin*2)/2, y + 11, { align:"center" });

  setBlue();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("www.nasverige.org", x + (panelW - margin*2)/2, pageHeight - 28, { align:"center" });

  setBlack();
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.text("Uppgifterna kan ha ändrats sedan utskrift.", x + (panelW - margin*2)/2, pageHeight - 12, { align:"center" });

  // Sida 2: insida. A4 stående med dynamiska kolumner.
  // Kolumnerna balanseras efter uppskattad höjd. Veckodagar hålls ihop när det går,
  // men kan brytas och fortsätta i nästa kolumn om det krävs.
  doc.addPage("a4", "portrait");

  const innerPageWidth = doc.internal.pageSize.getWidth();
  const innerPageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(255,255,255);
  doc.rect(0,0,innerPageWidth,innerPageHeight,"F");


  const meetingCountForLayout = sortedMeetings.length;
  const cols = meetingCountForLayout <= 13 ? 1 : meetingCountForLayout <= 45 ? 2 : 3;
  const gap = cols === 1 ? 0 : 3.5;
  const innerMargin = cols === 1 ? 12 : 6;
  const colW = (innerPageWidth - innerMargin*2 - gap*(cols-1)) / cols;
  const topY = 17;
  const bottomY = innerPageHeight - 5.5;

  function makeLayoutStyle(scale){
    const base =
      cols === 1
        ? { day: 12.2, time: 9.2, title: 9.2, body: 8.2, type: 7.7, timeW: 28, maxTitle: 3, maxAddr: 5, maxType: 3 }
        : cols === 2
          ? { day: 11.0, time: 8.15, title: 8.15, body: 7.35, type: 6.8, timeW: 20, maxTitle: 3, maxAddr: 4, maxType: 5 }
          : { day: 9.4, time: 6.65, title: 6.65, body: 6.05, type: 5.35, timeW: 15.3, maxTitle: 2, maxAddr: 3, maxType: 6 };

    const s = Math.max(0.48, scale);
    return {
      day: base.day * s,
      dayH: base.day * s * 0.56,
      time: base.time * s,
      title: base.title * s,
      body: base.body * s,
      type: base.type * s,
      rowH: base.body * s * (cols === 3 && meetingCountForLayout > 70 ? 0.43 : 0.46),
      titleH: base.title * s * (cols === 3 && meetingCountForLayout > 70 ? 0.46 : 0.48),
      typeH: base.type * s * (cols === 3 && meetingCountForLayout > 70 ? 0.39 : 0.44),
      gap: cols === 1 ? 1.15 * s : cols === 2 ? 0.82 * s : (meetingCountForLayout > 70 ? 0.44 * s : 0.55 * s),
      dayGapBefore: cols === 3 && meetingCountForLayout > 70 ? 0.9 * s : 1.25 * s,
      timeW: base.timeW * Math.max(0.86, Math.min(1.08, s)),
      maxTitle: base.maxTitle,
      maxAddr: base.maxAddr,
      maxType: base.maxType
    };
  }

  function addColumnGuides(){
    if (cols <= 1) return;
    doc.setDrawColor(190, 205, 235);
    doc.setLineWidth(0.25);
    for (let i=1; i<cols; i++) {
      const lx = innerMargin + i*colW + (i-0.5)*gap;
      doc.line(lx, topY-4, lx, bottomY+2);
    }
  }

  addColumnGuides();

  setBlack();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.8);
  const filterHeaderText = getFilterLabelText()
    .map(([label, value]) => label + ": " + value)
    .join("  ·  ");
  const filterMetaText =
    "Antal möten: " + sortedMeetings.length +
    "  ·  Exportdatum: " + exportDate;
  const filterHeaderRows = doc.splitTextToSize(
    "Valda filter: " + filterHeaderText + "  ·  " + filterMetaText,
    innerPageWidth - innerMargin*2
  );
  let filterY = 7.8;
  filterHeaderRows.slice(0,2).forEach(row => {
    doc.text(row, innerMargin, filterY);
    filterY += 2.35;
  });
  const firstContentY = Math.max(topY, filterY + 1);
  const availableHeight = bottomY - firstContentY;

  function buildMeetingBlockWithStyle(m, layoutStyle){
    const day = cleanDay(m.days).toUpperCase();
    const addressParts = meetingExportAddress(m);
    const time = formatMeetingTimeForPdf(m);
    const title = String(m.title || "Okänt möte");
    const types = getTypes(m).filter(Boolean);
    const typeText = types.filter(t => t !== "Virtuellt möte").join(", ");
    const typeShort = isOnline(m) ? "Online" : typeText;
    const textWidth = colW - layoutStyle.timeW;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(layoutStyle.title);
    let titleRows = doc.splitTextToSize(title, textWidth).slice(0, layoutStyle.maxTitle);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(layoutStyle.body);
    let rowsForAddress = [];
    addressParts.forEach(part => {
      rowsForAddress.push(...doc.splitTextToSize(part, textWidth));
    });
    rowsForAddress = rowsForAddress.slice(0, layoutStyle.maxAddr);

    doc.setFontSize(layoutStyle.type);
    const rowsForType = typeShort ? doc.splitTextToSize(typeShort, textWidth).slice(0, layoutStyle.maxType) : [];

    const height =
      Math.max(layoutStyle.rowH, titleRows.length * layoutStyle.titleH) +
      rowsForAddress.length * layoutStyle.rowH +
      rowsForType.length * layoutStyle.typeH +
      layoutStyle.gap;

    return { day, time, titleRows, rowsForAddress, rowsForType, height };
  }

  function makeLayout(layoutStyle){
    const blocks = sortedMeetings.map(m => buildMeetingBlockWithStyle(m, layoutStyle));
    const dayGroups = [];
    blocks.forEach(block => {
      const last = dayGroups[dayGroups.length - 1];
      if (!last || last.day !== block.day) dayGroups.push({ day: block.day, blocks: [] });
      dayGroups[dayGroups.length - 1].blocks.push(block);
    });

    const columns = Array.from({ length: cols }, () => []);
    let layoutCol = 0;
    let currentHeight = 0;
    let failed = false;

    const totalContentHeight = dayGroups.reduce((sum, group) => {
      return sum + layoutStyle.dayH +
        group.blocks.reduce((s, block) => s + block.height, 0);
    }, 0);

    const targetHeight = cols > 1
      ? Math.min(availableHeight, totalContentHeight / cols)
      : availableHeight;

    function moveToNextColumn(){
      if (layoutCol < cols - 1) {
        layoutCol++;
        currentHeight = 0;
        return true;
      }
      failed = true;
      return false;
    }

    function pushDayHeading(day, continued = false){
      let gapBefore = currentHeight > 0 ? layoutStyle.dayGapBefore : 0;
      if (currentHeight + gapBefore + layoutStyle.dayH > availableHeight) {
        if (!moveToNextColumn()) return false;
        gapBefore = 0;
      }
      columns[layoutCol].push({ type: "day", day, continued, gapBefore });
      currentHeight += gapBefore + layoutStyle.dayH;
      return true;
    }

    dayGroups.forEach((group, groupIndex) => {
      if (failed) return;

      const groupHeight = layoutStyle.dayH +
        group.blocks.reduce((sum, block) => sum + block.height, 0);

      const groupsLeft = dayGroups.length - groupIndex;
      const colsLeft = cols - layoutCol - 1;

      const ignoreDayBalancing = meetingCountForLayout > 70;

      const shouldBalance =
        !ignoreDayBalancing &&
        cols > 1 &&
        layoutCol < cols - 1 &&
        currentHeight > 0 &&
        groupsLeft > colsLeft &&
        (
          currentHeight >= targetHeight * 0.98 ||
          currentHeight + groupHeight > targetHeight * 1.18
        );

      if (
        shouldBalance ||
        (!ignoreDayBalancing &&
         layoutCol < cols - 1 &&
         currentHeight > 0 &&
         currentHeight + groupHeight > availableHeight)
      ) {
        moveToNextColumn();
      }

      if (!pushDayHeading(group.day, false)) return;

      group.blocks.forEach(block => {
        if (failed) return;

        if (block.height > availableHeight - layoutStyle.dayH) {
          failed = true;
          return;
        }

        if (currentHeight + block.height > availableHeight) {
          if (!moveToNextColumn()) return;
          if (!pushDayHeading(group.day, true)) return;
        }

        columns[layoutCol].push({ type: "meeting", block });
        currentHeight += block.height;
      });
    });

    const written = columns.reduce((sum, items) => sum + items.filter(item => item.type === "meeting").length, 0);
    return {
      columns,
      fits: !failed && written === sortedMeetings.length,
      written
    };
  }

  let bestLayout = null;
  let layoutStyle = null;

  const maxScale = meetingCountForLayout > 70 ? 1.50 : meetingCountForLayout > 45 ? 1.40 : 1.30;

  for (let scale = maxScale; scale >= 0.48; scale -= 0.02) {
    const candidateStyle = makeLayoutStyle(scale);
    const candidateLayout = makeLayout(candidateStyle);

    if (candidateLayout.fits) {
      layoutStyle = candidateStyle;
      bestLayout = candidateLayout;
      break;
    }
  }

  if (!bestLayout) {
    layoutStyle = makeLayoutStyle(0.48);
    bestLayout = makeLayout(layoutStyle);
  }

  const columns = bestLayout.columns;
  let writtenMeetings = 0;
  columns.forEach((items, columnIndex) => {
    let cx = innerMargin + columnIndex * (colW + gap);
    let cy = firstContentY;

    items.forEach(item => {
      if (item.type === "day") {
        const gapBefore = item.gapBefore || 0;
        if (cy + gapBefore + layoutStyle.dayH > bottomY) return;
        cy += gapBefore;
        setBlue();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(layoutStyle.day);
        doc.text(item.day + (item.continued ? " FORTS." : ""), cx, cy);
        cy += layoutStyle.dayH;
        return;
      }

      const block = item.block;
      if (cy + block.height > bottomY) return;

      setBlack();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(layoutStyle.time);
      doc.text(block.time, cx, cy);

      doc.setFontSize(layoutStyle.title);
      doc.text(block.titleRows[0] || "", cx + layoutStyle.timeW, cy);
      cy += layoutStyle.titleH;

      for (let i=1; i<block.titleRows.length; i++) {
        doc.text(block.titleRows[i], cx + layoutStyle.timeW, cy);
        cy += layoutStyle.titleH;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(layoutStyle.body);
      block.rowsForAddress.forEach(row => {
        doc.text(row, cx + layoutStyle.timeW, cy);
        cy += layoutStyle.rowH;
      });

      if (block.rowsForType.length) {
        doc.setFontSize(layoutStyle.type);
        doc.setTextColor(90,90,90);
        block.rowsForType.forEach(row => {
          doc.text(row, cx + layoutStyle.timeW, cy);
          cy += layoutStyle.typeH;
        });
        setBlack();
      }

      cy += layoutStyle.gap;
      writtenMeetings++;
    });
  });

  if (!sortedMeetings.length) {
    setBlack();
    doc.setFontSize(9);
    doc.text("Inga fysiska möten matchar aktuellt filter.", innerMargin, firstContentY);
  }

  if (writtenMeetings < sortedMeetings.length) {
    const message = "Alla möten fick inte plats i foldern (" + writtenMeetings + " av " + sortedMeetings.length + "). Begränsa urvalet eller justera layouten.";
    setStatus('<span class="bad">' + esc(message) + '</span>');
    alert(message);
    return;
  }

  doc.save("NA Sverige Möteslista " + exportDate + ".pdf");
  setStatus('<span class="ok">Vikbar folder-PDF skapad.</span>');
}
