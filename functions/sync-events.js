const pageSize = 100;
let page = 1;
let allEvents = [];

while (true) {
  const url =
    "https://cms.nasverige.org/api/events" +
    "?populate=*" +
    `&pagination[page]=${page}` +
    `&pagination[pageSize]=${pageSize}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json"
    }
  });

  const json = await response.json();

  allEvents = allEvents.concat(json.data || []);

  const pagination = json.meta?.pagination;

  if (!pagination || page >= pagination.pageCount) {
    break;
  }

  page++;
}

return Response.json({
  success: true,
  count: allEvents.length,
  events: allEvents
});
