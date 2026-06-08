# ui-react 플레이그라운드 정리·고도화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 플레이그라운드 단일 스크롤을 해시 라우팅 기반 카테고리 페이지로 분리하고, 페이지마다 주요 예시를 복사 가능한 코드블록과 함께 제공한다.

**Architecture:** 의존성 0의 자체 해시 라우터(`useHashRoute`) + 라우트 테이블(`routes.tsx`) + 사이드바 셸(`App.tsx`). 기존 `sections/`를 `pages/`로 옮기고 각 파일이 한 카테고리 페이지가 된다. 새 `<Example>` 프리미티브가 라이브 렌더 + plain `<pre>` 코드블록 + 복사 버튼을 묶는다.

**Tech Stack:** React 18 + Vite (source-only `@idenflu/ui-react` 소비), 디자인 토큰 CSS. 새 런타임 의존성 없음.

**테스트 정책 (이 저장소 고유):** 플레이그라운드는 `npm run check`에서 격리됨. 각 태스크 컴파일 스모크테스트 = `cd examples/playground && npx vite build`(esbuild 트랜스파일 성공 = import/구문 오류 없음). 시각·동작 검증은 컨트롤러가 태스크 경계에서 Claude Preview(dev 서버 :5199)로 수행. **커밋 시 소스 파일만 `git add`로 명시 — `dist/` 빌드 산출물은 절대 스테이지하지 않는다.** 마지막에 안전 확인용 `npm run check`도 1회 실행(플레이그라운드 무관하게 통과해야 함).

---

### Task 1: 라우팅 셸 — 해시 라우터 · 사이드바 · 페이지 분리 · Overview · CSS

기존 단일 스크롤을 사이드바 + 카테고리 페이지로 전환한다. 이 태스크 후 앱은 완전히 동작하는 라우팅 셸이 되며, 각 페이지는 아직 기존 라이브 예시만 보여준다(코드블록은 Task 2~3).

**Files:**
- Create: `examples/playground/src/categories.ts`
- Create: `examples/playground/src/useHashRoute.ts`
- Create: `examples/playground/src/routes.tsx`
- Create: `examples/playground/src/pages/Overview.tsx`
- Rename: `examples/playground/src/sections/` → `examples/playground/src/pages/` (10개 파일, 내용 불변)
- Modify: `examples/playground/src/App.tsx` (셸 재작성)
- Modify: `examples/playground/src/playground.css` (사이드바/nav/main/overview/반응형)

- [ ] **Step 1: 카테고리 메타데이터 생성 (순환 의존 회피용 leaf 모듈)**

Create `examples/playground/src/categories.ts`:
```ts
// 순수 네비게이션 메타데이터. 컴포넌트 import 없음 → 순환 의존 회피.
export type Category = { key: string; label: string };

export const CATEGORIES: Category[] = [
  { key: "overview", label: "Overview" },
  { key: "buttons", label: "Buttons" },
  { key: "inputs", label: "Inputs" },
  { key: "controls", label: "Controls" },
  { key: "tags", label: "Tags & identity" },
  { key: "feedback", label: "Feedback" },
  { key: "data", label: "Data & surfaces" },
  { key: "overlays", label: "Navigation & overlays" },
  { key: "tabs", label: "Tabs" },
  { key: "patterns", label: "Patterns" },
  { key: "icons", label: "Icons" },
];
```

- [ ] **Step 2: 해시 라우터 훅 생성**

Create `examples/playground/src/useHashRoute.ts`:
```ts
import * as React from "react";

/** "#/buttons" -> "buttons"; 빈 해시/"#/" -> "overview". */
function readHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, "").trim();
  return raw || "overview";
}

/** URL 해시에서 현재 라우트 키. hashchange로 갱신. */
export function useHashRoute(): string {
  const [route, setRoute] = React.useState(readHash);
  React.useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
```

- [ ] **Step 3: 섹션 디렉터리를 pages로 rename**

git이 추적하도록 `git mv`로 옮긴다(내용·export 이름은 불변):
```bash
cd examples/playground/src
git mv sections pages
```
이후 `pages/` 안에 Buttons.tsx, Inputs.tsx, Controls.tsx, Tags.tsx, Feedback.tsx, Data.tsx, Overlays.tsx, Tabs.tsx, Patterns.tsx, Icons.tsx 가 존재한다. 각 파일 내부의 `import { ... } from "../Section";` 는 경로가 그대로 유효(여전히 한 단계 위) — 수정 불필요.

- [ ] **Step 4: 라우트 테이블 생성**

Create `examples/playground/src/routes.tsx`:
```tsx
import { CATEGORIES } from "./categories";
import { Overview } from "./pages/Overview";
import { ButtonsSection } from "./pages/Buttons";
import { InputsSection } from "./pages/Inputs";
import { ControlsSection } from "./pages/Controls";
import { TagsSection } from "./pages/Tags";
import { FeedbackSection } from "./pages/Feedback";
import { DataSection } from "./pages/Data";
import { OverlaysSection } from "./pages/Overlays";
import { TabsSection } from "./pages/Tabs";
import { PatternsSection } from "./pages/Patterns";
import { IconsSection } from "./pages/Icons";

export type Route = { key: string; label: string; Component: () => JSX.Element };

const COMPONENTS: Record<string, () => JSX.Element> = {
  overview: Overview,
  buttons: ButtonsSection,
  inputs: InputsSection,
  controls: ControlsSection,
  tags: TagsSection,
  feedback: FeedbackSection,
  data: DataSection,
  overlays: OverlaysSection,
  tabs: TabsSection,
  patterns: PatternsSection,
  icons: IconsSection,
};

export const ROUTES: Route[] = CATEGORIES.map((c) => ({ ...c, Component: COMPONENTS[c.key] }));
```

- [ ] **Step 5: Overview 랜딩 페이지 생성**

Create `examples/playground/src/pages/Overview.tsx`:
```tsx
import * as React from "react";
import { Section } from "../Section";
import { CATEGORIES } from "../categories";

export function Overview() {
  const categories = CATEGORIES.filter((c) => c.key !== "overview");
  return (
    <Section id="overview" title="Overview">
      <p className="pg-section-note">
        @idenflu/ui-react 컴포넌트를 카테고리별로 보여주는 로컬 플레이그라운드입니다. source-only 패키지를 Vite로 직접 소비합니다.
        왼쪽에서 카테고리를 고르거나 아래 카드를 클릭하세요.
      </p>
      <div className="pg-overview-grid">
        {categories.map((c) => (
          <a key={c.key} href={`#/${c.key}`} className="pg-overview-card">
            <strong>{c.label}</strong>
            <span>#/{c.key}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: App.tsx를 셸로 재작성**

Replace the entire contents of `examples/playground/src/App.tsx`:
```tsx
import * as React from "react";
import { IconSpriteProvider, SegmentedControl } from "@idenflu/ui-react";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { useHashRoute } from "./useHashRoute";
import { ROUTES } from "./routes";

type Theme = "light" | "dark";

export function App() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const route = useHashRoute();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-if-theme", theme);
  }, [theme]);

  const active = ROUTES.find((r) => r.key === route) ?? ROUTES[0];
  const ActiveComponent = active.Component;

  return (
    <IconSpriteProvider href={spriteUrl}>
      <div className="pg-shell">
        <nav className="pg-nav" aria-label="Categories">
          <div className="pg-nav__brand">
            <strong>idenflu ui-react</strong>
            <span>플레이그라운드</span>
          </div>
          <ul className="pg-nav__list">
            {ROUTES.map((r) => (
              <li key={r.key}>
                <a
                  href={`#/${r.key}`}
                  className={r.key === active.key ? "pg-nav__link is-active" : "pg-nav__link"}
                  aria-current={r.key === active.key ? "page" : undefined}
                >
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pg-nav__theme">
            <SegmentedControl
              label="Theme"
              size="small"
              value={theme}
              onChange={(v) => setTheme(v as Theme)}
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </div>
        </nav>
        <main className="pg-main">
          <ActiveComponent />
        </main>
      </div>
    </IconSpriteProvider>
  );
}
```

- [ ] **Step 7: playground.css — 셸/사이드바/overview/반응형으로 교체·확장**

`examples/playground/src/playground.css`에서 `.pg-shell`와 `.pg-topbar` 규칙을 아래로 교체한다. `.pg-topbar`(및 그 자식 `.pg-topbar h1/p`) 규칙은 더 이상 쓰지 않으므로 **삭제**하고, 그 자리에 아래 블록을 넣는다. 기존 `.pg-section`, `.pg-section-note`, `.pg-group`, `.pg-row`, `.pg-col`, `.pg-grid`, `.pg-icon-cell` 규칙은 그대로 둔다.

기존:
```css
.pg-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--if-space-xl) var(--if-space-lg) var(--if-space-xxl);
}

.pg-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--if-space-md);
  margin-bottom: var(--if-space-xl);
}

.pg-topbar h1 {
  font-size: var(--if-font-size-display-md, 24px);
  margin: 0;
}

.pg-topbar p {
  margin: 4px 0 0;
  color: var(--if-color-ink-muted);
  font-size: var(--if-font-size-body-sm);
}
```
교체:
```css
.pg-shell {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: start;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.pg-nav {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--if-space-md);
  padding: var(--if-space-lg) var(--if-space-md);
  border-right: 1px solid var(--if-color-hairline);
}

.pg-nav__brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pg-nav__brand strong {
  font-size: var(--if-font-size-headline, 18px);
}
.pg-nav__brand span {
  font-size: var(--if-font-size-caption);
  color: var(--if-color-ink-muted);
}

.pg-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.pg-nav__link {
  display: block;
  padding: var(--if-space-sm) var(--if-space-md);
  border-radius: var(--if-radius-md);
  color: var(--if-color-ink-muted);
  text-decoration: none;
  font-size: var(--if-font-size-body-sm);
}
.pg-nav__link:hover {
  background: var(--if-color-surface-1);
  color: var(--if-color-ink);
}
.pg-nav__link.is-active {
  background: var(--if-color-surface-1);
  color: var(--if-color-ink);
  font-weight: var(--if-font-weight-emphasis);
}

.pg-nav__theme {
  padding-top: var(--if-space-md);
  border-top: 1px solid var(--if-color-hairline);
}

.pg-main {
  padding: var(--if-space-xl) var(--if-space-xl) var(--if-space-xxl);
  min-width: 0;
}
.pg-main .pg-section {
  border-top: none;
  margin-top: 0;
  padding-top: 0;
}

.pg-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--if-space-md);
}
.pg-overview-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--if-space-md);
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-md);
  text-decoration: none;
  color: var(--if-color-ink);
}
.pg-overview-card:hover {
  border-color: var(--if-color-primary);
}
.pg-overview-card span {
  font-size: var(--if-font-size-caption);
  color: var(--if-color-ink-muted);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

@media (max-width: 820px) {
  .pg-shell {
    grid-template-columns: 1fr;
  }
  .pg-nav {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--if-color-hairline);
  }
  .pg-nav__list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 8: 컴파일 스모크테스트**

Run: `cd examples/playground && npx vite build 2>&1 | tail -5`
Expected: `✓ built in …` (오류 없이 빌드 성공). import/구문 오류가 있으면 여기서 실패한다.

- [ ] **Step 9: Commit (소스만 — dist 제외)**

```bash
cd /Users/seunghyeonoh/WebstormProjects/idenflu-design-system
git add examples/playground/src/categories.ts examples/playground/src/useHashRoute.ts examples/playground/src/routes.tsx examples/playground/src/App.tsx examples/playground/src/playground.css examples/playground/src/pages
git commit -m "feat(playground): 해시 라우팅 셸 + 사이드바 + 카테고리 페이지 분리

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```
> `git mv sections pages`로 인한 rename은 `git add ... pages`로 함께 스테이지된다. `git status`로 `dist/`가 스테이지되지 않았는지 확인.

---

### Task 2: `<Example>` 프리미티브 + 주요 예시 코드 (Buttons · Inputs · Controls · Tags · Feedback)

`<Example>`를 만들고, 5개 페이지 상단에 주요 예시 + 코드블록을 추가한다. 기존 라이브 그룹은 아래에 그대로 유지.

**Files:**
- Create: `examples/playground/src/Example.tsx`
- Modify: `examples/playground/src/playground.css` (`.pg-example*` 추가)
- Modify: `examples/playground/src/pages/Buttons.tsx`
- Modify: `examples/playground/src/pages/Inputs.tsx`
- Modify: `examples/playground/src/pages/Controls.tsx`
- Modify: `examples/playground/src/pages/Tags.tsx`
- Modify: `examples/playground/src/pages/Feedback.tsx`

- [ ] **Step 1: Example 프리미티브 생성**

Create `examples/playground/src/Example.tsx`:
```tsx
import * as React from "react";

export function Example({ title, code, children }: { title?: string; code: string; children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
  };

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <div className="pg-example">
      {title ? <div className="pg-example__title">{title}</div> : null}
      <div className="pg-example__preview">{children}</div>
      <div className="pg-example__codewrap">
        <button type="button" className="pg-example__copy" onClick={copy}>
          {copied ? "복사됨" : "복사"}
        </button>
        <pre className="pg-example__code"><code>{code}</code></pre>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Example CSS 추가**

`examples/playground/src/playground.css` 맨 끝에 추가:
```css

.pg-example {
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-md);
  overflow: hidden;
  margin-bottom: var(--if-space-lg);
}
.pg-example__title {
  font-size: var(--if-font-size-caption);
  font-weight: var(--if-font-weight-emphasis);
  color: var(--if-color-ink-muted);
  padding: var(--if-space-sm) var(--if-space-md);
  border-bottom: 1px solid var(--if-color-hairline);
}
.pg-example__preview {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--if-space-md);
  padding: var(--if-space-lg) var(--if-space-md);
}
.pg-example__codewrap {
  position: relative;
  border-top: 1px solid var(--if-color-hairline);
}
.pg-example__copy {
  position: absolute;
  top: var(--if-space-sm);
  right: var(--if-space-sm);
  padding: 2px 8px;
  font-size: var(--if-font-size-caption);
  color: var(--if-color-ink-muted);
  background: var(--if-color-surface-raised);
  border: 1px solid var(--if-color-hairline);
  border-radius: var(--if-radius-sm);
  cursor: pointer;
}
.pg-example__copy:hover {
  color: var(--if-color-ink);
}
.pg-example__code {
  margin: 0;
  padding: var(--if-space-md);
  overflow-x: auto;
  background: var(--if-color-surface-1);
  color: var(--if-color-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--if-font-size-caption);
  line-height: 1.6;
}
```

- [ ] **Step 3: Buttons 페이지에 주요 예시 추가**

`examples/playground/src/pages/Buttons.tsx`: import 줄에 `Example`을 추가하고, `<Section ...>` 바로 다음(첫 `<Group>` 앞)에 `<Example>` 블록을 넣는다.

import 변경 — 기존:
```tsx
import { Group, Row, Section } from "../Section";
```
다음을 추가(별도 줄):
```tsx
import { Example } from "../Example";
```
`<Section id="buttons" title="Buttons">` 다음 줄에 삽입:
```tsx
      <Example
        title="주요 예시 — variant + IconButton"
        code={`<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
<IconButton icon={<Icon name="icon-settings" />} label="Settings" />`}
      >
        <Button variant="primary">저장</Button>
        <Button variant="secondary">취소</Button>
        <IconButton icon={<Icon name="icon-settings" />} label="Settings" />
      </Example>
```
(`Button`, `IconButton`, `Icon`은 이미 import돼 있음.)

- [ ] **Step 4: Inputs 페이지에 주요 예시 추가**

`examples/playground/src/pages/Inputs.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="inputs" title="Inputs">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — TextField + Select"
        code={`<TextField label="Email" placeholder="you@idenflu.com" helperText="회사 이메일" />
<Select label="Status" options={statusOptions} />`}
      >
        <div style={{ display: "grid", gap: 14, maxWidth: 360 }}>
          <TextField label="Email" placeholder="you@idenflu.com" helperText="회사 이메일" />
          <Select label="Status" options={statusOptions} />
        </div>
      </Example>
```
(`TextField`, `Select`, `statusOptions`는 이미 파일에 있음.)

- [ ] **Step 5: Controls 페이지에 주요 예시 추가**

`examples/playground/src/pages/Controls.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="controls" title="Controls">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Switch + Checkbox"
        code={`<Switch label="Auto-assign reviewers" defaultChecked />
<Checkbox label="검토 정책에 동의합니다" />`}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Switch label="Auto-assign reviewers" defaultChecked />
          <Checkbox label="검토 정책에 동의합니다" />
        </div>
      </Example>
```
(`Switch`, `Checkbox`는 이미 import돼 있음.)

- [ ] **Step 6: Tags 페이지에 주요 예시 추가**

`examples/playground/src/pages/Tags.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="tags" title="Tags & identity">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Badge + Chip + Avatar"
        code={`<Badge tone="success">Ready</Badge>
<Chip tone="blue" interactive onClick={() => {}}>Instagram</Chip>
<Avatar name="Mina Park" presence="online" />`}
      >
        <Badge tone="success">Ready</Badge>
        <Chip tone="blue" interactive onClick={() => {}}>
          Instagram
        </Chip>
        <Avatar name="Mina Park" presence="online" />
      </Example>
```
(`Badge`, `Chip`, `Avatar`는 이미 import돼 있음.)

- [ ] **Step 7: Feedback 페이지에 주요 예시 추가**

`examples/playground/src/pages/Feedback.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="feedback" title="Feedback">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Banner"
        code={`<Banner tone="info" title="Info">일반 안내 메시지입니다.</Banner>`}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <Banner tone="info" title="Info">
            일반 안내 메시지입니다.
          </Banner>
        </div>
      </Example>
```
(`Banner`는 이미 import돼 있음.)

- [ ] **Step 8: 컴파일 스모크테스트**

Run: `cd examples/playground && npx vite build 2>&1 | tail -5`
Expected: `✓ built in …` (오류 없음).

- [ ] **Step 9: Commit (소스만)**

```bash
cd /Users/seunghyeonoh/WebstormProjects/idenflu-design-system
git add examples/playground/src/Example.tsx examples/playground/src/playground.css examples/playground/src/pages/Buttons.tsx examples/playground/src/pages/Inputs.tsx examples/playground/src/pages/Controls.tsx examples/playground/src/pages/Tags.tsx examples/playground/src/pages/Feedback.tsx
git commit -m "feat(playground): <Example> 프리미티브 + 주요 예시 코드 (inputs/controls/tags/feedback/buttons)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: 주요 예시 코드 (Data · Overlays · Tabs · Patterns · Icons)

나머지 5개 페이지에 동일한 패턴으로 주요 예시 + 코드블록을 추가한다.

**Files:**
- Modify: `examples/playground/src/pages/Data.tsx`
- Modify: `examples/playground/src/pages/Overlays.tsx`
- Modify: `examples/playground/src/pages/Tabs.tsx`
- Modify: `examples/playground/src/pages/Patterns.tsx`
- Modify: `examples/playground/src/pages/Icons.tsx`

- [ ] **Step 1: Data 페이지에 주요 예시 추가**

`examples/playground/src/pages/Data.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="data" title="Data & surfaces">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Card"
        code={`<Card>
  <CardHeader><strong>Campaign</strong></CardHeader>
  <CardBody>캠페인 요약입니다.</CardBody>
  <CardFooter><Button variant="quiet" size="small">Open</Button></CardFooter>
</Card>`}
      >
        <div style={{ maxWidth: 320 }}>
          <Card>
            <CardHeader>
              <strong>Campaign</strong>
            </CardHeader>
            <CardBody>캠페인 요약입니다.</CardBody>
            <CardFooter>
              <Button variant="quiet" size="small">
                Open
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Example>
```
(`Card`, `CardHeader`, `CardBody`, `CardFooter`, `Button`은 이미 import돼 있음.)

- [ ] **Step 2: Overlays 페이지에 주요 예시 추가**

`examples/playground/src/pages/Overlays.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="overlays" title="Navigation & overlays">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Breadcrumb"
        code={`<Breadcrumb
  items={[
    { label: "Home", href: "#" },
    { label: "Campaigns", href: "#" },
    { label: "Detail", current: true },
  ]}
/>`}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "#" },
            { label: "Campaigns", href: "#" },
            { label: "Detail", current: true },
          ]}
        />
      </Example>
```
(`Breadcrumb`은 이미 import돼 있음.)

- [ ] **Step 3: Tabs 페이지에 주요 예시 추가**

`examples/playground/src/pages/Tabs.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="tabs" title="Tabs">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — Tabs"
        code={`<Tabs
  label="Campaign detail"
  defaultValue="overview"
  tabs={[
    { value: "overview", label: "Overview", content: <p>요약</p> },
    { value: "creators", label: "Creators", content: <p>크리에이터</p> },
  ]}
/>`}
      >
        <div style={{ flex: 1, minWidth: 320 }}>
          <Tabs
            label="Campaign detail (example)"
            defaultValue="overview"
            tabs={[
              { value: "overview", label: "Overview", content: <p>요약</p> },
              { value: "creators", label: "Creators", content: <p>크리에이터</p> },
            ]}
          />
        </div>
      </Example>
```
(`Tabs`는 이미 import돼 있음.)

- [ ] **Step 4: Patterns 페이지에 주요 예시 추가**

`examples/playground/src/pages/Patterns.tsx`: `import { Example } from "../Example";` 추가하고, 기존 `<p className="pg-section-note">…</p>` 바로 다음(첫 `<Group>` 앞)에 삽입:
```tsx
      <Example
        title="주요 예시 — 리뷰 행 조합 (Avatar + Badge + Chip)"
        code={`<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <Avatar name="Mina Park" presence="online" />
  <strong>Mina Park</strong>
  <Badge tone="warning">Review pending</Badge>
  <Chip tone="blue">Instagram</Chip>
</div>`}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name="Mina Park" presence="online" />
          <strong>Mina Park</strong>
          <Badge tone="warning">Review pending</Badge>
          <Chip tone="blue">Instagram</Chip>
        </div>
      </Example>
```
(`Avatar`, `Badge`, `Chip`은 이미 import돼 있음.)

- [ ] **Step 5: Icons 페이지에 주요 예시 추가**

`examples/playground/src/pages/Icons.tsx`: `import { Example } from "../Example";` 추가하고, `<Section id="icons" title="Icons">` 다음에 삽입:
```tsx
      <Example
        title="주요 예시 — 크기 / currentColor"
        code={`<Icon name="icon-search" size="large" />
<span style={{ color: "var(--if-color-primary)" }}>
  <Icon name="icon-check" size="large" />
</span>`}
      >
        <Icon name="icon-search" size="large" />
        <span style={{ color: "var(--if-color-primary)" }}>
          <Icon name="icon-check" size="large" />
        </span>
      </Example>
```
(`Icon`은 이미 import돼 있음.)

- [ ] **Step 6: 컴파일 스모크테스트**

Run: `cd examples/playground && npx vite build 2>&1 | tail -5`
Expected: `✓ built in …` (오류 없음).

- [ ] **Step 7: 안전 확인 — 전체 check (플레이그라운드 무관 통과)**

Run: `cd /Users/seunghyeonoh/WebstormProjects/idenflu-design-system && npm run check 2>&1 | tail -3`
Expected: `site verification ok` + `package skeleton check ok`.

- [ ] **Step 8: Commit (소스만)**

```bash
cd /Users/seunghyeonoh/WebstormProjects/idenflu-design-system
git add examples/playground/src/pages/Data.tsx examples/playground/src/pages/Overlays.tsx examples/playground/src/pages/Tabs.tsx examples/playground/src/pages/Patterns.tsx examples/playground/src/pages/Icons.tsx
git commit -m "feat(playground): 주요 예시 코드 (data/overlays/tabs/patterns/icons)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 브라우저 검증 (모든 태스크 후, 컨트롤러 수행 — dev 서버 :5199)

1. `#/`(overview) 로드 → 소개 + 카테고리 카드. 카드/사이드바 링크 클릭 시 해당 페이지 렌더.
2. 사이드바 활성 강조(`is-active`)가 현재 라우트와 일치.
3. 주소창에 `#/inputs` 직접 입력(딥링크) → Inputs 페이지. 브라우저 뒤로가기 동작.
4. 알 수 없는 해시(`#/zzz`) → overview 폴백.
5. 각 페이지 상단 `<Example>` 코드블록 렌더 + "복사" 클릭 시 클립보드 복사 & "복사됨" 피드백(1.5초 후 복귀).
6. 라이트/다크 토글이 모든 페이지에서 동작(코드블록 배경 포함).
7. 좁은 폭(≤820px)에서 사이드바가 상단으로 스택.
8. 콘솔 에러 0.

## Self-Review (작성자 체크)

- **Spec 커버리지:** 해시 라우터=Task1 Step2 / 라우트 테이블=Step4 / 셸·사이드바=Step6 / 페이지 분리(rename)=Step3 / Overview=Step5 / CSS(사이드바·반응형)=Step7 / `<Example>`=Task2 Step1 / 코드블록·복사·plain pre=Step1+2 / 주요 예시 큐레이션 10개 페이지=Task2 Step3-7 + Task3 Step1-5. 비범위(하이라이터·햄버거·자동추출·검색 없음, 컴포넌트 패키지 불변) 준수. 갭 없음.
- **Placeholder 스캔:** TODO/TBD/"적절히" 없음. 모든 코드 블록은 실제 코드.
- **타입/이름 일관성:** `useHashRoute(): string`, `ROUTES: Route[]`(key/label/Component), `CATEGORIES: Category[]`(key/label), `<Example title? code children>` — Task 전반에서 동일하게 참조. `git mv sections pages` 후 모든 import 경로가 `../pages/*` 및 `../Section`/`../Example`로 일관. 순환 의존: `categories.ts`(leaf) ← routes/Overview/App, 사이클 없음.
