import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const packageDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(packageDir, "../../..");
const foundationsDir = resolve(repoRoot, "docs/foundations");

const config: StorybookConfig = {
  stories: [
    "./Configure.mdx",
    "../../../docs/foundations/**/*.mdx",
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(config) {
    return mergeConfig(config, {
      // Keep the icon sprite as an external asset so `<use href="…icons.svg#id">` resolves.
      build: {
        assetsInlineLimit: 0,
      },
      resolve: {
        alias: {
          "@foundations": foundationsDir,
        },
      },
    });
  },
};
export default config;
