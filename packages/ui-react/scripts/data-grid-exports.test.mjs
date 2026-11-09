import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { build } from "esbuild";

const require = createRequire(import.meta.url);
const bundle = await build({
  entryPoints: [new URL("../src/components/DataGrid/index.ts", import.meta.url).pathname],
  bundle: true,
  write: false,
  platform: "node",
  format: "cjs",
  packages: "external",
  loader: { ".module.css": "empty", ".css": "empty" },
});
const exports = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(exports, exports.exports, require);
const { createDataGridCsv, createDataGridXlsx } = exports.exports;

test("CSV escapes delimiters and neutralizes formula-like text", () => {
  const csv = createDataGridCsv({
    columns: [{ header: "값", accessor: (row) => row }],
    rows: ["=1+1", "쉼표, 따옴표\"", -3],
  });
  assert.equal(csv, "\uFEFF값\r\n'=1+1\r\n\"쉼표, 따옴표\"\"\"\r\n-3\r\n");
});

test("XLSX serializes formula-like input as inline text", () => {
  const bytes = createDataGridXlsx({
    columns: [{ header: "값", accessor: (row) => row }],
    rows: ["=1+1"],
  });
  const contents = new TextDecoder().decode(bytes);
  assert.equal(bytes[0], 0x50);
  assert.equal(bytes[1], 0x4b);
  assert.match(contents, /xl\/worksheets\/sheet1\.xml/);
  assert.match(contents, /<t[^>]*>=1\+1<\/t>/);
  assert.doesNotMatch(contents, /<f[ >]/);
});
