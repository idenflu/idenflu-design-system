const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const exists = (file) => fs.existsSync(path.join(rootDir, file));

const config = exists("site.config.json") ? JSON.parse(read("site.config.json")) : null;
const tokens = exists("tokens.json") ? JSON.parse(read("tokens.json")) : null;
const styles = exists("styles.css") ? read("styles.css") : "";
const generatedTokens = exists("tokens.generated.css") ? read("tokens.generated.css") : "";

if (!config) failures.push("missing site.config.json");
if (!tokens) failures.push("missing tokens.json");
if (!exists("scripts/build-site.js")) failures.push("missing scripts/build-site.js");
if (!exists("scripts/build-tokens.js")) failures.push("missing scripts/build-tokens.js");
if (!exists("tokens.generated.css")) failures.push("missing tokens.generated.css");
if (!exists("scripts/visual-qa-check.js")) failures.push("missing scripts/visual-qa-check.js");

const normalizeColor = (value) => String(value).trim().toLowerCase();

if (config) {
  config.pages.forEach((page) => {
    if (!exists(page.file)) {
      failures.push(`missing page ${page.file}`);
      return;
    }

    if (!exists(path.join("src/pages", page.source))) {
      failures.push(`missing source fragment ${page.source}`);
    }

    const html = read(page.file);
    if (!html.includes(config.cssHref)) failures.push(`${page.file}: css href mismatch`);
    if (config.tokenCssHref && !html.includes(config.tokenCssHref)) failures.push(`${page.file}: token css href mismatch`);

    const nav = html.match(/<nav class="topnav"[\s\S]*?<\/nav>/);
    if (!nav) {
      failures.push(`${page.file}: missing topnav`);
    } else {
      const labels = [...nav[0].matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map((match) => match[1].trim());
      const expected = config.topnav.map((item) => item.label);
      if (JSON.stringify(labels) !== JSON.stringify(expected)) {
        failures.push(`${page.file}: topnav labels ${labels.join(",")}`);
      }
    }

    const activeTopnav = html.match(/<nav class="topnav"[\s\S]*?<a class="active" href="([^"]+)"/);
    if (!activeTopnav || activeTopnav[1] !== page.activeTopnav) {
      failures.push(`${page.file}: active topnav mismatch`);
    }
  });

  const generatedFiles = config.pages.map((page) => page.file);
  const componentPages = generatedFiles.filter((file) => file.startsWith("components-"));
  if (componentPages.length < 11) failures.push("expected at least 11 component detail pages");
  if (!generatedFiles.includes("starter-kit.html")) failures.push("missing starter kit page");
  if (!generatedFiles.includes("changelog.html")) failures.push("missing changelog page");

  ["components.html", ...componentPages].forEach((file) => {
    const source = read(path.join("src/pages", file));
    if (!source.startsWith('<section class="page-header component-page-header">')) {
      failures.push(`${file}: missing compact component page header`);
    }
  });

  if (!styles.includes(".component-page-header")) {
    failures.push("styles.css: missing component page header override");
  }

  componentPages.forEach((file) => {
    const source = read(path.join("src/pages", file));
    ["component-standard", "doc-anatomy", "doc-variants", "doc-states", "doc-accessibility", "doc-examples"].forEach((id) => {
      if (!source.includes(`id="${id}"`)) failures.push(`${file}: missing ${id}`);
    });
  });

  ["components-buttons.html", "components-cards.html", "components-overlays.html", "components-table.html"].forEach((file) => {
    const source = read(path.join("src/pages", file));
    [
      'id="component-template-map"',
      "component-template-map",
      'id="context-example"',
      "component-context-example",
      'id="token-contract"',
      "component-token-contract",
      "Overview",
      "Anatomy",
      "Variants",
      "States",
      "Accessibility",
      "QA",
      "Token contract",
    ].forEach((marker) => {
      if (!source.includes(marker)) {
        failures.push(`${file}: missing component depth marker ${marker}`);
      }
    });
  });

  const componentIndex = read("components.html");
  if (!componentIndex.includes("component-index-grid")) {
    failures.push("components.html: missing component-index-grid");
  }

  const indexSource = read(path.join("src/pages", "index.html"));
  [
    'id="system-positioning"',
    'id="documentation-path"',
    "System lens",
    "Example context",
    "Recommended path",
  ].forEach((marker) => {
    if (!indexSource.includes(marker)) {
      failures.push(`index.html: missing ${marker}`);
    }
  });

  [
    'id="component-template"',
    "component-template-grid",
    "Required depth",
    "A11y contract",
    "QA evidence",
  ].forEach((marker) => {
    if (!componentIndex.includes(marker)) {
      failures.push(`components.html: missing ${marker}`);
    }
  });

  const guidelinesSource = read(path.join("src/pages", "guidelines.html"));
  [
    "visual-do-dont-grid",
    "do-example",
    "dont-example",
    "Good pattern",
    "Avoid pattern",
  ].forEach((marker) => {
    if (!guidelinesSource.includes(marker)) {
      failures.push(`guidelines.html: missing ${marker}`);
    }
  });

  const accessibilitySource = read(path.join("src/pages", "accessibility.html"));
  [
    "a11y-flow-diagram",
    "Modal keyboard flow",
    "Table row flow",
    "Combobox flow",
  ].forEach((marker) => {
    if (!accessibilitySource.includes(marker)) {
      failures.push(`accessibility.html: missing ${marker}`);
    }
  });

  [
    "system-positioning-grid",
    "doc-path-grid",
    "component-template-grid",
    "visual-do-dont-grid",
    "a11y-flow-diagram",
    "component-template-map",
    "component-context-example",
    "component-token-contract",
  ].forEach((className) => {
    if (!styles.includes(`.${className}`)) {
      failures.push(`styles.css: missing ${className}`);
    }
  });

  const cardSource = read(path.join("src/pages", "components-cards.html"));
  ["card-header", "card-body", "card-footer"].forEach((className) => {
    if (!cardSource.includes(`class="${className}"`)) {
      failures.push(`components-cards.html: missing ${className}`);
    }
  });

  const buttonSource = read(path.join("src/pages", "components-buttons.html"));
  [
    ["Small", ['class="button quiet small"', 'class="button primary small"', 'class="icon-button small"']],
    ["Medium", ['class="button quiet"', 'class="button primary"', 'class="icon-button"']],
    ["Large", ['class="button quiet large"', 'class="button primary large"', 'class="icon-button large"']],
  ].forEach(([label, requiredMarkers]) => {
    const section = buttonSource.match(new RegExp(`<span>${label}[^<]*<\\/span>([\\s\\S]*?)<\\/article>`));
    if (!section) {
      failures.push(`components-buttons.html: missing ${label.toLowerCase()} button size example`);
      return;
    }

    requiredMarkers.forEach((marker) => {
      if (!section[1].includes(marker)) {
        failures.push(`components-buttons.html: ${label.toLowerCase()} size missing ${marker}`);
      }
    });
  });

  const overlaySource = read(path.join("src/pages", "components-overlays.html"));
  if (!overlaySource.includes('id="overlay-structure"')) {
    failures.push('components-overlays.html: missing id="overlay-structure"');
  }

  [
    "overlay-structure-visual",
    "overlay-anatomy-diagram",
    "overlay-anatomy-backdrop",
    "overlay-anatomy-surface",
    "overlay-anatomy-header",
    "overlay-anatomy-body",
    "overlay-anatomy-footer",
  ].forEach((className) => {
    if (!overlaySource.includes(`class="${className}"`)) {
      failures.push(`components-overlays.html: missing ${className}`);
    }
  });

  ["Underlying page", "Backdrop layer", "Surface", "Header", "Body", "Footer"].forEach((label) => {
    if (!overlaySource.includes(label)) {
      failures.push(`components-overlays.html: missing overlay visual label ${label}`);
    }
  });

  [
    "modal-header",
    "modal-body",
    "modal-footer",
    "modal-impact-list",
    "overlay-case-grid",
    "overlay-case",
    "sheet-header",
    "sheet-body",
    "sheet-footer",
    "overlay-backdrop",
  ].forEach((className) => {
    if (!overlaySource.includes(`class="${className}"`)) {
      failures.push(`components-overlays.html: missing ${className}`);
    }
  });

  ["Trigger", "Backdrop", "Surface", "Header", "Body", "Footer"].forEach((label) => {
    if (!overlaySource.includes(`<strong>${label}</strong>`)) {
      failures.push(`components-overlays.html: missing overlay structure ${label}`);
    }
  });

  ["Popover case", "Modal + backdrop case", "Drawer case"].forEach((label) => {
    if (!overlaySource.includes(label)) {
      failures.push(`components-overlays.html: missing ${label}`);
    }
  });

  if (!styles.includes("backdrop-filter: blur(3px)")) {
    failures.push("styles.css: missing backdrop blur");
  }

  if (!read("script.js").includes("data-overlay-backdrop")) {
    failures.push("script.js: missing overlay backdrop behavior");
  }

  ["starter-kit.html", "guidelines.html", "states.html", "accessibility.html", "responsive.html", "enterprise.html", "visual-qa.html", "changelog.html"].forEach((file) => {
    if (exists(file) && !read(file).includes("visual-qa.html")) {
      failures.push(`${file}: missing visual QA link`);
    }
  });

  if (exists("visual-qa.html") && !read("visual-qa.html").includes('id="automation"')) {
    failures.push("visual-qa.html: missing automation section");
  }

  if (!generatedFiles.includes("responsive.html")) failures.push("missing responsive page");
}

if (tokens) {
  const colorMappings = {
    primary: "--primary",
    "primary-hover": "--primary-hover",
    "primary-pressed": "--primary-pressed",
    "primary-soft": "--primary-soft",
    "accent-coral": "--accent-coral",
    "accent-coral-soft": "--accent-coral-soft",
    "accent-mint": "--accent-mint",
    "accent-mint-soft": "--accent-mint-soft",
    "accent-amber": "--accent-amber",
    "accent-amber-soft": "--accent-amber-soft",
    "accent-amber-ink": "--accent-amber-ink",
    ink: "--ink",
    "ink-muted": "--ink-muted",
    "ink-subtle": "--ink-subtle",
    canvas: "--canvas",
    "surface-1": "--surface-1",
    "surface-2": "--surface-2",
    "surface-raised": "--surface-raised",
    "inverse-canvas": "--inverse-canvas",
    "inverse-surface-1": "--inverse-surface-1",
    "inverse-ink": "--inverse-ink",
    "inverse-ink-muted": "--inverse-ink-muted",
    hairline: "--hairline",
    "hairline-strong": "--hairline-strong",
  };

  Object.entries(colorMappings).forEach(([tokenName, cssVar]) => {
    const tokenValue = tokens.colors?.[tokenName]?.value;
    if (!tokenValue) {
      failures.push(`tokens.json: missing color ${tokenName}`);
      return;
    }

    const cssMatch = styles.match(new RegExp(`${cssVar}:\\s*([^;]+);`));
    const generatedMatch = generatedTokens.match(new RegExp(`${cssVar}:\\s*([^;]+);`));
    if (!cssMatch) {
      failures.push(`styles.css: missing ${cssVar}`);
      return;
    }
    if (!generatedMatch) {
      failures.push(`tokens.generated.css: missing ${cssVar}`);
      return;
    }

    if (normalizeColor(tokenValue) !== normalizeColor(cssMatch[1])) {
      failures.push(`${tokenName}: token ${tokenValue} != css ${cssMatch[1]}`);
    }
    if (normalizeColor(tokenValue) !== normalizeColor(generatedMatch[1])) {
      failures.push(`${tokenName}: token ${tokenValue} != generated ${generatedMatch[1]}`);
    }
  });

  ["icon-user", "icon-file", "icon-table", "icon-alert", "icon-settings", "icon-lock"].forEach((icon) => {
    if (!tokens.icons?.symbols?.includes(icon)) failures.push(`tokens.json: missing ${icon}`);
    if (!read("icons.svg").includes(`id="${icon}"`)) failures.push(`icons.svg: missing ${icon}`);
  });
}

const blockedMarkers = [
  'href="#' + "icon-",
  "icon-" + "sprite",
  "고" + "급",
  String.fromCodePoint(0x2315),
  String.fromCodePoint(0x2193),
  "design-" + "ibm",
  "TO" + "DO",
  "T" + "BD",
  "FIX" + "ME",
];
const blockedPositioningMarkers = [
  "Creator operations " + "system",
  "엔터프라이즈 크리에이터 " + "운영 콘솔",
  "크리에이터 캠페인 " + "제품",
  "Creator operations " + "workspace",
  "creator workflow " + "context",
  "단독 컴포넌트보다 campaign, creator, review, admin " + "workflow",
  "generic admin " + "화면",
];
["html", "css", "js", "md", "svg", "json"].forEach((extension) => {
  fs.readdirSync(rootDir)
    .filter((file) => file.endsWith(`.${extension}`))
    .forEach((file) => {
      const content = read(file);
      if (blockedMarkers.some((marker) => content.includes(marker))) {
        failures.push(`${file}: contains blocked legacy marker`);
      }
      if (blockedPositioningMarkers.some((marker) => content.includes(marker))) {
        failures.push(`${file}: contains over-specific positioning copy`);
      }
    });
});

if (config) {
  [...new Set(config.pages.map((page) => path.join("src/pages", page.source)))].forEach((file) => {
    if (!exists(file)) return;
    const content = read(file);
    if (blockedMarkers.some((marker) => content.includes(marker))) {
      failures.push(`${file}: contains blocked legacy marker`);
    }
    if (blockedPositioningMarkers.some((marker) => content.includes(marker))) {
      failures.push(`${file}: contains over-specific positioning copy`);
    }
  });
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("site verification ok");
