# Tabs Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a data-driven `Tabs` component to `@idenflu/ui-react` implementing the WAI-ARIA tabs pattern (roving tabindex + arrow keys, automatic activation).

**Architecture:** A `forwardRef` wrapper rendering a `role="tablist"` of `role="tab"` buttons and all `role="tabpanel"`s (inactive ones `hidden`). Controlled/uncontrolled via `value`/`defaultValue`. Keyboard moves selection across non-disabled tabs with wrap + focus.

**Tech Stack:** React 18 (peer), plain CSS with `--if-*` tokens, source-only (no build), Node verification scripts.

**Verification note:** No unit-test runner; verify via `package-skeleton-check.js` + `npm run check` + token/export cross-checks + playground render (standing project decision).

---

### Task 1: Tabs component

**Files:**
- Create: `packages/ui-react/src/components/Tabs.tsx`

- [ ] **Step 1: Write the component**

```tsx
import * as React from "react";
import { classNames } from "../utils/classNames";

export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  tabs: TabItem[];
  /** Accessible name for the tablist. */
  label: string;
  /** Selected tab value (controlled). */
  value?: string;
  /** Initial selected value (uncontrolled). Defaults to the first enabled tab. */
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, label, onChange, tabs, value, ...props }, ref) => {
    const base = React.useId();
    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const isControlled = value !== undefined;
    const firstEnabled = tabs.find((tab) => !tab.disabled)?.value;
    const [internal, setInternal] = React.useState(defaultValue ?? firstEnabled);
    const current = isControlled ? value : internal;

    const select = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    };

    const activate = (index: number) => {
      const tab = tabs[index];
      if (!tab || tab.disabled) return;
      select(tab.value);
      tabRefs.current[index]?.focus();
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const count = tabs.length;
      const step = (dir: 1 | -1) => {
        for (let i = 1; i <= count; i += 1) {
          const next = ((index + dir * i) % count + count) % count;
          if (!tabs[next].disabled) return next;
        }
        return index;
      };
      let target: number | null = null;
      if (event.key === "ArrowRight") target = step(1);
      else if (event.key === "ArrowLeft") target = step(-1);
      else if (event.key === "Home") target = tabs.findIndex((tab) => !tab.disabled);
      else if (event.key === "End") {
        for (let i = count - 1; i >= 0; i -= 1) {
          if (!tabs[i].disabled) {
            target = i;
            break;
          }
        }
      }
      if (target !== null && target >= 0) {
        event.preventDefault();
        activate(target);
      }
    };

    const currentTab = tabs.find((tab) => tab.value === current) ?? tabs.find((tab) => !tab.disabled);
    const currentValue = currentTab?.value;

    return (
      <div ref={ref} className={classNames("if-tabs", className)} {...props}>
        <div role="tablist" aria-label={label} className="if-tabs__list">
          {tabs.map((tab, index) => {
            const selected = tab.value === currentValue;
            return (
              <button
                key={tab.value}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${tab.value}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${tab.value}`}
                tabIndex={selected ? 0 : -1}
                disabled={tab.disabled}
                className={classNames("if-tabs__tab", selected && "is-selected")}
                onClick={() => select(tab.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                {tab.icon != null ? (
                  <span className="if-tabs__icon" aria-hidden="true">
                    {tab.icon}
                  </span>
                ) : null}
                <span className="if-tabs__label">{tab.label}</span>
              </button>
            );
          })}
        </div>
        {tabs.map((tab) => (
          <div
            key={tab.value}
            role="tabpanel"
            id={`${base}-panel-${tab.value}`}
            aria-labelledby={`${base}-tab-${tab.value}`}
            tabIndex={0}
            hidden={tab.value !== currentValue}
            className="if-tabs__panel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    );
  },
);

Tabs.displayName = "Tabs";
```

- [ ] **Step 2: Verify conventions present**

Run: `grep -nE 'forwardRef|displayName|role="tab"|aria-selected|tabIndex' packages/ui-react/src/components/Tabs.tsx`
Expected: all matches present.

---

### Task 2: Export the component

**Files:**
- Modify: `packages/ui-react/src/index.ts` (append after the `SegmentedControl` exports)

- [ ] **Step 1: Append exports**

```ts
export { Tabs } from "./components/Tabs";
export type { TabsProps, TabItem } from "./components/Tabs";
```

- [ ] **Step 2: Verify exports resolve**

Run: `grep -nE 'export (const|type) (Tabs|TabsProps|TabItem)' packages/ui-react/src/components/Tabs.tsx`
Expected: `Tabs`, `TabsProps`, `TabItem` all present.

---

### Task 3: Component styles

**Files:**
- Modify: `packages/ui-react/src/styles.css` (append at end)

- [ ] **Step 1: Append the `.if-tabs*` rules**

```css
.if-tabs {
  display: flex;
  flex-direction: column;
}

.if-tabs__list {
  display: flex;
  gap: var(--if-space-md);
  border-bottom: 1px solid var(--if-color-hairline);
  overflow-x: auto;
}

.if-tabs__tab {
  align-items: center;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  color: var(--if-color-ink-muted);
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-family: var(--if-font-family);
  font-size: var(--if-font-size-body-sm);
  gap: var(--if-space-xs);
  margin-bottom: -1px;
  padding: var(--if-space-sm) var(--if-space-xs);
  transition: color var(--if-duration-fast) ease, border-color var(--if-duration-fast) ease;
}

.if-tabs__tab:hover:not(:disabled) {
  color: var(--if-color-ink);
}

.if-tabs__tab.is-selected {
  border-bottom-color: var(--if-color-primary);
  color: var(--if-color-primary);
}

.if-tabs__tab:focus-visible {
  border-radius: var(--if-radius-sm);
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

.if-tabs__tab:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.if-tabs__icon {
  align-items: center;
  display: inline-flex;
}

.if-tabs__panel {
  padding-top: var(--if-space-md);
}

.if-tabs__panel:focus-visible {
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

@media (prefers-reduced-motion: reduce) {
  .if-tabs__tab {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify referenced tokens are defined**

Run:
```bash
comm -23 \
  <(grep -oE 'var\([[:space:]]*[-]-if-[a-z0-9-]+' packages/ui-react/src/styles.css | grep -oE '[-]-if-[a-z0-9-]+' | sort -u) \
  <(grep -oE '[-]-if-[a-z0-9-]+' packages/tokens/dist/css/variables.css | sort -u)
```
Expected: empty output.

---

### Task 4: Extend the skeleton check

**Files:**
- Modify: `scripts/package-skeleton-check.js`

- [ ] **Step 1: Add `Tabs.tsx` to the `requireFile` list** (in the components array passed to `.forEach(requireFile)`):
```js
  "packages/ui-react/src/components/Tabs.tsx",
```

- [ ] **Step 2: Add `Tabs` to the index.ts markers** (in the `requireIncludes("packages/ui-react/src/index.ts", [...])` array):
```js
  "Tabs",
```

- [ ] **Step 3: Add a per-component marker check** (near the other component `requireIncludes`):
```js
requireIncludes("packages/ui-react/src/components/Tabs.tsx", [
  "export type TabItem",
  "role=\"tab\"",
  "aria-selected={selected}",
  "if-tabs__list",
  "Tabs.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-tabs",
  ".if-tabs__tab.is-selected",
]);
```

- [ ] **Step 4: Run the skeleton check**

Run: `node scripts/package-skeleton-check.js`
Expected: `package skeleton check ok`

---

### Task 5: Package documentation

**Files:**
- Modify: `docs/ui-react-usage.md`
- Modify: `docs/react-package-plan.md`

- [ ] **Step 1: Add `Tabs` to the Components list and a usage section in `docs/ui-react-usage.md`**

Add `Tabs` to the Components list, then add a section:
````markdown
## Tabs

`Tabs`는 같은 영역의 뷰를 전환합니다. data-driven(`tabs` 배열), WAI-ARIA tabs 패턴(roving tabindex + 화살표 키)을 따릅니다.

```tsx
import { Tabs } from "@idenflu/ui-react";

// uncontrolled
<Tabs
  label="Campaign detail"
  defaultValue="overview"
  tabs={[
    { value: "overview", label: "Overview", content: <p>상태·owner·revision</p> },
    { value: "creators", label: "Creators", content: <p>크리에이터 목록</p> },
    { value: "audit", label: "Audit", content: <p>변경 이력</p>, disabled: true },
  ]}
/>

// controlled
<Tabs label="Workspace" value={tab} onChange={setTab} tabs={tabs} />
```
````

- [ ] **Step 2: Reflect in `docs/react-package-plan.md`**

Under the last "추가 컴포넌트" entry, add:
```markdown
- `Tabs` — data-driven 탭(WAI-ARIA tablist, roving tabindex + 화살표 키). `packages/ui-react/src/components/Tabs.tsx`.
```
Keep all existing required grep strings intact.

- [ ] **Step 3: Verify skeleton check still passes**

Run: `node scripts/package-skeleton-check.js`
Expected: `package skeleton check ok`

---

### Task 6: Document on the site (tabs page)

**Files:**
- Modify: `docs/src/pages/components-tabs.html` (source fragment)
- Regenerate: `docs/components-tabs.html`

- [ ] **Step 1: Add a React note to the tabs source**

In `docs/src/pages/components-tabs.html`, find the first `.tab-list` example's enclosing block (e.g. after the `data-tabs`/context-preview block or inside a usage section) and insert a `<p>` matching surrounding markup, without modifying any existing line/marker:
```html
              <p>React: <code>&lt;Tabs label="Campaign detail" tabs={[...]} /&gt;</code> — data-driven, <code>role="tablist"</code> + roving tabindex + 화살표 키 이동. controlled/uncontrolled.</p>
```

- [ ] **Step 2: Rebuild the site**

Run: `node docs/scripts/build-site.js`
Expected: `built 43 pages`

- [ ] **Step 3: Verify the doc site**

Run: `npm run check:docs`
Expected: `site verification ok`

---

### Task 7: Playground demo

**Files:**
- Create: `examples/playground/src/sections/Tabs.tsx`
- Modify: `examples/playground/src/App.tsx` (import + render the section)

- [ ] **Step 1: Create the Tabs demo section**

```tsx
import * as React from "react";
import { Badge, Tabs } from "@idenflu/ui-react";
import { Group, Section } from "../Section";

export function TabsSection() {
  const [tab, setTab] = React.useState("overview");
  return (
    <Section id="tabs" title="Tabs">
      <Group label="Controlled · 화살표 키로 이동">
        <Tabs
          label="Campaign detail"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "overview", label: "Overview", content: <p>상태 · owner · revision · due를 한 화면에서 확인합니다.</p> },
            { value: "creators", label: "Creators", content: <p>배정된 크리에이터 목록과 응답 상태입니다.</p> },
            {
              value: "audit",
              label: "Audit",
              content: (
                <p>
                  변경 이력 <Badge tone="info">3 events</Badge>
                </p>
              ),
            },
            { value: "settings", label: "Settings", content: <p>접근 권한</p>, disabled: true },
          ]}
        />
      </Group>
    </Section>
  );
}
```

- [ ] **Step 2: Render it in `App.tsx`**

Add the import alongside the others:
```tsx
import { TabsSection } from "./sections/Tabs";
```
And render it in the section list (e.g. after `<DataSection />`):
```tsx
        <TabsSection />
```

- [ ] **Step 3: Build the playground**

Run: `npm run build --workspace playground`
Expected: `✓ built` with no errors.

---

### Task 8: Final verification and commit

- [ ] **Step 1: Full check**

Run: `npm run check`
Expected: `site verification ok` then `package skeleton check ok`.

- [ ] **Step 2: Export symbols resolve**

Run:
```bash
node -e "const fs=require('fs');const i=fs.readFileSync('packages/ui-react/src/index.ts','utf8');const m=[...i.matchAll(/export (?:type )?\{([^}]+)\} from \"(\.\/components\/[^\"]+)\"/g)];let p=0;for(const x of m){const ns=x[1].split(',').map(s=>s.trim()).filter(Boolean);const s=fs.readFileSync('packages/ui-react/src/'+x[2].slice(2)+'.tsx','utf8');for(const n of ns){if(!new RegExp('export (const|function|class|type|interface) '+n+'\\\\b').test(s)&&!new RegExp('export \\\\{[^}]*\\\\b'+n+'\\\\b').test(s)){console.log('MISSING',n);p++}}}console.log(p+' missing')"
```
Expected: `0 missing`

- [ ] **Step 3: Build reproducibility**

Run: `node docs/scripts/build-site.js && git status --short`
Expected: only intended files changed; rerun produces no further diff.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui-react): add Tabs component (WAI-ARIA tabs, roving tabindex)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** Component incl. roving tabindex/keyboard/all-panels-hidden (Task 1), exports (Task 2), CSS (Task 3), skeleton-check (Task 4), package docs (Task 5), doc-site note + rebuild (Task 6), playground demo (Task 7), verification (Task 8). All spec sections mapped.
- **Placeholder scan:** No TBD/TODO; every code step is complete.
- **Type consistency:** `TabsProps`/`TabItem`, `Tabs`, `if-tabs`/`if-tabs__list`/`if-tabs__tab`/`is-selected`/`if-tabs__panel` consistent across Tasks 1, 3, 4. Keyboard helper (`step`/`activate`/`onKeyDown`), `base`/`current`/`currentValue`, and id scheme (`${base}-tab-${value}`/`${base}-panel-${value}`) consistent within Task 1.
