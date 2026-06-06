const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(rootDir, file), "utf8"));

const renderTokenUsageGrid = () => {
  const usage = readJson("component-token-usage.json");

  const cards = Object.values(usage.components)
    .map(
      (component) => `    <article>
      <strong>${escapeHtml(component.label)}</strong>
      <p>${component.tokens.map((token) => `{${escapeHtml(token)}}`).join(", ")}</p>
    </article>`,
    )
    .join("\n");

  return `<div class="token-usage-grid" data-partial="component-token-usage">
${cards}
  </div>`;
};

const renderComponentApiReference = () => {
  const api = readJson("component-api.json");

  const cards = Object.values(api.components)
    .map(
      (component) => `    <article>
      <strong>${escapeHtml(component.label)}</strong>
      <dl>
        <dt>Props</dt>
        <dd>${component.props.map(escapeHtml).join(", ")}</dd>
        <dt>States</dt>
        <dd>${component.states.map(escapeHtml).join(", ")}</dd>
        <dt>Accessibility</dt>
        <dd>${component.accessibility.map(escapeHtml).join(", ")}</dd>
      </dl>
    </article>`,
    )
    .join("\n");

  return `<div class="component-api-grid" data-partial="component-api-reference">
${cards}
  </div>`;
};

const partials = {
  "component-token-usage": renderTokenUsageGrid,
  "component-api-reference": renderComponentApiReference,
};

const expandPagePartials = (content) =>
  content.replace(/<!--\s*partial:([a-z0-9-]+)\s*-->/g, (match, name) => {
    const render = partials[name];

    if (!render) {
      throw new Error(`Unknown page partial: ${name}`);
    }

    return render();
  });

module.exports = {
  expandPagePartials,
};
