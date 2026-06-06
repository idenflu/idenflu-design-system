const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const exists = (file) => fs.existsSync(path.join(rootDir, file));
const readJson = (file) => JSON.parse(read(file));

const flattenComponentLinks = (groups) =>
  groups.flatMap((group) => group.links.map((link) => ({ ...link, group: group.label })));

const collectCoverageFailures = () => {
  const failures = [];

  if (!exists("component-groups.json")) return ["missing component-groups.json"];
  if (!exists("component-api.json")) return ["missing component-api.json"];
  if (!exists("component-token-usage.json")) return ["missing component-token-usage.json"];
  if (!exists("site.config.json")) return ["missing site.config.json"];

  const groups = readJson("component-groups.json").groups || [];
  const api = readJson("component-api.json").components || {};
  const tokenUsage = readJson("component-token-usage.json").components || {};
  const config = readJson("site.config.json");
  const configuredFiles = new Set(config.pages.map((page) => page.file));
  const componentPages = config.pages.filter((page) => page.sidebarAria === "Component pages");
  const links = flattenComponentLinks(groups);
  const componentLinks = links.filter((link) => link.componentKey);

  ["Core components", "Input and choice", "Data and workflow", "System surfaces"].forEach((label) => {
    if (!groups.some((group) => group.label === label)) failures.push(`component-groups.json: missing group ${label}`);
  });

  links.forEach((link) => {
    if (!configuredFiles.has(link.href)) failures.push(`component-groups.json: ${link.href} missing from site.config.json`);
    if (!exists(link.href)) failures.push(`component-groups.json: missing generated page ${link.href}`);
    const sourceFile = path.join("src/pages", link.href);
    if (!exists(sourceFile)) failures.push(`component-groups.json: missing source ${sourceFile}`);
    if (link.sectionId && exists(sourceFile) && !read(sourceFile).includes(`id="${link.sectionId}"`)) {
      failures.push(`${sourceFile}: missing section id ${link.sectionId}`);
    }
  });

  componentLinks.forEach((link) => {
    if (!api[link.componentKey]) failures.push(`component-api.json: missing ${link.componentKey}`);
    if (!tokenUsage[link.componentKey]) failures.push(`component-token-usage.json: missing ${link.componentKey}`);
  });

  Object.keys(api).forEach((componentKey) => {
    if (!componentLinks.some((link) => link.componentKey === componentKey)) {
      failures.push(`component-api.json: ${componentKey} missing from component-groups.json`);
    }
  });

  Object.keys(tokenUsage).forEach((componentKey) => {
    if (!componentLinks.some((link) => link.componentKey === componentKey)) {
      failures.push(`component-token-usage.json: ${componentKey} missing from component-groups.json`);
    }
  });

  componentPages.forEach((page) => {
    if (!page.componentSidebar) failures.push(`${page.file}: missing componentSidebar flag`);
    if (page.sidebarGroups?.length) failures.push(`${page.file}: component sidebar should come from component-groups.json`);
  });

  if (exists("components.html")) {
    const indexHtml = read("components.html");
    ["data-partial=\"component-index\"", "component-grouped-index"].forEach((marker) => {
      if (!indexHtml.includes(marker)) failures.push(`components.html: missing ${marker}`);
    });
    groups.forEach((group) => {
      if (!indexHtml.includes(group.label)) failures.push(`components.html: missing group ${group.label}`);
    });
  }

  return failures;
};

if (require.main === module) {
  const failures = collectCoverageFailures();
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }

  console.log("component coverage ok");
}

module.exports = {
  collectCoverageFailures,
};
