# Switch component — design spec

작성일: 2026-06-07
브랜치: `feat/ui-react-switch`
패키지: `@idenflu/ui-react`

## 1. 목적 / 배경

운영 화면의 즉시 적용 on/off 설정을 위한 `Switch` 컴포넌트를 `@idenflu/ui-react`에 추가한다. 문서 사이트(`docs/components-controls.html`)에 이미 Switch 설계 스펙(Control API)이 존재하나, 현재 문서는 네이티브 체크박스에 `accent-color`만 입힌 형태이고 React 구현은 없다. 이 작업은 (1) React `Switch` 컴포넌트를 구현하고 (2) 문서 사이트의 Switch 섹션을 React 구현 기준으로 갱신해 문서↔코드를 연결한다.

### 문서의 Switch 계약 (출처: `docs/component-api.json` → `controls`, `docs/components-controls.html`)

- **용도**: 즉시 적용되는 on/off 설정·필터. 현재 값이 화면에 계속 남아야 할 때.
- **금지**: 일회성/즉시 실행 명령을 switch로 표현하지 않는다(→ button). 모드 전환은 tabs.
- **Props 계약(패밀리)**: label, value, checked, group, helper
- **States**: checked, selected, indeterminate, disabled, focus
- **A11y**: native input, group label, `aria-checked where needed`, keyboard path
- **Token 계약**: `control-height`, `density.compact`, `colors.primary-soft`(selected 배경), `colors.primary`(focus/on)

## 2. 목표 / 비목표

**목표**
- 네이티브 `<input type="checkbox" role="switch">` 기반 + CSS pill 비주얼.
- 라벨 행(텍스트 좌 / 컨트롤 우)을 포함하는 필드형 컴포넌트.
- controlled / uncontrolled 모두 지원.
- 기존 패키지 컨벤션(forwardRef, classNames, `if-` 클래스, `--if-*` 토큰, 무의존성 source-only) 준수.
- 문서 사이트 controls 페이지를 React Switch 기준으로 갱신.

**비목표 (YAGNI)**
- `indeterminate` 상태 — checkbox group용이라 Switch에서 제외.
- `size="large"` — small/medium만 제공.
- focus-trap, 애니메이션 라이브러리, 외부 의존성.
- tsc/유닛 테스트 인프라 도입 — 기존 방침(skeleton-check 검증) 유지.
- tier-2 5종의 문서 사이트 백필 — 별도 작업.

## 3. 구조 & 마크업

신규 파일: `packages/ui-react/src/components/Switch.tsx` (단일 컴포넌트 패밀리).

```tsx
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
      type="checkbox"
      role="switch"
      className="if-switch__control"
      aria-describedby={describedBy}
      disabled={disabled}
      {...props}
    />
  </label>
  {helperText != null ? <p id={helperId} className="if-switch__helper">{helperText}</p> : null}
</div>
```

- 루트는 래퍼 `<div class="if-switch-field">` — helper 텍스트를 라벨 클릭 영역 밖에 두기 위함.
- `<label class="if-switch">`가 라벨 텍스트 + 컨트롤을 감싸 클릭/탭으로 토글 가능.
- `label` 미제공 시 `if-switch__text` 생략 → 컨트롤만 렌더. 이때 접근 가능한 이름은 소비측이 `aria-label`로 제공해야 함(passthrough). JSDoc에 명시.

## 4. API

```ts
export type SwitchSize = "small" | "medium";

export type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> & {
  /** 보이는 라벨. 생략하면 컨트롤만 렌더되며 소비측이 aria-label을 제공해야 한다. */
  label?: React.ReactNode;
  /** 라벨 아래 보조 설명. */
  description?: React.ReactNode;
  /** helper/검증 텍스트. aria-describedby로 input에 연결된다. */
  helperText?: React.ReactNode;
  /** 컨트롤 크기. 기본 "medium". */
  size?: SwitchSize;
};
```

- `forwardRef<HTMLInputElement>` — ref는 내부 `<input>`으로 전달. `Switch.displayName = "Switch"`.
- **controlled/uncontrolled**: 네이티브 input 래퍼이므로 `checked`+`onChange`(controlled) / `defaultChecked`(uncontrolled)가 passthrough로 동작. `name`, `value`, `id`, `onChange`, `onBlur` 등 모두 전달.
- `size`는 native `size?: number`와 충돌 → `Omit<…, "size">` (Button/TextField 동일 패턴).
- `aria-describedby` 병합: 소비측 `aria-describedby` + 내부 `helperId`를 합친다(TextField/Select 패턴).
  ```ts
  const helperId = helperText != null ? `${id ?? generatedId}-helper` : undefined;
  const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined;
  ```
- `id`는 소비측 제공 우선, 없으면 `React.useId()`.

## 5. 접근성

- `<input type="checkbox" role="switch">` — checked·키보드(Space 토글)·focus·폼 제출이 브라우저 기본으로 동작. `role="switch"`면 브라우저가 `checked`를 `aria-checked`로 자동 노출(수동 설정 불필요) → 계약의 "native input, aria-checked where needed" 충족.
- 가시 라벨이 있으면 `<label>` 연관으로 접근 이름 확보. 라벨 없으면 `aria-label` 필수(문서화).
- `helperText`는 `aria-describedby`로 연결.
- focus 표시는 색 외 box-shadow 링으로 항상 가시(계약: "키보드 focus는 hover와 별개로 항상 보임").

## 6. 비주얼 / CSS (`packages/ui-react/src/styles.css`에 append)

토큰만 사용. 정확한 토큰명은 구현 시 `packages/tokens/src/tokens.css`로 재확인(현재 확인됨: `--if-color-primary`, `--if-color-primary-hover`, `--if-color-surface-2`, `--if-color-surface-raised`, `--if-color-hairline-strong`, `--if-color-ink`, `--if-color-ink-muted`, `--if-focus-ring`, `--if-space-*`).

치수(고정 px, docs의 38×22 참고):
- **medium**: 트랙 40×22, thumb 18, inset 2px, 이동거리 `calc(100% - 18px - 2px)`
- **small**: 트랙 32×18, thumb 14, inset 2px

핵심 규칙:
```css
.if-switch { display:flex; align-items:center; justify-content:space-between; gap:var(--if-space-md); cursor:pointer; }
.if-switch__text { display:flex; flex-direction:column; gap:var(--if-space-xxs); }
.if-switch__label { color:var(--if-color-ink); }          /* .if-field__label 타이포 토큰 재사용 */
.if-switch__description { color:var(--if-color-ink-muted); }
.if-switch__control { appearance:none; -webkit-appearance:none; position:relative; flex:0 0 auto;
  width:40px; height:22px; border-radius:999px; background:var(--if-color-surface-2);
  border:1px solid var(--if-color-hairline-strong); cursor:pointer;
  transition:background-color 120ms ease, border-color 120ms ease; }
.if-switch__control::before { content:""; position:absolute; top:50%; left:2px; transform:translateY(-50%);
  width:18px; height:18px; border-radius:50%; background:var(--if-color-surface-raised);
  box-shadow:0 1px 2px rgba(0,0,0,.2); transition:left 120ms ease; }
.if-switch__control:checked { background:var(--if-color-primary); border-color:var(--if-color-primary); }
.if-switch__control:checked:hover { background:var(--if-color-primary-hover); border-color:var(--if-color-primary-hover); }
.if-switch__control:checked::before { left:calc(100% - 18px - 2px); }
.if-switch__control:focus-visible { box-shadow:0 0 0 3px var(--if-focus-ring); outline:0; }
.if-switch.is-disabled { opacity:.55; cursor:not-allowed; }
.if-switch.is-disabled .if-switch__control { cursor:not-allowed; }
.if-switch--small .if-switch__control { width:32px; height:18px; }
.if-switch--small .if-switch__control::before { width:14px; height:14px; left:2px; }
.if-switch--small .if-switch__control:checked::before { left:calc(100% - 14px - 2px); }
.if-switch__helper { margin-top:var(--if-space-xs); color:var(--if-color-ink-muted); }
```
- 다크 모드: 토큰이 `[data-if-theme="dark"]`에서 자동 처리.
- `prefers-reduced-motion: reduce` 시 transition 제거 규칙 추가.

## 7. 통합 지점

**패키지 코드**
- `packages/ui-react/src/index.ts`: `export { Switch }` + `export type { SwitchProps, SwitchSize }`.
- `packages/ui-react/src/styles.css`: `.if-switch*` 규칙 append.
- `scripts/package-skeleton-check.js`: Switch 파일을 requireFile 목록에 추가, index 마커에 `Switch` 추가, `requireIncludes(Switch.tsx, [...마커])`, styles.css cssMarkers 추가.

**패키지 문서**
- `docs/ui-react-usage.md`: Components 목록 + Switch 사용 예시(controlled/uncontrolled, label 없는 케이스 포함).
- `docs/react-package-plan.md`: 1차/2차 외 추가 컴포넌트로 Switch 명시.

**문서 사이트 (생성 파이프라인)**
- 소스 수정: `docs/src/pages/components-controls.html`의 "Switches" 섹션 — 예시 마크업을 pill+`role="switch"` 형태로 갱신하고 React `<Switch>` 사용/contract 노트 추가. `verify-site.js`가 요구하는 partial/depth/component 마커는 보존.
- `docs/styles.css`: `.switch-row input`을 pill 비주얼로 갱신(컴포넌트와 시각 일치). `.component-page-header` 등 기존 마커 유지.
- 재빌드: `node docs/scripts/build-site.js` → `docs/components-controls.html` 재생성.
- `docs/component-api.json`의 `controls`(패밀리 계약)는 그대로 두고, Switch 전용 React 계약은 controls 페이지에 인라인 추가.

## 8. 검증 계획

- `npm run check` (= `verify-site.js` + `package-skeleton-check.js`) 그린.
- `node docs/scripts/build-site.js` 후 git diff가 의도한 변경만 포함(재현성 유지).
- 토큰 교차검증: styles.css가 참조하는 모든 `var(--if-*)`가 tokens.css에 정의됨(미정의 0).
- export 심볼 검증: index.ts의 모든 export가 Switch.tsx에 실재.
- 수동 리뷰: TSX 유효성, a11y(role/aria/label), 컨벤션 일치.
- tsc/런타임 렌더 검증은 인프라 미도입으로 수행하지 않음(정직히 한계로 기록).

## 9. 파일 영향 요약

| 파일 | 변경 |
|---|---|
| `packages/ui-react/src/components/Switch.tsx` | 신규 |
| `packages/ui-react/src/index.ts` | Switch export 추가 |
| `packages/ui-react/src/styles.css` | `.if-switch*` 추가 |
| `scripts/package-skeleton-check.js` | Switch 마커 추가 |
| `docs/ui-react-usage.md` | Switch 사용 예시 |
| `docs/react-package-plan.md` | Switch 목록 반영 |
| `docs/src/pages/components-controls.html` | Switches 섹션 갱신 (소스) |
| `docs/styles.css` | `.switch-row` pill 비주얼 |
| `docs/components-controls.html` | build-site.js 재생성 산출물 |
