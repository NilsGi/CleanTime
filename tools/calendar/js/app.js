const calendarView = document.getElementById("calendarView");
const adminView = document.getElementById("adminView");
const calendarNav = document.getElementById("calendarNav");
const adminNav = document.getElementById("adminNav");

function getRequestedView() {
  const params = new URLSearchParams(window.location.search);
  const legacyAdminHash = window.location.hash === "#admin";

  if (legacyAdminHash) {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.set("view", "admin");
    window.history.replaceState(null, "", url);
    return "admin";
  }

  return params.get("view") === "admin" ? "admin" : "calendar";
}

function setView(view, options = {}) {
  const isAdmin = view === "admin";

  if (options.pushState) {
    const url = new URL(window.location.href);
    url.hash = "";

    if (isAdmin) {
      url.searchParams.set("view", "admin");
    } else {
      url.searchParams.delete("view");
    }

    window.history.pushState(null, "", url);
  }

  calendarView?.classList.toggle("is-hidden", isAdmin);
  adminView?.classList.toggle("is-hidden", !isAdmin);
  calendarNav?.classList.toggle("is-active", !isAdmin);
  adminNav?.classList.toggle("is-active", isAdmin);

  if (isAdmin) {
    window.dispatchEvent(new CustomEvent("calendar-admin-view"));
  }
}

function showView() {
  setView(getRequestedView());
}

calendarNav?.addEventListener("click", event => {
  event.preventDefault();
  setView("calendar", { pushState: true });
});

adminNav?.addEventListener("click", event => {
  event.preventDefault();
  setView("admin", { pushState: true });
});

window.addEventListener("hashchange", showView);
window.addEventListener("popstate", showView);
showView();
