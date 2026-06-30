---
name: new-component
description: Implements new idenflu ui-react components from Figma designs. Use when the user asks to create, implement, or scaffold a new component, especially with a Figma URL or node from the Idenflu Design System.
---

# New Component

## Purpose

Use this skill for Figma to code implementation of new `packages/ui-react`
components in the idenflu design system.

## Required Inputs

Ask for missing information before implementation when any required input is
absent:

- Component name
- Target component path, usually `packages/ui-react/src/components/<Name>/`
- Figma URL or node ID when the component has a source design
- Expected variants, sizes, states, or interaction requirements if they are not
  clear from Figma

The default Figma file is:

- File: `Idenflu Design System`
- fileKey: `aMK1ysrAI4RGk1mrFk0O41`

## Workflow

1. Gather design context.
   - If a Figma URL or node ID is provided, call Figma `get_design_context`.
   - Extract variants, states, spacing, color, typography, motion, and a11y
     hints.
   - Treat generated code as reference only.

2. Compare equivalent libraries.
   - Check Carbon React docs or source for behavior and accessibility patterns.
   - Use MUI MCP in this order: `useMuiDocs` then `fetchDocs`.
   - Do not copy MUI or Carbon API/code verbatim.

3. Inspect local patterns.
   - Prefer existing `packages/ui-react/src/components/*` conventions.
   - Use `Button` as the first reference when no closer component exists.
   - Follow component folder structure, naming, exports, and Storybook patterns.

4. Design the implementation before editing.
   - Summarize the recommended API and any meaningful MUI/Carbon differences.
   - Call out accessibility behavior: keyboard, ARIA, focus, disabled/loading
     states, and screen reader behavior.
   - Ask for confirmation when the API has meaningful trade-offs.

5. Implement only after requirements are clear.
   - Create or update:
     - `<ComponentName>.tsx`
     - `<ComponentName>.css`
     - `<ComponentName>.stories.tsx`
     - `index.ts`
   - Add public exports in `packages/ui-react/src/index.ts`.
   - Export public types from the component `index.ts` and package index.

6. Validate.
   - Check lints for edited files.
   - Run focused package checks or tests when available and appropriate.
   - Report any skipped validation clearly.

## Component Conventions

- Folder: `packages/ui-react/src/components/<Name>/`
- CSS class prefix: `nova-<kebab-name>`
- Styling must use CSS custom properties from `@idenflu/ui-foundations`.
- Import tokens through `packages/ui-react/src/styles/tokens.css` only.
- Never hardcode visual values for color, spacing, radius, or typography.
- Use `classNames` from `../../utils/classNames` when composing classes.
- Keep TypeScript strict and avoid `any`.

## Storybook Requirements

Stories should cover:

- Variant matrix
- Size matrix
- Interactive states
- Disabled and loading states when supported
- Accessibility notes for keyboard, ARIA, and focus behavior

## Constraints

- Do not paste Tailwind, raw hex colors, or generated Figma code directly.
- Do not introduce visual values outside the token system.
- Do not preserve compatibility with unshipped in-progress code unless the user
  explicitly asks for it.
- Keep edits scoped to the new component and required exports.

