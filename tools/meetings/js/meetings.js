const DISTRICT_COLORS = [
  "#111111", "#E60000", "#0057D9", "#008A00", "#FF7A00",
  "#7A00CC", "#E6007E", "#00A6B4", "#FFD400", "#7A4A00",
  "#737373", "#A6D800", "#FF5C00", "#00C896", "#2D2A8C"
];

const DISTRICT_COLOR_OVERRIDES = {
  "stockholm": "#111111",
  "gossnad": "#E60000",
  "sidna": "#0057D9",
  "nisna": "#7A00CC",
  "malardalen": "#008A00",
  "mälardalen": "#008A00",
  "skane": "#E6007E",
  "skåne": "#E6007E",
  "vastra gotaland": "#FF7A00",
  "västra götaland": "#FF7A00",
  "norra norrland": "#00A6B4",
  "sodra norrland": "#FFD400",
  "södra norrland": "#FFD400"
};

let districtColorMap = {};

function getMeetingDistrict(m){
  return m.meetingDistrict?.district || "Okänt distrikt";
}

function normalizeDistrictColorKey(district){
  return String(district || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function updateDistrictColorMap(meetings){
  const districts = [...new Set((meetings || []).map(getMeetingDistrict).filter(Boolean))]
    .sort((a,b) => a.localeCompare(b, "sv"));

  districtColorMap = {};
  const usedColors = new Set();
  let fallbackIndex = 0;

  function nextUnusedFallbackColor(){
    for (let i = 0; i < DISTRICT_COLORS.length; i++) {
      const color = DISTRICT_COLORS[(fallbackIndex + i) % DISTRICT_COLORS.length];
      if (!usedColors.has(color)) {
        fallbackIndex = fallbackIndex + i + 1;
        return color;
      }
    }

    const color = DISTRICT_COLORS[fallbackIndex % DISTRICT_COLORS.length];
    fallbackIndex++;
    return color;
  }

  districts.forEach((district, index) => {
    const override = DISTRICT_COLOR_OVERRIDES[normalizeDistrictColorKey(district)];
    if (override) {
      districtColorMap[district] = override;
      usedColors.add(override);
      return;
    }

    const color = nextUnusedFallbackColor();
    districtColorMap[district] = color;
    usedColors.add(color);
  });
}

function getDistrictColor(district){
  if (!districtColorMap[district]) {
    const override = DISTRICT_COLOR_OVERRIDES[normalizeDistrictColorKey(district)];
    if (override) {
      districtColorMap[district] = override;
      return districtColorMap[district];
    }

    const usedColors = new Set(Object.values(districtColorMap));
    const index = Object.keys(districtColorMap).length;
    const color = DISTRICT_COLORS.find(candidate => !usedColors.has(candidate))
      || DISTRICT_COLORS[index % DISTRICT_COLORS.length];
    districtColorMap[district] = color;
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

function getTypes(m){ return (m.meetingTypes||[]).map(t=>t.title); }

function isOnline(m){ return getTypes(m).includes("Virtuellt möte") || !!safeUrl(m.onlineMeeting?.url); }

function getCity(m){
  const city = getCities(m).join(", ");
  return city || (isOnline(m) ? "Online" : "");
}

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
    const cityList = cities.length ? [cities.join(", ")] : [isOnline(m) ? "Online" : "Okänd ort"];

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
