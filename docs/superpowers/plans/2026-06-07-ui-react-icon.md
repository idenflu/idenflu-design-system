# Icon Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `Icon` component (+ `IconSpriteProvider`) to `@idenflu/ui-react` that renders `@idenflu/ui-icons` sprite symbols via `<use>`, with type-safe names and a11y defaults.

**Architecture:** A `forwardRef` `<svg><use href=…/></svg>` wrapper. The sprite URL resolves from an `IconSpriteContext` (default `iconSpriteHref`, overridable per-instance via `spriteHref`); consumers set the resolved URL once via `IconSpriteProvider`. Icons are decorative by default (`aria-hidden`); a `label` promotes to `role="img"`. Shared files (index, styles, skeleton-check, docs) are updated; the doc site is regenerated.

**Tech Stack:** React 18 (peer), `@idenflu/ui-icons` (already a dependency), plain CSS, source-only (no build), Node verification scripts.

**Verification note:** No unit-test runner; verify via `package-skeleton-check.js` + `npm run check` + token/export cross-checks + manual review (standing project decision).

---

### Task 1: Icon component

**Files:**
- Create: `packages/ui-react/src/components/Icon.tsx`

- [ ] **Step 1: Write the component**

```tsx
import * as React from "react";
import { getIconHref, iconSpriteHref, type IconName } from "@idenflu/ui-icons";
import { classNames } from "../utils/classNames";

export type IconSize = "small" | "medium" | "large";

const ICON_SIZES: Record<IconSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

const IconSpriteContext = React.createContext<string>(iconSpriteHref);

export type IconSpriteProviderProps = {
  /** Bundler-resolved URL of the @idenflu/ui-icons sprite. */
  href: string;
  children: React.ReactNode;
};

export const IconSpriteProvider = ({ href, children }: IconSpriteProviderProps) => (
  <IconSpriteContext.Provider value={href}>{children}</IconSpriteContext.Provider>
);

IconSpriteProvider.displayName = "IconSpriteProvider";

export type IconProps = Omit<React.SVGAttributes<SVGSVGElement>, "children"> & {
  /** Icon symbol name from @idenflu/ui-icons. */
  name: IconName;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  label?: string;
  /** Size token (small=16, medium=20, large=24) or explicit pixels. Defaults to "medium". */
  size?: IconSize | number;
  /** Override the sprite URL for this icon. Defaults to the IconSpriteProvider value. */
  spriteHref?: string;
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, label, name, size = "medium", spriteHref, ...props }, ref) => {
    const contextHref = React.useContext(IconSpriteContext);
    const px = typeof size === "number" ? size : ICON_SIZES[size];
    const a11y = label
      ? ({ role: "img", "aria-label": label } as const)
      : ({ "aria-hidden": true, focusable: false } as const);

    return (
      <svg
        ref={ref}
        width={px}
        height={px}
        viewBox="0 0 24 24"
        className={classNames("if-icon", className)}
        {...a11y}
        {...props}
      >
        <use href={getIconHref(name, spriteHref ?? contextHref)} />
      </svg>
    );
  },
);

Icon.displayName = "Icon";
```

- [ ] **Step 2: Verify conventions present**

Run: `grep -nE 'forwardRef|displayName|<use href=|name: IconName' packages/ui-react/src/components/Icon.tsx`
Expected: all four match.

---

### Task 2: Export the component and re-export icon names

**Files:**
- Modify: `packages/ui-react/src/index.ts` (append after the `SegmentedControl` exports)

- [ ] **Step 1: Append exports**

```ts
export { Icon, IconSpriteProvider } from "./components/Icon";
export type { IconProps, IconSize, IconSpriteProviderProps } from "./components/Icon";

export { iconNames } from "@idenflu/ui-icons";
export type { IconName } from "@idenflu/ui-icons";
```

- [ ] **Step 2: Verify the local exports resolve to real symbols**

Run:
```bash
node -e "const fs=require('fs');const i=fs.readFileSync('packages/ui-react/src/index.ts','utf8');const m=[...i.matchAll(/export (?:type )?\{([^}]+)\} from \"(\.\/components\/[^\"]+)\"/g)];let p=0;for(const x of m){const ns=x[1].split(',').map(s=>s.trim()).filter(Boolean);const s=fs.readFileSync('packages/ui-react/src/'+x[2].slice(2)+'.tsx','utf8');for(const n of ns){if(!new RegExp('export (const|function|class|type|interface) '+n+'\\\\b').test(s)&&!new RegExp('export \\\\{[^}]*\\\\b'+n+'\\\\b').test(s)){console.log('MISSING',n);p++}}}console.log(p+' missing')"
```
Expected: `0 missing` (this checks only `./components/*` exports; the `@idenflu/ui-icons` re-exports are intentionally not checked here).

---

### Task 3: Component styles

**Files:**
- Modify: `packages/ui-react/src/styles.css` (append at end)

- [ ] **Step 1: Append the `.if-icon` rule**

```css
.if-icon {
  color: inherit;
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
}
```

- [ ] **Step 2: Verify no broken token references were introduced**

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

- [ ] **Step 1: Add `Icon.tsx` to the `requireFile` list**

Add after `"packages/ui-react/src/components/SegmentedControl.tsx",`:
```js
  "packages/ui-react/src/components/Icon.tsx",
```

- [ ] **Step 2: Add index.ts markers**

In the `requireIncludes("packages/ui-react/src/index.ts", [...])` array, add after `"SegmentedControl",`:
```js
  "Icon",
  "IconSpriteProvider",
```

- [ ] **Step 3: Add per-component marker checks**

Add near the SegmentedControl `requireIncludes` block:
```js
requireIncludes("packages/ui-react/src/components/Icon.tsx", [
  "export type IconSize",
  "name: IconName",
  "<use href=",
  "IconSpriteProvider",
  "Icon.displayName",
]);

requireIncludes("packages/ui-react/src/styles.css", [
  ".if-icon",
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

- [ ] **Step 1: Add `Icon` to the Components list and an Icon usage section in `docs/ui-react-usage.md`**

Add `Icon`, `IconSpriteProvider` to the Components list, then add a section:
````markdown
## Icon

`Icon`은 `@idenflu/ui-icons` sprite의 symbol을 타입 안전하게 렌더합니다. 앱 루트에서 `IconSpriteProvider`로 sprite URL을 한 번 주입합니다(번들러가 해석한 URL).

```tsx
import spriteUrl from "@idenflu/ui-icons/icons.svg";
import { Icon, IconSpriteProvider, Button } from "@idenflu/ui-react";

function App() {
  return (
    <IconSpriteProvider href={spriteUrl}>
      {/* 장식 아이콘 (기본 aria-hidden) — 버튼이 접근 이름 제공 */}
      <Button icon={<Icon name="search" />}>Search</Button>

      {/* 단독 의미 아이콘 — label로 노출 */}
      <Icon name="alert" label="Warning" size="large" />
    </IconSpriteProvider>
  );
}
```
````

- [ ] **Step 2: Reflect in `docs/react-package-plan.md`**

Under the `Checkbox / RadioGroup / SegmentedControl` "추가 컴포넌트" entry, add:
```markdown
- `Icon` — `@idenflu/ui-icons` sprite를 감싸는 React 컴포넌트. `IconSpriteProvider`로 sprite URL 주입, name 타입 안전, 장식 기본/`label` 의미 아이콘.
```
Keep all existing required grep strings intact.

- [ ] **Step 3: Verify skeleton check still passes**

Run: `node scripts/package-skeleton-check.js`
Expected: `package skeleton check ok`

---

### Task 6: Document on the site (icons page)

**Files:**
- Modify: `docs/src/pages/components-icons.html` (source fragment)
- Regenerate: `docs/components-icons.html`

- [ ] **Step 1: Read the page to find an anchor**

Run: `grep -nE 'class="control-group"|class="eyebrow"|<article|</section>|sprite' docs/src/pages/components-icons.html | head -30`
Expected: prints article/section structure so the next step targets a real element.

- [ ] **Step 2: Add a React note**

Insert a `<p>` immediately after the first `<article …>`'s opening content (or after the first descriptive `<p>` in the main content section), matching the indentation of surrounding markup:
```html
              <p>React: <code>&lt;Icon name="search" /&gt;</code> — <code>@idenflu/ui-react</code>의 <code>Icon</code>이 이 sprite를 <code>&lt;use&gt;</code>로 렌더합니다. <code>IconSpriteProvider</code>로 sprite URL을 한 번 주입하세요.</p>
```
Do not remove existing partial/depth/component markers.

- [ ] **Step 3: Rebuild the site**

Run: `node docs/scripts/build-site.js`
Expected: `built 40 pages`

- [ ] **Step 4: Verify the doc site**

Run: `npm run check:docs`
Expected: `site verification ok`

---

### Task 7: Final verification and commit

- [ ] **Step 1: Full check**

Run: `npm run check`
Expected: `site verification ok` then `package skeleton check ok`.

- [ ] **Step 2: Build reproducibility**

Run: `node docs/scripts/build-site.js && git status --short`
Expected: only intended files changed; rerun produces no further diff.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(ui-react): add Icon component and IconSpriteProvider

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** Icon + IconSpriteProvider + context (Task 1), exports + IconName/iconNames re-export (Task 2), `.if-icon` CSS (Task 3), skeleton-check (Task 4), package docs incl. Provider+decorative/label usage (Task 5), doc-site source + rebuild (Task 6), verification (Task 7). All spec sections mapped.
- **Placeholder scan:** No TBD/TODO; every code step has full content. Task 6 Step 1 is an explicit anchor-finding step (the icons page structure is read at execution time), Step 2 gives the exact markup to insert.
- **Type consistency:** `IconProps`/`IconSize`/`IconSpriteProviderProps`, `Icon`/`IconSpriteProvider`, `IconName`/`iconNames` consistent across Tasks 1, 2, 4. `IconSpriteContext`, `ICON_SIZES`, `getIconHref(name, spriteHref ?? contextHref)` consistent within Task 1. CSS class `if-icon` consistent between Task 1, Task 3, and Task 4 marker.
