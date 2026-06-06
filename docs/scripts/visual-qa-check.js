const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const exists = (file) => fs.existsSync(path.join(rootDir, file));

const requireInFile = (file, label, value) => {
  if (!exists(file)) {
    failures.push(`${file}: missing file`);
    return;
  }

  if (!read(file).includes(value)) failures.push(`${file}: missing ${label}`);
};

["actions", "forms", "data", "states", "checklist", "automation", "themes"].forEach((id) => {
  requireInFile("visual-qa.html", `#${id}`, `id="${id}"`);
});

[
  ["components-buttons.html", "button spec", 'id="button-spec"'],
  ["components-inputs.html", "input spec", 'id="input-spec"'],
  ["components-inputs.html", "form flows", 'id="form-flows"'],
  ["components-select.html", "select component page", 'id="select"'],
  ["components-forms.html", "forms component page", 'id="forms"'],
  ["components-progress.html", "progress component page", 'id="progress"'],
  ["components-disclosure.html", "disclosure component page", 'id="disclosure"'],
  ["components-chips.html", "chips component page", 'id="chips"'],
  ["components-pagination.html", "pagination component page", 'id="pagination"'],
  ["components-toast.html", "toast component page", 'id="toast"'],
  ["components-table.html", "table spec", 'id="table-spec"'],
  ["components-table.html", "table behavior", 'id="table-behavior"'],
  ["components-overlays.html", "overlay interactions", 'id="overlay-interactions"'],
  ["components-overlays.html", "overlay states", 'id="overlay-states"'],
  ["components-overlays.html", "overlay focus", 'id="overlay-focus"'],
  ["components-menu.html", "menu component page", 'id="menu"'],
  ["components-combobox.html", "combobox component page", 'id="combobox"'],
  ["components-badges.html", "badges component page", 'id="badges"'],
  ["components-tooltips.html", "tooltips component page", 'id="tooltips"'],
  ["components-avatar.html", "avatar component page", 'id="avatar"'],
  ["components-search-toolbar.html", "search toolbar component page", 'id="search-toolbar"'],
  ["components-attachments.html", "attachments component page", 'id="attachments"'],
  ["components-date-time.html", "date time component page", 'id="date-time"'],
  ["components-stepper.html", "stepper component page", 'id="stepper-component"'],
  ["components-empty-states.html", "empty states component page", 'id="empty-states"'],
  ["accessibility.html", "component contracts", 'id="component-contracts"'],
  ["accessibility.html", "aria roles", 'id="aria-roles"'],
  ["accessibility.html", "focus order", 'id="focus-order"'],
].forEach(([file, label, marker]) => requireInFile(file, label, marker));

const styles = read("styles.css");
[
  ".button:disabled:hover",
  ".icon-button:disabled:hover",
  ".button.loading::after",
  ".button.ghost:hover",
  ".icon-button.ghost:not(:disabled):hover",
  ".field input:disabled",
  ".field input:read-only:not(:disabled)",
].forEach((selector) => {
  if (!styles.includes(selector)) failures.push(`styles.css: missing ${selector}`);
});

const script = read("script.js");
["[data-overlay-open]", "[data-overlay-close]", "aria-expanded", "Escape", "trapOverlayFocus", "getFocusableElements"].forEach((marker) => {
  if (!script.includes(marker)) failures.push(`script.js: missing overlay marker ${marker}`);
});

["[data-keyboard-table]", "moveTableFocus", "data-row-focus"].forEach((marker) => {
  if (!script.includes(marker)) failures.push(`script.js: missing table keyboard marker ${marker}`);
});

const htmlFiles = fs
  .readdirSync(rootDir)
  .filter((file) => file.endsWith(".html"));

htmlFiles.forEach((file) => {
  const html = read(file);
  const iconButtons = html.match(/<button[^>]*class="[^"]*\bicon-button\b[^"]*"[^>]*>/g) || [];
  iconButtons.forEach((button) => {
    if (!button.includes("aria-label=")) failures.push(`${file}: icon-only button missing aria-label`);
  });
});

const combobox = read("components-inputs.html");
["role=\"combobox\"", "aria-expanded=\"true\"", "aria-controls=\"component-owner-options\"", "aria-activedescendant=\"component-owner-mina\""].forEach((marker) => {
  if (!combobox.includes(marker)) failures.push(`components-inputs.html: missing combobox marker ${marker}`);
});

const table = read("components-table.html");
if (!table.includes("aria-sort=\"ascending\"")) failures.push("components-table.html: missing active sort marker");
if (!table.includes("aria-expanded=\"true\"")) failures.push("components-table.html: missing expanded row marker");
if (!table.includes("disabled>Approve</button>")) failures.push("components-table.html: missing locked row disabled action");
if (!table.includes("data-keyboard-table")) failures.push("components-table.html: missing keyboard table marker");
if (!table.includes("data-row-focus")) failures.push("components-table.html: missing row focus marker");

const accessibility = read("accessibility.html");
["Overlay focus trap", "Table keyboard navigation", "Form error linkage"].forEach((marker) => {
  if (!accessibility.includes(marker)) failures.push(`accessibility.html: missing ${marker}`);
});

requireInFile("scripts/browser-qa-check.js", "browser QA scenarios", "screenshotScenarios");
requireInFile("scripts/browser-qa-check.js", "interaction scenarios", "interactionScenarios");
requireInFile("scripts/browser-qa-check.js", "theme modes", "themeModes");
requireInFile("scripts/browser-qa-check.js", "viewport matrix", "viewports");
requireInFile("scripts/browser-qa-check.js", "tablet viewport", "tablet");
requireInFile("scripts/browser-qa-check.js", "menu responsive QA", "component-menu-responsive");
requireInFile("scripts/browser-qa-check.js", "combobox responsive QA", "component-combobox-responsive");
requireInFile("scripts/browser-qa-check.js", "select responsive QA", "select responsive QA");
requireInFile("scripts/browser-qa-check.js", "table responsive QA", "component-table-responsive");
requireInFile("scripts/browser-qa-check.js", "overlay responsive QA", "component-overlays-responsive");
requireInFile("scripts/browser-qa-check.js", "layout audit selectors", "layoutAuditSelectors");
requireInFile("scripts/browser-qa-check.js", "layout audit collector", "collectLayoutFailures");
requireInFile("scripts/token-usage-report.js", "token usage check mode", "--check");
requireInFile("scripts/component-coverage-check.js", "component coverage check", "collectCoverageFailures");
requireInFile("scripts/page-partials.js", "partial expansion", "expandPagePartials");
requireInFile("component-groups.json", "component groups", "\"groups\"");
requireInFile("component-docs.json", "component docs", "\"pages\"");
requireInFile("visual-qa-matrix.json", "visual QA matrix", "\"groups\"");
requireInFile("component-token-usage.json", "token usage components", "\"components\"");
requireInFile("component-api.json", "component API components", "\"components\"");
requireInFile("visual-qa.html", "QA command board", "qa-command-board");
requireInFile("visual-qa.html", "QA dashboard", "qa-dashboard-grid");
requireInFile("visual-qa.html", "QA coverage grid", "visual-qa-coverage-grid");
requireInFile("visual-qa.html", "QA coverage partial", 'data-partial="visual-qa-coverage"');
requireInFile("visual-qa.html", "utility component QA", "utility-component-grid");
requireInFile("visual-qa.html", "menu identity QA", "Menu and identity QA");
requireInFile("visual-qa.html", "workflow recovery QA", "Workflow and recovery QA");
requireInFile("visual-qa.html", "filter toolbar QA", "Filter toolbar QA");
requireInFile("visual-qa.html", "browser QA command", "node scripts/browser-qa-check.js --dry-run");
requireInFile("visual-qa.html", "browser layout audit command", "Browser layout audit");
requireInFile("visual-qa.html", "token usage command", "node scripts/token-usage-report.js --check");
requireInFile("components.html", "component API reference", "component-api-reference");
requireInFile("components.html", "component API grid", "component-api-grid");
requireInFile("components.html", "grouped component index", "component-grouped-index");
["Select API", "Form API", "Disclosure API", "Menu API", "Combobox API", "Badge API", "Chip API", "Tooltip API", "Avatar API"].forEach((marker) => {
  requireInFile("components.html", marker, marker);
});
["Search Toolbar API", "Attachment API", "Progress API", "Date Time API", "Stepper API", "Empty State API", "Pagination API", "Toast API"].forEach((marker) => {
  requireInFile("components.html", marker, marker);
});

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("visual QA check ok");
