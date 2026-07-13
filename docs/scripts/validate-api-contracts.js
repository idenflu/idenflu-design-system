const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const apiDir = path.join(rootDir, "docs/api");
const componentsDir = path.join(apiDir, "components");

const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const readJson = (file) => JSON.parse(read(file));
const exists = (file) => fs.existsSync(path.join(rootDir, file));

const PROP_KINDS = new Set([
  "boolean",
  "string",
  "number",
  "enum",
  "node",
  "unknown",
]);
const STATUSES = new Set(["draft", "implemented", "deprecated"]);

const validateProp = (componentId, prop, index) => {
  const prefix = `${componentId}.props[${index}]`;

  if (!prop || typeof prop !== "object") {
    failures.push(`${prefix}: must be an object`);
    return;
  }

  if (!prop.name || typeof prop.name !== "string") {
    failures.push(`${prefix}: missing name`);
  }

  if (!PROP_KINDS.has(prop.kind)) {
    failures.push(`${prefix}: invalid kind ${prop.kind}`);
  }

  if (prop.kind === "enum") {
    if (!Array.isArray(prop.values) || prop.values.length === 0) {
      failures.push(`${prefix}: enum requires non-empty values`);
    }
  }
};

const validateContract = (contract, file) => {
  const id = contract.id || path.basename(file, ".json");

  if (!contract.id || !/^[a-z][a-z0-9-]*$/.test(contract.id)) {
    failures.push(`${file}: invalid or missing id`);
  }

  if (!contract.label || typeof contract.label !== "string") {
    failures.push(`${file}: missing label`);
  }

  if (!STATUSES.has(contract.status)) {
    failures.push(`${file}: invalid status ${contract.status}`);
  }

  if (!Array.isArray(contract.props) || contract.props.length === 0) {
    failures.push(`${file}: props must be a non-empty array`);
  } else {
    contract.props.forEach((prop, index) => validateProp(id, prop, index));
    const names = contract.props.map((prop) => prop.name).filter(Boolean);
    const duplicates = names.filter(
      (name, index) => names.indexOf(name) !== index
    );
    if (duplicates.length) {
      failures.push(
        `${file}: duplicate prop names: ${[...new Set(duplicates)].join(", ")}`
      );
    }
  }

  if (!Array.isArray(contract.states) || contract.states.length === 0) {
    failures.push(`${file}: states must be a non-empty array`);
  }

  if (
    !Array.isArray(contract.accessibility) ||
    contract.accessibility.length === 0
  ) {
    failures.push(`${file}: accessibility must be a non-empty array`);
  } else {
    contract.accessibility.forEach((item, index) => {
      if (!item?.id || !item?.rule) {
        failures.push(`${file}: accessibility[${index}] requires id and rule`);
      }
    });
  }

  if (contract.events !== undefined) {
    failures.push(
      `${file}: events must not appear in shared contracts (framework-specific)`
    );
  }

  return contract;
};

const extractPropNames = (sourceFile) => {
  const source = read(sourceFile);
  const startMatch = source.match(/export type (\w+Props)\s*=/);
  if (!startMatch) return null;

  const from = startMatch.index + startMatch[0].length;
  const slice = source.slice(from);
  const objectStart = slice.indexOf("{");
  if (objectStart === -1) return null;

  let depth = 0;
  let objectEnd = -1;
  for (let i = objectStart; i < slice.length; i += 1) {
    const char = slice[i];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        objectEnd = i;
        break;
      }
    }
  }

  if (objectEnd === -1) return null;

  const header = slice.slice(0, objectStart);
  const objectBody = slice.slice(objectStart, objectEnd + 1);
  const names = new Set();

  for (const match of objectBody.matchAll(
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*:/gm
  )) {
    names.add(match[1]);
  }

  // Native attrs kept in shared contracts when extending button HTML attributes
  if (/ButtonHTMLAttributes/.test(header)) {
    names.add("disabled");
    names.add("children");
  }

  return names;
};

const syncProps = (contract) => {
  const sourceFile = contract.source?.react;
  if (!sourceFile) return;

  if (!exists(sourceFile)) {
    failures.push(`${contract.id}: source.react missing file ${sourceFile}`);
    return;
  }

  const implemented = extractPropNames(sourceFile);
  if (!implemented) {
    failures.push(
      `${contract.id}: could not parse Props type from ${sourceFile}`
    );
    return;
  }

  const contracted = contract.props.map((prop) => prop.name);

  contracted.forEach((name) => {
    if (!implemented.has(name)) {
      failures.push(
        `${contract.id}: contract prop "${name}" not found in ${sourceFile} Props (engineering-first sync)`
      );
    }
  });
};

/** Patterns that must appear somewhere in the component implementation bundle. */
const STATE_PATTERNS = {
  default: null, // baseline render; no extra marker required
  hover: [/:hover\b/, /\bhover\b/i],
  focus: [/:focus(?:-visible)?\b/, /\bfocus(?:Visible|ed)?\b/i],
  loading: [/\bloading\b/i],
  disabled: [/\bdisabled\b/i, /:disabled\b/],
  selected: [/\bselected\b/i, /\baria-pressed\b/, /\baria-selected\b/],
  error: [/\berror\b/i, /\binvalid\b/i, /\baria-invalid\b/],
  readonly: [/\breadonly\b/i, /\breadOnly\b/],
  open: [/\bopen\b/i, /\bexpanded\b/i, /\baria-expanded\b/],
};

const collectImplementationHaystack = (sourceFile) => {
  const dir = path.posix.dirname(sourceFile.replace(/\\/g, "/"));
  const base = path.posix.basename(sourceFile, path.extname(sourceFile));
  const candidates = [
    sourceFile,
    `${dir}/${base}.module.css`,
    `${dir}/${base}.css`,
    `${dir}/${base}.stories.tsx`,
    `${dir}/${base}.stories.ts`,
    `${dir}/${base}.stories.jsx`,
    `${dir}/${base}.stories.js`,
  ];

  const parts = [];
  const used = [];

  candidates.forEach((file) => {
    if (!exists(file)) return;
    parts.push(read(file));
    used.push(file);
  });

  return { text: parts.join("\n"), files: used };
};

const patternsForState = (state) => {
  if (Object.prototype.hasOwnProperty.call(STATE_PATTERNS, state)) {
    return STATE_PATTERNS[state];
  }

  const escaped = state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [new RegExp(`\\b${escaped}\\b`, "i")];
};

const syncStates = (contract) => {
  const sourceFile = contract.source?.react;
  if (!sourceFile) return;

  if (!exists(sourceFile)) {
    // syncProps already reports missing source
    return;
  }

  if (!Array.isArray(contract.states) || contract.states.length === 0) return;

  const { text, files } = collectImplementationHaystack(sourceFile);
  if (!files.length) {
    failures.push(
      `${contract.id}: no implementation files found next to ${sourceFile} for states check`
    );
    return;
  }

  const searchedIn = files.join(", ");

  contract.states.forEach((state) => {
    if (typeof state !== "string" || !state) {
      failures.push(`${contract.id}: states entries must be non-empty strings`);
      return;
    }

    const patterns = patternsForState(state);
    if (patterns === null) return;

    const matched = patterns.some((pattern) => pattern.test(text));
    if (!matched) {
      failures.push(
        `${contract.id}: state "${state}" pattern not found in ${searchedIn}`
      );
    }
  });
};

if (!exists("docs/api/index.json")) {
  failures.push("missing docs/api/index.json");
} else {
  const index = readJson("docs/api/index.json");
  const registered = index.components || [];

  if (!Array.isArray(registered) || registered.length === 0) {
    failures.push("docs/api/index.json: components must be a non-empty array");
  }

  if (!exists("docs/api/components")) {
    failures.push("missing docs/api/components");
  } else {
    const files = fs
      .readdirSync(componentsDir)
      .filter((name) => name.endsWith(".json"))
      .sort();

    const fileIds = files.map((name) => path.basename(name, ".json"));

    registered.forEach((id) => {
      if (!fileIds.includes(id)) {
        failures.push(`docs/api/index.json: missing components/${id}.json`);
      }
    });

    fileIds.forEach((id) => {
      if (!registered.includes(id)) {
        failures.push(
          `docs/api/components/${id}.json: not registered in index.json`
        );
      }
    });

    files.forEach((name) => {
      const relative = `docs/api/components/${name}`;
      const contract = validateContract(readJson(relative), relative);

      if (contract.id && contract.id !== path.basename(name, ".json")) {
        failures.push(`${relative}: id "${contract.id}" must match file name`);
      }

      if (contract.status === "implemented") {
        syncProps(contract);
        syncStates(contract);
      }
    });
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("api-contracts check ok");
