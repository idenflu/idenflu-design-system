---
name: new-component
description: Implements new idenflu ui-react components from Figma designs. Use when the user asks to create, implement, or scaffold a new component, especially with a Figma URL or node from the Idenflu Design System.
---

# New Component

## Purpose

Use this skill for Figma to code implementation of new `packages/ui-react`
components in the idenflu design system.

For SVG icon creation or modification in `packages/icons`, follow
`packages/icons/AGENTS.md` and `docs/foundations/icons/design-principles.md`
instead of this Figma-to-component workflow. Icons are designed from those rules
and existing SVGs without a Figma source or a separate React component per icon.
This exception does not change the design-source workflow for other UI components.

## Required Inputs

Resolve inputs from the request, Figma, and local patterns before asking:

- Component name
- Default target path: `packages/ui-react/src/components/<Name>/`
- Figma URL or node ID when the component has a source design
- Expected variants, sizes, states, or interaction requirements if they are not
  clear from Figma

Ask only when an unresolved choice materially affects behavior, public API,
accessibility, or scope. State routine assumptions and proceed. A missing default
path or an already-authorized API choice does not require confirmation.

The default Figma file is:

- File: `Idenflu Design System`
- fileKey: `aMK1ysrAI4RGk1mrFk0O41`

## Workflow

1. Gather design context.
   - Load the available `figma-design-to-code` skill before calling
     `get_design_context`; follow its Code Connect and token-mapping guidance.
   - If a Figma URL or node ID is provided, call Figma `get_design_context`.
   - Extract variants, states, spacing, color, typography, motion, and a11y
     hints.
   - Treat generated code as reference only.
   - If Figma is unavailable, continue work supported by supplied specs or local
     code, report the missing design verification, and ask only for decisions
     that block implementation. Do not invent visual values.

2. Compare equivalent libraries.
   - Check Carbon React docs or source for behavior and accessibility patterns.
   - Discover the available MUI documentation tools rather than assuming tool
     names. If MCP documentation is unavailable, use the official MUI docs.
   - Do not copy MUI or Carbon API/code verbatim.

3. Inspect local patterns.
   - Prefer existing `packages/ui-react/src/components/*` conventions.
   - Use `Button` as the first reference when no closer component exists.
   - Follow component folder structure, naming, exports, and Storybook patterns.

4. Design the implementation before editing.
   - Summarize the recommended API and any meaningful MUI/Carbon differences.
   - Call out accessibility behavior: keyboard, ARIA, focus, disabled/loading
     states, and screen reader behavior.
   - Ask only for consequential API choices that remain unresolved after checking
     the request and existing contracts.

5. Implement only after requirements are clear.
   - Create or update:
     - `<ComponentName>.tsx`
     - `<ComponentName>.module.css`
     - `<ComponentName>.stories.tsx`
     - `index.ts`
   - Add public exports in `packages/ui-react/src/index.ts`.
   - Export public types from the component `index.ts` and package index.
   - Follow `docs/api/README.md`: register the component in `docs/api/index.json`
     and synchronize `docs/api/components/<id>.json` in the same change. The
     implemented public types are the source of truth for shared props.

6. Validate.
   - From the repository root, run `npm run check:api-contracts` and
     `npm run check:packages`. These check contracts and package structure;
     they do not prove runtime behavior or accessibility.
   - Check current package scripts before selecting additional checks. There is
     currently no ui-react lint script; do not claim lint passed without running
     an available linter.
   - For component or story changes, run
     `npm run build-storybook -w @idenflu/ui-react` to check preview compilation.
   - Use `npm run storybook:ui-react` from the root and verify affected stories
     in a browser: relevant variants, sizes, themes, keyboard/focus behavior,
     disabled/loading states, and narrow-screen behavior where applicable.
     Writing stories alone is not interaction verification.
   - Run focused regression tests for meaningful behavior changes when useful.
     Inspect the final diff and report failed or unrun checks explicitly.

## Component Conventions

- Folder: `packages/ui-react/src/components/<Name>/`
- Styling: CSS Modules, following the closest existing component.
- Styling must use CSS custom properties from `@idenflu/ui-tokens`.
- Import tokens through `packages/ui-react/src/styles/tokens.css` only.
- Never hardcode visual values for color, spacing, radius, or typography.
- Use `cn` from `../../utils/classNames` when composing classes.
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
- Keep edits scoped to the component and necessary callers, exports, API
  contracts, stories, and verification updates.

## Maintenance

This is the canonical skill. Keep `.cursor/skills/new-component/SKILL.md` in sync
when updating it; do not maintain separate workflows in the two copies.
