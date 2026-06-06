const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const screenshotDir = path.join(rootDir, ".qa", "screenshots");
const dryRun = process.argv.includes("--dry-run");
const baseUrlArg = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseUrlArg ? baseUrlArg.split("=")[1] : `file://${rootDir}/`;

const viewports = [
  { name: "desktop", width: 1440, height: 1100 },
  { name: "mobile", width: 390, height: 900 },
];

const themeModes = ["light", "dark"];

const screenshotScenarios = [
  {
    name: "component-depth-buttons",
    file: "components-buttons.html",
    hash: "#component-template-map",
    requiredSelectors: ["#component-template-map", "#context-example", "#token-contract"],
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
  console.log(`browser QA ok (${screenshotScenarios.length * viewports.length * themeModes.length} screenshots, ${interactionScenarios.length} interactions)`);
};

if (dryRun) {
  validateDryRun();
} else {
  runBrowserQa();
}
