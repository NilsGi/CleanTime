const calendarView = document.getElementById("calendarView");
const adminView = document.getElementById("adminView");
const calendarNav = document.getElementById("calendarNav");
const adminNav = document.getElementById("adminNav");

function showView() {
  const params = new URLSearchParams(window.location.search);
  const legacyAdminHash = window.location.hash === "#admin";
  const isAdmin = params.get("view") === "admin" || legacyAdminHash;

  if (legacyAdminHash) {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.set("view", "admin");
    window.history.replaceState(null, "", url);
  }

  calendarView?.classList.toggle("is-hidden", isAdmin);
  adminView?.classList.toggle("is-hidden", !isAdmin);
  calendarNav?.classList.toggle("is-active", !isAdmin);
  adminNav?.classList.toggle("is-active", isAdmin);

  if (isAdmin) {
    window.dispatchEvent(new CustomEvent("calendar-admin-view"));
  }
}

window.addEventListener("hashchange", showView);
window.addEventListener("popstate", showView);
showView();
