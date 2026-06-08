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
  if (!packageJson.types) failures.push(`${file}: missing top-level types field`);
  if (packageJson.types && packageJson.exports?.["."]?.types !== packageJson.types) {
    failures.push(`${file}: exports . types must match top-level types`);
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
  "packages/ui-react/src/components/SelectListbox.tsx",
  "packages/ui-react/src/components/Badge.tsx",
  "packages/ui-react/src/components/Chip.tsx",
  "packages/ui-react/src/components/Card.tsx",
  "packages/ui-react/src/components/Table.tsx",
  "packages/ui-react/src/components/EmptyState.tsx",
  "packages/ui-react/src/components/Dialog.tsx",
  "packages/ui-react/src/components/Drawer.tsx",
  "packages/ui-react/src/components/Toolbar.tsx",
  "packages/ui-react/src/components/LoadingState.tsx",
  "packages/ui-react/src/components/ErrorState.tsx",
  "packages/ui-react/src/components/Switch.tsx",
  "packages/ui-react/src/components/Checkbox.tsx",
  "packages/ui-react/src/components/RadioGroup.tsx",
  "packages/ui-react/src/components/SegmentedControl.tsx",
  "packages/ui-react/src/components/Tabs.tsx",
  "packages/ui-react/src/components/Icon.tsx",
  "packages/ui-react/src/components/Avatar.tsx",
  "packages/ui-react/src/components/Skeleton.tsx",
  "packages/ui-react/src/components/Banner.tsx",
  "packages/ui-react/src/components/Breadcrumb.tsx",
  "packages/ui-react/src/components/DatePicker.tsx",
  "packages/ui-react/src/utils/dateUtils.ts",
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
  "Dialog",
  "Drawer",
  "Toolbar",
  "LoadingState",
  "ErrorState",
  "Switch",
  "Checkbox",
  "RadioGroup",
  "SegmentedControl",
  "Tabs",
  "Icon",
  "IconSpriteProvider",
  "Avatar",
  "Skeleton",
  "SkeletonProps",
  "SkeletonVariant",
  "Banner",
  "BannerProps",
  "BannerTone",
  "Breadcrumb",
]);

requireIncludes("packages/ui-react/src/components/Icon.tsx", [
  "export type IconSize",
  "name: IconName",
  "<use href=",
  "IconSpriteProvider",
  "Icon.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-icon",
]);

requireIncludes("packages/ui-react/src/components/Avatar.tsx", [
  "export type AvatarSize = \"small\" | \"medium\" | \"large\"",
  "export type AvatarPresence = \"online\" | \"busy\"",
  "React.forwardRef<HTMLSpanElement, AvatarProps>",
  "if-avatar__presence",
  "Avatar.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-avatar",
  ".if-avatar.is-muted",
  ".if-avatar__presence",
  ".if-avatar--small",
]);

requireIncludes("packages/ui-react/src/components/Skeleton.tsx", [
  "export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>",
  "Skeleton.displayName = \"Skeleton\";",
  "export type SkeletonVariant = \"text\" | \"block\" | \"circle\";",
  "classNames(\"if-skeleton\", `if-skeleton--${variant}`, className)",
  "aria-hidden=\"true\"",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-skeleton {",
  ".if-skeleton--text {",
  ".if-skeleton__line.is-last {",
  "@keyframes if-skeleton-shimmer {",
]);

requireIncludes("packages/ui-react/src/components/Banner.tsx", [
  "export type BannerTone = \"info\" | \"success\" | \"warning\" | \"error\";",
  "React.forwardRef<HTMLDivElement, BannerProps>",
  "role={tone === \"error\" ? \"alert\" : \"status\"}",
  "aria-label={dismissLabel ?? \"Dismiss\"}",
  "Banner.displayName = \"Banner\";",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-banner {",
  ".if-banner__dismiss {",
  ".if-banner--error {",
  ".if-banner--warning {",
]);

requireIncludes("packages/ui-react/src/components/Breadcrumb.tsx", [
  "export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(",
  "aria-label={label ?? \"Breadcrumb\"}",
  "className=\"if-breadcrumb__list\"",
  "aria-current=\"page\"",
  "Breadcrumb.displayName = \"Breadcrumb\";",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-breadcrumb__list",
  ".if-breadcrumb__separator",
  ".if-breadcrumb__link",
  ".if-breadcrumb__current",
]);

requireIncludes("packages/ui-react/src/components/DatePicker.tsx", [
  "export type DateRange",
  "role=\"dialog\"",
  "role=\"grid\"",
  "if-datepicker__trigger",
  "locale?: string",
  "DatePicker.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-datepicker__trigger",
  ".if-datecal__row",
  ".if-datecal__day",
]);

requireIncludes("packages/ui-react/src/utils/dateUtils.ts", [
  "export const createDateFormatters",
  "Intl.DateTimeFormat",
]);

requireIncludes("packages/ui-react/src/components/Checkbox.tsx", [
  "export type CheckboxSize = \"small\" | \"medium\"",
  "type=\"checkbox\"",
  "if-checkbox__control",
  "indeterminate",
  "Checkbox.displayName",
]);

requireIncludes("packages/ui-react/src/components/RadioGroup.tsx", [
  "export type RadioOption",
  "type=\"radio\"",
  "if-radio__control",
  "<legend",
  "RadioGroup.displayName",
]);

requireIncludes("packages/ui-react/src/components/SegmentedControl.tsx", [
  "export type SegmentedOption",
  "role=\"group\"",
  "aria-pressed={selected}",
  "if-segmented__option",
  "SegmentedControl.displayName",
]);

requireIncludes("packages/ui-react/src/components/Tabs.tsx", [
  "export type TabItem",
  "role=\"tab\"",
  "aria-selected={selected}",
  "if-tabs__list",
  "Tabs.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-tabs",
  ".if-tabs__tab.is-selected",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-checkbox",
  ".if-checkbox__control:checked",
  ".if-radio-group",
  ".if-radio__control",
  ".if-segmented",
  ".if-segmented__option",
]);

requireIncludes("packages/ui-react/src/components/Switch.tsx", [
  "export type SwitchSize = \"small\" | \"medium\"",
  "role=\"switch\"",
  "if-switch__control",
  "aria-describedby={describedBy}",
  "Switch.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-switch",
  ".if-switch__control",
  ".if-switch__control:checked",
  ".if-switch--small",
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

requireIncludes("packages/ui-react/src/components/SelectListbox.tsx", [
  "role=\"listbox\"",
  "aria-multiselectable",
  "aria-activedescendant",
  "if-select__trigger",
  "SelectListbox.displayName",
]);

requireIncludes("packages/ui-react/src/components/Select.tsx", [
  "expanded?: boolean",
  "multiple?: boolean",
  "searchable?: boolean",
  "onValueChange",
  "SelectListbox",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-select__trigger",
  ".if-select__panel",
  ".if-select__option",
]);

requireIncludes("packages/ui-react/src/components/Dialog.tsx", [
  "role=\"dialog\"",
  "aria-modal=\"true\"",
  "if-dialog__backdrop",
  "export type DialogProps",
  "if-dialog--${size}",
  "export const DialogClose",
]);

requireIncludes("packages/ui-react/src/components/Drawer.tsx", [
  "export type DrawerSide = \"left\" | \"right\"",
  "export type DrawerSize = \"sm\" | \"md\" | \"lg\"",
  "role=\"dialog\"",
  "aria-modal=\"true\"",
  "if-drawer__backdrop",
  "aria-label={closeLabel}",
]);

requireIncludes("packages/ui-react/src/components/Toolbar.tsx", [
  "export type ToolbarProps = React.HTMLAttributes<HTMLDivElement>",
  "React.forwardRef<HTMLDivElement, ToolbarProps>",
  "role=\"toolbar\"",
  "aria-label={label}",
  "if-toolbar",
  "ToolbarGroup",
]);

requireIncludes("packages/ui-react/src/components/LoadingState.tsx", [
  "export type LoadingStateSize = \"small\" | \"medium\" | \"large\";",
  "export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(",
  "role=\"status\"",
  "aria-live=\"polite\"",
  "className=\"if-loading-state__spinner\"",
  "LoadingState.displayName = \"LoadingState\";",
]);

requireIncludes("packages/ui-react/src/components/ErrorState.tsx", [
  "export type ErrorStateTone = \"error\" | \"warning\" | \"critical\"",
  "React.forwardRef<HTMLDivElement, ErrorStateProps>",
  "role={tone === \"warning\" ? \"status\" : \"alert\"}",
  "if-error-state",
  "ErrorState.displayName = \"ErrorState\"",
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
  "font-weight: 450",
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

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-dialog__backdrop",
  ".if-dialog--medium",
  ".if-dialog__header",
  ".if-dialog__footer",
  ".if-dialog__close",
  ".if-drawer",
  ".if-drawer__backdrop",
  ".if-drawer--right",
  ".if-drawer--left",
  ".if-drawer__header",
  ".if-drawer__close:focus-visible",
  ".if-toolbar",
  ".if-toolbar--compact",
  ".if-toolbar--between",
  ".if-toolbar__group",
  ".if-toolbar__group--end",
  ".if-loading-state {",
  ".if-loading-state__spinner {",
  ".if-loading-state__label {",
  ".if-loading-state--small {",
  ".if-loading-state--large .if-loading-state__spinner {",
  "@keyframes if-loading-spin {",
  ".if-error-state",
  ".if-error-state__title",
  ".if-error-state__action",
  ".if-error-state--warning",
  ".if-error-state--critical",
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
