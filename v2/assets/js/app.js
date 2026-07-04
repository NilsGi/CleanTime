(function () {
  const routes = {
    "": "menu",
    "/": "menu",
    "/index.html": "menu",
    "/register": "register",
    "/total": "total",
    "/statistics": "statistics",
    "/manual": "manual",
    "/history": "history",
    "/create": "create",
    "/admin": "admin",
    "/changelog": "changelog"
  };

  const pageFiles = {
    menu: "/assets/js/pages/menu.js",
    register: "/assets/js/pages/register.js",
    total: "/assets/js/pages/total.js",
    statistics: "/assets/js/pages/statistics.js",
    manual: "/assets/js/pages/manual.js",
    history: "/assets/js/pages/history.js",
    create: "/assets/js/pages/create.js",
    admin: "/assets/js/pages/admin.js",
    changelog: "/assets/js/pages/changelog.js"
  };

  const state = {
    pages: Object.create(null),
    currentPage: null
  };

  window.CleanTime = {
    registerPage(name, definition) {
      state.pages[name] = definition;
    }
  };

  function normalizePath(pathname) {
    let path = pathname.replace(/\/+$/, "");
    if (!path) return "/";
    path = path.replace(/\/index\.html$/i, "");
    return path || "/";
  }

  function getPageName() {
    const path = normalizePath(window.location.pathname);
    return routes[path] || "menu";
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-page-src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.dataset.pageSrc = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Kunde inte ladda " + src));
      document.head.appendChild(script);
    });
  }

  function renderPage(name) {
    const page = state.pages[name];
    const app = document.getElementById("app");

    if (!page || !app) return;

    state.currentPage = name;
    document.title = page.title || "Clean Time";
    document.body.className = "route-" + name;

    let style = document.getElementById("page-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "page-style";
      document.head.appendChild(style);
    }

    style.textContent = page.style || "";
    app.innerHTML = page.html || "";

    if (typeof page.init === "function") {
      page.init();
    }
  }

  async function boot() {
    const name = getPageName();
    const file = pageFiles[name] || pageFiles.menu;

    try {
      await loadScript(file);
      renderPage(name);
    } catch (error) {
      const app = document.getElementById("app");
      if (app) {
        app.innerHTML = '<main style="padding:24px;font-family:Segoe UI,Arial,sans-serif"><h1>Clean Time</h1><p>Kunde inte ladda sidan.</p></main>';
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
