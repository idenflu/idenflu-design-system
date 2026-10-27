import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DOMParser } from "@xmldom/xmldom";
import * as icons from "@idenflu/ui-react/icons";
import { generateIcons } from "./generate-icons.mjs";

const require = createRequire(import.meta.url);
const packageRoot = fileURLToPath(new URL("../", import.meta.url));
const parse = (source) =>
  new DOMParser().parseFromString(source, "image/svg+xml");
const sprite = await readFile(
  new URL("../../icons/src/icons.svg", import.meta.url),
  "utf8",
);

test("public types allow numeric size and SVG refs, and reject sprite and drawing props", () => {
  execFileSync(
    process.execPath,
    [
      require.resolve("typescript/bin/tsc"),
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--jsx",
      "react-jsx",
      "--module",
      "ESNext",
      "--moduleResolution",
      "Bundler",
      "--target",
      "ES2020",
      "scripts/icons.types.tsx",
    ],
    { cwd: packageRoot, stdio: "inherit" },
  );
});

test("every source symbol has an exported component with unchanged drawing attributes", () => {
  const symbols = Array.from(parse(sprite).getElementsByTagName("symbol"));
  assert.equal(Object.keys(icons).length, symbols.length);
  for (const symbol of symbols) {
    const name =
      symbol
        .getAttribute("id")
        .split("-")
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join("") + "Icon";
    assert(icons[name], `Missing ${name}`);
    const svg = parse(
      renderToStaticMarkup(React.createElement(icons[name])),
    ).documentElement;
    const sourceNodes = [
      symbol,
      ...Array.from(symbol.getElementsByTagName("*")),
    ];
    const renderedNodes = [svg, ...Array.from(svg.getElementsByTagName("*"))];
    assert.equal(renderedNodes.length, sourceNodes.length, name);
    sourceNodes.forEach((node, index) => {
      if (index > 0)
        assert.equal(renderedNodes[index].localName, node.localName, name);
      for (const attr of Array.from(node.attributes)) {
        if (attr.name === "id" && index === 0) continue;
        assert.equal(
          renderedNodes[index].getAttribute(attr.name),
          attr.value,
          `${name}: ${attr.name}`,
        );
      }
    });
  }
});

test("numeric sizes, labels, native props and inherited color work without sprite setup", () => {
  const decorative = parse(
    renderToStaticMarkup(React.createElement(icons.PlusIcon)),
  ).documentElement;
  assert.equal(decorative.getAttribute("width"), "16");
  assert.equal(decorative.getAttribute("height"), "16");
  assert.equal(decorative.getAttribute("aria-hidden"), "true");
  assert.equal(decorative.getAttribute("focusable"), "false");
  assert.equal(decorative.getAttribute("stroke"), "currentColor");
  assert.equal(decorative.getElementsByTagName("use").length, 0);
  const semantic = parse(
    renderToStaticMarkup(
      React.createElement(icons.WarningIcon, {
        size: 20,
        label: "경고",
        className: "custom-icon",
        "data-example": "warning",
        style: { color: "var(--theme-text-primary)" },
      }),
    ),
  ).documentElement;
  assert.equal(semantic.getAttribute("width"), "20");
  assert.equal(semantic.getAttribute("height"), "20");
  assert.equal(semantic.getAttribute("role"), "img");
  assert.equal(semantic.getAttribute("aria-label"), "경고");
  assert(!semantic.hasAttribute("aria-hidden"));
  assert.equal(semantic.getAttribute("class"), "custom-icon");
  assert.equal(semantic.getAttribute("data-example"), "warning");
  assert(
    semantic.getAttribute("style").includes("color:var(--theme-text-primary)"),
  );
});

test("a single public import excludes unused icons and all sprite dependencies", async () => {
  const result = await build({
    absWorkingDir: packageRoot,
    stdin: {
      contents: 'export { PlusIcon } from "@idenflu/ui-react/icons";',
      resolveDir: packageRoot,
    },
    bundle: true,
    write: false,
    format: "esm",
    metafile: true,
    external: ["react", "react/jsx-runtime"],
  });
  const code = result.outputFiles[0].text;
  assert(code.includes("M12 3.75v16.5"));
  assert(!code.includes("SearchIcon"));
  assert(!code.includes("WarningIcon"));
  assert(!/sprite|IconSpriteContext|ui-icons|\.svg["']/i.test(code));
  assert(!code.includes('"use"'));
});

test("local SVG references remain unique across repeated component instances", async () => {
  const generated = await generateIcons(
    `<svg xmlns="http://www.w3.org/2000/svg"><symbol id="clipped" viewBox="0 0 24 24" fill="none"><defs><clipPath id="clip"><rect width="24" height="24" /></clipPath></defs><g clip-path="url(#clip)"><path id="shape" d="M1 1h10"/><use href="#shape"/></g></symbol></svg>`,
  );
  const result = await build({
    stdin: {
      contents: generated.get("ClippedIcon.tsx"),
      loader: "tsx",
      resolveDir: `${packageRoot}/src/icons/generated`,
    },
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    jsx: "automatic",
    external: ["react", "react/jsx-runtime"],
  });
  const module = { exports: {} };
  new Function("require", "module", "exports", result.outputFiles[0].text)(
    require,
    module,
    module.exports,
  );
  const { ClippedIcon } = module.exports;
  const document = parse(
    renderToStaticMarkup(
      React.createElement(
        "svg",
        null,
        React.createElement(ClippedIcon),
        React.createElement(ClippedIcon),
      ),
    ),
  );
  const nodes = Array.from(document.getElementsByTagName("*"));
  const ids = nodes
    .filter((node) => node.hasAttribute("id"))
    .map((node) => node.getAttribute("id"));
  assert.equal(ids.length, 4);
  assert.equal(new Set(ids).size, ids.length);
  for (const node of nodes) {
    if (node.hasAttribute("href"))
      assert(ids.includes(node.getAttribute("href").slice(1)));
    if (node.hasAttribute("clip-path"))
      assert(ids.includes(node.getAttribute("clip-path").slice(5, -1)));
  }
});

test("generation rejects malformed SVG, duplicate names, export collisions and missing references", async () => {
  for (const source of [
    '<svg><symbol id="broken"></svg>',
    '<svg><symbol id="plus"/><symbol id="plus"/></svg>',
    '<svg><symbol id="a-1"/><symbol id="a1"/></svg>',
    '<svg><symbol id="missing"><use href="#other"/></symbol></svg>',
  ])
    await assert.rejects(generateIcons(source));
});
