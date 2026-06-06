const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const exists = (file) => fs.existsSync(path.join(rootDir, file));
const readJson = (file) => JSON.parse(read(file));

const requireFile = (file) => {
  if (!exists(file)) failures.push(`missing ${file}`);
};

const requireIncludes = (file, marker) => {
  if (!exists(file)) {
    failures.push(`missing ${file}`);
    return;
  }

  if (!read(file).includes(marker)) failures.push(`${file}: missing ${marker}`);
};

[
  "component-api.json",
  "component-docs.json",
  "component-groups.json",
  "component-token-usage.json",
  "component-usage.json",
  "site.config.json",
  "script.js",
  "styles.css",
].forEach(requireFile);

if (exists("site.config.json")) {
  const files = new Set(readJson("site.config.json").pages.map((page) => page.file));
  if (!files.has("components-select.html")) failures.push("site.config.json: missing components-select.html");
}

if (exists("component-groups.json")) {
  const links = readJson("component-groups.json").groups.flatMap((group) => group.links);
  const selectLink = links.find((link) => link.componentKey === "select");
  if (!selectLink) failures.push("component-groups.json: missing select component link");
  if (selectLink && selectLink.href !== "components-select.html") failures.push("component-groups.json: select href mismatch");
}

["component-api.json", "component-token-usage.json", "component-usage.json"].forEach((file) => {
  if (exists(file) && !readJson(file).components?.select) failures.push(`${file}: missing select`);
});

if (exists("component-docs.json") && !readJson("component-docs.json").pages?.["components-select.html"]) {
  failures.push("component-docs.json: missing components-select.html");
}

[
  "components-select.html",
  "src/pages/components-select.html",
].forEach((file) => {
  requireIncludes(file, 'id="select"');
  requireIncludes(file, "select-demo-grid");
  requireIncludes(file, "data-select-demo");
  requireIncludes(file, "data-select-output");
  requireIncludes(file, "data-select-reset");
});
requireIncludes("src/pages/components-select.html", "<!-- partial:component-usage-guidance -->");

[
  "src/pages/components-combobox.html",
  "components-combobox.html",
].forEach((file) => {
  requireIncludes(file, "data-combobox");
  requireIncludes(file, "data-combobox-input");
  requireIncludes(file, "data-combobox-option");
  requireIncludes(file, "data-combobox-empty");
  requireIncludes(file, "data-combobox-loading");
  requireIncludes(file, "data-combobox-clear");
});

[
  "filterComboboxOptions",
  "getVisibleComboboxOptions",
  "data-combobox-disabled",
  "data-combobox-empty",
  "data-combobox-loading",
  "data-select-demo",
  "data-select-output",
].forEach((marker) => requireIncludes("script.js", marker));

[
  ".select-demo-grid",
  ".select-demo-surface",
  ".select-output",
  ".combobox-panel [hidden]",
].forEach((marker) => requireIncludes("styles.css", marker));

[
  "components-select.html",
  "select responsive QA",
].forEach((marker) => requireIncludes("scripts/browser-qa-check.js", marker));

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("choice components check ok");
