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
  ["components-table.html", "table spec", 'id="table-spec"'],
  ["components-table.html", "table behavior", 'id="table-behavior"'],
  ["components-overlays.html", "overlay interactions", 'id="overlay-interactions"'],
  ["components-overlays.html", "overlay states", 'id="overlay-states"'],
  ["components-overlays.html", "overlay focus", 'id="overlay-focus"'],
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
requireInFile("scripts/token-usage-report.js", "token usage check mode", "--check");
requireInFile("component-token-usage.json", "token usage components", "\"components\"");
requireInFile("visual-qa.html", "QA command board", "qa-command-board");
requireInFile("visual-qa.html", "browser QA command", "node scripts/browser-qa-check.js --dry-run");
requireInFile("visual-qa.html", "token usage command", "node scripts/token-usage-report.js --check");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("visual QA check ok");
