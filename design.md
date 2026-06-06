---
version: alpha
name: idenflu-design-system
source: "IBM Carbon analysis reinterpreted for idenflu"
description: >-
  idenflu is a premium enterprise creator-operations design system: restrained,
  high-trust, and built for serious campaign work. The IBM source gives us
  discipline: clear hierarchy, hairline structure, restrained surfaces, and
  visible system state. idenflu keeps the creator workflow context, controls
  saturation through bounded accent surfaces, sharpens data density, and uses a clean white application chrome
  so the product reads as a polished B2B SaaS workspace. It should feel like a
  decision console for campaigns, creator reviews, revisions, approvals, and
  commercial operations.

colors:
  primary: "#3F6DF6"
  primary-hover: "#315FE6"
  primary-pressed: "#264AB8"
  primary-soft: "#EDF4FF"
  accent-coral: "#E3563F"
  accent-coral-soft: "#FFE9E4"
  accent-mint: "#009F7A"
  accent-mint-soft: "#DFF8EF"
  accent-amber: "#F0A000"
  accent-amber-soft: "#FFF0C7"
  ink: "#0B1220"
  ink-muted: "#566173"
  ink-subtle: "#8792A5"
  canvas: "#FFFFFF"
  surface-1: "#F7F9FC"
  surface-2: "#EEF2F7"
  surface-raised: "#FFFFFF"
  inverse-canvas: "#050505"
  inverse-surface-1: "#111113"
  inverse-ink: "#FFFFFF"
  inverse-ink-muted: "#AEB8C8"
  hairline: "#D5DCE8"
  hairline-strong: "#A8B2C3"
  focus: "#3F6DF6"
  semantic-success: "#009F7A"
  semantic-warning: "#F0A000"
  semantic-error: "#D04B55"
  semantic-error-hover: "#B83F49"
  semantic-info: "#3F6DF6"

colorRoles:
  primary: "Primary Blue for CTA, selection, focus, and key links."
  secondary: "Neutral base for surfaces, borders, secondary actions, and application chrome."
  semantic: "Coral, mint, and amber for workflow state only. Mint is not the secondary color."

themes:
  light:
    canvas: "#FFFFFF"
    surface-1: "#F7F9FC"
    surface-2: "#EEF2F7"
    surface-raised: "#FFFFFF"
    ink: "#0B1220"
    ink-muted: "#566173"
    hairline: "#D5DCE8"
    chrome: "rgba(255, 255, 255, 0.94)"
  dark:
    canvas: "#000000"
    surface-1: "#0A0A0B"
    surface-2: "#141416"
    surface-raised: "#080809"
    ink: "#F7F9FD"
    ink-muted: "#C4CEDD"
    hairline: "#292B30"
    chrome: "rgba(0, 0, 0, 0.94)"

typography:
  display-xl:
    fontFamily: Pretendard
    fontSize: 68px
    fontWeight: 650
    lineHeight: 1.06
    letterSpacing: 0
  display-lg:
    fontFamily: Pretendard
    fontSize: 56px
    fontWeight: 650
    lineHeight: 1.10
    letterSpacing: 0
  display-md:
    fontFamily: Pretendard
    fontSize: 40px
    fontWeight: 650
    lineHeight: 1.16
    letterSpacing: 0
  headline:
    fontFamily: Pretendard
    fontSize: 30px
    fontWeight: 650
    lineHeight: 1.22
    letterSpacing: 0
  card-title:
    fontFamily: Pretendard
    fontSize: 21px
    fontWeight: 650
    lineHeight: 1.34
    letterSpacing: 0
  subhead:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.48
    letterSpacing: 0
  body-lg:
    fontFamily: Pretendard
    fontSize: 17px
    fontWeight: 450
    lineHeight: 1.56
    letterSpacing: 0
  body:
    fontFamily: Pretendard
    fontSize: 15px
    fontWeight: 450
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 450
    lineHeight: 1.46
    letterSpacing: 0
  body-emphasis:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: 650
    lineHeight: 1.46
    letterSpacing: 0
  caption:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.34
    letterSpacing: 0
  button:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: 450
    lineHeight: 1.28
    letterSpacing: 0
  eyebrow:
    fontFamily: Pretendard
    fontSize: 12px
    fontWeight: 650
    lineHeight: 1.34
    letterSpacing: 0

rounded:
  none: 0px
  xs: 0px
  sm: 0px
  md: 0px
  lg: 0px
  pill: 0px
  full: 0px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  xxxl: 40px
  section: 88px

sizing:
  control-height-sm: 32px
  control-height: 38px
  control-height-lg: 44px
  field-height: 40px
  compact-control-height: 32px

shadow:
  none: "none"
  low: "0 1px 2px rgba(11, 18, 32, 0.05)"
  panel: "0 18px 48px rgba(11, 18, 32, 0.14)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{sizing.control-height}"
    padding: 9px 14px
  button-secondary:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{sizing.control-height}"
    padding: 9px 14px
  button-quiet:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{sizing.control-height}"
    padding: 9px 14px
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{sizing.control-height}"
    padding: 9px 12px
  button-danger:
    backgroundColor: "{colors.semantic-error}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    height: "{sizing.control-height}"
    padding: 9px 14px
  icon-button:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    size: "{sizing.control-height}"
  icon-button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    size: "{sizing.control-height}"
  icon-button-small:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    size: "{sizing.control-height-sm}"
  icon-button-large:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    size: "{sizing.control-height-lg}"
  icon-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  guideline-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  state-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  alert-banner:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  dropdown-menu:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
  command-palette:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
  file-upload:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  date-picker:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: "{spacing.sm}"
  status-chip:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    rounded: "{rounded.none}"
    padding: 5px 9px
  campaign-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 20px
  creator-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  metric-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  activity-row:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 12px 14px
  text-input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "{sizing.field-height}"
    padding: 9px 11px
  decorated-input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    decorationColor: "{colors.ink-subtle}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    height: "{sizing.field-height}"
    padding: 0 11px
  command-input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: "{sizing.field-height}"
    padding: 9px 11px
  product-tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    height: "{sizing.control-height}"
    padding: 8px 12px
  product-tab-selected:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.sm}"
    height: "{sizing.control-height}"
    padding: 8px 12px
  segmented-control:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 8px
  feedback-banner:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 16px
  toolbar-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-emphasis}"
    rounded: "{rounded.sm}"
    padding: 0 12px
  top-nav:
    backgroundColor: "rgba(251, 252, 254, 0.92)"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    height: 56px
  side-nav:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    width: 264px
  data-table:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 0
  modal-panel:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 24px
  footer:
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink-muted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.none}"
    padding: 48px 32px
---

## Overview

idenflu의 디자인 시스템은 IBM Carbon의 엄격함을 그대로 복제하지 않는다. 대신 **구조적 명료함**만 가져오고, 크리에이터 캠페인 제품에 맞는 고급 엔터프라이즈 애플리케이션 언어로 재해석한다.

핵심 방향은 **Creator operations workspace**다. 첫 화면은 예쁜 랜딩보다 바로 일할 수 있는 작업대처럼 보여야 한다. 캠페인 상태, 크리에이터 수, 리비전, 승인 대기, 최근 활동, 채널, 기한 같은 운영 메타데이터가 눈에 보여야 한다. 중요한 정보는 툴팁이나 정렬 메뉴 뒤에 숨기지 않는다.

IBM 원본이 `white + charcoal + blue + square`였다면, idenflu는 `clean white chrome + precise blue action + vivid bounded semantic accents`다. 딱딱한 엔터프라이즈 느낌은 줄이되, B2B SaaS의 신뢰감과 의사결정 콘솔의 밀도를 유지한다.

**Key Characteristics**

- **운영툴형 제품감**: dashboard, campaign, creator roster, review queue, audit trail이 자연스러운 기본 화면이다.
- **고급 엔터프라이즈 톤**: white chrome, restrained neutral, vivid but bounded accent, clear data density를 기본으로 한다.
- **카드 안의 카드 금지**: 큰 섹션은 평평한 영역으로 두고, 반복 항목만 카드로 만든다.
- **콘텐츠 우선**: 썸네일, creator avatar, campaign cover, status chip, deadline, revision을 함께 보여준다.
- **0px radius**: 부드러움보다 SaaS 운영툴의 정밀함을 우선한다.
- **그림자는 도구적으로만**: 기본 카드는 border와 surface로 구분하고, popover/modal에만 shadow를 쓴다.

## Token Export

- `design.md` is the narrative source of truth.
- `tokens.json` is the machine-readable export for implementation.
- Token export includes color, theme, typography, spacing, sizing, radius, shadow, component, and icon metadata.
- Token names should stay kebab-case so they can map cleanly to CSS custom properties and design tool imports.
- When `design.md` token values change, `tokens.json` must be updated in the same change.

## Governance & Versioning

- `site.config.json` defines shared top navigation, sidebars, page metadata, and generated page order.
- `src/pages/*.html` contains page-specific content. Root HTML files are generated from these fragments.
- `scripts/build-tokens.js` generates `tokens.generated.css` from `tokens.json`.
- `scripts/build-site.js` rebuilds root pages from the shared layout.
- `scripts/verify-site.js` checks page generation, token/CSS color sync, icon registry sync, component documentation structure, and blocked legacy markers.
- `scripts/visual-qa-check.js` checks visual QA coverage, component spec coverage, disabled hover overrides, icon-only labels, combobox markers, and table interaction markers.
- `changelog.html` records version, impact, deprecation, and release checklist decisions.
- Every component detail page should keep the same documentation contract: Anatomy, Variants, States, Accessibility, Examples, and QA.
- `responsive.html` defines breakpoint behavior, mobile table fallback, toolbar overflow, and long text stress rules.
- `starter-kit.html` is the recommended entry point for new screens. It keeps the first pass lightweight: workflow, layout, component composition, and basic states.

## From IBM To idenflu

| IBM에서 가져올 것 | idenflu로 바꿀 것 |
|---|---|
| 명확한 정보 계층 | 더 제품적인 density와 campaign metadata |
| 얇은 hairline과 차분한 표면 | 0px radius, controlled neutral, subtle panel depth |
| 단일 primary CTA | precise blue action + vivid bounded semantic accents |
| square enterprise chrome | white app chrome + creator operations workspace |
| light display type | 단단한 700 display weight와 한국어 가독성 |

IBM의 장점은 구조다. idenflu의 차별점은 **신뢰감 있는 운영 콘솔 안에서 크리에이터 업무 맥락이 보이는 것**이다.

## Colors

### Color Architecture

idenflu의 컬러 구조는 **Primary Blue + Neutral base + Semantic accents**다. Mint는 secondary color가 아니라 approved, live, healthy 같은 상태를 표현하는 semantic accent다.

- **Primary Blue**: 주요 CTA, 현재 선택, focus, 핵심 링크.
- **Neutral base**: white/black canvas, surface, border, secondary button, app chrome.
- **Semantic accents**: coral, mint, amber. 상태를 설명할 때만 작은 면적으로 사용한다.

### Brand & Action

- **Primary Blue** (`{colors.primary}`): 주요 CTA, 현재 선택 상태, focus ring, 중요한 링크에 사용한다.
- **Primary Soft** (`{colors.primary-soft}`): 선택된 필터, active summary, low-risk highlight background에 사용한다.
- **Semantic Coral** (`{colors.accent-coral}`): creative review, attention, revision request처럼 사람의 판단이 필요한 상태에 작게 쓴다.
- **Semantic Mint** (`{colors.accent-mint}`): approved, live, paid, healthy 상태에 쓴다.
- **Semantic Amber** (`{colors.accent-amber}`): pending, scheduled, approaching deadline 상태에 쓴다.

### Surface

- **Canvas** (`{colors.canvas}`): 전체 앱 배경. 라이트 모드는 명확한 white canvas를 기본으로 한다.
- **Surface 1** (`{colors.surface-1}`): 페이지 밴드, toolbar, filter well, secondary panel. 흰색과 구분되는 아주 옅은 gray만 사용한다.
- **Surface 2** (`{colors.surface-2}`): disabled, divider-heavy rows, skeleton background.
- **Surface Raised** (`{colors.surface-raised}`): 카드, table, modal, input의 기본 표면.
- **Hairline** (`{colors.hairline}`): 카드, row, section boundary.

### Text

- **Ink** (`{colors.ink}`): 제목, 주요 수치, 핵심 label.
- **Ink Muted** (`{colors.ink-muted}`): 설명, metadata, secondary action.
- **Ink Subtle** (`{colors.ink-subtle}`): placeholder, empty state hint, disabled copy.
- **Inverse Ink** (`{colors.inverse-ink}`): 어두운 표면 위의 제목과 primary text.

### Color Rules

- 한 화면에서 primary blue, coral, mint, amber를 모두 크게 쓰지 않는다. Accent는 상태를 설명하는 작은 면적에만 사용하고, large surface에는 neutral을 우선한다.
- 배경 그라디언트나 장식용 색 번짐은 쓰지 않는다. Trendy함은 색의 양이 아니라 정보 배치, 타이포, 이미지 밀도에서 만든다.
- Status chip은 텍스트와 색이 같이 있어야 한다. 색만으로 상태를 전달하지 않는다.

### Theme Modes

- **Light mode**: 명확한 white canvas와 white chrome을 기본으로 한다. Surface 1/2는 아주 얕은 gray만 사용해 제품이 깨끗하고 정확하게 보이게 한다.
- **Dark mode**: black canvas를 기준으로 쓰고, charcoal surface와 visible hairline으로 table, card, pipeline의 경계가 사라지지 않게 한다.
- **Shared behavior**: component radius, spacing, hierarchy, CTA 위치는 theme에 따라 바뀌지 않는다. 변하는 것은 color token과 focus/shadow intensity뿐이다.

## Typography

### Font Family

- **Pretendard**를 기본으로 사용한다.
- Fallback: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- 한국어/영어가 섞이는 제품이므로 display와 body를 같은 family로 유지한다.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `{typography.display-xl}` | 68px | 650 | 1.06 | 제품/브랜드 hero, 큰 campaign story |
| `{typography.display-lg}` | 56px | 650 | 1.10 | 섹션 hero, onboarding opener |
| `{typography.display-md}` | 40px | 650 | 1.16 | dashboard headline, page title |
| `{typography.headline}` | 30px | 650 | 1.22 | section heading |
| `{typography.card-title}` | 21px | 650 | 1.34 | card title, module title |
| `{typography.subhead}` | 18px | 500 | 1.48 | short supporting copy |
| `{typography.body}` | 15px | 450 | 1.55 | default body |
| `{typography.body-sm}` | 13px | 450 | 1.46 | table rows, card metadata |
| `{typography.body-emphasis}` | 13px | 650 | 1.46 | selected tabs, row labels |
| `{typography.caption}` | 12px | 500 | 1.34 | chip, timestamp, compact meta |
| `{typography.button}` | 14px | 450 | 1.28 | button label |
| `{typography.eyebrow}` | 12px | 650 | 1.34 | section label |

### Typography Rules

- Hero display는 너무 가늘게 만들지 않는다. idenflu는 confident하되, enterprise 화면에서는 과한 hero scale을 피한다.
- Letter spacing은 0으로 둔다. 한국어 혼합 UI에서 음수 tracking은 불안정하게 보인다.
- Dashboard 내부에서는 hero-scale type을 남용하지 않는다. 운영 화면의 제목은 30-40px 범위에서 충분하다.
- 수치 데이터는 card title보다 크게, 설명보다 진하게 둔다. 중요한 숫자는 한눈에 들어와야 한다.

## Layout

### Spacing System

- Base unit: 4px.
- Compact controls: 32-38px height with 8-12px gap.
- Button scale: small 32px, medium 38px, large 44px.
- Card padding: 16-20px.
- Page section padding: 64-88px.
- Dashboard shell gutter: 20-24px.
- Dense table row height: 40-48px.

### Density System

| Density | Control | Row / Field | Use |
|---|---:|---:|---|
| Compact | 32px | 40-44px | data table, toolbar, repeated row actions |
| Comfortable | 38px | 40px | default dashboard, forms, details |
| Spacious | 44px | 48px+ | modal decisions, critical approval, recovery flows |

Density is selected by workflow, not decoration. Review queues and admin tables should default to compact. Campaign details and settings should default to comfortable. Blocking decisions can use spacious density.

### Grid & Containers

- Marketing-style full hero보다 **workspace shell**을 우선한다.
- 기본 앱 레이아웃은 `side-nav + top-nav + main canvas + right detail panel`을 지원한다.
- Dashboard는 12-column grid로 보고, metric cards 4-up, campaign cards 3-up, table/list full-width를 기본으로 한다.
- 반복 카드가 아닌 section wrapper에는 카드 스타일을 적용하지 않는다.

### Whitespace Philosophy

여백은 고급스러움보다 **스캔 가능성**을 위해 쓴다. idenflu 화면은 campaign operator가 반복적으로 보는 화면이므로, 큰 빈 공간보다 잘 정돈된 밀도가 더 중요하다.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Canvas only | page background |
| 1 | Raised surface + 1px hairline | cards, tables, input groups |
| 2 | Soft surface tint | selected filter, active segment, empty well |
| 3 | `shadow.low` | floating toolbar, small popover |
| 4 | `shadow.panel` | modal, drawer, command palette |

Depth is functional. Default cards do not need a shadow. If every card floats, the page loses operational clarity.

## Shapes

| Token | Value | Use |
|---|---:|---|
| `{rounded.none}` | 0px | dividers, full-width bands |
| `{rounded.xs}` | 0px | tiny thumbnail, color swatch |
| `{rounded.sm}` | 0px | compact control, table badge |
| `{rounded.md}` | 0px | card, input, modal, button |
| `{rounded.lg}` | 0px | large panel |
| `{rounded.pill}` | 0px | pill shape removed |

Rounded corners are removed by default. idenflu should feel precise, structured, and enterprise-grade.

## Components

### Documentation Structure

- `components.html` is the component catalog index.
- Each major component owns a dedicated page: buttons, icons, inputs, controls, tabs, cards, data table, examples, feedback, overlays, and navigation.
- Component detail pages should grow independently with Overview, Anatomy, Variants, States, Accessibility, and Examples sections.
- Shared usage rules stay in `guidelines.html`; state regression stays in `visual-qa.html`; advanced B2B components stay in `enterprise.html`.

### Buttons

**`button-primary`** - The main action.

- Use for create campaign, invite creator, submit review, approve content.
- One primary button per decision area.
- Avoid full-width primary buttons on desktop unless inside a form or modal.
- Default control height is 38px so actions feel compact and operational.
- Size scale: small 32px for dense rows and toolbars, medium 38px for default page actions, large 44px for modal footers or high-emphasis decision areas. Button height is fixed per size so labels and icons do not shift the layout.

**`button-secondary`** - Strong neutral action.

- Use for export, open brief, view report.
- Works well in dark text-heavy surfaces.

**`button-quiet`** - Low-risk action.

- Use for filters, view toggles, secondary navigation.

**`button-ghost`** - Inline or toolbar action.

- Use with icons for compact tools. Text-only ghost buttons should be limited to clear commands.
- Hover keeps the surface transparent and uses primary text plus a thin bottom rule, so it does not read like a default filled button.

**`button-danger`** - Destructive action.

- Use only when the action deletes, removes, rejects, or revokes access.

**`icon-button`** - Compact tool action.

- Use for familiar tools such as search, filter, refresh, download, close, more actions.
- Icon-only buttons must have an accessible label.
- Ghost icon buttons are for inline utility actions where the surrounding row or toolbar already provides the surface.
- Keep icon stroke light and square; do not use rounded icon containers.

**`icon-library`** - Current operational icon set.

- Current icons: plus, filter, download, check, x, refresh, more, search, calendar.
- Expanded operational icons: user, file, table, alert, settings, lock.
- Use 24px viewBox, no fill, 1.8px stroke, square line caps and joins.
- Icon gallery cards show the symbol name and intended operational usage.

| Symbol | Use |
|---|---|
| `icon-plus` | Create, add, invite |
| `icon-filter` | Filter, segment, stage |
| `icon-download` | Export, report download |
| `icon-check` | Approve, selected, complete |
| `icon-x` | Cancel, reject, remove |
| `icon-refresh` | Refresh queue, sync |
| `icon-more` | Overflow, more actions |
| `icon-search` | Search, command input |
| `icon-calendar` | Date, deadline, schedule |
| `icon-user` | Creator, owner, reviewer |
| `icon-file` | Brief, asset, document |
| `icon-table` | Data view, report, roster |
| `icon-alert` | Risk, warning, failed sync |
| `icon-settings` | Preferences, admin, controls |
| `icon-lock` | Permission, locked workflow |

**Button states**

- Default: neutral border or primary fill depending on action importance.
- Hover: stronger border and surface tint, not extra weight.
- Focus: blue focus ring with visible border.
- Selected: primary-soft background plus primary border.
- Loading: compact inline pulse bar, text remains visible.
- Disabled: muted text, surface-2 background, no hover or active movement. Icon-only buttons follow the same disabled treatment.

### Cards & Containers

**`campaign-card`**

- Shows campaign cover thumbnail, campaign title, status, channel, deadline, owner, revision count, and next action.
- Metadata is visible in the card body. Do not hide revision or deadline in tooltip-only UI.

**`creator-card`**

- Shows avatar or content thumbnail, creator name, platform, audience fit, rate/range, availability, last activity.
- Use one accent at a time: fit score, availability, or risk.

**`metric-card`**

- Shows primary number, trend, period, and source label.
- Avoid oversized decorative charts. Small sparklines are acceptable when they clarify trend.

**`activity-row`**

- Used for audit log, approval feed, asset review events.
- Include actor, action, target, timestamp, and status.

**`data-table`**

- Best for campaign operations, creator lists, invoices, revision queues.
- Important operational fields should be columns, not hidden menus.
- Table toolbar includes filter, owner scope, density, export, and updated time.
- Bulk selection bar must show selected count, affected scope, and the available actions.
- Sortable headers use real buttons; active sort uses `aria-sort`.
- Row actions remain visible and reachable without hover.
- Pagination stays connected to the table region and preserves filters, density, and selection state.

### Inputs & Forms

**`text-input`**

- Raised white field on soft background.
- Default field height is 40px to align visually with compact buttons and selects.
- Form grid items align to the start so helper text in one column does not stretch a neighboring field.
- Field anatomy is label, control, helper/error text, and optional required signal.
- Optional input shell supports leading icons, text prefixes, text suffixes, and decorated selects without changing the base field size.
- Decorations are metadata or affordances only; keep the entered value visually dominant.
- Focus state uses blue outline or blue bottom accent.
- Error state pairs red accent with readable helper copy.
- Success state pairs green border with concise confirmation copy.
- Disabled fields use Surface 2, muted text, and no focus or hover treatment. Decorated inputs should disable the shell and all decorations together.
- Readonly fields stay readable and copyable while preventing edits.
- Input groups should keep prefix/suffix/decorative icon outside the editable value.

**`command-input`**

- Used for search, quick jump, command palette, creator lookup.
- Should support placeholder examples like "Search campaigns, creators, briefs".
- Prefer a leading search icon and a trailing keyboard hint for command-style fields.
- Searchable selection uses combobox/listbox/option roles and keeps active option state in `aria-activedescendant`.

### Example Screens

- **Campaign detail**: combines status, campaign metrics, checklist, and decision actions.
- **Creator profile**: combines profile identity, fit metrics, rate, and invite/message actions.
- **Review queue**: combines asset preview, issue list, reviewer assignment, and resolve action.
- **Settings / permissions**: combines switchable permissions, locked values, and default owner fields.
- **Operational states**: loading, error, and empty states should preserve the user's current filter and selection context.

### Tabs & Filters

**`product-tab` / `product-tab-selected`**

- Use segmented tabs for dashboard modes: Overview, Campaigns, Creators, Reviews, Billing.
- Selected tab has raised white surface plus strong text. Blue underline is optional when the tab strip already has contrast.

**Filter chips**

- Chips are compact and stateful.
- Show selected filters in the main canvas, not only inside a dropdown.

### Controls & Feedback

**`segmented-control`**

- Use for time range, channel, review mode, and dashboard density toggles.
- Keep the selected state neutral-raised unless it is the main action.

**`switch-control` / `checkbox-group` / `range-control`**

- Use switches for binary settings, checkboxes for multi-select filters, and range controls for thresholds.
- Native form affordances are acceptable when they are clear and compact.

**`feedback-banner` / `toast` / `progress-row`**

- Pair semantic color with visible text. Never depend on color alone.
- Progress should expose both label and value.

### Example Cases

- **Decision footer**: cancel plus one primary action for approval/rejection flows.
- **Dense toolbar**: repeated queue tools such as compare, assign, archive, and export.
- **Inline row actions**: view, message, shortlist, approve, request changes.
- **Empty state**: calm operational copy plus one quiet next action.
- **Bulk action bar**: selected count, filter context, and two neutral actions.

### Navigation

**`top-nav`**

- Sticky, translucent white, 56px height.
- Contains workspace switcher, search/command, notifications, user menu.
- In the design system docs, keep top navigation to Overview, Foundations, Components, Patterns, and Reference.
- Reference groups Guidelines, States, Accessibility, Enterprise, and Visual QA so the primary IA stays compact.

**`side-nav`**

- Use for core product areas.
- Keep labels short: Dashboard, Campaigns, Creators, Reviews, Assets, Reports, Settings.

### Modal & Drawer

**`modal-panel`**

- Use for focused decisions: approve, reject, invite, duplicate, delete.
- Keep destructive actions visually separated.

**Drawer**

- Use for previewing campaign or creator details without leaving the list.
- Drawer should show visible status, revision, owner, and recent events near the top.

## Usage Guidelines

Use these guidelines as a starting point, not as a rigid approval checklist. Start with the workflow and user decision, then pull in detailed component contracts only when the screen needs them.

### Action Priority

- Use one primary button per decision area.
- Use quiet buttons for visible secondary controls such as filter, cancel, export, or view report.
- Use ghost buttons for repeated row actions and inline navigation where a filled surface would create noise.
- Use danger only for destructive or irreversible actions, and label the action explicitly.

### Forms

- Always show a visible label. Placeholder text does not replace a label.
- Error states must include helper copy that explains the problem and the next recovery action.
- Disabled fields are for unavailable actions. Readonly fields are for fixed values that can still be read or copied.
- Decorated inputs may use leading icons, prefixes, and suffixes, but the entered value remains visually dominant.

### Data Views

- Choose tables when comparison matters: creator rates, revisions, invoices, owners, deadlines.
- Choose cards when the user is scanning repeated objects with thumbnails or summary metadata.
- Keep owner, status, revision, deadline, and risk visible in the main body.
- Bulk action bars must show selected count, scope, and available actions.

### Overlays

- Use modal panels for blocking decisions such as approve, reject, delete, invite, or duplicate.
- Use popovers for short contextual settings and row actions.
- Use tooltips only for supplemental explanation. Do not hide operational state in a tooltip.

## State System

### State Rules

- Every state should answer: what happened, why it matters, and what action is available.
- Loading states preserve the final layout footprint through skeleton rows or inline progress.
- Empty states identify whether the page is truly empty, filtered empty, or permission-limited.
- Error states pair semantic accent with readable copy and a recovery action.
- Permission-locked states explain who can unlock or what policy applies.

### Required States

| State | Required content | Example action |
|---|---|---|
| Loading | Stable layout placeholder, optional progress label | Keep working |
| Empty | Cause and next step | Clear filters, upload asset |
| Success | Result confirmation | View saved brief |
| Warning | Risk and deadline | Assign owner |
| Error | Cause and recovery | Retry, choose smaller file |
| Locked | Permission or workflow reason | Request access |

## Accessibility

### Interaction Contract

- All interactive controls require a visible focus state.
- Icon-only buttons require an accessible name such as `aria-label="Download report"`.
- Status cannot rely on color alone. Pair color with text.
- Menu, modal, popover, and tabs must define keyboard behavior before implementation.
- Disabled controls need nearby reason copy. Readonly controls should preserve text readability.

### QA Checklist

- Tab order follows the visual reading order.
- Focus is visible on buttons, links, inputs, tabs, menus, and icon-only controls.
- Esc closes menus, popovers, and non-destructive modals.
- Modal focus is trapped and restored to the triggering control.
- Light and dark modes preserve text contrast and border visibility.

### Visual QA

- Use `visual-qa.html` before changing core tokens or component state styles.
- Compare buttons, fields, tables, feedback states, and theme surfaces in one pass.
- Visual QA should include default, hover sample, focus, selected, loading, disabled, readonly, success, invalid, empty, error, and permission states.
- A component state should not rely on hover-only affordances. Row actions and recovery actions must remain visible.

## Enterprise Components

### Contract Checklist

Every enterprise component must define:

- **Anatomy**: visible parts, required labels, and optional areas.
- **States**: default, hover, focus, active, disabled, loading, empty, invalid, and destructive where relevant.
- **Keyboard**: Tab order, arrow key behavior, Enter/Space activation, Esc close behavior, and focus restore.
- **ARIA**: role, labelledby/describedby, selected/expanded/busy/invalid state, and accessible name for icon-only actions.

### Navigation Components

- **Breadcrumb**: shows object hierarchy in deep campaign, creator, or review pages.
- **Dropdown menu**: groups row actions and toolbar commands without adding repeated buttons.
- **Command palette**: supports search, quick jump, and high-frequency workflow actions.

| Component | Anatomy | States | Keyboard |
|---|---|---|---|
| Breadcrumb | Root, parent object, current page | Current item, truncated overflow | Links follow normal Tab order |
| Dropdown menu | Trigger, menu surface, grouped items | Open, active item, disabled, destructive | Arrow keys move, Enter selects, Esc exits |
| Command palette | Search input, result list, command label | Typing, empty, loading, active result | Arrow keys move, Enter commits, Esc collapses |

### Overlay Components

- **Tooltip**: supplemental terminology only.
- **Popover**: short contextual forms such as assign reviewer or quick filter.
- **Drawer**: detail preview that preserves the list or table context.

| Component | Anatomy | States | Keyboard |
|---|---|---|---|
| Tooltip | Trigger, short description, placement | Hover, focus, delayed close | Appears on focus, closes on blur or Esc |
| Popover | Trigger, title, body, action row | Open, pending, validation, dismissed | Initial focus enters, Esc restores trigger |
| Drawer | Header, object summary, sections, close action | Loading, dirty, locked, empty section | Focus stays inside until close |

### Feedback Components

- **Alert banner**: section or page-level state.
- **Toast**: short confirmation after non-blocking actions.
- **Inline validation**: field-level error with recovery copy.

| Component | Anatomy | States | Keyboard |
|---|---|---|---|
| Alert banner | Tone, title, recovery copy, optional action | Info, warning, error, success | Inline links and actions stay tabbable |
| Toast | Status, message, optional undo/view | Queued, visible, dismissed, action used | Action is reachable; timeout is not required |
| Inline validation | Label, control, error message, recovery hint | Default, invalid, corrected, server error | Error is connected with `aria-describedby` |

### Advanced Form Components

- **Date picker**: deadline and schedule selection with timezone context.
- **File upload**: accepted formats, size limits, progress, and failure recovery.
- **Combobox**: searchable selection for owners, creators, campaigns, and reviewers.
- **Stepper**: ordered setup or approval workflows.

| Component | Anatomy | States | Keyboard |
|---|---|---|---|
| Date picker | Text field, calendar grid, selected day, timezone note | Today, selected, unavailable, invalid | Field and day controls are reachable |
| File upload | Drop zone, file rules, action, progress row | Idle, dragging, uploading, failed, complete | Choose file is the first tabbable control |
| Combobox | Input, filtered list, entity metadata | Typing, active option, no result, disabled option | Arrow keys move, Enter selects, Esc collapses |
| Stepper | Step label, progress line, current step | Complete, current, blocked, upcoming | Clickable steps follow logical order |

## Patterns

### Dashboard Overview

The first screen should show:

- Current campaign health.
- Pending reviews.
- Creator replies.
- Deadline risk.
- Recent activity.
- Visible revision count.

Recommended layout: top summary metrics, campaign pipeline, review queue, right activity rail.

### Campaign Pipeline

Pipeline columns should be operational, not decorative:

- Draft.
- Recruiting.
- Content review.
- Scheduled.
- Live.
- Complete.

Each card should expose owner, due date, creator count, status, and next action.

### Creator Roster

Creator lists need fast comparison:

- Thumbnail/avatar.
- Platform.
- Category.
- Audience range.
- Fit score.
- Rate or package.
- Response status.
- Last contacted.

Use table/list view as the default for operations. Card view can be a visual browsing mode.

### Review Queue

The review queue is a core idenflu surface:

- Asset thumbnail.
- Campaign.
- Creator.
- Revision number.
- Reviewer.
- Due time.
- Approve/request changes/reject actions.

Never make revision visibility depend on hover, tooltip, or sort state.

### Login / Auth Shell

Login is part of the product, not a generic gate.

- Show brand name and workspace context.
- Explain security/domain restriction clearly.
- Give recovery action for blocked auth or wrong workspace.
- Keep the visual tone calm and operational, not campaign-landing-heavy.

## Do's and Don'ts

### Do

- Show operational metadata directly in cards, rows, and panels.
- Use real campaign thumbnails, creator avatars, or content previews when possible.
- Use white raised surfaces over a clean white canvas, with only subtle gray section bands where hierarchy is needed.
- Keep primary blue for action and selection.
- Use coral/mint/amber as semantic accents, not decoration.
- Keep repeated cards square with 0px radius.
- Prefer dense but readable layouts for dashboard and admin views.
- Use icons for compact tools when the action is familiar.

### Don't

- Don't turn idenflu into a marketing landing page when the task is dashboard or login UI.
- Don't bury revision, deadline, owner, or status in tooltips.
- Don't nest cards inside cards unless the inner item is a true repeated object.
- Don't use large decorative gradient blobs, bokeh, or abstract orbs.
- Don't make every surface blue-tinted.
- Don't use pill-shaped buttons or chips by default.
- Don't use shadow to separate every card.
- Don't let thumbnails become generic placeholders when the workflow depends on content review.

## Responsive Behavior

| Name | Width | Key Changes |
|---|---:|---|
| Desktop wide | 1440px+ | Side nav, main grid, right detail rail can all be visible |
| Desktop | 1024px+ | Main grid remains, right rail can collapse into drawer |
| Tablet | 768px+ | Cards become 2-up, table gains horizontal affordance |
| Mobile | 390px+ | Single-column, side nav becomes bottom or drawer nav |

### Touch Targets

- Buttons and inputs: 44-48px minimum height.
- Table row actions should remain reachable through row menu or sticky action bar.
- Chips need enough hit area even when text is compact.

### Mobile Priority

Mobile should prioritize:

1. Pending actions.
2. Campaign status.
3. Creator messages.
4. Review queue.
5. Search.

Avoid squeezing full desktop tables onto mobile without a focused card/list alternative.

## Content & Tone

idenflu copy should be clear and operational.

- Prefer "Review due today" over "Your creative journey awaits".
- Prefer "3 revisions pending" over "Needs attention".
- Prefer "Invite creators" over "Start now".
- Prefer "Workspace access is limited to approved domains" over vague auth errors.

The product voice is concise, premium, and useful.

## Iteration Guide

1. When adding a new screen, start from the workflow: campaign, creator, review, asset, report, billing, settings.
2. Decide whether the screen is comparison-heavy. If yes, use table/list first.
3. Make status, owner, revision, and deadline visible before adding visual polish.
4. Use `{colors.primary}` for the main next action only.
5. Use `{colors.accent-coral}`, `{colors.accent-mint}`, and `{colors.accent-amber}` only when they encode state.
6. Keep section wrappers flat. Use cards only for repeated objects or framed tools.
7. Test desktop and mobile for text overflow, crowded chips, and hidden actions.

## Known Gaps

- Brand assets, logo rules, and thumbnail photography rules are not yet finalized.
- Exact chart styles should be defined after seeing real campaign metrics.
- If idenflu has an existing production app style, these tokens should be reconciled against that code before implementation.
