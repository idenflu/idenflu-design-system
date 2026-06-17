const PX_NUMBER_TOKEN_PATHS = new Set(["font.Size", "font.LineHeight"]);

const PX_NUMBER_TOKEN_NAMES = new Set([
  "header-height",
  "side-nav-width",
  "tabs-height",
]);

/**
 * @param {import('style-dictionary/types').DesignToken} token
 * @param {{ usesDtcg?: boolean }} options
 */
export function isPxNumberToken(token, options = {}) {
  const type = options.usesDtcg ? token.$type : token.type;
  if (type !== "number") return false;

  const path = token.path ?? [];
  if (path.length === 0) return false;

  const prefix = path.slice(0, 2).join(".");
  if (PX_NUMBER_TOKEN_PATHS.has(prefix)) return true;

  const root = path[0];
  if (typeof root !== "string") return false;

  if (PX_NUMBER_TOKEN_NAMES.has(root)) return true;
  if (root.startsWith("rounded-") || root.startsWith("spacing-")) return true;

  return false;
}

export const idenfluCssTransformGroup = [
  "attribute/cti",
  "name/kebab",
  "time/seconds",
  "html/icon",
  "size/rem",
  "size/number-to-px",
  "color/css",
  "asset/url",
  "fontFamily/css",
  "cubicBezier/css",
  "strokeStyle/css/shorthand",
  "border/css/shorthand",
  "typography/css/shorthand",
  "transition/css/shorthand",
  "shadow/css/shorthand",
];

export const idenfluTransforms = {
  "size/number-to-px": {
    type: "value",
    filter: isPxNumberToken,
    transform: (token, _platform, options = {}) => {
      const value = options.usesDtcg ? token.$value : token.value;
      return `${value}px`;
    },
  },
};
