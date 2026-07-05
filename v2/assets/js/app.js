(function () {
  const APP_VERSION = "20260705-004";

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

  const currentScriptUrl = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  const scriptBase = new URL(".", currentScriptUrl);
  const routeNames = new Set(Object.values(routes));

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
    const routeAliases = new Set(["register", "total", "statistics", "manual", "history", "create", "admin", "changelog"]);
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
    document.body.className = "route-" + name;

    let style = document.getElementById("page-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "page-style";
      document.head.appendChild(style);
    }

    style.textContent = page.style || "";
    app.innerHTML = page.html || "";
    rewriteInternalLinks(app);

    if (typeof page.init === "function") {
      try {
        page.init();
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

    const routeAliases = new Set(["register", "total", "statistics", "manual", "history", "create", "admin", "changelog"]);
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
    const menuButton = event.target.closest && event.target.closest("#registerButton, #totalButton, #manualButton, #statisticsButton, #historyButton, #createButton, #adminButton, #changelogButton");
    if (!menuButton) return;

    const routesById = {
      registerButton: "register",
      totalButton: "total",
      manualButton: "manual",
      statisticsButton: "statistics",
      historyButton: "history",
      createButton: "create",
      adminButton: "admin",
      changelogButton: "changelog"
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
