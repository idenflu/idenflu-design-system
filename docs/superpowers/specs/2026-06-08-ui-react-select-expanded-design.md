# Select expanded form — design spec

작성일: 2026-06-08
브랜치: `feat/ui-react-select-expanded`
패키지: `@idenflu/ui-react` (+ docs 미러)

## 1. 목적 / 배경

현재 `@idenflu/ui-react`의 `Select`는 네이티브 `<select>` 래퍼다. 네이티브는 옵션에 커스텀 내용(아이콘·보조설명)을 넣을 수 없고, 다중 선택 UX가 빈약하다. MUI Select(`native` vs 커스텀 폼, selection indicator)를 참고해 **하나의 `<Select>`가 두 폼을 지원**하도록 확장한다:

- **native 폼** (기본, 현행): 실제 `<select>` — 단순·모바일 친화·JS 불필요.
- **expanded 폼** (opt-in): 커스텀 listbox 위젯 — 커스텀 옵션(아이콘·설명), 다중 선택(칩 + 체크마크), 선택적 검색.

본질적으로 **실제 상호작용 컴포넌트 기능**이므로 ui-react가 소스 오브 트루스이고, docs는 이를 문서화/데모로 미러링한다. **작업 순서: ui-react 먼저 → docs 반영.** 최종 상태는 docs↔ui-react parity 유지.

## 2. 결정 사항 (브레인스토밍 확정)

- **범위**: docs + ui-react 둘 다 (parity). 단, **ui-react 우선** 구현 후 docs 미러.
- **공개 API**: 단일 `<Select>` (MUI식). native 기본, expanded는 opt-in. 내부적으로 expanded listbox는 별도 모듈로 분리.
- **다중 선택 trigger 표시**: 선택 항목을 **Chip(태그) 나열**(개별 제거), 넘치면 **`+N` 오버플로우**. 드롭다운 옵션에는 **체크마크 indicator**.
- **검색**: **`searchable` prop (기본 off)** — 켜면 드롭다운 상단에 필터 입력. 글자 점프 **typeahead는 항상 포함**(검색 필드와 무관).
- **커스텀 옵션**: 구조화 필드(`icon` + `description`) 방식 — 선언적, docs 데모와 호환. 렌더 함수(renderOption/renderValue)는 도입하지 않음.
- **expanded 변경 콜백**: native 이벤트 `onChange`와 분리해 **`onValueChange`** 신설.
- **자동 expanded**: `multiple`/`searchable`이 true이거나 옵션에 `icon`/`description`이 있으면 expanded로 자동 전환.

## 3. 목표 / 비목표

**목표**
- 단일 `<Select>` API에 `expanded`·`multiple`·`searchable` props, `SelectOption`에 `icon`·`description` 추가.
- expanded: 커스텀 listbox(트리거 + 패널), 단일/다중, controlled/uncontrolled, 선택적 검색.
- WAI-ARIA listbox 패턴 + 키보드(↑↓·Home/End·Enter/Space·Esc·typeahead). 다중은 토글+열린 유지.
- 기존 컨벤션(forwardRef, classNames, `if-` 클래스, `--if-*` 토큰, source-only, displayName, a11y) 준수.
- docs `components-select.html` 문서/데모 + 플레이그라운드 섹션에 두 폼·다중·검색·커스텀 옵션 추가.
- native 폼 하위호환 100% (기존 사용처 변화 없음).

**비목표 (YAGNI)**
- `renderValue`/`renderOption` 커스텀 렌더 prop — 구조화 필드로 대체.
- 비동기/원격 옵션, 무한 스크롤 — Combobox 담당 영역.
- optgroup(그룹 헤더), 옵션 가상화.
- 팝업 포지셔닝 라이브러리(floating-ui 등) 도입 — 의존성 없이 트리거 아래 정적 배치 + 뷰포트 플립 정도만.
- tsc/테스트 인프라 — 기존 방침(skeleton-check + 플레이그라운드 시각검증) 유지.

## 4. 공개 API

```ts
export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /** expanded 폼에서만 렌더되는 선행 아이콘. */
  icon?: React.ReactNode;
  /** expanded 폼에서만 렌더되는 보조 설명(2번째 줄). */
  description?: React.ReactNode;
};

export type SelectProps = {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  state?: FieldState;
  /** 커스텀 listbox 폼 사용. multiple/searchable/icon/description이 있으면 자동 true. */
  expanded?: boolean;
  /** 다중 선택(expanded 전제). value는 string[]. */
  multiple?: boolean;
  /** 드롭다운 상단 필터 입력(expanded 전제). */
  searchable?: boolean;
  /** 선택값. 단일=string, 다중=string[]. */
  value?: string | string[];
  defaultValue?: string | string[];
  /** expanded 폼의 값 변경 콜백(native onChange와 분리). */
  onValueChange?: (value: string | string[]) => void;
  // ... 기존 SelectHTMLAttributes (native 폼용 onChange 등)
};
```

- **native 폼**(기본): 현행 그대로 — `value: string`, native `onChange(event)`.
- **expanded 단일**: `value: string`, `onValueChange(string)`.
- **expanded 다중**: `value: string[]`, `onValueChange(string[])`.
- 잘못된 조합 방어: `multiple`/`searchable`/`icon`/`description` 중 하나라도 있으면 expanded로 강제(개발 편의).

## 5. expanded 폼 구조(anatomy)

- **Trigger** — field control 룩(`.if-select__trigger`, 동일 높이·border·chevron)의 `<button type="button">`.
  - `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls={panelId}`, label 연결.
  - 내용: 비었으면 placeholder / 단일이면 옵션 label(+icon) / **다중이면 Chip 나열**(`if-chip`, 개별 x = 해당 값 제거) + 표시 한도 초과 시 `+N`.
- **Panel** — `.if-select__panel`, `role="listbox"`, `aria-multiselectable={multiple}`, `aria-label`/`aria-labelledby`.
  - (선택) **검색 입력**: `searchable`일 때 상단 텍스트 입력 — 옵션 label 필터.
  - **옵션**: `role="option"`, `aria-selected`, `id`(activedescendant 타깃). 레이아웃 = [체크마크 indicator] [icon?] [label / description?].
  - **빈 상태**: 필터 결과 없음 → "결과 없음" 안내.

## 6. 동작 · 키보드

- **열기**: 트리거 클릭 / Enter / Space / ArrowDown.
- **닫기**: Esc, 바깥 클릭, (단일) 선택 시. 닫힐 때 포커스를 트리거로 복원.
- **이동**: ArrowUp/Down으로 active 옵션 이동(`aria-activedescendant`), Home/End, 비활성 옵션 건너뜀.
- **typeahead**: 글자 입력 시 매칭 옵션으로 점프(검색 필드 없을 때). 검색 필드가 있으면 입력은 필터로.
- **선택**: Enter/Space — 단일은 선택+닫힘, **다중은 토글 + 열린 채 유지**.
- **다중 칩 제거**: 트리거의 칩 x 또는 패널에서 다시 토글.
- 상태: controlled(`value`)/uncontrolled(`defaultValue`) 모두 지원.

## 7. 접근성

docs Combobox listbox 패턴(`docs/components-combobox.html`)을 재사용:
- `role="listbox"`/`option`, `aria-selected`, `aria-activedescendant`, `aria-multiselectable`, 트리거 `aria-expanded`/`aria-haspopup`.
- label은 시각 라벨과 연결(`aria-labelledby` 또는 `aria-label`).
- 키보드 단독 조작 가능, 가시 포커스, 색만으로 상태 전달 금지(체크마크 동반).
- native 폼은 네이티브 시맨틱 유지(현행).

## 8. 파일 구조 (단일 API + 내부 분리)

| 파일 | 책임 |
|---|---|
| `packages/ui-react/src/components/Select.tsx` | 공개 `<Select>`. expanded 아니면 native `<select>`(현행), 맞으면 `<SelectListbox>`에 위임. props 정규화/자동 expanded 판정. |
| `packages/ui-react/src/components/SelectListbox.tsx` (신규, 내부) | expanded listbox 위젯 — 트리거+패널+키보드+검색+다중. `Chip`(태그)·`Icon`(chevron/check) 재사용. |
| `packages/ui-react/src/styles.css` | `.if-select__trigger`/`__panel`/`__option`/`__check`/`__search` 등 추가. 기존 `.if-field`/`.if-chip` 토큰 재사용. |
| `packages/ui-react/src/index.ts` | 확장된 타입 재노출(SelectOption에 icon/description). |
| `scripts/package-skeleton-check.js` | Select 신규 마커 추가(SelectListbox 파일, expanded/multiple/role="listbox", `.if-select__panel` 등). |

## 9. docs 반영 (ui-react 다음 단계)

- `docs/src/pages/components-select.html`: native vs expanded 비교 + multiple(chips) + searchable + 커스텀 옵션(icon/description) 데모/설명. React 시그니처 갱신.
- expanded 데모는 JS 필요 → `docs/script.js`에 컨트롤러 추가(기존 combobox 컨트롤러 미러). combobox panel/option 스타일 재사용/확장.
- `docs/component-api.json`(select props/states/a11y), `component-usage`/`component-token-usage` 갱신. verify-site 마커·partial 유지.

## 10. 검증

- `npm run check` (verify-site + package-skeleton-check) 통과.
- 플레이그라운드(examples/playground)에 Select 섹션 추가/확장 → Claude Preview로 시각·키보드(↑↓·Enter·Esc·typeahead·다중 토글) 실측.
- native 폼 하위호환: 기존 select 데모/사용처가 변하지 않음 확인.

## 11. 확정한 디폴트 (재확인됨)

1. 다중 trigger 넘침 = `+N` 오버플로우.
2. expanded 변경 콜백 = `onValueChange` 분리.
3. `multiple`/`searchable`/`icon`/`description` 있으면 자동 expanded.
