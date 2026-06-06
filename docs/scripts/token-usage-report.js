const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const usagePath = path.join(rootDir, "component-token-usage.json");
const tokensPath = path.join(rootDir, "tokens.json");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const hasFlag = (flag) => process.argv.includes(flag);

const getPath = (source, tokenPath) =>
  tokenPath.split(".").reduce((value, key) => (value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined), source);

const run = () => {
  const usage = readJson(usagePath);
  const tokens = readJson(tokensPath);
  const failures = [];
  const rows = [];

  Object.entries(usage.components || {}).forEach(([component, definition]) => {
    if (!Array.isArray(definition.tokens) || definition.tokens.length === 0) {
      failures.push(`${component}: missing tokens`);
      return;
    }

    definition.tokens.forEach((tokenPath) => {
      const value = getPath(tokens, tokenPath);

      if (value === undefined) {
        failures.push(`${component}: missing token path ${tokenPath}`);
        return;
      }

      rows.push({
        component,
        label: definition.label,
        token: tokenPath,
        value: typeof value === "object" && value !== null && "value" in value ? value.value : value,
      });
    });
  });

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }

  if (hasFlag("--check")) {
    console.log(`token usage ok (${rows.length} bindings)`);
    return;
  }

  rows.forEach((row) => {
    console.log(`${row.component}\t${row.token}\t${row.value}`);
  });
};

run();
