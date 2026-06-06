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

const getComponentKey = (context) => {
  const componentGroups = readJson("component-groups.json");
  const key = componentGroups.groups
    .flatMap((group) => group.links)
    .find((link) => link.href === context.file || link.href === context.source)?.componentKey;

  if (!key) {
    throw new Error(`Missing component key for ${context.file || context.source || "unknown page"}`);
  }

  return key;
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

const renderComponentApiContract = (context) => {
  const componentKey = getComponentKey(context);
  const api = readJson("component-api.json").components?.[componentKey];

  if (!api) {
    throw new Error(`Missing component API for ${componentKey}`);
  }

  const rows = [
    ["Props", api.props],
    ["States", api.states],
    ["A11y", api.accessibility],
  ]
    .map(
      ([label, values]) => `    <div class="component-api-row"><span><strong>${escapeHtml(label)}</strong></span><span>${values.map(escapeHtml).join(", ")}</span></div>`,
    )
    .join("\n");

  return `<section id="component-api-contract" class="section surface-band">
  <div class="section-heading">
    <p class="eyebrow">API contract</p>
    <h2>${escapeHtml(api.label)} 구현 계약.</h2>
  </div>
  <div class="component-api-contract">
    <div class="component-api-row header"><span>Type</span><span>Contract</span></div>
${rows}
  </div>
</section>`;
};

const renderComponentTokenBinding = (context) => {
  const componentKey = getComponentKey(context);
  const tokenUsage = readJson("component-token-usage.json").components?.[componentKey];

  if (!tokenUsage) {
    throw new Error(`Missing component token usage for ${componentKey}`);
  }

  const tokens = tokenUsage.tokens
    .map((token) => `    <span>{${escapeHtml(token)}}</span>`)
    .join("\n");

  return `<section id="component-token-binding" class="section">
  <div class="section-heading">
    <p class="eyebrow">Token usage</p>
    <h2>${escapeHtml(tokenUsage.label)}를 실제 token path에 연결합니다.</h2>
  </div>
  <div class="component-token-binding">
${tokens}
  </div>
</section>`;
};

const renderComponentUsageGuidance = (context) => {
  const componentKey = getComponentKey(context);
  const usage = readJson("component-usage.json").components?.[componentKey];

  if (!usage) {
    throw new Error(`Missing component usage guidance for ${componentKey}`);
  }

  const rows = [
    ["Use", usage.use],
    ["Avoid", usage.avoid],
    ["Replace with", usage.replace],
  ]
    .map(
      ([label, value]) => `    <article>
      <strong>${escapeHtml(label)}</strong>
      <p>${escapeHtml(value)}</p>
    </article>`,
    )
    .join("\n");

  return `<section id="component-usage-guidance" class="section surface-band">
  <div class="section-heading">
    <p class="eyebrow">Usage guidance</p>
    <h2>idenflu 화면에서 쓰는 기준을 먼저 정합니다.</h2>
  </div>
  <div class="component-usage-guidance">
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
  "component-api-contract": renderComponentApiContract,
  "component-token-binding": renderComponentTokenBinding,
  "component-usage-guidance": renderComponentUsageGuidance,
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
