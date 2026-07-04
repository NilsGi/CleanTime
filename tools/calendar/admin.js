const calendarView = document.getElementById("calendarView");
const adminView = document.getElementById("adminView");
const calendarNav = document.getElementById("calendarNav");
const adminNav = document.getElementById("adminNav");

function showView() {
  const isAdmin = window.location.hash === "#admin";

  calendarView?.classList.toggle("is-hidden", isAdmin);
  adminView?.classList.toggle("is-hidden", !isAdmin);
  calendarNav?.classList.toggle("is-active", !isAdmin);
  adminNav?.classList.toggle("is-active", isAdmin);

  if (isAdmin) {
    window.dispatchEvent(new CustomEvent("calendar-admin-view"));
  }
}

window.addEventListener("hashchange", showView);
showView();
