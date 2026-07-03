const DISTRICT_COLORS = [
  "#1976d2", "#00a6a6", "#6c5ce7", "#2e7d32", "#f57c00",
  "#c2185b", "#455a64", "#00897b", "#5e35b1", "#ef6c00",
  "#0277bd", "#7cb342", "#ad1457", "#546e7a", "#3949ab",
  "#0097a7", "#8e24aa", "#6d4c41", "#1565c0", "#00838f"
];

let districtColorMap = {};

function getMeetingDistrict(m){
  return m.meetingDistrict?.district || "Okänt distrikt";
}

function updateDistrictColorMap(meetings){
  const districts = [...new Set((meetings || []).map(getMeetingDistrict).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, "sv"));

  districtColorMap = {};
  districts.forEach((district, index) => {
    districtColorMap[district] = DISTRICT_COLORS[index % DISTRICT_COLORS.length];
  });
}

function getDistrictColor(district){
  if (!districtColorMap[district]) {
    const index = Object.keys(districtColorMap).length;
    districtColorMap[district] = DISTRICT_COLORS[index % DISTRICT_COLORS.length];
  }
  return districtColorMap[district];
}

function meetingPrimaryKey(m){
  if (m.documentId) return "documentId:" + String(m.documentId);
  if (m.id !== undefined && m.id !== null) return "id:" + String(m.id);
  return [m.title,m.days,m.startTime,m.endTime,m.address,m.zip].map(normalizeText).join("|");
}

function compareMeetingsByDayTime(a,b){
  return dayOrder(a.days) - dayOrder(b.days)
    || timeValue(a.startTime) - timeValue(b.startTime)
    || timeValue(a.endTime) - timeValue(b.endTime)
    || String(a.title || "").localeCompare(String(b.title || ""), "sv")
    || String(getCity(a) || "").localeCompare(String(getCity(b) || ""), "sv");
}

function compareGroupsByDayTime(a,b){
  const meetingsA = [...(a.meetings || [])].sort(compareMeetingsByDayTime);
  const meetingsB = [...(b.meetings || [])].sort(compareMeetingsByDayTime);
  const firstA = meetingsA[0] || {};
  const firstB = meetingsB[0] || {};

  return dayOrder(firstA.days) - dayOrder(firstB.days)
    || timeValue(firstA.startTime) - timeValue(firstB.startTime)
    || String(a.title || "").localeCompare(String(b.title || ""), "sv")
    || String(a.city || "").localeCompare(String(b.city || ""), "sv");
}

function normalizeGroupName(name){ return String(name || "Okänd grupp").trim().replace(/\s+/g, " ").toLowerCase(); }

function displayGroupName(name){ return String(name || "Okänd grupp").trim().replace(/\s+/g, " "); }

function getCities(m){
  const raw = (m.meetingCity || []).map(c => c.city).filter(Boolean);
  const cities = raw.flatMap(city => String(city).split(",")).map(city => city.trim()).filter(Boolean);
  return [...new Set(cities)].sort((a,b)=>a.localeCompare(b,"sv"));
}

function getCity(m){ return getCities(m).join(", "); }

function getTypes(m){ return (m.meetingTypes||[]).map(t=>t.title); }

function isOnline(m){ return getTypes(m).includes("Virtuellt möte") || !!m.onlineMeeting; }

function hasCoords(m){ return m.latitude !== null && m.longitude !== null && !isNaN(Number(m.latitude)) && !isNaN(Number(m.longitude)); }

function meetingText(m){
  return [
    m.title,
    getCity(m),
    getMeetingDistrict(m),
    m.location,
    m.address,
    m.zip,
    m.station,
    m.information,
    getTypes(m).join(" ")
  ].join(" ").toLowerCase();
}

function groupMeetingsForDisplay(meetings){
  const groups = {};
  const selectedCities = selectedValues("cityFilter");

  meetings.forEach(m => {
    const district = getMeetingDistrict(m);
    const cities = getCities(m);
    const cityList = cities.length ? [cities.join(", ")] : ["Okänd ort"];

    if (selectedCities.length && !cities.some(city => selectedCities.includes(city))) return;

    cityList.forEach(city => {
      const cityKey = normalizeText(city);
      const groupKey = normalizeGroupName(m.title);
      const key = district + "|||" + cityKey + "|||" + groupKey;

      if (!groups[key]) {
        groups[key] = {
          key, district, city,
          color: getDistrictColor(district),
          title: displayGroupName(m.title),
          meetings: [],
          latitude: null,
          longitude: null,
          isOnlineOnly: true,
          distance: null
        };
      }

      groups[key].meetings.push(m);
      if (!isOnline(m)) groups[key].isOnlineOnly = false;

      if (groups[key].latitude === null && hasCoords(m)) {
        groups[key].latitude = Number(m.latitude);
        groups[key].longitude = Number(m.longitude);
      }
    });
  });

  const result = Object.values(groups).map(g => {
    g.meetings.sort(compareMeetingsByDayTime);
    if (userPosition && groupHasCoords(g)) {
      g.distance = haversine(userPosition.lat, userPosition.lng, g.latitude, g.longitude);
    }
    return g;
  });

  if (userPosition) result.sort((a,b)=>(a.distance ?? Infinity) - (b.distance ?? Infinity));
  else result.sort(compareGroupsByDayTime);

  return result;
}

function groupHasCoords(g){ return g.latitude !== null && g.longitude !== null && !isNaN(g.latitude) && !isNaN(g.longitude); }

function groupMatchesMap(g){ return !g.isOnlineOnly && groupHasCoords(g); }

function meetingUniqueKey(m){
  return meetingPrimaryKey(m);
}

function distanceToMeeting(m){
  if (!userPosition || !hasCoords(m)) return null;
  return haversine(userPosition.lat,userPosition.lng,Number(m.latitude),Number(m.longitude));
}
