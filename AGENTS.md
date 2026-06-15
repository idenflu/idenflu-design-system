# Idenflu Design System — Agent Context

React component package for the idenflu design system.

## Packages

| Package        | Path                                 | Role                |
| -------------- | ------------------------------------ | ------------------- |
| ui-react       | `packages/ui-react`                  | React components    |
| ui-foundations | `@idenflu/ui-foundations` (external) | Design tokens (CSS) |

## Figma

- **File**: [Idenflu Design System](https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System)
- **fileKey**: `aMK1ysrAI4RGk1mrFk0O41`

Component work should start from a node-specific Figma URL (`?node-id=...`).

## Tokens

`packages/ui-react/src/styles/tokens.css` imports:

```css
@import "@idenflu/ui-foundations/css/tokens-light.css";
@import "@idenflu/ui-foundations/css/tokens-dark.css";
```

All styling must use these CSS custom properties — no hardcoded visual values.

## Reference Libraries

| Library      | Purpose                | Access                                                                                                                           |
| ------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Figma MCP    | Visual source of truth | `get_design_context`, Code Connect                                                                                               |
| MUI          | API and a11y patterns  | MUI MCP (`useMuiDocs`, `fetchDocs`)                                                                                              |
| Carbon React | API and a11y patterns  | [Docs](https://react.carbondesignsystem.com/), [GitHub](https://github.com/carbon-design-system/carbon/tree/main/packages/react) |

## Cursor Rules

- `.cursor/rules/design-system.mdc` — principles (tokens, a11y, TS)
- `.cursor/rules/component-workflow.mdc` — MCP workflows
- `.cursor/prompts/` — copy-paste prompt templates

## Component Structure

```
packages/ui-react/src/components/<Name>/
  <Name>.tsx
  <Name>.css          # nova-<name> BEM-style classes
  <Name>.stories.tsx
  index.ts
```

Export public types from `packages/ui-react/src/index.ts`.
