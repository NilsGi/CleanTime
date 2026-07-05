const calendarView = document.getElementById("calendarView");
const adminView = document.getElementById("adminView");
const calendarNav = document.getElementById("calendarNav");
const pastNav = document.getElementById("pastNav");
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

  if (params.get("view") === "admin") return "admin";
  if (params.get("view") === "past") return "past";
  return "calendar";
}

function setView(view, options = {}) {
  const isAdmin = view === "admin";
  const isPast = view === "past";

  if (options.pushState) {
    const url = new URL(window.location.href);
    url.hash = "";

    if (isAdmin) {
      url.searchParams.set("view", "admin");
    } else if (isPast) {
      url.searchParams.set("view", "past");
    } else {
      url.searchParams.delete("view");
    }

    window.history.pushState(null, "", url);
  }

  calendarView?.classList.toggle("is-hidden", isAdmin);
  adminView?.classList.toggle("is-hidden", !isAdmin);
  calendarNav?.classList.toggle("is-active", !isAdmin && !isPast);
  pastNav?.classList.toggle("is-active", isPast);
  adminNav?.classList.toggle("is-active", isAdmin);

  if (isAdmin) {
    window.dispatchEvent(new CustomEvent("calendar-admin-view"));
  } else {
    window.dispatchEvent(new CustomEvent("calendar-mode-change", {
      detail: { mode: isPast ? "past" : "upcoming" }
    }));
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

pastNav?.addEventListener("click", event => {
  event.preventDefault();
  setView("past", { pushState: true });
});

window.addEventListener("hashchange", showView);
window.addEventListener("popstate", showView);
showView();
