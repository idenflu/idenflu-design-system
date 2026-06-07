import tokens from "./tokens.json";

export { tokens };

export const cssVariablePrefix = "--if";
export const themeAttribute = "data-if-theme";

export const colorTokens = {
  primary: "var(--if-color-primary)",
  primaryHover: "var(--if-color-primary-hover)",
  surfaceRaised: "var(--if-color-surface-raised)",
  ink: "var(--if-color-ink)",
  inkMuted: "var(--if-color-ink-muted)",
  hairline: "var(--if-color-hairline)",
  success: "var(--if-color-success)",
  warning: "var(--if-color-warning)",
  error: "var(--if-color-error)",
} as const;

export const spacingTokens = {
  xs: "var(--if-space-xs)",
  sm: "var(--if-space-sm)",
  md: "var(--if-space-md)",
  lg: "var(--if-space-lg)",
  xl: "var(--if-space-xl)",
} as const;

export const sizingTokens = {
  controlSm: "var(--if-control-height-sm)",
  control: "var(--if-control-height)",
  controlLg: "var(--if-control-height-lg)",
  field: "var(--if-field-height)",
} as const;

export type ColorToken = keyof typeof colorTokens;
export type SpacingToken = keyof typeof spacingTokens;
export type SizingToken = keyof typeof sizingTokens;
