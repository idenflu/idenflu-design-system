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

/** Folder-based public component: Name/index.ts + Name/Name.tsx (+ optional CSS module). */
const requireFolderComponent = (name, { cssModule = true } = {}) => {
  const base = `packages/ui-react/src/components/${name}`;
  requireFile(`${base}/index.ts`);
  requireFile(`${base}/${name}.tsx`);
  if (cssModule) requireFile(`${base}/${name}.module.css`);
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
]);

requireIncludes("README.md", ["docs/ui-react-usage.md"]);

requireIncludes("docs/ui-react-usage.md", [
  "@idenflu/ui-react",
  "npm install @idenflu/ui-react @idenflu/ui-tokens @idenflu/ui-icons",
  "import \"@idenflu/ui-react/styles.css\";",
  "Button",
  "IconButton",
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
  if (!packageJson.workspaces?.includes("packages/*")) {
    failures.push("package.json: missing packages/* workspace");
  }
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
  if (!packageJson.types) failures.push(`${file}: missing top-level types field`);
  if (packageJson.types && packageJson.exports?.["."]?.types !== packageJson.types) {
    failures.push(`${file}: exports . types must match top-level types`);
  }
  if (!packageJson.repository?.url?.includes("github.com/idenflu/idenflu-design-system.git")) {
    failures.push(`${file}: missing repository url`);
  }
  if (!packageJson.repository?.directory) failures.push(`${file}: missing repository directory`);
  if (!Array.isArray(packageJson.files)) {
    failures.push(`${file}: missing files allowlist`);
  } else if (file === "packages/tokens/package.json") {
    if (!packageJson.files.includes("dist")) {
      failures.push(`${file}: missing files dist allowlist`);
    }
  } else if (!packageJson.files.includes("src")) {
    failures.push(`${file}: missing files src allowlist`);
  }
});

[
  "packages/tokens/dist/index.d.ts",
  "packages/tokens/dist/js/tokens.js",
  "packages/tokens/dist/css/variables.css",
  "packages/icons/src/index.ts",
  "packages/icons/src/index.d.ts",
  "packages/icons/src/icons.svg",
  "packages/ui-react/src/index.ts",
  "packages/ui-react/src/styles.css",
  "packages/ui-react/src/styles/tokens.css",
  "packages/ui-react/src/utils/classNames.ts",
  "packages/ui-react/src/utils/dateUtils.ts",
].forEach(requireFile);

// Folder-based components (CSS Modules). File-unit legacy components are not required.
[
  "Alert",
  "Avatar",
  "Breadcrumb",
  "Button",
  "Chip",
  "DataTable",
  "DatePicker",
  "DateTimePicker",
  "Dialog",
  "Divider",
  "Drawer",
  "Dropdown",
  "Icon",
  "IconButton",
  "Select",
  "Spinner",
  "Switch",
  "Tabs",
  "TextArea",
  "TextInput",
  "TimePicker",
  "Toast",
  "Tooltip",
  "Typography",
].forEach((name) => requireFolderComponent(name));

requireIncludes("packages/ui-react/src/index.ts", [
  "Button",
  "IconButton",
  "TextInput",
  "TextArea",
  "Select",
  "Chip",
  "DataTable",
  "Dialog",
  "Drawer",
  "Spinner",
  "Switch",
  "Tabs",
  "Icon",
  "IconSpriteProvider",
  "Avatar",
  "Breadcrumb",
  "DatePicker",
  "TimePicker",
  "DateTimePicker",
  "Dropdown",
  "Tooltip",
  "Toast",
  "Typography",
  "Alert",
  "Divider",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  '@import "./styles/normalize.css"',
  '@import "./styles/tokens.css"',
]);

requireIncludes("packages/ui-react/src/components/Button/Button.tsx", [
  "export type ButtonProps",
  "React.forwardRef<HTMLButtonElement, ButtonProps>",
  "aria-busy={loading || undefined}",
  'Button.displayName = "Button"',
]);

requireIncludes("packages/ui-react/src/components/Icon/Icon.tsx", [
  "export type IconProps",
  "name: IconName",
  "<use href=",
  "IconSpriteProvider",
  'Icon.displayName = "Icon"',
]);

requireIncludes("packages/ui-react/src/components/DatePicker/DatePicker.tsx", [
  "export type DatePickerProps",
  "DatePicker.displayName",
]);

requireIncludes("packages/ui-react/src/utils/dateUtils.ts", [
  "export const createDateFormatters",
  "Intl.DateTimeFormat",
]);

requireIncludes("packages/tokens/dist/css/variables.css", [
  "--brand-500",
  "--background-primary",
  "--spacing-04",
  "--rounded-md",
  ":root",
  ".dark",
]);

if (exists("packages/ui-react/package.json")) {
  const uiReact = readJson("packages/ui-react/package.json");
  const uiTokens = exists("packages/tokens/package.json")
    ? readJson("packages/tokens/package.json")
    : undefined;
  const uiIcons = exists("packages/icons/package.json")
    ? readJson("packages/icons/package.json")
    : undefined;
  if (!uiReact.peerDependencies?.react) {
    failures.push("packages/ui-react/package.json: missing react peer dependency");
  }
  if (!uiReact.dependencies?.["@idenflu/ui-tokens"]) {
    failures.push("packages/ui-react/package.json: missing token dependency");
  }
  if (!uiReact.dependencies?.["@idenflu/ui-icons"]) {
    failures.push("packages/ui-react/package.json: missing icon dependency");
  }
  if (uiReact.dependencies?.["@idenflu/ui-tokens"]?.startsWith("workspace:")) {
    failures.push(
      "packages/ui-react/package.json: publish dependencies must not use workspace protocol"
    );
  }
  if (uiReact.dependencies?.["@idenflu/ui-icons"]?.startsWith("workspace:")) {
    failures.push(
      "packages/ui-react/package.json: publish dependencies must not use workspace protocol"
    );
  }
  if (uiTokens && uiReact.dependencies?.["@idenflu/ui-tokens"] !== uiTokens.version) {
    failures.push(
      "packages/ui-react/package.json: @idenflu/ui-tokens dependency must match package version"
    );
  }
  if (uiIcons && uiReact.dependencies?.["@idenflu/ui-icons"] !== uiIcons.version) {
    failures.push(
      "packages/ui-react/package.json: @idenflu/ui-icons dependency must match package version"
    );
  }
}

[
  "docs/react-package-plan.md",
  "packages/tokens/dist/js/tokens.js",
  "packages/icons/src/index.ts",
  "packages/ui-react/src/index.ts",
  "packages/ui-react/src/styles.css",
].forEach(requireNoPlaceholders);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("package skeleton check ok");
