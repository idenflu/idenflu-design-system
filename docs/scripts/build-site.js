const fs = require("fs");
const path = require("path");
const { expandPagePartials } = require("./page-partials");

const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "site.config.json");
const sourceDir = path.join(rootDir, "src", "pages");
const componentGroupsPath = path.join(rootDir, "component-groups.json");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const renderTopnav = (config, activeHref) => {
  const links = config.topnav
    .map((item) => {
      const active = item.href === activeHref ? ' class="active"' : "";
      return `        <a${active} href="${item.href}">${escapeHtml(item.label)}</a>`;
    })
    .join("\n");

  return `      <nav class="topnav" aria-label="Primary">\n${links}\n      </nav>`;
};

const getComponentSidebarGroups = (activeHref) => {
  if (!fs.existsSync(componentGroupsPath)) return [];
  const componentGroups = readJson(componentGroupsPath);

  return componentGroups.groups.map((group) => ({
    label: group.label,
    reference: false,
    links: group.links.map((link) => ({
      label: link.label,
      href: link.href,
      active: link.href === activeHref,
    })),
  }));
};

const renderSidebar = (page) => {
  const groups = page.componentSidebar ? getComponentSidebarGroups(page.file) : page.sidebarGroups || [];
  const sourcePath = path.join(sourceDir, page.source);
  const source = fs.existsSync(sourcePath) ? fs.readFileSync(sourcePath, "utf8") : "";
  const expandedSource = source
    ? expandPagePartials(source.trimEnd(), {
        file: page.file,
        source: page.source,
      })
    : "";
  const pageAnchorLinks = [
    { label: "Template", href: "#component-template-map" },
    { label: "Context", href: "#context-example" },
    { label: "Tokens", href: "#token-contract" },
    { label: "Usage", href: "#component-usage-guidance" },
  ].filter((link) => expandedSource.includes(`id="${link.href.slice(1)}"`));
  const sidebarGroups = pageAnchorLinks.length
    ? [
        ...groups,
        {
          label: "On this page",
          reference: true,
          links: pageAnchorLinks,
        },
      ]
    : groups;

  const body = sidebarGroups
    .map((group) => {
      const links = group.links
        .map((link) => {
          const active = link.active ? ' class="active"' : "";
          return `        <a${active} href="${link.href}">${escapeHtml(link.label)}</a>`;
        })
        .join("\n");
      const labelClass = group.reference ? "sidebar-label reference-label" : "sidebar-label";
      return `        <p class="${labelClass}">${escapeHtml(group.label)}</p>\n${links}`;
    })
    .join("\n");
  const jumpLinks = sidebarGroups
    .flatMap((group) => group.links.map((link) => ({ ...link, group: group.label })))
    .map((link) => {
      const active = link.active ? ' class="active"' : "";
      return `          <a${active} href="${link.href}"><span>${escapeHtml(link.label)}</span><small>${escapeHtml(link.group)}</small></a>`;
    })
    .join("\n");
  const jump = jumpLinks
    ? `        <details class="sidebar-jump">
          <summary>${escapeHtml(page.componentSidebar ? "Component navigation" : "Page navigation")}</summary>
          <div>
${jumpLinks}
          </div>
        </details>
`
    : "";

  return `      <aside class="sidebar" aria-label="${escapeHtml(page.sidebarAria || "Page sections")}">
${jump}${body}
      </aside>`;
};

const renderStyleLinks = (config) => {
  const links = [config.tokenCssHref, config.cssHref].filter(Boolean);
  return links.map((href) => `    <link rel="stylesheet" href="${href}">`).join("\n");
};

const renderPage = (config, page) => {
  const sourcePath = path.join(sourceDir, page.source);
  const content = expandPagePartials(fs.readFileSync(sourcePath, "utf8").trimEnd(), {
    file: page.file,
    source: page.source,
  });

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
${renderStyleLinks(config)}
  </head>
  <body>
    <header class="topbar">
      <a class="brand" href="index.html"><span class="brand-mark"></span><span>idenflu</span></a>
${renderTopnav(config, page.activeTopnav)}
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode" aria-pressed="false"><svg class="theme-toggle__icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-moon"></use></svg></button>
      <div class="topbar-meta">${escapeHtml(page.meta)}</div>
    </header>

    <div class="doc-layout">
${renderSidebar(page)}

      <main>
${content}
      </main>
    </div>

    <script src="script.js"></script>
  </body>
</html>
`;
};

const build = () => {
  const config = readJson(configPath);

  config.pages.forEach((page) => {
    const outputPath = path.join(rootDir, page.file);
    fs.writeFileSync(outputPath, renderPage(config, page), "utf8");
  });

  console.log(`built ${config.pages.length} pages`);
};

build();
