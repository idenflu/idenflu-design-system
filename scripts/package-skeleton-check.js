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

const requireIncludes = (file, markers) => {
  requireFile(file);
  if (!exists(file)) return;

  markers.forEach((marker) => {
    if (!read(file).includes(marker)) failures.push(`${file}: missing ${marker}`);
  });
};

const requireNoPlaceholders = (file) => {
  if (!exists(file)) return;
  ["TODO", "TBD", "FIXME"].forEach((marker) => {
    if (read(file).includes(marker)) failures.push(`${file}: contains ${marker}`);
  });
};

requireIncludes("docs/react-package-plan.md", [
  "packages/tokens",
  "packages/icons",
  "packages/ui-react",
  "@idenflu/ui-tokens",
  "@idenflu/ui-icons",
  "@idenflu/ui-react",
  "GitHub Packages",
  "npm.pkg.github.com",
  "Button",
  "Table",
]);

requireIncludes("README.md", ["docs/ui-react-usage.md"]);

requireIncludes("docs/ui-react-usage.md", [
  "@idenflu/ui-react",
  "npm install @idenflu/ui-react @idenflu/ui-tokens @idenflu/ui-icons",
  "import \"@idenflu/ui-react/styles.css\";",
  "data-if-theme=\"dark\"",
  "Button",
  "IconButton",
  "TextField",
  "Card",
]);

requireIncludes(".npmrc", ["@idenflu:registry=https://npm.pkg.github.com"]);
requireIncludes(".github/workflows/publish-packages.yml", [
  "Publish GitHub Packages",
  "packages: write",
  "registry-url: https://npm.pkg.github.com",
  "NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}",
  "npm view @idenflu/ui-tokens@$VERSION version",
  "npm view @idenflu/ui-icons@$VERSION version",
  "npm view @idenflu/ui-react@$VERSION version",
  "npm publish --workspace @idenflu/ui-tokens",
  "npm publish --workspace @idenflu/ui-icons",
  "npm publish --workspace @idenflu/ui-react",
]);

requireFile("package.json");
if (exists("package.json")) {
  const packageJson = readJson("package.json");
  if (!packageJson.private) failures.push("package.json: root package must be private");
  if (!packageJson.workspaces?.includes("packages/*")) failures.push("package.json: missing packages/* workspace");
  if (packageJson.scripts?.["check:packages"] !== "node scripts/package-skeleton-check.js") {
    failures.push("package.json: missing check:packages script");
  }
}

[
  ["packages/tokens/package.json", "@idenflu/ui-tokens"],
  ["packages/icons/package.json", "@idenflu/ui-icons"],
  ["packages/ui-react/package.json", "@idenflu/ui-react"],
].forEach(([file, packageName]) => {
  requireFile(file);
  if (!exists(file)) return;

  const packageJson = readJson(file);
  if (packageJson.name !== packageName) failures.push(`${file}: expected name ${packageName}`);
  if (packageJson.private) failures.push(`${file}: must be publishable`);
  if (packageJson.publishConfig?.registry !== "https://npm.pkg.github.com") {
    failures.push(`${file}: missing GitHub Packages publishConfig`);
  }
  if (!packageJson.repository?.url?.includes("github.com/idenflu/idenflu-design-system.git")) {
    failures.push(`${file}: missing repository url`);
  }
  if (!packageJson.repository?.directory) failures.push(`${file}: missing repository directory`);
  if (!Array.isArray(packageJson.files) || !packageJson.files.includes("src")) {
    failures.push(`${file}: missing files src allowlist`);
  }
});

[
  "packages/tokens/src/index.ts",
  "packages/tokens/src/index.d.ts",
  "packages/tokens/src/tokens.css",
  "packages/tokens/src/tokens.json",
  "packages/icons/src/index.ts",
  "packages/icons/src/index.d.ts",
  "packages/icons/src/icons.svg",
  "packages/ui-react/src/index.ts",
  "packages/ui-react/src/styles.css",
  "packages/ui-react/src/utils/classNames.ts",
  "packages/ui-react/src/components/Button.tsx",
  "packages/ui-react/src/components/TextField.tsx",
  "packages/ui-react/src/components/Textarea.tsx",
  "packages/ui-react/src/components/Select.tsx",
  "packages/ui-react/src/components/Badge.tsx",
  "packages/ui-react/src/components/Chip.tsx",
  "packages/ui-react/src/components/Card.tsx",
  "packages/ui-react/src/components/Table.tsx",
  "packages/ui-react/src/components/EmptyState.tsx",
].forEach(requireFile);

requireIncludes("packages/ui-react/src/index.ts", [
  "Button",
  "IconButton",
  "TextField",
  "Textarea",
  "Select",
  "Badge",
  "Chip",
  "Card",
  "Table",
  "EmptyState",
]);

requireIncludes("packages/ui-react/src/components/Button.tsx", [
  "export type ButtonSize = \"small\" | \"medium\" | \"large\"",
  "IconButton",
  "aria-busy={loading || undefined}",
  "aria-label={label}",
  "aria-pressed={pressed ?? undefined}",
  "size = \"medium\"",
  "if-icon-button",
]);

requireIncludes("packages/ui-react/src/components/TextField.tsx", [
  "export type FieldState = \"default\" | \"invalid\" | \"success\" | \"server-error\"",
  "export type FieldAvailability = \"editable\" | \"readonly\" | \"disabled\" | \"locked\"",
  "availability?: FieldAvailability",
  "required?: boolean",
  "prefix?: React.ReactNode",
  "suffix?: React.ReactNode",
  "icon?: React.ReactNode",
  "aria-describedby={describedBy}",
  "readOnly={isReadonly || readOnly}",
  "disabled={isDisabled || disabled}",
  "if-input-shell",
  "if-field__required",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-button",
  ".if-icon-button",
  ".if-field",
  ".if-badge",
  ".if-chip",
  ".if-card",
  ".if-table",
  ".if-empty-state",
  "--if-color-primary",
  "font-weight: 350",
  ".if-button--primary:hover",
  ".if-button--secondary:hover",
  "var(--if-color-inverse-canvas)",
  "var(--if-color-inverse-surface-1)",
  ".if-button--ghost:hover",
  ".if-button.is-loading::after",
  ".if-button:disabled:hover",
  ".if-icon-button--ghost:not(:disabled)",
  "transform: translateY(1px)",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-field__required",
  ".if-input-shell",
  ".if-input-shell:focus-within",
  ".if-input-shell.is-disabled",
  ".if-field__prefix",
  ".if-field__suffix",
  ".if-field__icon",
  ".if-field--readonly .if-field__control",
  ".if-field--disabled .if-field__control",
  ".if-field--locked .if-field__control",
  ".if-field--server-error .if-field__control",
  "-webkit-text-fill-color",
  "opacity: 1",
]);

requireIncludes("packages/tokens/src/tokens.css", [
  "--if-color-primary",
  "--if-color-surface-raised",
  "--if-color-inverse-canvas",
  "--if-color-inverse-surface-1",
  "--if-space-sm",
  "--if-control-height",
  "[data-if-theme=\"dark\"]",
]);

if (exists("packages/ui-react/package.json")) {
  const uiReact = readJson("packages/ui-react/package.json");
  const uiTokens = exists("packages/tokens/package.json") ? readJson("packages/tokens/package.json") : undefined;
  const uiIcons = exists("packages/icons/package.json") ? readJson("packages/icons/package.json") : undefined;
  if (!uiReact.peerDependencies?.react) failures.push("packages/ui-react/package.json: missing react peer dependency");
  if (!uiReact.dependencies?.["@idenflu/ui-tokens"]) failures.push("packages/ui-react/package.json: missing token dependency");
  if (!uiReact.dependencies?.["@idenflu/ui-icons"]) failures.push("packages/ui-react/package.json: missing icon dependency");
  if (uiReact.dependencies?.["@idenflu/ui-tokens"]?.startsWith("workspace:")) {
    failures.push("packages/ui-react/package.json: publish dependencies must not use workspace protocol");
  }
  if (uiReact.dependencies?.["@idenflu/ui-icons"]?.startsWith("workspace:")) {
    failures.push("packages/ui-react/package.json: publish dependencies must not use workspace protocol");
  }
  if (uiTokens && uiReact.dependencies?.["@idenflu/ui-tokens"] !== uiTokens.version) {
    failures.push("packages/ui-react/package.json: @idenflu/ui-tokens dependency must match package version");
  }
  if (uiIcons && uiReact.dependencies?.["@idenflu/ui-icons"] !== uiIcons.version) {
    failures.push("packages/ui-react/package.json: @idenflu/ui-icons dependency must match package version");
  }
}

[
  "docs/react-package-plan.md",
  "packages/tokens/src/index.ts",
  "packages/icons/src/index.ts",
  "packages/ui-react/src/index.ts",
  "packages/ui-react/src/styles.css",
].forEach(requireNoPlaceholders);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("package skeleton check ok");
