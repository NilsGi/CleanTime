(function () {
  const APP_VERSION = "20260707-008";

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
    "/admin": "admin"
  };

  const pageFiles = {
    menu: "pages/menu.js",
    register: "pages/register.js",
    total: "pages/total.js",
    statistics: "pages/statistics.js",
    manual: "pages/manual.js",
    history: "pages/history.js",
    create: "pages/create.js",
    admin: "pages/admin.js"
  };

  const currentScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  const scriptBase = new URL(".", currentScriptUrl);
  const routeNames = new Set(Object.values(routes));
  const SERVICE_CREDIT_TEXTS = {
    sv: 'Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige.<br>Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.',
    en: "This web app is a service tool developed by the Web Committee of NA Region Sweden for Narcotics Anonymous Sweden.<br>Narcotics Anonymous® and NA logos are used within NA's service structure."
  };
  const MEETING_LIST_THEME_CSS = `
body.clean-theme {
  background: #f7f9fc;
  color: #0f172a;
}

body.clean-theme .hero {
  position: relative;
  background: #ffffff;
  color: #1E4F9A;
  text-align: center;
  padding: 24px 16px 30px;
  border-bottom: 1px solid #d8e3f3;
  box-shadow: 0 2px 12px rgba(30, 79, 154, 0.08);
}

body.clean-theme .hero h1,
body.clean-theme .hero .event-title {
  color: #1E4F9A;
  margin: 0 0 8px;
  font-size: clamp(24px, 6vw, 38px);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.16;
  text-transform: uppercase;
}

body.clean-theme .hero p,
body.clean-theme .hero .hero-subtitle,
body.clean-theme .counter-note {
  color: #475569;
  opacity: 1;
}

body.clean-theme .counter {
  color: #1E4F9A;
  font-size: clamp(2rem, 9vw, 4rem);
  letter-spacing: 0;
}

body.clean-theme .language-toggle {
  top: 14px;
  right: 14px;
  background: #ffffff;
  border: 1px solid #c9d8ed;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

body.clean-theme .language-toggle button {
  color: #1E4F9A;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 999px;
}

body.clean-theme .language-toggle button.active,
body.clean-theme .language-toggle button:hover {
  background: #1E4F9A;
  color: #ffffff;
}

body.clean-theme .wrap {
  width: min(640px, calc(100% - 24px));
  margin: 20px auto 42px;
  padding: 0;
}

body.clean-theme .card,
body.clean-theme .stat-card,
body.clean-theme .summary-box,
body.clean-theme .qr-box,
body.clean-theme .preview-flyer,
body.clean-theme .link-row,
body.clean-theme .result-box {
  border-radius: 12px;
  border: 1px solid #d8e3f3;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.06);
}

body.clean-theme .card h2,
body.clean-theme h2,
body.clean-theme .stat-title,
body.clean-theme .stat-value,
body.clean-theme .summary-value,
body.clean-theme .event-display-title,
body.clean-theme .preview-title,
body.clean-theme .qr-title,
body.clean-theme .link-label {
  color: #1E4F9A;
  text-transform: uppercase;
}

body.clean-theme .helper-text,
body.clean-theme .stat-note,
body.clean-theme .created-note {
  color: #475569;
}

body.clean-theme input[type="text"],
body.clean-theme input[type="password"],
body.clean-theme input[type="date"],
body.clean-theme select,
body.clean-theme textarea {
  display: block;
  width: calc(100% - 32px);
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #c9d8ed;
  border-radius: 10px;
  box-shadow: none;
  box-sizing: border-box;
}

body.clean-theme input:focus,
body.clean-theme select:focus,
body.clean-theme textarea:focus {
  outline: 3px solid rgba(30, 79, 154, 0.16);
  border-color: #1E4F9A;
}

body.clean-theme button,
body.clean-theme .nav-button,
body.clean-theme .back-button,
body.clean-theme .secondary-button {
  display: block;
  width: calc(100% - 32px);
  margin-left: auto;
  margin-right: auto;
  background: #ffffff;
  color: #1E4F9A;
  border: 1.5px solid #1E4F9A;
  border-radius: 10px;
  box-shadow: none;
  font-weight: 750;
}

body.clean-theme button:hover,
body.clean-theme .nav-button:hover,
body.clean-theme .back-button:hover,
body.clean-theme .secondary-button:hover,
body.clean-theme button:focus-visible,
body.clean-theme .nav-button:focus-visible,
body.clean-theme .back-button:focus-visible,
body.clean-theme .secondary-button:focus-visible {
  background: #1E4F9A;
  color: #ffffff;
  border-color: #1E4F9A;
  transform: none;
}

body.clean-theme .copy-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  padding: 0;
  margin: 0;
  background: #1E4F9A;
  color: #ffffff;
  border-color: #1E4F9A;
}

body.clean-theme .button-grid,
body.clean-theme .flyer-actions,
body.clean-theme .admin-actions,
body.clean-theme .row-actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

body.clean-theme .copy-icon-button svg {
  stroke: currentColor;
}

body.clean-theme .message,
body.clean-theme .selected-event,
body.clean-theme .selected-info,
body.clean-theme .result-box,
body.clean-theme .link-row,
body.clean-theme .qr-box,
body.clean-theme .preview-flyer,
body.clean-theme .summary-box,
body.clean-theme .dashboard-box,
body.clean-theme .stat-card {
  width: calc(100% - 32px);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

body.clean-theme #manualHistoryList > div > div:last-child {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 0 auto;
}

body.clean-theme #manualHistoryList button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px !important;
  min-width: 44px;
  height: 40px;
  margin: 0 !important;
  padding: 8px 12px !important;
}

body.clean-theme .danger-button,
body.clean-theme button[style*="#b91c1c"],
body.clean-theme button[style*="background:#b91c1c"] {
  color: #b91c1c;
  border-color: #b91c1c;
}

body.clean-theme .danger-button:hover,
body.clean-theme button[style*="#b91c1c"]:hover,
body.clean-theme button[style*="background:#b91c1c"]:hover {
  background: #b91c1c;
  color: #ffffff;
}

body.clean-theme .message.success,
body.clean-theme .selected-event,
body.clean-theme .selected-info,
body.clean-theme .link-row {
  background: #eef5ff;
  border-color: #c9d8ed;
  color: #163D78;
}

body.clean-theme table th {
  background: #eef5ff;
  color: #1E4F9A;
}

body.clean-theme .footer-logo {
  width: min(70vw, 220px);
}

@media (max-width: 560px) {
  body.clean-theme .hero {
    padding: 22px 12px 24px;
  }

  body.clean-theme .hero .language-toggle {
    position: static;
    display: inline-flex;
    width: auto;
    margin: 0 auto 18px;
    transform: none;
  }

  body.clean-theme .hero h1,
  body.clean-theme .hero .event-title {
    margin-top: 0;
  }

  body.clean-theme .wrap {
    margin-top: 14px;
  }
}
`;

  const state = {
    pages: Object.create(null),
    currentPage: null
  };

  window.CleanTime = {
    registerPage(name, definition) {
      state.pages[name] = definition;
    },
    getBasePath() {
      return getBasePath();
    },
    routePath(route, params) {
      const basePath = getBasePath();
      const cleanRoute = String(route || "").replace(/^\/+|\/+$/g, "");
      const queryParams = params instanceof URLSearchParams
        ? new URLSearchParams(params)
        : new URLSearchParams(params || {});
      if (cleanRoute) queryParams.set("page", cleanRoute);
      const query = queryParams.toString();
      return query ? basePath + "?" + query : basePath;
    },
    routeUrl(route, params) {
      return window.location.origin + this.routePath(route, params);
    },
    updateServiceCredit(root) {
      updateServiceCredit(root || document);
    }
  };

  function normalizePath(pathname) {
    let path = pathname.replace(/\/+$/, "");
    if (!path) return "/";
    path = path.replace(/\/index\.html$/i, "");
    return path || "/";
  }

  function getPageName() {
    const pageParam = new URLSearchParams(window.location.search).get("page");
    if (routeNames.has(pageParam)) return pageParam;

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

  function routePath(route, params) {
    return window.CleanTime.routePath(route, params);
  }

  function rewriteInternalLinks(root) {
    const routeAliases = new Set(["register", "total", "statistics", "manual", "history", "create", "admin"]);
    root.querySelectorAll("a[href]").forEach((anchor) => {
      const rawHref = anchor.getAttribute("href");
      if (!rawHref || rawHref === "#" || rawHref.startsWith("#")) return;

      let url;
      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const parts = url.pathname.split("/").filter(Boolean);
      const route = parts[parts.length - 1] || "";

      if (!routeAliases.has(route)) {
        if (url.pathname === "/" || url.pathname.endsWith("/index.html")) {
          anchor.href = routePath("", url.searchParams);
        }
        return;
      }

      url.searchParams.delete("page");
      anchor.href = routePath(route, url.searchParams);
    });
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
    ]).map((url) => {
      const resolved = new URL(url);
      resolved.searchParams.set("v", APP_VERSION);
      return resolved.href;
    });
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
    if (state.pages[name]) return;

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
    const themedPage = name !== "total";
    document.body.className = "route-" + name + (themedPage ? " clean-theme" : "");

    let style = document.getElementById("page-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "page-style";
      document.head.appendChild(style);
    }

    style.textContent = (page.style || "") + (themedPage ? "\n\n" + MEETING_LIST_THEME_CSS : "");
    app.innerHTML = page.html || "";
    if (themedPage) {
      decorateThemedPage(name, app);
    }
    updateServiceCredit(app);
    rewriteInternalLinks(app);

    if (typeof page.init === "function") {
      try {
        page.init();
        updateServiceCredit(app);
        rewriteInternalLinks(app);
      } catch (error) {
        console.error(error);
        const warning = document.createElement("div");
        warning.style.cssText = "max-width:760px;margin:16px auto;padding:12px;border:1px solid #fecdd3;border-radius:12px;background:#fff1f2;color:#9f1239;font-family:Segoe UI,Arial,sans-serif";
        warning.textContent = "Sidan laddades, men en funktion kunde inte starta. Kontrollera anslutning och konsolen.";
        app.prepend(warning);
      }
    }
  }

  function decorateThemedPage(name, root) {
    if (name !== "menu" && name !== "register" && !root.querySelector(".back-button")) {
      const target = root.querySelector(".card") || root.querySelector(".wrap");
      if (target) {
        const backLink = document.createElement("a");
        backLink.className = "back-button theme-back-button";
        backLink.href = "./";
        backLink.textContent = "Till huvudmenyn";
        target.appendChild(backLink);
      }
    }
  }

  function getLanguage() {
    return localStorage.getItem("language") === "en" ? "en" : "sv";
  }

  function updateServiceCredit(root) {
    const scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll(".service-credit").forEach((element) => {
      element.innerHTML = SERVICE_CREDIT_TEXTS[getLanguage()];
    });
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

  document.addEventListener("click", (event) => {
    const languageButton = event.target.closest && event.target.closest("#langSv, #langEn");
    if (languageButton) {
      setTimeout(() => updateServiceCredit(document), 0);
    }
  }, true);

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest && event.target.closest("a[href]");
    if (!anchor) return;

    const rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref === "#" || rawHref.startsWith("#")) return;

    let url;
    try {
      url = new URL(rawHref, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) return;

    const routeAliases = new Set(["register", "total", "statistics", "manual", "history", "create", "admin"]);
    const parts = url.pathname.split("/").filter(Boolean);
    const route = parts[parts.length - 1] || "";

    if (!routeAliases.has(route) && url.pathname !== "/" && !url.pathname.endsWith("/index.html")) return;

    url.searchParams.delete("page");
    const nextPath = routeAliases.has(route) ? routePath(route, url.searchParams) : routePath("", url.searchParams);

    if (nextPath !== url.pathname + url.search) {
      event.preventDefault();
      window.location.href = nextPath;
    }
  });

  document.addEventListener("click", (event) => {
    const menuButton = event.target.closest && event.target.closest("#registerButton, #totalButton, #manualButton, #statisticsButton, #historyButton, #createButton, #adminButton");
    if (!menuButton) return;

    const routesById = {
      registerButton: "register",
      totalButton: "total",
      manualButton: "manual",
      statisticsButton: "statistics",
      historyButton: "history",
      createButton: "create",
      adminButton: "admin"
    };

    const route = routesById[menuButton.id];
    if (!route) return;

    const needsEvent = new Set(["register", "total", "manual", "statistics"]);
    const selectedEvent = document.getElementById("eventSelect")?.value || localStorage.getItem("selectedEventSlug") || "";

    if (needsEvent.has(route) && !selectedEvent) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const targetPath = needsEvent.has(route)
      ? routePath(route, { event: selectedEvent })
      : routePath(route);

    window.location.assign(targetPath);
  }, true);

  document.addEventListener("DOMContentLoaded", boot);
})();
