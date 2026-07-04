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
    menu: "pages/menu.js",
    register: "pages/register.js",
    total: "pages/total.js",
    statistics: "pages/statistics.js",
    manual: "pages/manual.js",
    history: "pages/history.js",
    create: "pages/create.js",
    admin: "pages/admin.js",
    changelog: "pages/changelog.js"
  };

  const scriptBase = new URL(".", document.currentScript.src);
  const routeNames = new Set(Object.values(routes));

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
    if (routes[path]) return routes[path];

    const parts = path.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1] || "";
    return routeNames.has(lastPart) ? lastPart : "menu";
  }

  function getBasePath() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1] || "";

    if (routeNames.has(lastPart) || lastPart === "index.html") {
      parts.pop();
    }

    return "/" + (parts.length ? parts.join("/") + "/" : "");
  }

  function unique(items) {
    return [...new Set(items.filter(Boolean))];
  }

  function resolvePageScripts(src) {
    const basePath = getBasePath();
    return unique([
      new URL(src, scriptBase).href,
      new URL("assets/js/" + src, window.location.origin + basePath).href,
      new URL("/assets/js/" + src, window.location.origin).href
    ]);
  }

  function loadScriptUrl(resolvedSrc) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[data-page-src="${resolvedSrc}"]`);
      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = resolvedSrc;
      script.dataset.pageSrc = resolvedSrc;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        reject(new Error("Kunde inte ladda " + resolvedSrc));
      };
      document.head.appendChild(script);
    });
  }

  async function loadPageDefinition(name, src) {
    const urls = resolvePageScripts(src);
    const errors = [];

    for (const url of urls) {
      try {
        await loadScriptUrl(url);
        if (state.pages[name]) return;
        errors.push("Ingen siddefinition i " + url);
      } catch (error) {
        errors.push(error.message);
      }
    }

    throw new Error(errors.join(" | "));
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
      try {
        page.init();
      } catch (error) {
        console.error(error);
        const warning = document.createElement("div");
        warning.style.cssText = "max-width:760px;margin:16px auto;padding:12px;border:1px solid #fecdd3;border-radius:12px;background:#fff1f2;color:#9f1239;font-family:Segoe UI,Arial,sans-serif";
        warning.textContent = "Sidan laddades, men en funktion kunde inte starta. Kontrollera anslutning och konsolen.";
        app.prepend(warning);
      }
    }
  }

  async function boot() {
    const name = getPageName();
    const file = pageFiles[name] || pageFiles.menu;

    try {
      await loadPageDefinition(name, file);
      renderPage(name);
    } catch (error) {
      const app = document.getElementById("app");
      if (app) {
        app.innerHTML = '<main style="padding:24px;font-family:Segoe UI,Arial,sans-serif"><h1>Clean Time</h1><p>Kunde inte ladda sidan.</p><p style="color:#64748b;font-size:14px">Kontrollera att mappen <code>assets/js/pages</code> ligger bredvid <code>index.html</code>.</p></main>';
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
