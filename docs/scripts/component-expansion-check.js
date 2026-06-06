const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const exists = (file) => fs.existsSync(path.join(rootDir, file));
const readJson = (file) => JSON.parse(read(file));

const requireIncludes = (file, marker) => {
  if (!exists(file)) {
    failures.push(`missing ${file}`);
    return;
  }

  if (!read(file).includes(marker)) failures.push(`${file}: missing ${marker}`);
};

const expectedComponents = [
  ["forms", "components-forms.html", "id=\"forms\"", "form-demo-grid", "field-group", "validation-summary", "form-save-bar"],
  ["progress", "components-progress.html", "id=\"progress\"", "progress-demo-grid", "skeleton-row", "data-progress-demo"],
  ["disclosure", "components-disclosure.html", "id=\"disclosure\"", "disclosure-demo-grid", "data-disclosure", "aria-expanded"],
  ["chips", "components-chips.html", "id=\"chips\"", "chip-demo-grid", "tag-list", "data-chip-remove"],
  ["pagination", "components-pagination.html", "id=\"pagination\"", "pagination-demo-grid", "data-pagination-demo", "aria-current=\"page\""],
  ["toast", "components-toast.html", "id=\"toast\"", "toast-demo-grid", "data-toast-demo", "aria-live"],
];

if (exists("site.config.json")) {
  const pages = new Set(readJson("site.config.json").pages.map((page) => page.file));
  expectedComponents.forEach(([, file]) => {
    if (!pages.has(file)) failures.push(`site.config.json: missing ${file}`);
  });
}

if (exists("component-groups.json")) {
  const links = readJson("component-groups.json").groups.flatMap((group) => group.links);
  expectedComponents.forEach(([componentKey, file]) => {
    const link = links.find((item) => item.componentKey === componentKey);
    if (!link) failures.push(`component-groups.json: missing ${componentKey}`);
    if (link && link.href !== file) failures.push(`component-groups.json: ${componentKey} href mismatch`);
  });
}

["component-api.json", "component-token-usage.json", "component-usage.json"].forEach((file) => {
  if (!exists(file)) return;
  const components = readJson(file).components || {};
  expectedComponents.forEach(([componentKey]) => {
    if (!components[componentKey]) failures.push(`${file}: missing ${componentKey}`);
  });
});

if (exists("component-docs.json")) {
  const pages = readJson("component-docs.json").pages || {};
  expectedComponents.forEach(([, file]) => {
    if (!pages[file]) failures.push(`component-docs.json: missing ${file}`);
  });
}

expectedComponents.forEach(([, file, ...markers]) => {
  [file, path.join("src/pages", file)].forEach((target) => {
    markers.forEach((marker) => requireIncludes(target, marker));
  });
  requireIncludes(path.join("src/pages", file), "<!-- partial:component-usage-guidance -->");
});

[
  "data-disclosure",
  "data-toast-trigger",
  "data-chip-remove",
  "data-pagination-next",
  "data-progress-demo",
].forEach((marker) => requireIncludes("script.js", marker));

[
  ".form-demo-grid",
  ".field-group",
  ".validation-summary",
  ".form-save-bar",
  ".progress-demo-grid",
  ".skeleton-row",
  ".disclosure-demo-grid",
  ".chip-demo-grid",
  ".tag-list",
  ".pagination-demo-grid",
  ".toast-demo-grid",
  ".toast-stack",
  ".overlay-decision-tree",
  ".workflow-pattern-grid",
  ".semantic-token-grid",
].forEach((marker) => requireIncludes("styles.css", marker));

[
  "table-bulk-action-model",
  "sticky-table-example",
  "mobile-table-cards",
].forEach((marker) => requireIncludes("src/pages/components-table.html", marker));

[
  "overlay-decision-guide",
  "overlay-decision-tree",
  "Use inline",
  "Use modal",
].forEach((marker) => requireIncludes("src/pages/components-overlays.html", marker));

[
  "semantic-token-aliases",
  "status-success",
  "status-warning",
  "status-error",
  "focus-ring",
].forEach((marker) => requireIncludes("src/pages/foundations.html", marker));

[
  "workflow-pattern-grid",
  "campaign-setup-pattern",
  "creator-shortlist-pattern",
  "approval-review-pattern",
  "permission-recovery-pattern",
].forEach((marker) => requireIncludes("src/pages/patterns.html", marker));

[
  "components-forms.html",
  "components-progress.html",
  "components-disclosure.html",
  "components-chips.html",
  "components-pagination.html",
  "components-toast.html",
  "workflow-pattern-grid",
].forEach((marker) => requireIncludes("scripts/browser-qa-check.js", marker));

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("component expansion check ok");
