const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const screenshotDir = path.join(rootDir, ".qa", "screenshots");
const dryRun = process.argv.includes("--dry-run");
const baseUrlArg = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseUrlArg ? baseUrlArg.split("=")[1] : `file://${rootDir}/`;

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "tablet", width: 768, height: 900 },
  { name: "mobile", width: 390, height: 900 },
];

const themeModes = ["light", "dark"];

const layoutAuditSelectors = [
  ".component-token-contract",
  ".component-api-contract",
  ".spec-table",
  ".decision-table",
  ".state-table",
  ".a11y-table",
  ".tooltip-popover-board .tooltip-anchor",
  ".filter-toolbar",
];

const screenshotScenarios = [
  {
    name: "component-depth-buttons",
    file: "components-buttons.html",
    hash: "#component-template-map",
    requiredSelectors: ["#component-template-map", "#context-example", "#token-contract"],
  },
  {
    name: "component-menu-responsive",
    file: "components-menu.html",
    hash: "#menu",
    requiredSelectors: ["#menu", ".menu-demo-grid", ".menu-demo-surface", ".interaction-contract-grid"],
  },
  {
    name: "component-combobox-responsive",
    file: "components-combobox.html",
    hash: "#combobox",
    requiredSelectors: ["#combobox", ".combobox-demo-grid", ".combobox-demo-surface", ".interaction-contract-grid"],
  },
  {
    name: "component-table-responsive",
    file: "components-table.html",
    hash: "#table",
    requiredSelectors: ["#table", ".table-shell", ".component-anatomy-visual", ".interaction-contract-grid"],
  },
  {
    name: "component-overlays-responsive",
    file: "components-overlays.html",
    hash: "#overlay-interactions",
    requiredSelectors: ["#overlay-interactions", ".overlay-case-grid", ".interaction-contract-grid"],
  },
  {
    name: "component-depth-overlays",
    file: "components-overlays.html",
    hash: "#overlay-interactions",
    requiredSelectors: ["#overlay-interactions", "[data-overlay-open=\"reject-modal\"]", "#reject-modal"],
  },
  {
    name: "examples-connected-workflow",
    file: "components-examples.html",
    hash: "#connected-workflow",
    requiredSelectors: ["#connected-workflow", ".connected-workflow-demo", ".screen-composition-demo"],
  },
  {
    name: "visual-qa-command-board",
    file: "visual-qa.html",
    hash: "#automation",
    requiredSelectors: ["#automation", ".qa-command-board"],
  },
  {
    name: "accessibility-interaction-qa",
    file: "accessibility.html",
    hash: "#interaction-qa",
    requiredSelectors: ["#interaction-qa", ".interaction-qa-grid"],
  },
];

const interactionScenarios = [
  {
    name: "overlay-focus-restore",
    file: "components-overlays.html",
    hash: "#overlay-interactions",
    run: async (page) => {
      const trigger = "[data-overlay-open=\"reject-modal\"]";

      await page.click(trigger);
      await page.waitForSelector("#reject-modal:not([hidden])");
      await page.keyboard.press("Tab");
      const activeInside = await page.evaluate(() => document.getElementById("reject-modal").contains(document.activeElement));
      await page.keyboard.press("Escape");
      await page.waitForSelector("#reject-modal[hidden]");
      const restored = await page.evaluate(() => document.activeElement === document.querySelector("[data-overlay-open=\"reject-modal\"]"));

      if (!activeInside) throw new Error("overlay focus escaped dialog");
      if (!restored) throw new Error("overlay focus did not restore to trigger");
    },
  },
  {
    name: "table-row-keyboard",
    file: "components-table.html",
    hash: "#table",
    run: async (page) => {
      await page.focus("[data-row-focus]");
      await page.keyboard.press("ArrowDown");
      const activeIndex = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll("[data-row-focus]"));
        return rows.indexOf(document.activeElement);
      });

      if (activeIndex !== 1) throw new Error(`expected second row focus, got ${activeIndex}`);
    },
  },
  {
    name: "combobox-keyboard",
    file: "components-inputs.html",
    hash: "#inputs",
    run: async (page) => {
      await page.focus("#component-owner-combobox");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      const value = await page.$eval("#component-owner-combobox", (input) => input.value);

      if (value !== "Alex Kim") throw new Error(`expected Alex Kim, got ${value}`);
    },
  },
];

const selectorToMarker = (selector) => {
  if (selector.startsWith("#")) return `id="${selector.slice(1)}"`;
  if (selector.startsWith(".")) return selector.slice(1);
  if (selector.startsWith("[") && selector.endsWith("]")) return selector.slice(1, -1).replaceAll("\\\"", "\"");
  return selector;
};

const scenarioUrl = (scenario) => `${baseUrl.replace(/\/$/, "")}/${scenario.file}${scenario.hash || ""}`;

const validateDryRun = () => {
  const failures = [];

  [...screenshotScenarios, ...interactionScenarios].forEach((scenario) => {
    const htmlPath = path.join(rootDir, scenario.file);

    if (!fs.existsSync(htmlPath)) {
      failures.push(`${scenario.name}: missing ${scenario.file}`);
      return;
    }

    const html = fs.readFileSync(htmlPath, "utf8");
    (scenario.requiredSelectors || []).forEach((selector) => {
      const marker = selectorToMarker(selector);
      if (!html.includes(marker)) failures.push(`${scenario.name}: missing selector marker ${selector}`);
    });
  });

  ["script.js", "styles.css"].forEach((file) => {
    if (!fs.existsSync(path.join(rootDir, file))) failures.push(`missing ${file}`);
  });

  ["layoutAuditSelectors", "collectLayoutFailures", "consoleFailures"].forEach((marker) => {
    if (!fs.readFileSync(__filename, "utf8").includes(marker)) failures.push(`browser QA missing ${marker}`);
  });

  if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
  }

  console.log(`browser QA dry run ok (${screenshotScenarios.length} screenshots, ${interactionScenarios.length} interactions)`);
};

const runBrowserQa = async () => {
  let chromium;

  try {
    ({ chromium } = await import("playwright"));
  } catch (error) {
    console.error("Playwright is not installed. Run with --dry-run or install Playwright in the QA environment.");
    console.error(error.message);
    process.exit(1);
  }

  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleFailures = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleFailures.push(message.text());
  });
  page.on("pageerror", (error) => {
    consoleFailures.push(error.message);
  });

  const collectLayoutFailures = async (scenario, viewport, theme) =>
    page.evaluate(
      ({ selectors, scenarioName, viewportName, themeName }) => {
        const failures = [];

        selectors.forEach((selector) => {
          document.querySelectorAll(selector).forEach((element) => {
            const scrollWidth = Math.ceil(element.scrollWidth);
            const clientWidth = Math.ceil(element.clientWidth);
            if (scrollWidth > clientWidth + 2) {
              failures.push(`${scenarioName}/${viewportName}/${themeName}: ${selector} overflow ${scrollWidth}/${clientWidth}`);
            }
          });
        });

        if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) {
          failures.push(
            `${scenarioName}/${viewportName}/${themeName}: page overflow ${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`,
          );
        }

        return failures;
      },
      {
        selectors: layoutAuditSelectors,
        scenarioName: scenario.name,
        viewportName: viewport.name,
        themeName: theme,
      },
    );

  const layoutFailures = [];

  for (const scenario of screenshotScenarios) {
    for (const viewport of viewports) {
      for (const theme of themeModes) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(scenarioUrl(scenario));
        await page.evaluate((nextTheme) => {
          document.documentElement.dataset.theme = nextTheme;
        }, theme);

        for (const selector of scenario.requiredSelectors) {
          await page.waitForSelector(selector);
        }

        layoutFailures.push(...(await collectLayoutFailures(scenario, viewport, theme)));

        await page.screenshot({
          path: path.join(screenshotDir, `${scenario.name}-${viewport.name}-${theme}.png`),
          fullPage: true,
        });
      }
    }
  }

  for (const scenario of interactionScenarios) {
    await page.goto(scenarioUrl(scenario));
    await scenario.run(page);
  }

  await browser.close();
  if (consoleFailures.length || layoutFailures.length) {
    console.error([...consoleFailures.map((failure) => `console: ${failure}`), ...layoutFailures].join("\n"));
    process.exit(1);
  }

  console.log(`browser QA ok (${screenshotScenarios.length * viewports.length * themeModes.length} screenshots, ${interactionScenarios.length} interactions)`);
};

if (dryRun) {
  validateDryRun();
} else {
  runBrowserQa();
}
