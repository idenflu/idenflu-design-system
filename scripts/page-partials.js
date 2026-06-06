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

const getComponentDoc = (context) => {
  const docs = readJson("component-docs.json");
  const key = context.file || context.source;
  const doc = docs.pages?.[key];

  if (!doc) {
    throw new Error(`Missing component docs for ${key || "unknown page"}`);
  }

  return doc;
};

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

const renderComponentIndex = () => {
  const componentGroups = readJson("component-groups.json");

  const groups = componentGroups.groups
    .map((group) => {
      const links = group.links
        .map(
          (link) => `        <a href="${escapeHtml(link.href)}">
          <span>${escapeHtml(link.label)}</span>
          <small>${escapeHtml(link.description)}</small>
        </a>`,
        )
        .join("\n");

      return `    <article class="component-index-group">
      <strong>${escapeHtml(group.label)}</strong>
      <div class="link-list component-index-grid">
${links}
      </div>
    </article>`;
    })
    .join("\n");

  return `<div class="component-grouped-index" data-partial="component-index">
${groups}
  </div>`;
};

const renderComponentStandard = (context) => {
  const standard = getComponentDoc(context).standard;
  const cards = standard.cards
    .map((card) => {
      const items = card.items.length ? `<ul>${card.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";

      return `    <article id="${escapeHtml(card.id)}" class="component-doc-card">
      <strong>${escapeHtml(card.title)}</strong>
      <p>${escapeHtml(card.description)}</p>${items ? `\n      ${items}` : ""}
    </article>`;
    })
    .join("\n");

  return `<section id="component-standard" class="${escapeHtml(standard.sectionClass)}">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(standard.eyebrow)}</p>
    <h2>${escapeHtml(standard.heading)}</h2>
  </div>
  <div class="component-doc-grid">
${cards}
  </div>
</section>`;
};

const renderComponentTemplateMap = (context) => {
  const templateMap = getComponentDoc(context).templateMap;
  const steps = templateMap.steps
    .map(
      (step) => `    <article>
      <span>${escapeHtml(step.number)}</span>
      <strong>${escapeHtml(step.title)}</strong>
      <p>${escapeHtml(step.description)}</p>
    </article>`,
    )
    .join("\n");

  return `<section id="component-template-map" class="${escapeHtml(templateMap.sectionClass)}">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(templateMap.eyebrow)}</p>
    <h2>${escapeHtml(templateMap.heading)}</h2>
  </div>
  <div class="component-template-map">
${steps}
  </div>
</section>`;
};

const renderComponentTokenContract = (context) => {
  const tokenContract = getComponentDoc(context).tokenContract;
  const rows = tokenContract.rows
    .map(
      (row) => `    <div class="token-contract-row"><span><strong>${escapeHtml(row.decision)}</strong></span><span>${escapeHtml(row.token)}</span><span>${escapeHtml(row.rule)}</span></div>`,
    )
    .join("\n");

  return `<section id="token-contract" class="${escapeHtml(tokenContract.sectionClass)}">
  <div class="section-heading">
    <p class="eyebrow">${escapeHtml(tokenContract.eyebrow)}</p>
    <h2>${escapeHtml(tokenContract.heading)}</h2>
  </div>
  <div class="component-token-contract">
    <div class="token-contract-row header"><span>Decision</span><span>Token</span><span>Rule</span></div>
${rows}
  </div>
</section>`;
};

const renderVisualQaCoverage = () => {
  const matrix = readJson("visual-qa-matrix.json");

  const cards = matrix.groups
    .map((group, index) => {
      const checks = group.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("");
      const number = String(index + 1).padStart(2, "0");

      return `    <article>
      <span>${number}</span>
      <strong>${escapeHtml(group.label)}</strong>
      <p>${escapeHtml(group.description)}</p>
      <ul>${checks}</ul>
      <code>${escapeHtml(group.command)}</code>
    </article>`;
    })
    .join("\n");

  return `<section id="coverage-matrix" class="section" data-partial="visual-qa-coverage">
  <div class="section-heading">
    <p class="eyebrow">Coverage matrix</p>
    <h2>QA 범위를 케이스별로 분리합니다.</h2>
    <p class="lede">각 범위는 자동화 명령, 수동 확인 항목, 대표 컴포넌트를 함께 연결합니다.</p>
  </div>
  <div class="visual-qa-coverage-grid">
${cards}
  </div>
</section>`;
};

const partials = {
  "component-token-usage": renderTokenUsageGrid,
  "component-api-reference": renderComponentApiReference,
  "component-index": renderComponentIndex,
  "component-standard": renderComponentStandard,
  "component-template-map": renderComponentTemplateMap,
  "component-token-contract": renderComponentTokenContract,
  "visual-qa-coverage": renderVisualQaCoverage,
};

const expandPagePartials = (content, context = {}) =>
  content.replace(/<!--\s*partial:([a-z0-9-]+)\s*-->/g, (match, name) => {
    const render = partials[name];

    if (!render) {
      throw new Error(`Unknown page partial: ${name}`);
    }

    return render(context);
  });

module.exports = {
  expandPagePartials,
};
