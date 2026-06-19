# Switch Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `Switch` component to `@idenflu/ui-react` (native checkbox + `role="switch"` pill, label row, controlled/uncontrolled) and reflect it in the documentation site.

**Architecture:** A presentational `forwardRef` wrapper over a native `<input type="checkbox" role="switch">` styled as a pill via CSS, mirroring the field-family conventions (label row + helper). Shared files (index.ts, styles.css, skeleton-check, docs) are updated to register and document the component. The doc site is a generated pipeline: edit the source fragment + `docs/styles.css`, then rebuild.

**Tech Stack:** React 18 (peer), plain CSS with `--if-*` tokens, npm workspaces, no build step (source-only), Node verification scripts (`package-skeleton-check.js`, `verify-site.js`, `build-site.js`).

**Verification note:** This repo has no unit-test runner; the standing decision is to verify via `package-skeleton-check.js` + `npm run check` + token/export cross-checks + manual review. Steps below follow that mechanism instead of TDD with a test framework.

---

### Task 1: Create the Switch component

**Files:**
- Create: `packages/ui-react/src/components/Switch.tsx`

- [ ] **Step 1: Write the component file**

```tsx
import * as React from "react";
import { classNames } from "../utils/classNames";

export type SwitchSize = "small" | "medium";

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> & {
  /** Visible label rendered beside the control. Omit only when an `aria-label` is supplied (e.g. a table cell). */
  label?: React.ReactNode;
  /** Secondary line shown under the label. */
  description?: React.ReactNode;
  /** Helper text wired to the input via `aria-describedby`. */
  helperText?: React.ReactNode;
  /** Control size. Defaults to `"medium"`. */
  size?: SwitchSize;
};

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      "aria-describedby": ariaDescribedBy,
      className,
      description,
      disabled,
      helperText,
      id,
      label,
      size = "medium",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const controlId = id ?? generatedId;
    const helperId = helperText != null ? `${controlId}-helper` : undefined;
    const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="if-switch-field">
        <label className={classNames("if-switch", `if-switch--${size}`, disabled && "is-disabled", className)}>
          {label != null ? (
            <span className="if-switch__text">
              <span className="if-switch__label">{label}</span>
              {description != null ? <span className="if-switch__description">{description}</span> : null}
            </span>
          ) : null}
          <input
            ref={ref}
            id={controlId}
            type="checkbox"
            role="switch"
            className="if-switch__control"
            aria-describedby={describedBy}
            disabled={disabled}
            {...props}
          />
        </label>
        {helperText != null ? (
          <p id={helperId} className="if-switch__helper">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Switch.displayName = "Switch";
```

- [ ] **Step 2: Verify it reads as valid TSX and follows conventions**

Run: `grep -nE 'forwardRef|displayName|role="switch"|classNames' packages/ui-react/src/components/Switch.tsx`
Expected: matches for all four (forwardRef wrapper, displayName, native switch role, classNames helper).

---

### Task 2: Export the component

**Files:**
- Modify: `packages/ui-react/src/index.ts` (append after the `ErrorState` exports)

- [ ] **Step 1: Append exports**

```ts
export { Switch } from "./components/Switch";
export type { SwitchProps, SwitchSize } from "./components/Switch";
```

- [ ] **Step 2: Verify exports resolve to real symbols**

Run: `grep -nE 'export (const|type) (Switch|SwitchProps|SwitchSize)' packages/ui-react/src/components/Switch.tsx`
Expected: `Switch`, `SwitchProps`, `SwitchSize` all present.

---

### Task 3: Add component styles

**Files:**
- Modify: `packages/ui-react/src/styles.css` (append at end of file)

- [ ] **Step 1: Append the `.if-switch*` rules**

```css
.if-switch-field {
  display: flex;
  flex-direction: column;
  gap: var(--if-space-xs);
}

.if-switch {
  align-items: center;
  cursor: pointer;
  display: flex;
  font-family: var(--if-font-family);
  gap: var(--if-space-md);
  justify-content: space-between;
}

.if-switch__text {
  display: flex;
  flex-direction: column;
  gap: var(--if-space-xxs);
}

.if-switch__label {
  color: var(--if-color-ink);
  font-size: var(--if-font-size-body-sm);
  font-weight: var(--if-font-weight-emphasis);
}

.if-switch__description {
  color: var(--if-color-ink-muted);
  font-size: var(--if-font-size-caption);
  line-height: var(--if-line-height-compact);
}

.if-switch__control {
  appearance: none;
  -webkit-appearance: none;
  background: var(--if-color-surface-2);
  border: 1px solid var(--if-color-hairline-strong);
  border-radius: 999px;
  cursor: pointer;
  flex: 0 0 auto;
  height: 22px;
  margin: 0;
  position: relative;
  transition: background-color 120ms ease, border-color 120ms ease;
  width: 40px;
}

.if-switch__control::before {
  background: var(--if-color-surface-raised);
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  content: "";
  height: 18px;
  left: 2px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: left 120ms ease;
  width: 18px;
}

.if-switch__control:checked {
  background: var(--if-color-primary);
  border-color: var(--if-color-primary);
}

.if-switch__control:checked:hover {
  background: var(--if-color-primary-hover);
  border-color: var(--if-color-primary-hover);
}

.if-switch__control:checked::before {
  left: calc(100% - 18px - 2px);
}

.if-switch__control:focus-visible {
  box-shadow: 0 0 0 3px var(--if-focus-ring);
  outline: 0;
}

.if-switch.is-disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.if-switch.is-disabled .if-switch__control {
  cursor: not-allowed;
}

.if-switch--small .if-switch__control {
  height: 18px;
  width: 32px;
}

.if-switch--small .if-switch__control::before {
  height: 14px;
  width: 14px;
}

.if-switch--small .if-switch__control:checked::before {
  left: calc(100% - 14px - 2px);
}

.if-switch__helper {
  color: var(--if-color-ink-muted);
  font-family: var(--if-font-family);
  font-size: var(--if-font-size-caption);
  line-height: var(--if-line-height-compact);
}

@media (prefers-reduced-motion: reduce) {
  .if-switch__control,
  .if-switch__control::before {
    transition: none;
  }
}
```

- [ ] **Step 2: Verify every referenced token is defined (no broken vars)**

Run:
```bash
comm -23 \
  <(grep -oE 'var\(\s*--if-[a-z0-9-]+' packages/ui-react/src/styles.css | grep -oE '--if-[a-z0-9-]+' | sort -u) \
  <(grep -oE '--if-[a-z0-9-]+' packages/tokens/dist/css/variables.css | sort -u)
```
Expected: empty output (all referenced tokens are defined).

---

### Task 4: Extend the package skeleton check

**Files:**
- Modify: `scripts/package-skeleton-check.js`

- [ ] **Step 1: Add `Switch.tsx` to the `requireFile` list array**

Add this entry to the array of component files passed to `.forEach(requireFile)`:
```js
  "packages/ui-react/src/components/Switch.tsx",
```

- [ ] **Step 2: Add `Switch` to the index.ts markers**

In the `requireIncludes("packages/ui-react/src/index.ts", [...])` call, add:
```js
  "Switch",
```

- [ ] **Step 3: Add a Switch-specific marker check**

Add a new call near the other per-component `requireIncludes` calls:
```js
requireIncludes("packages/ui-react/src/components/Switch.tsx", [
  "export type SwitchSize = \"small\" | \"medium\"",
  "role=\"switch\"",
  "if-switch__control",
  "aria-describedby={describedBy}",
  "Switch.displayName",
]);
```

- [ ] **Step 4: Add Switch CSS markers**

Add a new call:
```js
requireIncludes("packages/ui-react/src/styles.css", [
  ".if-switch",
  ".if-switch__control",
  ".if-switch__control:checked",
  ".if-switch--small",
]);
```

- [ ] **Step 5: Run the skeleton check**

Run: `node scripts/package-skeleton-check.js`
Expected: `package skeleton check ok`

---

### Task 5: Package documentation

**Files:**
- Modify: `docs/ui-react-usage.md`
- Modify: `docs/react-package-plan.md`

- [ ] **Step 1: Add Switch to the Components list and a usage section in `docs/ui-react-usage.md`**

Add `Switch` to the existing Components list, then add a section (place near the other component examples):
````markdown
### Switch

```tsx
import { Switch } from "@idenflu/ui-react";

// controlled
<Switch
  label="Auto-assign reviewers"
  description="Applies immediately to new submissions"
  checked={autoAssign}
  onChange={(e) => setAutoAssign(e.target.checked)}
/>

// uncontrolled, small
<Switch label="Notify creator" defaultChecked size="small" />

// label-less (e.g. table cell) — aria-label required
<Switch aria-label="Enable row" checked={enabled} onChange={onToggle} />
```
````

- [ ] **Step 2: Reflect Switch in `docs/react-package-plan.md`**

Under the implemented-components area (after the tier-2 section), add:
```markdown
추가 컴포넌트:

- `Switch` — 즉시 적용되는 on/off 설정용. native checkbox + `role="switch"` pill로 `packages/ui-react/src/components/Switch.tsx`에 구현했습니다.
```
Do not remove any existing required grep strings (packages/tokens, packages/icons, packages/ui-react, @idenflu/ui-tokens, @idenflu/ui-icons, @idenflu/ui-react, GitHub Packages, npm.pkg.github.com, Button, Table).

- [ ] **Step 3: Verify package docs still satisfy the skeleton check**

Run: `node scripts/package-skeleton-check.js`
Expected: `package skeleton check ok`

---

### Task 6: Update the documentation site (Switches section)

**Files:**
- Modify: `docs/src/pages/components-controls.html` (source fragment — the "Switches" `control-group`)
- Modify: `docs/styles.css` (`.switch-row input` → pill visual)
- Regenerate: `docs/components-controls.html` (via build script)

- [ ] **Step 1: Update the Switches example + add a React note in the source fragment**

In `docs/src/pages/components-controls.html`, locate the `<article class="control-group">` whose eyebrow is `Switches`. Keep the two `switch-row` labels, and append a React contract note inside that article:
```html
              <p class="component-note">React: <code>&lt;Switch label="Auto-assign reviewers" /&gt;</code> — native <code>&lt;input type="checkbox" role="switch"&gt;</code> styled as a pill. label/description/helperText/size props, controlled &amp; uncontrolled.</p>
```
(Use the existing `component-note`/paragraph class already present in the page; if no such class exists, use a plain `<p>`.) Do not remove existing partial/depth/component markers.

- [ ] **Step 2: Make the doc-site switch render as a pill in `docs/styles.css`**

Replace the existing `.switch-row input` block:
```css
.switch-row input {
  width: 38px;
  height: 22px;
}
```
with a pill treatment (doc-site variables use the un-prefixed token names already in `docs/styles.css`, e.g. `--primary`, `--surface-raised`, `--hairline`):
```css
.switch-row input {
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  width: 40px;
  height: 22px;
  margin: 0;
  border-radius: 999px;
  border: 1px solid var(--hairline);
  background: var(--surface-2, var(--surface-raised));
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.switch-row input::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface-raised);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: left 120ms ease;
}

.switch-row input:checked {
  background: var(--primary);
  border-color: var(--primary);
}

.switch-row input:checked::before {
  left: calc(100% - 18px - 2px);
}
```
Keep the existing `.switch-row input { accent-color: var(--primary); }` grouped rule harmless or fold it in; do not remove `.component-page-header` or other markers `verify-site.js` requires.

- [ ] **Step 3: Rebuild the site**

Run: `node docs/scripts/build-site.js`
Expected: `built 40 pages`, and `docs/components-controls.html` now reflects the source change.

- [ ] **Step 4: Verify the doc site**

Run: `npm run check:docs`
Expected: `site verification ok`

---

### Task 7: Final verification and commit

- [ ] **Step 1: Full check**

Run: `npm run check`
Expected: `site verification ok` then `package skeleton check ok`.

- [ ] **Step 2: Cross-check exported symbols resolve**

Run:
```bash
node -e "const fs=require('fs');const i=fs.readFileSync('packages/ui-react/src/index.ts','utf8');const m=[...i.matchAll(/export (?:type )?\{([^}]+)\} from \"(\.\/components\/[^\"]+)\"/g)];let p=0;for(const x of m){const ns=x[1].split(',').map(s=>s.trim()).filter(Boolean);const s=fs.readFileSync('packages/ui-react/src/'+x[2].slice(2)+'.tsx','utf8');for(const n of ns){if(!new RegExp('export (const|function|class|type|interface) '+n+'\\\\b').test(s)&&!new RegExp('export \\\\{[^}]*\\\\b'+n+'\\\\b').test(s)){console.log('MISSING',n);p++}}}console.log(p+' missing')"
```
Expected: `0 missing`

- [ ] **Step 3: Build reproducibility (no stray diffs)**

Run: `node docs/scripts/build-site.js && git status --short`
Expected: only intended files changed; rerunning build produces no further diff.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(ui-react): add Switch component and document it in the controls page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

- **Spec coverage:** Component (Task 1), API/types (Task 1), exports (Task 2), CSS/visual incl. sizes/disabled/focus/reduced-motion (Task 3), skeleton-check (Task 4), package docs (Task 5), doc-site source+CSS+rebuild (Task 6), verification (Task 7). All spec sections mapped.
- **Placeholder scan:** No TBD/TODO; every code step contains full content.
- **Type consistency:** `SwitchProps`/`SwitchSize`/`Switch` names consistent across Tasks 1, 2, 4. CSS class names (`if-switch`, `if-switch__control`, `if-switch__text`, `if-switch__label`, `if-switch__description`, `if-switch__helper`, `if-switch--small`, `is-disabled`) consistent between Task 1 markup and Task 3 CSS and Task 4 markers.
