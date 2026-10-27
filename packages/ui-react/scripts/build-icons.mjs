import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);

execFileSync(
  process.execPath,
  [require.resolve("typescript/bin/tsc"), "-p", "tsconfig.icons.json"],
  {
    cwd: packageRoot,
    stdio: "inherit",
  },
);
await build({
  absWorkingDir: packageRoot,
  entryPoints: ["src/icons/index.ts"],
  outfile: "dist/icons/index.mjs",
  bundle: true,
  format: "esm",
  platform: "neutral",
  target: "es2020",
  jsx: "automatic",
  external: ["react", "react/jsx-runtime"],
});
