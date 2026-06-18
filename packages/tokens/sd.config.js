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

const BASE_SOURCE = [
  "src/rounded/rounded.tokens.json",
  "src/colors/colors.tokens.json",
  "src/spacing/spacing.tokens.json",
  "src/typography/typo.tokens.json",
  "src/typography/styles.tokens.json",
  "src/layout/tokens.json",
];

const LIGHT_THEME_SOURCE = "src/themes/light.tokens.json";
const DARK_THEME_SOURCE = "src/themes/dark.tokens.json";

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
  return token.filePath?.includes("dark.tokens.json") ?? false;
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
    source: ["src/colors/colors.tokens.json", DARK_THEME_SOURCE],
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
