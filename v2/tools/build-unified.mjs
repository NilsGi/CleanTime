import fs from "node:fs";
import path from "node:path";

const root = path.resolve("/workspace/cleantime-unified");
const cache = path.resolve("/workspace/.cache");

const pages = [
  { name: "menu", src: "01-index-16-.html" },
  { name: "total", src: "02-index-15-.html" },
  { name: "statistics", src: "03-index-14-.html", highlightCredit: true },
  { name: "register", src: "04-index-13-.html" },
  { name: "manual", src: "05-index-12-.html", expose: ["editManualEntry", "deleteManualEntry"] },
  { name: "history", src: "06-index-11-.html" },
  { name: "create", src: "07-index-10-.html" },
  { name: "changelog", src: "08-index-9-.html" },
  { name: "admin", src: "09-index-8-.html", expose: ["saveEdit", "deleteEntry"] }
];

const serviceCredit =
  "Denna webbapp är ett serviceverktyg utvecklat av NA Region Sveriges webbkommitté för Anonyma Narkomaner Sverige. Narcotics Anonymous® och NA-logotyper används inom NA:s servicestruktur.";

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function extractFirst(source, regex, fallback = "") {
  const match = source.match(regex);
  return match ? match[1] : fallback;
}

function extractInlineScripts(source) {
  const scripts = [];
  const regex = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(source))) {
    scripts.push(match[1].trim());
  }
  return scripts.join("\n\n");
}

function normalizeLinks(markup) {
  return markup
    .replaceAll("/register/index.html", "/register/")
    .replaceAll("/total/index.html", "/total/")
    .replaceAll("/manual/index.html", "/manual/")
    .replaceAll("/statistics/index.html", "/statistics/")
    .replaceAll("/history/index.html", "/history/")
    .replaceAll("/create/index.html", "/create/")
    .replaceAll("/admin/index.html", "/admin/")
    .replaceAll("/changelog/index.html", "/changelog/")
    .replaceAll('href="/index.html"', 'href="/"');
}

function injectServiceCredit(markup, highlight = false) {
  const creditMarkup =
    `<div class="service-credit${highlight ? " service-credit-statistics" : ""}">${serviceCredit}</div>`;

  if (markup.includes(serviceCredit)) {
    return markup;
  }

  if (markup.includes("<footer")) {
    return markup.replace(/<footer\b/i, `${creditMarkup}\n<footer`);
  }

  return `${markup}\n${creditMarkup}`;
}

function buildExposeCode(names = []) {
  return names
    .map((name) => `if (typeof ${name} === "function") window.${name} = ${name};`)
    .join("\n");
}

function buildPageFile(page) {
  const source = fs.readFileSync(path.join(cache, page.src), "utf8");
  const title = extractFirst(source, /<title[^>]*>([\s\S]*?)<\/title>/i, "Clean Time").trim();
  const style = extractFirst(source, /<style[^>]*>([\s\S]*?)<\/style>/i).trim();
  const body = extractFirst(source, /<body[^>]*>([\s\S]*?)<\/body>/i)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .trim();
  const scripts = normalizeLinks(extractInlineScripts(source));
  const markup = injectServiceCredit(normalizeLinks(body), page.highlightCredit);
  const exposeCode = buildExposeCode(page.expose);
  const initBody = [scripts, exposeCode].filter(Boolean).join("\n\n");

  return `window.CleanTime.registerPage(${JSON.stringify(page.name)}, {
  title: ${JSON.stringify(title)},
  style: ${JSON.stringify(style)},
  html: ${JSON.stringify(markup)},
  init: function init${page.name[0].toUpperCase()}${page.name.slice(1)}Page() {
${initBody
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
  }
});
`;
}

function writeStaticFiles() {
  fs.writeFileSync(
    path.join(root, "index.html"),
    `<!--
Clean Time
Copyright (c) 2026 N.A. Sverige

All rights reserved.

Koden får inte kopieras, distribueras eller användas
utan skriftligt tillstånd från upphovsmannen.
-->
<!DOCTYPE html>
<html lang="sv">
<head>
  <link rel="icon" type="image/png" href="assets/favicon.png">
  <link rel="apple-touch-icon" href="assets/favicon.png">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clean Time</title>
  <link rel="stylesheet" href="assets/css/app.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="assets/js/app.js" defer></script>
</head>
<body>
  <div id="app" aria-live="polite"></div>
  <noscript>JavaScript behövs för att använda Clean Time.</noscript>
</body>
</html>
`
  );

  fs.writeFileSync(
    path.join(root, "_redirects"),
    `/register/* /index.html 200
/total/* /index.html 200
/statistics/* /index.html 200
/manual/* /index.html 200
/history/* /index.html 200
/create/* /index.html 200
/admin/* /index.html 200
/changelog/* /index.html 200
/* /index.html 200
`
  );

  fs.writeFileSync(
    path.join(root, "assets/css/app.css"),
    `#app {
  min-height: 100vh;
}

.service-credit {
  width: min(100% - 32px, 760px);
  margin: 18px auto 10px;
  color: #64748b;
  font: 12px/1.45 "Segoe UI", Arial, sans-serif;
  text-align: center;
}

.service-credit-statistics {
  margin-top: 8px;
  margin-bottom: 18px;
}

@media (max-width: 430px) {
  .service-credit {
    width: min(100% - 24px, 760px);
    font-size: 11.5px;
  }
}
`
  );

  fs.writeFileSync(
    path.join(root, "assets/js/app.js"),
    `(function () {
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
    let path = pathname.replace(/\\/+$/, "");
    if (!path) return "/";
    path = path.replace(/\\/index\\.html$/i, "");
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
      const existing = document.querySelector(\`script[data-page-src="\${resolvedSrc}"]\`);
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
`
  );
}

ensureDir(path.join(root, "assets/css"));
ensureDir(path.join(root, "assets/js/pages"));
writeStaticFiles();

for (const page of pages) {
  fs.writeFileSync(path.join(root, "assets/js/pages", `${page.name}.js`), buildPageFile(page));
}

console.log(`Wrote ${pages.length} pages to ${root}`);
