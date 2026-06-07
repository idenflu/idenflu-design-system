# Controls family (Checkbox / RadioGroup / SegmentedControl) — design spec

작성일: 2026-06-07
브랜치: `feat/ui-react-controls-family`
패키지: `@idenflu/ui-react`

## 1. 목적 / 배경

문서의 `controls` 컴포넌트 패밀리(segmented control, switch, checkbox, radio, range) 중 React 구현은 현재 `Switch`뿐이다. 이 작업은 `Checkbox`, `RadioGroup`, `SegmentedControl`을 추가해 controls 패밀리를 사실상 완성한다. (Range는 이번 범위 제외 — YAGNI.)

### 문서 계약 (출처: `docs/component-api.json` → `controls`, `docs/components-controls.html`)

- **Props(패밀리)**: label, value, checked, group, helper
- **States**: checked, selected, indeterminate, disabled, focus
- **A11y**: native input, group label, `aria-checked where needed`, keyboard path
- **Token 계약**: `control-height`, `density.compact`, `colors.primary-soft`(selected 배경), `colors.primary`(focus/on)
- 문서 마크업: checkbox는 `<label><input type="checkbox"> text</label>`(컨트롤-좌, 텍스트-우), segmented는 `<div role="group" aria-label><button class="active">…</button></div>`. radio는 문서에 명시 없음 → 패밀리 일관성으로 신규 설계.

## 2. 결정 사항 (확정)

- **API 스타일**: data-driven (`options` 배열) — 기존 `Select`과 동일 패턴. RadioGroup·SegmentedControl에 적용.
- **Checkbox**: 단독 컴포넌트(+`indeterminate`). CheckboxGroup은 만들지 않음(소비측이 `fieldset`로 구성).

## 3. 목표 / 비목표

**목표**
- 네이티브 input 기반(Checkbox=checkbox, RadioGroup=radio) + 토큰 CSS. SegmentedControl은 docs 구조에 맞춰 버튼 기반.
- controlled/uncontrolled 모두 지원.
- 기존 컨벤션(forwardRef, classNames, `if-` 클래스, `--if-*` 토큰, 무의존성 source-only, displayName) 준수.
- 문서 사이트 controls 페이지에 React 노트 연결.

**비목표 (YAGNI)**
- Range/슬라이더, CheckboxGroup, size "large".
- SegmentedControl의 roving-tabindex radiogroup 시맨틱(아래 5.3 참고).
- tsc/테스트 인프라 — 기존 방침(skeleton-check) 유지.

## 4. 파일 구조 (신규 3개)

| 파일 | 책임 |
|---|---|
| `packages/ui-react/src/components/Checkbox.tsx` | 단일 checkbox + indeterminate |
| `packages/ui-react/src/components/RadioGroup.tsx` | data-driven radio 그룹 |
| `packages/ui-react/src/components/SegmentedControl.tsx` | data-driven 단일선택 세그먼트 |

## 5. 컴포넌트 설계

### 5.1 Checkbox

```ts
export type CheckboxSize = "small" | "medium";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "children"
> & {
  label?: React.ReactNode;       // 컨트롤 우측 텍스트
  description?: React.ReactNode;  // 라벨 아래 보조 설명
  helperText?: React.ReactNode;   // aria-describedby로 연결
  indeterminate?: boolean;        // 부분 선택
  size?: CheckboxSize;            // 기본 "medium"
};
```

- 구조: `<div class="if-checkbox-field"> <label class="if-checkbox if-checkbox--{size} {is-disabled}"> <input type="checkbox" class="if-checkbox__control" …/> <span class="if-checkbox__text"><span class="if-checkbox__label">label</span><span class="if-checkbox__description">…</span></span> </label> <p class="if-checkbox__helper">…</p> </div>`. 컨트롤이 좌측, 텍스트 우측(docs 순서). label 미제공 시 텍스트 생략 → `aria-label` 필요(JSDoc 명시).
- **indeterminate**: HTML 속성이 없으므로 내부 `React.useRef`를 forwardRef와 병합(callback ref)하고 `useEffect`에서 `node.indeterminate = !!indeterminate` 설정. 네이티브가 `aria-checked="mixed"`를 자동 노출.
- controlled/uncontrolled: `checked`+`onChange` / `defaultChecked` passthrough.
- `aria-describedby` 병합: `[ariaDescribedBy, helperId].filter(Boolean).join(" ") || undefined`. `id`는 소비측 우선, 없으면 `useId`.
- forwardRef→input, `Checkbox.displayName = "Checkbox"`.

### 5.2 RadioGroup

```ts
export type RadioGroupSize = "small" | "medium";

export type RadioOption = {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "defaultValue"
> & {
  options: RadioOption[];
  label: React.ReactNode;          // 그룹 라벨 (legend)
  value?: string;                  // controlled
  defaultValue?: string;           // uncontrolled
  onChange?: (value: string) => void;
  name?: string;                   // 공유 input name (기본 useId)
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  size?: RadioGroupSize;
  orientation?: "vertical" | "horizontal"; // 기본 "vertical"
};
```

- 구조: `<fieldset class="if-radio-group if-radio-group--{orientation} if-radio-group--{size}"> <legend class="if-radio-group__label">label</legend> {description} {options.map → <label class="if-radio {is-disabled}"><input type="radio" class="if-radio__control" name checked onChange disabled/> <span class="if-radio__text">label+description</span></label>} <p class="if-radio-group__helper">…</p> </fieldset>`.
- `fieldset`+`legend` = 네이티브 group label(계약 "group label" 충족). 네이티브 radio라 화살표 키보드 이동 무료.
- controlled/uncontrolled: `value` 있으면 controlled, 없으면 `defaultValue` 초기값으로 내부 state. 각 input `checked = current === option.value`, `onChange` 시 `onChange?.(option.value)` + (uncontrolled면) state 갱신.
- `name`은 그룹 내 공유(기본 `useId`). 그룹 전체 `disabled`는 각 input에 합성(`disabled || option.disabled`).
- `helperText`는 `aria-describedby`로 fieldset에 연결.
- forwardRef→fieldset, `RadioGroup.displayName = "RadioGroup"`.

### 5.3 SegmentedControl

```ts
export type SegmentedControlSize = "small" | "medium";

export type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> & {
  options: SegmentedOption[];
  label: string;                   // 필수 aria-label
  value?: string;                  // controlled
  defaultValue?: string;           // uncontrolled
  onChange?: (value: string) => void;
  size?: SegmentedControlSize;
  disabled?: boolean;
};
```

- 구조: `<div role="group" aria-label={label} class="if-segmented if-segmented--{size}"> {options.map → <button type="button" class="if-segmented__option" aria-pressed={selected} disabled={disabled||option.disabled} onClick={() => select(value)}>{icon? <span class="if-segmented__icon" aria-hidden>…</span>}<span class="if-segmented__label">label</span></button>} </div>`.
- 단일 선택. controlled/uncontrolled는 RadioGroup과 동일 로직.
- **a11y 트레이드오프**: 단일 배타 선택은 radiogroup(role=radio + roving tabindex)이 가장 정밀하나, docs 구조(role=group + 버튼)와 무의존 단순성을 위해 `role="group"` + 옵션별 `aria-pressed` 채택. icon-only 옵션은 허용하지 않음(항상 visible label) — 필요 시 후속에서 `aria-label` 옵션 추가.
- forwardRef→컨테이너 div, `SegmentedControl.displayName = "SegmentedControl"`.

## 6. 공유 동작: controlled/uncontrolled 헬퍼

RadioGroup·SegmentedControl 모두 동일 패턴(각 파일에 인라인, 공유 모듈 신설 안 함 — 작은 로직):
```ts
const isControlled = value !== undefined;
const [internal, setInternal] = React.useState(defaultValue);
const current = isControlled ? value : internal;
const select = (next: string) => {
  if (!isControlled) setInternal(next);
  onChange?.(next);
};
```

## 7. 비주얼 / CSS (`packages/ui-react/src/styles.css`에 append)

토큰만 사용(확인됨: `--if-color-primary`, `--if-color-primary-soft`, `--if-color-surface-1`, `--if-color-surface-2`, `--if-color-surface-raised`, `--if-color-hairline`, `--if-color-hairline-strong`, `--if-color-ink`, `--if-color-ink-muted`, `--if-color-inverse-ink`, `--if-radius-sm`, `--if-radius-md`, `--if-control-height-sm`, `--if-focus-ring`, `--if-space-*`, `--if-font-*`).

- **Checkbox**: `.if-checkbox`(align-items: flex-start, gap), `.if-checkbox__control`(appearance:none, 18×18(small 16), `--if-radius-sm`, border `--if-color-hairline-strong`); `:checked`→`--if-color-primary` bg + `::after` 체크표시(회전 border, `--if-color-inverse-ink`); `:indeterminate`→`--if-color-primary` bg + `::after` 수평 대시; `:focus-visible`→`box-shadow 0 0 0 3px var(--if-focus-ring)`. 텍스트/헬퍼는 field 토큰 재사용.
- **RadioGroup**: `.if-radio-group`(fieldset 리셋: border:0,margin:0,padding:0,min-inline-size:0), `--horizontal`은 옵션 flex-row. `.if-radio__control`(appearance:none, 원형 `border-radius:50%`, 18×18); `:checked`→`--if-color-primary` border + 내부 dot(`::after`, `--if-color-primary`); `:focus-visible` 링.
- **SegmentedControl**: `.if-segmented`(inline-flex, `--if-color-surface-1` bg, `1px var(--if-color-hairline)` border, `--if-radius-md`, padding 2px, gap 2px); `.if-segmented__option`(투명 bg, `--if-color-ink-muted`, `--if-radius-sm`, min-height `--if-control-height-sm`); `[aria-pressed="true"]`→`--if-color-surface-raised` bg + `--if-color-ink`; `:focus-visible` 링; `:disabled` opacity.
- `@media (prefers-reduced-motion: reduce)`로 transition 제거.
- 다크 모드는 토큰이 자동 처리.

## 8. 통합 지점

**패키지 코드**
- `index.ts`: `Checkbox`/`RadioGroup`/`SegmentedControl` + 각 타입(`CheckboxProps,CheckboxSize`, `RadioGroupProps,RadioGroupSize,RadioOption`, `SegmentedControlProps,SegmentedControlSize,SegmentedOption`) export.
- `styles.css`: `.if-checkbox*`/`.if-radio*`/`.if-segmented*` append.
- `scripts/package-skeleton-check.js`: 3개 파일 requireFile, index 마커 3개, 컴포넌트별 requireIncludes 마커, styles.css cssMarkers.

**패키지 문서**
- `docs/ui-react-usage.md`: Components 목록 + 3개 사용 예시(controlled/uncontrolled 포함).
- `docs/react-package-plan.md`: 추가 컴포넌트로 반영.

**문서 사이트**
- `docs/src/pages/components-controls.html`: "Segmented control"/"Checkbox group" 섹션에 React 노트(`<SegmentedControl …/>`, `<Checkbox …/>`, `<RadioGroup …/>`) 추가. partial/depth/component 마커 보존. 필요 시 `docs/styles.css` 정합. → `node docs/scripts/build-site.js` 재빌드.

## 9. 검증 계획

- `npm run check` (verify-site + skeleton) 그린.
- `node docs/scripts/build-site.js` 후 의도한 변경만 + 재현성.
- 토큰 교차검증(미정의 `--if-*` 0), export 심볼 검증(0 missing), 수동 리뷰(TSX 유효성, a11y, 컨벤션).
- tsc/런타임 렌더는 인프라 미도입으로 미수행(한계 기록).

## 10. 파일 영향 요약

| 파일 | 변경 |
|---|---|
| `packages/ui-react/src/components/Checkbox.tsx` | 신규 |
| `packages/ui-react/src/components/RadioGroup.tsx` | 신규 |
| `packages/ui-react/src/components/SegmentedControl.tsx` | 신규 |
| `packages/ui-react/src/index.ts` | 3개 export |
| `packages/ui-react/src/styles.css` | `.if-checkbox*`/`.if-radio*`/`.if-segmented*` |
| `scripts/package-skeleton-check.js` | 마커 추가 |
| `docs/ui-react-usage.md` | 사용 예시 |
| `docs/react-package-plan.md` | 목록 반영 |
| `docs/src/pages/components-controls.html` | React 노트 (소스) |
| `docs/components-controls.html` | build-site.js 산출물 |
