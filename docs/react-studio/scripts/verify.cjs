const { spawn } = require("node:child_process");
const path = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "../../..");
const ids = require("../../api/index.json").components;
const base = "http://127.0.0.1:5179/";
const server = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "--config", "docs/react-studio/vite.config.ts", "--host", "127.0.0.1", "--port", "5179", "--strictPort"], { cwd: root, stdio: "pipe" });
let serverError = "";
server.stderr.on("data", data => { serverError += data; });
async function ready() {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Document server exited: ${serverError}`);
    try { if ((await fetch(base)).ok) return; } catch { /* Server is starting. */ }
    await delay(100);
  }
  throw new Error(`Document server did not start: ${serverError}`);
}
function check(condition, message) { if (!condition) throw new Error(message); }
(async () => {
  let browser;
  try {
    await ready();
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base);
    const loadedFonts = await page.evaluate(async () => {
      const faces = await document.fonts.load('14px "Pretendard Variable"', "한글");
      return faces.filter(face => face.status === "loaded").length;
    });
    check(loadedFonts > 0, "styles.css did not load Pretendard");
    for (const id of ids) {
      await page.goto(`${base}#/components/${id}`);
      await page.locator("main h1").first().waitFor();
      check(await page.locator(".preview").count() === 1, `${id}: missing preview`);
      check(await page.locator("table tbody tr").count() > 0, `${id}: missing API reference`);
    }
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
    await page.goto(`${base}#/components/button`);
    await page.getByRole("button", { name: "복사", exact: true }).click();
    await page.getByRole("button", { name: "복사됨", exact: true }).waitFor();
    check((await page.evaluate(() => navigator.clipboard.readText())).includes('<Button>저장</Button>'), "Code copy did not write the example");
    await page.goto(`${base}#/components/select`);
    const select = page.getByRole("combobox", { name: /담당 팀/ });
    await select.click();
    await page.getByRole("option", { name: "디자인", exact: true }).click();
    check((await select.getAttribute("aria-label")).includes("디자인"), "Select did not update");
    await page.goto(`${base}#/examples`);
    check(await page.locator(".data-grid tbody tr").count() === 3, "Workspace example is missing rows");
    await page.getByRole("tab", { name: "프로젝트 목록" }).focus();
    await page.keyboard.press("ArrowRight");
    await page.getByLabel("프로젝트 이름").waitFor();
    check(await page.getByRole("tab", { name: "프로젝트 만들기" }).getAttribute("aria-selected") === "true", "Example tabs did not respond to keyboard");
    await page.getByRole("tab", { name: "프로젝트 목록" }).click();
    await page.getByRole("button", { name: "프로젝트 만들기", exact: true }).first().click();
    check(await page.getByLabel("프로젝트 이름").count() === 1, "Form example did not open");
    await page.goto(base);
    await page.getByRole("button", { name: "다크 테마로 전환" }).click();
    check(await page.locator("html").getAttribute("data-theme") === "dark", "Dark theme was not applied");
    await page.setViewportSize({ width: 375, height: 812 });
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    await page.getByLabel("컴포넌트 검색").fill("Select");
    const navigation = page.getByRole("navigation", { name: "문서 탐색" });
    check(await navigation.getByRole("button", { name: "Select", exact: true }).count() === 1, "Mobile search failed");
    await navigation.getByRole("button", { name: "Select", exact: true }).click();
    check(page.url().endsWith("#/components/select"), "Tree navigation did not update the URL");
    await page.getByRole("heading", { name: "Select", exact: true }).waitFor();
    check(await page.getByRole("heading", { name: "Select", exact: true }).count() === 1, "Tree navigation did not open the page");
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    check(await navigation.getByRole("button", { name: "Select", exact: true }).getAttribute("aria-current") === "true", "Tree selection does not match the page");
    const widths = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    check(widths[0] <= widths[1], `Mobile page overflows: ${widths}`);
    await page.goto(`${base}#/patterns/layout`);
    check(await page.getByRole("link", { name: /샘플 화면 열기/ }).count() === 1, "Layout sample link is missing");
    await page.goto(`${base}?layout=sidebar`);
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    await page.getByRole("dialog", { name: "업무 탐색" }).getByRole("button", { name: "프로젝트 만들기" }).click();
    await page.getByLabel("프로젝트 이름").fill("유지되는 입력");
    await page.getByRole("tab", { name: "대시보드" }).click();
    await page.getByRole("tab", { name: /프로젝트 만들기/ }).click();
    check(await page.getByLabel("프로젝트 이름").inputValue() === "유지되는 입력", "Sample tab lost form state");
    await page.getByRole("tab", { name: /프로젝트 만들기/ }).press("Delete");
    check(await page.getByRole("tab", { name: /프로젝트 만들기/ }).count() === 0, "Sample tab did not close");
    await page.getByRole("button", { name: "메뉴 열기" }).click();
    await page.getByRole("dialog", { name: "업무 탐색" }).getByRole("button", { name: "프로젝트 목록" }).click();
    check(await page.getByRole("heading", { name: "프로젝트", exact: true }).count() === 1, "Sample project page did not open");
    const sampleWidths = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    check(sampleWidths[0] <= sampleWidths[1], `Mobile sample overflows: ${sampleWidths}`);
    check(errors.length === 0, `Browser errors: ${errors.join(", ")}`);
    console.log(`React docs: ${ids.length} component pages and primary interactions passed.`);
  } finally {
    await browser?.close();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
