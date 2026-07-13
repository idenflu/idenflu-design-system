/**
 * Pre-publish / CI gate: sync shared docs/api contracts with @idenflu/ui-react.
 * Contracts stay in docs/api (framework-agnostic). This script is React-only.
 * Not shipped in the published package.
 */
const fs = require("fs");
const path = require("path");

const packageRoot = path.resolve(__dirname, "..");
const rootDir = path.resolve(packageRoot, "../..");
const apiDir = path.join(rootDir, "docs/api");
const componentsDir = path.join(apiDir, "components");
const reactComponentsDir = path.join(packageRoot, "src/components");

const failures = [];

const read = (file) => fs.readFileSync(path.join(rootDir, file), "utf8");
const readAbs = (absPath) => fs.readFileSync(absPath, "utf8");
const readJson = (file) => JSON.parse(read(file));
const exists = (file) => fs.existsSync(path.join(rootDir, file));
const existsAbs = (absPath) => fs.existsSync(absPath);

/** Contract id `date-picker` → folder/file `DatePicker`. */
const kebabToPascal = (id) =>
  id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

/**
 * Resolve React implementation from contract id only.
 * Convention: src/components/<Name>/<Name>.tsx
 */
const resolveReactSource = (componentId) => {
  const name = kebabToPascal(componentId);
  const absPath = path.join(reactComponentsDir, name, `${name}.tsx`);
  const relative = path.relative(rootDir, absPath).split(path.sep).join("/");
  return { absPath, relative, name };
};

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

const extractPropNames = (absSourceFile) => {
  const source = readAbs(absSourceFile);
  const componentName = path.basename(
    absSourceFile,
    path.extname(absSourceFile)
  );
  let startMatch = source.match(
    new RegExp(`export type ${componentName}Props\\s*=`)
  );
  if (!startMatch) {
    startMatch = source.match(/export type (\w+Props)\s*=/);
  }
  if (!startMatch) return null;

  const from = startMatch.index + startMatch[0].length;
  const slice = source.slice(from);

  // First `{` outside generics — covers `= { ... }` and `Omit<...> & { ... }`.
  let objectStart = -1;
  let depthAngle = 0;
  for (let i = 0; i < slice.length; i += 1) {
    const char = slice[i];
    if (char === "<") depthAngle += 1;
    else if (char === ">") depthAngle = Math.max(0, depthAngle - 1);
    else if (char === "{" && depthAngle === 0) {
      objectStart = i;
      break;
    } else if (char === ";" && depthAngle === 0 && objectStart === -1) {
      // Type ended without an object body
      break;
    }
  }

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

  if (
    /ButtonHTMLAttributes|InputHTMLAttributes|SelectHTMLAttributes|TextareaHTMLAttributes|HTMLAttributes/.test(
      header
    )
  ) {
    names.add("disabled");
    names.add("children");
  }

  return names;
};

const syncProps = (contract) => {
  const { absPath, relative } = resolveReactSource(contract.id);

  if (!existsAbs(absPath)) {
    failures.push(
      `${contract.id}: React source not found at ${relative} (expected src/components/<Name>/<Name>.tsx)`
    );
    return;
  }

  const implemented = extractPropNames(absPath);
  if (!implemented) {
    failures.push(
      `${contract.id}: could not parse Props type from ${relative}`
    );
    return;
  }

  const contracted = contract.props.map((prop) => prop.name);

  contracted.forEach((name) => {
    if (!implemented.has(name)) {
      failures.push(
        `${contract.id}: contract prop "${name}" not found in ${relative} Props (engineering-first sync)`
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

const collectImplementationHaystack = (absSourceFile) => {
  const dir = path.dirname(absSourceFile);
  const base = path.basename(absSourceFile, path.extname(absSourceFile));
  const candidates = [
    absSourceFile,
    path.join(dir, `${base}.module.css`),
    path.join(dir, `${base}.css`),
    path.join(dir, `${base}.stories.tsx`),
    path.join(dir, `${base}.stories.ts`),
    path.join(dir, `${base}.stories.jsx`),
    path.join(dir, `${base}.stories.js`),
  ];

  const parts = [];
  const used = [];

  candidates.forEach((file) => {
    if (!existsAbs(file)) return;
    parts.push(readAbs(file));
    used.push(path.relative(rootDir, file).split(path.sep).join("/"));
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
  const { absPath, relative } = resolveReactSource(contract.id);

  if (!existsAbs(absPath)) {
    // syncProps already reports missing source
    return;
  }

  if (!Array.isArray(contract.states) || contract.states.length === 0) return;

  const { text, files } = collectImplementationHaystack(absPath);
  if (!files.length) {
    failures.push(
      `${contract.id}: no implementation files found next to ${relative} for states check`
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

console.log("api-contracts check ok (@idenflu/ui-react)");
