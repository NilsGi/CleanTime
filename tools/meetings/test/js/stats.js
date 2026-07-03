function buildStats(meetings){
  const districtSummary = {};
  const groupSummary = {};
  const uniqueGroupsAll = new Set();

  meetings.forEach(m => {
    const district = m.meetingDistrict?.district || "Okänt distrikt";
    const city = getCity(m) || "Okänd ort";
    const cityKey = normalizeText(city);
    const groupKey = normalizeGroupName(m.title);
    const combinedKey = district + "|||" + cityKey + "|||" + groupKey;

    if (!districtSummary[district]) {
      districtSummary[district] = {district, meetings:0, physical:0, online:0, groups:new Set()};
    }

    districtSummary[district].meetings++;
    if (isOnline(m)) districtSummary[district].online++; else districtSummary[district].physical++;
    districtSummary[district].groups.add(cityKey + "|||" + groupKey);
    uniqueGroupsAll.add(combinedKey);

    if (!groupSummary[combinedKey]) {
      groupSummary[combinedKey] = {district, city, group:displayGroupName(m.title), meetings:0, physical:0, online:0, items:[]};
    }

    groupSummary[combinedKey].meetings++;
    groupSummary[combinedKey].items.push(m);
    if (isOnline(m)) groupSummary[combinedKey].online++; else groupSummary[combinedKey].physical++;
  });

  const districts = Object.values(districtSummary).map(d => ({
    district:d.district, meetings:d.meetings, groups:d.groups.size, physical:d.physical, online:d.online
  })).sort((a,b)=>b.meetings-a.meetings || a.district.localeCompare(b.district,"sv"));

  const groups = Object.values(groupSummary).sort((a,b)=>
    a.district.localeCompare(b.district,"sv") ||
    a.city.localeCompare(b.city,"sv") ||
    b.meetings-a.meetings ||
    a.group.localeCompare(b.group,"sv")
  );

  return {
    totalMeetings: meetings.length,
    totalGroups: uniqueGroupsAll.size,
    totalDistricts: districts.length,
    physical: meetings.filter(m=>!isOnline(m)).length,
    online: meetings.filter(isOnline).length,
    districts, groups
  };
}

function renderStats(meetings){
  const el = $("stats");

  if (!meetings.length) {
    if (el) el.innerHTML = '<p class="muted">Ingen statistik ännu. Hämta möten först.</p>';
    return;
  }

  const stats = buildStats(meetings);
  const cardsHtml = `
    <div class="stats-grid">
      <div class="stat-card"><span>Totalt antal möten</span><b>${stats.totalMeetings}</b></div>
      <div class="stat-card"><span>Fysiska möten</span><b>${stats.physical}</b></div>
      <div class="stat-card"><span>Online-möten</span><b>${stats.online}</b></div>
      <div class="stat-card"><span>Grupper/ort</span><b>${stats.totalGroups}</b></div>
    </div>
  `;

  if (!el) return;

  const districtRows = stats.districts.map(d => `
    <tr><td>${esc(d.district)}</td><td>${d.meetings}</td><td>${d.groups}</td><td>${d.physical}</td><td>${d.online}</td></tr>
  `).join("");

  const groupsByDistrict = {};
  stats.groups.forEach(g => {
    if (!groupsByDistrict[g.district]) groupsByDistrict[g.district] = [];
    groupsByDistrict[g.district].push(g);
  });

  const groupAccordion = Object.keys(groupsByDistrict).sort((a,b)=>a.localeCompare(b,"sv")).map(district => {
    const groups = groupsByDistrict[district];
    const meetingSum = groups.reduce((sum,g)=>sum+g.meetings,0);
    const rows = groups.map(g => `
      <div class="group-row">
        <div>
          <span class="group-name">${esc(g.group)}</span>
          <span class="group-city">${esc(g.city)}</span>
        </div>
        <div class="group-count">${g.meetings} möten</div>
        <div>${g.physical} fysiska</div>
        <div>${g.online} online</div>
      </div>
    `).join("");

    return `
      <details class="accordion-district">
        <summary>${esc(district)} – ${groups.length} grupper, ${meetingSum} möten</summary>
        <div class="accordion-content">
          <div class="group-row header"><div>Grupp / ort</div><div>Möten</div><div>Fysiska</div><div>Online</div></div>
          ${rows}
        </div>
      </details>`;
  }).join("");

  el.innerHTML = `
    ${cardsHtml}
    <h3>Summering per distrikt</h3>
    <table class="stats-table">
      <thead><tr><th>Distrikt</th><th>Möten</th><th>Grupp/ort</th><th>Fysiska</th><th>Online</th></tr></thead>
      <tbody>${districtRows}</tbody>
    </table>
    <h3>Grupper per distrikt</h3>
    <p class="muted">Statistik grupperas på distrikt + ort + gruppnamn.</p>
    ${groupAccordion}
  `;
}
