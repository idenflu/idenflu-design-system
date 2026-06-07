# DatePicker — design spec (minimal custom calendar)

작성일: 2026-06-08
브랜치: `feat/ui-react-datepicker`
패키지: `@idenflu/ui-react` (+ docs 미러)

## 1. 목적 / 배경

`@idenflu/ui-react`에 DatePicker가 없다. docs `date-time` 페이지는 표시용 텍스트 mockup뿐이다. **최대한 간소한 커스텀 달력 팝오버** DatePicker를 추가한다 — 단일 일자 선택 + 기간(from-to) 선택. 네이티브 `<input type="date">`가 아니라 직접 만든 월(月) 그리드 팝오버를 쓴다(테마 일관·범위 하이라이트 목적). 트리거/팝오버/바깥클릭/포커스 패턴은 직전에 만든 `SelectListbox`와 동일한 접근을 재사용한다.

## 2. 결정 사항 (브레인스토밍 확정)

- **구현**: 커스텀 달력 팝오버(네이티브 input[type=date] 아님).
- **API 모양**: 단일 `<DatePicker>` 컴포넌트 + `range?: boolean` (Select 패턴과 일관).
- **기간 UX**: 단일 달력 + 2클릭 — 첫 클릭=시작, 두 번째 클릭(≥시작)=종료 + 닫힘, 사이 구간 하이라이트, 호버 프리뷰.
- **표기 형식**: 트리거 표시는 ISO `YYYY-MM-DD` (저장 값과 동일, locale 불필요). 기간은 `"2026-06-10 ~ 2026-06-12"`.
- **주 시작 요일**: `weekStartsOn?: 0 | 1` prop (0=일요일 기본, 1=월요일).
- **선택 방식**: 달력 클릭 전용(트리거는 button — 텍스트 직접 입력 없음). 간소화.
- **범위**: ui-react 컴포넌트 + 플레이그라운드 **+ docs date-time 페이지 미러**(parity).

## 3. 목표 / 비목표

**목표**
- `<DatePicker>`: 단일/기간, controlled/uncontrolled, min/max 경계, field chrome(label/helper/error/required/state/disabled).
- 커스텀 월 그리드 팝오버: 헤더(이전/다음 달 + "June 2026" 라벨), 요일 행, 6×7 일자 버튼, 오늘/선택/범위/비활성 표시.
- WAI-ARIA dialog + grid + 키보드(화살표 일자 이동, PageUp/Down 월 이동, Enter/Space 선택, Esc 닫기, 트리거로 focus 복원).
- 순수 날짜 유틸(`dateUtils.ts`)로 로직 분리.
- 기존 컨벤션(forwardRef, classNames, `if-` 클래스, `--if-*` 토큰, source-only, displayName, a11y) 준수.
- docs date-time 페이지에 DatePicker(단일/기간) 데모 + vanilla JS 컨트롤러 미러 + 플레이그라운드 섹션.

**비목표 (YAGNI)**
- 시(時)/분 선택, timezone, 프리셋/단축(오늘·지난 7일 등), 다중 월(2-up), 연도 드롭다운/10년 뷰, 임의 disabled-date 콜백(= min/max만), locale 설정(고정 영문 라벨), 트리거 텍스트 직접 입력/파싱, clear 버튼.
- tsc/테스트 인프라 — 기존 방침(skeleton-check + 플레이그라운드/preview 시각검증) 유지.

## 4. 공개 API

```ts
export type DateRange = { from: string; to: string }; // ISO "YYYY-MM-DD", 미선택은 ""

export type DatePickerProps = {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  state?: FieldState;            // ./TextField 재사용
  disabled?: boolean;
  /** 기간(from-to) 선택 모드. */
  range?: boolean;
  /** 선택값. 단일=ISO string, 기간=DateRange. */
  value?: string | DateRange;
  defaultValue?: string | DateRange;
  /** 선택 완료 시 호출. 단일=string, 기간=완성된 DateRange. */
  onChange?: (value: string | DateRange) => void;
  /** 선택 가능 하한/상한(ISO). 바깥 일자는 비활성. */
  min?: string;
  max?: string;
  /** 주 시작 요일. 0=일요일(기본), 1=월요일. */
  weekStartsOn?: 0 | 1;
  placeholder?: string;          // 미선택 시 트리거 표시
};
```

- 단일: `value: string`, `onChange(string)` (일자 클릭 시 선택+닫힘).
- 기간: `value: DateRange`, `onChange({from,to})` — **종료까지 선택 완료된 시점에** 호출. 진행 중(시작만 선택)은 내부 state로 보관하고 트리거에 시작일만 표시.
- controlled(`value`) / uncontrolled(`defaultValue`) 모두 지원.

## 5. anatomy

- **Trigger**: field-styled `<button type="button" aria-haspopup="dialog" aria-expanded aria-controls aria-labelledby aria-describedby>` — 내용 = placeholder / `YYYY-MM-DD` / `YYYY-MM-DD ~ YYYY-MM-DD` + 캘린더 아이콘(`icon-calendar`).
- **Popover** `role="dialog"` `aria-label`(= 현재 월): 
  - 헤더: 이전 달 `<button aria-label="Previous month">` · 월 라벨(`June 2026`) · 다음 달 `<button aria-label="Next month">`.
  - 요일 행: `weekStartsOn` 기준 7개 약어(Su Mo … / Mo Tu …).
  - 그리드 `role="grid"`: 6주 × 7일 = 42 `<button role="gridcell-ish">`(실제 button + `aria-selected`). 인접 월 일자 muted, 오늘 표시, 선택/범위 endpoint/사이 구간 하이라이트, min/max 밖은 `disabled`.

## 6. 동작 · 키보드

- 열기: 트리거 클릭 / Enter / Space / ArrowDown. 열리면 포커스를 선택일(없으면 오늘/유효 기본일)로.
- 닫기: Esc, 바깥 클릭, (단일/기간 완료) 선택 시. 닫힐 때 트리거로 focus 복원.
- 이동: 화살표 = 하루씩(주·월 경계 넘어가면 표시 월 전환), PageUp/PageDown = 이전/다음 달, Home/End = 주 시작/끝(선택). 포커스는 해당 일자 버튼으로 이동(roving).
- 선택: Enter/Space — 단일은 선택+닫힘. 기간은 1st=시작, 2nd(≥시작)=종료+닫힘; 시작보다 이전 클릭은 시작 재설정.
- 호버/포커스 프리뷰: 기간에서 시작만 정해진 동안 hover/focus 일자까지 사이 구간을 미리 하이라이트.
- min/max 밖 일자는 선택 불가(키보드 이동 시 건너뛰지 않고 비활성 표시 — 단순화).

## 7. 접근성

- 트리거 `aria-haspopup="dialog"` / `aria-expanded` / `aria-controls`, label 연결.
- 팝오버 `role="dialog"` + 월 라벨이 접근 이름. 그리드 `role="grid"`, 일자 버튼에 전체 날짜 `aria-label`(예: "2026-06-12") + `aria-selected`. 이전/다음/요일 헤더 라벨.
- 색만으로 상태 전달 금지(선택은 배경+aria-selected, 오늘은 외곽선 등 형태 동반).
- 키보드 단독 조작 가능, 가시 포커스, focus 복원.

## 8. 파일 구조

| 파일 | 책임 |
|---|---|
| `packages/ui-react/src/components/DatePicker.tsx` | 공개 `<DatePicker>` — field chrome + 트리거 + 팝오버 + 월 그리드 + 상태/키보드. range/single 분기. (~250줄 초과 시 그리드를 내부 컴포넌트로 분리 허용) |
| `packages/ui-react/src/utils/dateUtils.ts` (신규) | 순수 헬퍼: `toISO`, `parseISO`, `addMonths`, `addDays`, `buildMonthGrid(year,month,weekStartsOn)`(42일), `isSameDay`, `compareISO`/`isBefore/After`, `isWithin(min,max)`, 고정 month/weekday 라벨. |
| `packages/ui-react/src/styles.css` | `.if-datepicker__*` (trigger/popover/header/nav/weekday/grid/day/today/selected/range/disabled). 토큰 재사용. |
| `packages/ui-react/src/index.ts` | `DatePicker`, `DatePickerProps`, `DateRange` export. |
| `scripts/package-skeleton-check.js` | DatePicker 파일 + `role="dialog"`/`role="grid"`/`if-datepicker__` + `.if-datepicker__*` CSS 마커. |
| `examples/playground/src/sections/Inputs.tsx` | 단일/기간 DatePicker 예시. |

## 9. docs 미러 (parity)

- `docs/src/pages/components-date-time.html`: DatePicker(단일/기간) 데모 + 설명 추가. 기존 표시용 mockup은 유지, React 노트 갱신.
- `docs/script.js`: `[data-datepicker]` 컨트롤러(월 그리드 렌더·이동·단일/기간 클릭·키보드·바깥클릭) — Select expanded 컨트롤러와 같은 방식.
- `docs/styles.css`: 달력 그리드 스타일(deltas). `docs/component-api.json` date-time 항목 갱신(range/min/max/weekStartsOn 등). verify-site 마커·partial 유지, 빌드 재현성.

## 10. 검증

- `npm run check` 통과(verify-site + package-skeleton-check).
- 플레이그라운드 + docs preview에서 Claude Preview로 시각·키보드(화살표 일자, PageUp/Down 월, Enter 선택, Esc, 기간 2클릭+하이라이트, min/max 비활성) 실측.
- 빌드 재현성(`build-site.js` 두 번 → diff 없음).

## 11. 확정한 디폴트

1. 표기 = ISO `YYYY-MM-DD`, 기간 구분자 ` ~ `.
2. `weekStartsOn` 기본 0(일요일).
3. 한 번에 한 달만 표시(2-up 아님). 헤더는 이전/다음 달 버튼 + "Month YYYY" 라벨(영문 고정).
4. onChange는 선택 완료 시(기간은 종료까지) 호출.
