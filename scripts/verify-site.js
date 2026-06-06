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
if (!exists("scripts/browser-qa-check.js")) failures.push("missing scripts/browser-qa-check.js");
if (!exists("scripts/token-usage-report.js")) failures.push("missing scripts/token-usage-report.js");
if (!exists("scripts/component-coverage-check.js")) failures.push("missing scripts/component-coverage-check.js");
if (!exists("scripts/page-partials.js")) failures.push("missing scripts/page-partials.js");
if (!exists("component-token-usage.json")) failures.push("missing component-token-usage.json");
if (!exists("component-api.json")) failures.push("missing component-api.json");
if (!exists("component-groups.json")) failures.push("missing component-groups.json");
if (!exists("component-docs.json")) failures.push("missing component-docs.json");
if (!exists("visual-qa-matrix.json")) failures.push("missing visual-qa-matrix.json");

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
  if (componentPages.length < 21) failures.push("expected at least 21 component detail pages");
  if (!generatedFiles.includes("starter-kit.html")) failures.push("missing starter kit page");
  if (!generatedFiles.includes("changelog.html")) failures.push("missing changelog page");

  ["components-menu.html", "components-combobox.html", "components-badges.html", "components-tooltips.html", "components-avatar.html"].forEach((file) => {
    if (!generatedFiles.includes(file)) failures.push(`missing generated component page ${file}`);
  });
  ["components-search-toolbar.html", "components-attachments.html", "components-date-time.html", "components-stepper.html", "components-empty-states.html"].forEach((file) => {
    if (!generatedFiles.includes(file)) failures.push(`missing generated component page ${file}`);
  });

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
    ["component-standard", "component-template-map", "component-token-contract"].forEach((partial) => {
      if (!source.includes(`<!-- partial:${partial} -->`)) failures.push(`${file}: missing ${partial} partial`);
    });
    const html = read(file);
    ["component-standard", "doc-anatomy", "doc-variants", "doc-states", "doc-accessibility", "doc-examples"].forEach((id) => {
      if (!html.includes(`id="${id}"`)) failures.push(`${file}: missing ${id}`);
    });

    ["#component-template-map", "#context-example", "#token-contract"].forEach((href) => {
      if (!html.includes(`href="${href}"`)) failures.push(`${file}: missing sidebar anchor ${href}`);
    });
  });

  ["components-buttons.html", "components-cards.html", "components-overlays.html", "components-table.html"].forEach((file) => {
    const source = read(file);
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

  ["components-icons.html", "components-inputs.html", "components-controls.html", "components-tabs.html", "components-feedback.html", "components-navigation.html"].forEach((file) => {
    const source = read(file);
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
        failures.push(`${file}: missing remaining component marker ${marker}`);
      }
    });
  });

  const examplesSource = read(path.join("src/pages", "components-examples.html"));
  [
    'id="example-blueprint"',
    'id="connected-workflow"',
    "scenario-matrix",
    "screen-composition-demo",
    "connected-workflow-demo",
    "Review workbench",
    "Settings and permissions",
  ].forEach((marker) => {
    if (!examplesSource.includes(marker)) {
      failures.push(`components-examples.html: missing examples depth marker ${marker}`);
    }
  });

  const foundationsSource = read(path.join("src/pages", "foundations.html"));
  const foundationsHtml = read("foundations.html");
  [
    'id="component-token-usage"',
    "component-token-usage.json",
    "<!-- partial:component-token-usage -->",
  ].forEach((marker) => {
    if (!foundationsSource.includes(marker)) {
      failures.push(`foundations.html: missing token usage source marker ${marker}`);
    }
  });

  [
    "token-usage-grid",
    'data-partial="component-token-usage"',
    "Button tokens",
    "Field tokens",
    "Table tokens",
    "Overlay tokens",
  ].forEach((marker) => {
    if (!foundationsHtml.includes(marker)) {
      failures.push(`foundations.html: missing token usage marker ${marker}`);
    }
  });

  const accessibilitySource = read(path.join("src/pages", "accessibility.html"));
  [
    'id="interaction-qa"',
    "interaction-qa-grid",
    "Overlay focus trap",
    "Table keyboard navigation",
    "Form error linkage",
  ].forEach((marker) => {
    if (!accessibilitySource.includes(marker)) {
      failures.push(`accessibility.html: missing interaction qa marker ${marker}`);
    }
  });

  const componentIndex = read("components.html");
  if (!componentIndex.includes("component-index-grid")) {
    failures.push("components.html: missing component-index-grid");
  }
  [
    'data-partial="component-index"',
    "component-grouped-index",
    "Core components",
    "Input and choice",
    "Data and workflow",
    "System surfaces",
  ].forEach((marker) => {
    if (!componentIndex.includes(marker)) failures.push(`components.html: missing grouped index marker ${marker}`);
  });
  [
    'id="component-api-reference"',
    "component-api-grid",
    "Button API",
    "Menu API",
    "Combobox API",
    "Badge API",
    "Tooltip API",
    "Avatar API",
    "Search Toolbar API",
    "Attachment API",
    "Date Time API",
    "Stepper API",
    "Empty State API",
    "Overlay API",
    "Table API",
  ].forEach((marker) => {
    if (!componentIndex.includes(marker)) failures.push(`components.html: missing ${marker}`);
  });

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
    "visual-qa-coverage-grid",
    "visual-do-dont-grid",
    "a11y-flow-diagram",
    "component-template-map",
    "component-context-example",
    "component-token-contract",
    "scenario-matrix",
    "screen-composition-demo",
    "token-usage-grid",
    "component-api-grid",
    "interaction-qa-grid",
    "qa-dashboard-grid",
    "utility-component-grid",
    "menu-surface",
    "combobox-panel",
    "badge-stack",
    "tooltip-popover-board",
    "avatar-cluster",
    "filter-toolbar",
    "attachment-list",
    "date-time-board",
    "workflow-stepper",
    "state-surface-grid",
  ].forEach((className) => {
    if (!styles.includes(`.${className}`)) {
      failures.push(`styles.css: missing ${className}`);
    }
  });

  ["connected-workflow-demo", "qa-command-board", "release-impact-grid"].forEach((className) => {
    if (!styles.includes(`.${className}`)) failures.push(`styles.css: missing ${className}`);
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

  const menuSource = read(path.join("src/pages", "components-menu.html"));
  [
    "menu-demo-grid",
    "menu-trigger-row",
    "menu-demo-surface",
    "Row action menu",
    "Selection menu",
  ].forEach((marker) => {
    if (!menuSource.includes(marker)) {
      failures.push(`components-menu.html: missing menu demo marker ${marker}`);
    }
  });
  if (menuSource.includes("utility-component-grid")) {
    failures.push("components-menu.html: should not use utility-component-grid for main examples");
  }

  const comboboxSource = read(path.join("src/pages", "components-combobox.html"));
  [
    "combobox-demo-grid",
    "combobox-field-demo",
    "combobox-demo-surface",
    "Owner search",
    "Label search",
  ].forEach((marker) => {
    if (!comboboxSource.includes(marker)) {
      failures.push(`components-combobox.html: missing combobox demo marker ${marker}`);
    }
  });
  if (comboboxSource.includes("utility-component-grid")) {
    failures.push("components-combobox.html: should not use utility-component-grid for main examples");
  }

  [
    ".menu-demo-grid",
    ".combobox-demo-grid",
    ".badge-demo-grid",
    ".tooltip-demo-grid",
    ".identity-demo-grid",
    ".toolbar-demo-surface",
    ".attachment-demo-surface",
    ".date-time-demo-grid",
    ".stepper-demo-surface",
    ".recovery-demo-grid",
    ".menu-demo-surface",
    ".combobox-demo-surface",
    ".menu-trigger-row",
    ".combobox-field-demo",
    ".component-anatomy-visual",
    ".component-api-contract",
    ".component-token-binding",
    ".interaction-contract-grid",
    ".screen-scenario-grid",
    ".visual-qa-control-panel",
    ".qa-scope-group",
  ].forEach((selector) => {
    if (!styles.includes(selector)) failures.push(`styles.css: missing ${selector}`);
  });

  const utilityDemoRequirements = {
    "components-badges.html": ["badge-demo-grid", "badge-demo-surface", "Status badge set", "Filter chip set"],
    "components-tooltips.html": ["tooltip-demo-grid", "tooltip-demo-surface", "Tooltip hint", "Interactive popover"],
    "components-avatar.html": ["identity-demo-grid", "identity-demo-surface", "Owner identity", "Reviewer group"],
    "components-search-toolbar.html": ["toolbar-demo-surface", "Filter toolbar surface", "Saved view controls"],
    "components-attachments.html": ["attachment-demo-surface", "Upload queue surface", "Failed upload recovery"],
    "components-date-time.html": ["date-time-demo-grid", "date-time-demo-surface", "Campaign period", "Invalid schedule"],
    "components-stepper.html": ["stepper-demo-surface", "Approval progress surface", "Blocked step recovery"],
    "components-empty-states.html": ["recovery-demo-grid", "recovery-demo-surface", "Filtered empty", "Permission recovery"],
  };

  Object.entries(utilityDemoRequirements).forEach(([file, markers]) => {
    const source = read(path.join("src/pages", file));
    markers.forEach((marker) => {
      if (!source.includes(marker)) failures.push(`${file}: missing utility demo marker ${marker}`);
    });
  });

  ["components-cards.html", "components-menu.html", "components-combobox.html", "components-table.html", "components-empty-states.html"].forEach((file) => {
    const source = read(path.join("src/pages", file));
    ["component-anatomy-visual", "anatomy-node", "Anatomy visual"].forEach((marker) => {
      if (!source.includes(marker)) failures.push(`${file}: missing anatomy visual marker ${marker}`);
    });
  });

  ["components-menu.html", "components-combobox.html", "components-tabs.html", "components-overlays.html", "components-table.html"].forEach((file) => {
    const source = read(path.join("src/pages", file));
    ["interaction-contract-grid", "Keyboard path", "Focus state", "State change"].forEach((marker) => {
      if (!source.includes(marker)) failures.push(`${file}: missing interaction contract marker ${marker}`);
    });
  });

  componentPages.forEach((file) => {
    const source = read(path.join("src/pages", file));
    ["<!-- partial:component-api-contract -->", "<!-- partial:component-token-binding -->"].forEach((marker) => {
      if (!source.includes(marker)) failures.push(`${file}: missing ${marker}`);
    });

    const html = read(file);
    ["component-api-contract", "component-token-binding", "Props", "States", "A11y", "Token usage"].forEach((marker) => {
      if (!html.includes(marker)) failures.push(`${file}: missing detailed API/token marker ${marker}`);
    });
  });

  const examplesEnhancementSource = read(path.join("src/pages", "components-examples.html"));
  ["screen-scenario-grid", "Review queue scenario", "Approval detail scenario", "Permission settings scenario"].forEach((marker) => {
    if (!examplesEnhancementSource.includes(marker)) failures.push(`components-examples.html: missing screen scenario marker ${marker}`);
  });

  const visualQaSource = read(path.join("src/pages", "visual-qa.html"));
  ["visual-qa-control-panel", "qa-scope-group", "Manual review scope", "Automated checks", "Responsive breakpoints"].forEach((marker) => {
    if (!visualQaSource.includes(marker)) failures.push(`visual-qa.html: missing visual QA grouping marker ${marker}`);
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
  if (exists("visual-qa.html")) {
    ["qa-command-board", "browser-qa-check.js", "token-usage-report.js", "qa-dashboard-grid", "visual-qa-coverage-grid", 'data-partial="visual-qa-coverage"', "Dark mode deep QA", "utility-component-grid", "Menu and identity QA", "Combobox active option", "Avatar fallback", "Workflow and recovery QA", "Filter toolbar QA", "Attachment upload QA", "Permission recovery"].forEach((marker) => {
      if (!read("visual-qa.html").includes(marker)) failures.push(`visual-qa.html: missing ${marker}`);
    });
  }
  if (exists("changelog.html")) {
    ["Release impact", "release-impact-grid", "QA automation", "Affected components", "Required QA"].forEach((marker) => {
      if (!read("changelog.html").includes(marker)) failures.push(`changelog.html: missing ${marker}`);
    });
  }

  if (!generatedFiles.includes("responsive.html")) failures.push("missing responsive page");
}

if (tokens) {
  const tokenUsage = exists("component-token-usage.json") ? JSON.parse(read("component-token-usage.json")) : null;
  const componentApi = exists("component-api.json") ? JSON.parse(read("component-api.json")) : null;
  const componentDocs = exists("component-docs.json") ? JSON.parse(read("component-docs.json")) : null;
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

  if (tokenUsage) {
    ["buttons", "cards", "inputs", "controls", "tabs", "table", "overlays", "feedback", "navigation", "icons", "menu", "combobox", "badges", "tooltips", "avatar", "search-toolbar", "attachments", "date-time", "stepper", "empty-states"].forEach((component) => {
      if (!tokenUsage.components?.[component]?.tokens?.length) {
        failures.push(`component-token-usage.json: missing ${component} tokens`);
      }
    });
  }

  if (componentApi) {
    ["buttons", "inputs", "table", "overlays", "menu", "combobox", "badges", "tooltips", "avatar", "search-toolbar", "attachments", "date-time", "stepper", "empty-states"].forEach((component) => {
      const definition = componentApi.components?.[component];
      if (!definition?.props?.length) failures.push(`component-api.json: missing ${component} props`);
      if (!definition?.states?.length) failures.push(`component-api.json: missing ${component} states`);
      if (!definition?.accessibility?.length) failures.push(`component-api.json: missing ${component} accessibility`);
    });
  }

  if (componentDocs && config) {
    const componentPages = config.pages.map((page) => page.file).filter((file) => file.startsWith("components-"));
    componentPages.forEach((file) => {
      const doc = componentDocs.pages?.[file];
      if (!doc?.standard) failures.push(`component-docs.json: missing ${file} standard`);
      if (!doc?.templateMap) failures.push(`component-docs.json: missing ${file} templateMap`);
      if (!doc?.tokenContract) failures.push(`component-docs.json: missing ${file} tokenContract`);
    });
  }
}

if (exists("scripts/page-partials.js")) {
  const partialScript = read("scripts/page-partials.js");
  [
    "renderComponentStandard",
    "renderComponentTemplateMap",
    "renderComponentTokenContract",
    "renderVisualQaCoverage",
  ].forEach((marker) => {
    if (!partialScript.includes(marker)) failures.push(`scripts/page-partials.js: missing ${marker}`);
  });
}

if (exists("scripts/component-coverage-check.js")) {
  const { collectCoverageFailures } = require("./component-coverage-check");
  failures.push(...collectCoverageFailures());
}

const blockedMarkers = [
  'href="#' + "icon-",
  "icon-" + "sprite",
  "고" + "급",
  "Pre" + "mium",
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
  "creator-" + "operations",
  "creator operations " + "workspace",
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
