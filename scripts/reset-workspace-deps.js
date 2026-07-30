/**
 * Changesets may rewrite ignored dependents to exact versions.
 * Keep monorepo-linked @idenflu deps on "*" so packages can release independently.
 */
const fs = require("fs");
const path = require("path");

function resetStars(relativePath, deps) {
  const filePath = path.join(__dirname, "..", relativePath);
  if (!fs.existsSync(filePath)) return;

  const pkg = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  for (const name of deps) {
    if (pkg.dependencies?.[name] && pkg.dependencies[name] !== "*") {
      pkg.dependencies[name] = "*";
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`reset ${relativePath} workspace deps to *`);
  }
}

resetStars("packages/ui-react/package.json", ["@idenflu/ui-tokens", "@idenflu/ui-icons"]);
