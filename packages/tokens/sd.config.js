import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import {
  idenfluCssTransformGroup,
  idenfluTransforms,
} from "./sd.transforms.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_BUILD_PATH = path.join(__dirname, "dist/css");
const JS_BUILD_PATH = path.join(__dirname, "dist/js");

const BASE_SOURCE = [
  "src/rounded/rounded.json",
  "src/colors/colors.json",
  "src/spacing/spacing.json",
  "src/typography/font.json",
  "src/typography/typo-styles.json",
  "src/layout/tokens.json",
];

const LIGHT_THEME_SOURCE = "src/themes/light.json";
const DARK_THEME_SOURCE = "src/themes/dark.json";

const sdHooks = {
  transforms: idenfluTransforms,
  transformGroups: {
    "idenflu/css": idenfluCssTransformGroup,
  },
};

/**
 * @param {import('style-dictionary/types').TransformedToken} token
 */
function isDarkThemeToken(token) {
  return token.filePath?.includes("dark.json") ?? false;
}

/**
 * @param {{
 *   source: string[];
 *   selector: string;
 *   filter?: (token: import('style-dictionary/types').TransformedToken) => boolean;
 * }} options
 */
async function buildCssSection({ source, selector, filter }) {
  const tempDestination = `_section-${selector.replace(/[^a-z]/gi, "")}.css`;

  const sd = new StyleDictionary({
    hooks: sdHooks,
    source,
    platforms: {
      css: {
        transformGroup: "idenflu/css",
        buildPath: "dist/css/",
        files: [
          {
            destination: tempDestination,
            format: "css/variables",
            ...(filter ? { filter } : {}),
            options: {
              outputReferences: true,
              selector,
            },
          },
        ],
      },
    },
  });

  await sd.buildPlatform("css");

  const tempPath = path.join(CSS_BUILD_PATH, tempDestination);
  const content = await fs.readFile(tempPath, "utf8");
  await fs.unlink(tempPath);
  return content.trimEnd();
}

await fs.mkdir(CSS_BUILD_PATH, { recursive: true });

const [lightCss, darkCss] = await Promise.all([
  buildCssSection({
    source: [...BASE_SOURCE, LIGHT_THEME_SOURCE],
    selector: ":root",
  }),
  buildCssSection({
    source: ["src/colors/colors.json", DARK_THEME_SOURCE],
    selector: ".dark",
    filter: isDarkThemeToken,
  }),
]);

const variablesCss = `${lightCss}\n\n${darkCss}\n`;

await Promise.all([
  fs.writeFile(path.join(CSS_BUILD_PATH, "variables.css"), variablesCss),
  fs.rm(path.join(CSS_BUILD_PATH, "_variables-light.css"), { force: true }),
  fs.rm(path.join(CSS_BUILD_PATH, "_variables-dark.css"), { force: true }),
]);

const sdJs = new StyleDictionary({
  hooks: sdHooks,
  source: [...BASE_SOURCE, LIGHT_THEME_SOURCE],
  platforms: {
    js: {
      transformGroup: "idenflu/css",
      buildPath: "dist/js/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/esm",
          options: {
            flat: true,
          },
        },
      ],
    },
  },
});

await sdJs.buildPlatform("js");

const tokensDeclaration = `declare const tokens: Record<string, string | number>;

export default tokens;
`;

await Promise.all([
  fs.writeFile(path.join(__dirname, "dist/index.d.ts"), tokensDeclaration),
  fs.writeFile(path.join(JS_BUILD_PATH, "tokens.d.ts"), tokensDeclaration),
]);
