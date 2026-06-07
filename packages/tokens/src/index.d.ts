import tokens from "./tokens.json";

export { tokens };

export declare const cssVariablePrefix = "--if";
export declare const themeAttribute = "data-if-theme";

export declare const colorTokens: {
  readonly primary: "var(--if-color-primary)";
  readonly primaryHover: "var(--if-color-primary-hover)";
  readonly surfaceRaised: "var(--if-color-surface-raised)";
  readonly ink: "var(--if-color-ink)";
  readonly inkMuted: "var(--if-color-ink-muted)";
  readonly hairline: "var(--if-color-hairline)";
  readonly success: "var(--if-color-success)";
  readonly warning: "var(--if-color-warning)";
  readonly error: "var(--if-color-error)";
};

export declare const spacingTokens: {
  readonly xs: "var(--if-space-xs)";
  readonly sm: "var(--if-space-sm)";
  readonly md: "var(--if-space-md)";
  readonly lg: "var(--if-space-lg)";
  readonly xl: "var(--if-space-xl)";
};

export declare const sizingTokens: {
  readonly controlSm: "var(--if-control-height-sm)";
  readonly control: "var(--if-control-height)";
  readonly controlLg: "var(--if-control-height-lg)";
  readonly field: "var(--if-field-height)";
};

export declare const motionTokens: {
  readonly durationFast: "var(--if-duration-fast)";
  readonly durationBase: "var(--if-duration-base)";
  readonly durationSlow: "var(--if-duration-slow)";
  readonly easeStandard: "var(--if-ease-standard)";
  readonly easeEmphasized: "var(--if-ease-emphasized)";
};

export type ColorToken = keyof typeof colorTokens;
export type SpacingToken = keyof typeof spacingTokens;
export type SizingToken = keyof typeof sizingTokens;
export type MotionToken = keyof typeof motionTokens;
