# React package draft

idenflu 디자인 시스템은 문서 사이트만으로 끝내지 않고 실제 제품 코드에서 재사용할 수 있는 패키지로 분리합니다. 첫 단계는 전체 UI 프레임워크가 아니라, 토큰과 핵심 React 컴포넌트의 계약을 작게 만드는 것입니다.

## 목표

- `docs`는 GitHub Pages 문서 사이트로 유지합니다.
- `packages/tokens`는 문서의 토큰을 제품 코드에서 import할 수 있는 형태로 제공합니다.
- `packages/icons`는 idenflu icon sprite와 symbol 이름을 패키지화합니다.
- `packages/ui-react`는 운영 화면에서 반복되는 핵심 컴포넌트를 React wrapper로 제공합니다.

## 구조

```txt
idenflu-design-system
├─ docs
│  └─ GitHub Pages 문서 사이트
├─ packages
│  ├─ tokens
│  ├─ icons
│  └─ ui-react
└─ scripts
   └─ package-skeleton-check.js
```

## 패키지

### packages/tokens

패키지 이름은 `@idenflu/ui-tokens`입니다. `tokens.json`과 `tokens.css`를 제공하고, React 컴포넌트는 이 패키지의 CSS variables를 기준으로 스타일을 잡습니다.

토큰 변수는 제품 코드에서 충돌이 적도록 `--if-` prefix를 씁니다.

```css
:root {
  --if-color-primary: #3f6df6;
  --if-color-surface-raised: #ffffff;
  --if-space-sm: 12px;
}
```

### packages/icons

패키지 이름은 `@idenflu/ui-icons`입니다. 현재 문서 사이트의 `icons.svg` sprite를 기반으로 두고, 우선 framework-neutral export를 제공합니다.

React 전용 Icon 컴포넌트는 `@idenflu/ui-react`에서 감싸는 방식으로 확장할 수 있습니다.

### packages/ui-react

패키지 이름은 `@idenflu/ui-react`입니다. 첫 단계에서는 문서에 이미 정리된 variant, state, a11y contract를 props와 class name으로 연결합니다.

1차 컴포넌트:

- `Button`
- `TextField`
- `Textarea`
- `Select`
- `Badge`
- `Chip`
- `Card`
- `Table`
- `EmptyState`

2차 후보 (구현 완료):

- `Dialog` — tier-2 overlay. `packages/ui-react/src/components/Dialog.tsx`에 구현했습니다.
- `Drawer` — tier-2 overlay side panel. `packages/ui-react/src/components/Drawer.tsx`에 구현하고 `src/index.ts` export와 `styles.css`를 연결했습니다.
- `Toolbar` — tier-2 container + `ToolbarGroup`. `packages/ui-react/src/components/Toolbar.tsx`에 구현했습니다.
- `LoadingState` — tier-2 inline/block loading placeholder. visible label과 `role=status`/`aria-live` spinner를 `packages/ui-react/src/components/LoadingState.tsx`에 구현했습니다.
- `ErrorState` — tier-2 error/failure feedback. `packages/ui-react/src/components/ErrorState.tsx`에 구현하고 `src/index.ts`에서 export합니다.

## 구현 원칙

- CSS Variables + React Components 조합으로 시작합니다.
- 복잡한 DatePicker, DataGrid, Rich Text Editor, Command Palette는 직접 만들지 않습니다.
- Table은 복잡한 grid가 아니라 기본 table shell과 상태 class 계약부터 시작합니다.
- 모든 icon-only action은 accessible name을 요구합니다.
- 상태는 색만으로 설명하지 않고 visible text와 다음 action을 함께 둡니다.

## 검증

`node scripts/package-skeleton-check.js`가 패키지 구조, 필수 export, 토큰 CSS, placeholder 문구를 확인합니다.

문서 사이트는 기존처럼 `node docs/scripts/verify-site.js`로 확인합니다.

사용 방법은 `docs/ui-react-usage.md`에 분리해 둡니다.

## GitHub Packages 배포

패키지는 GitHub Packages의 npm registry로 배포합니다.

- registry: `https://npm.pkg.github.com`
- scope: `@idenflu`
- packages:
  - `@idenflu/ui-tokens`
  - `@idenflu/ui-icons`
  - `@idenflu/ui-react`

배포는 `.github/workflows/publish-packages.yml`에서 처리합니다. release publish 또는 manual dispatch 때만 실행하고, workflow 권한은 `contents: read`, `packages: write`로 제한합니다.

로컬 `.npmrc`에는 scope registry만 둡니다.

```txt
@idenflu:registry=https://npm.pkg.github.com
```

토큰은 파일에 저장하지 않고 GitHub Actions의 `GITHUB_TOKEN`을 `NODE_AUTH_TOKEN`으로 전달합니다.
