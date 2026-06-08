# DatePicker `locale` 지원 — 설계 문서

**날짜:** 2026-06-08
**대상:** `@idenflu/ui-react` `DatePicker` + docs 미러
**상태:** 승인됨 (브레인스토밍 완료)

## 목표

`DatePicker`에 `locale` prop을 추가해, 달력 UI에 노출되는 모든 사람이 읽는 텍스트(월 헤더, 요일 행, 트리거 표시 값, 일자 aria-label)를 해당 로캘로 현지화한다. 브라우저 내장 `Intl.DateTimeFormat`만 사용하며 새로운 의존성은 없다.

## 범위 / 비범위

**범위**
- `DatePicker`에 선택적 `locale?: string` prop 추가 (예: `"ko-KR"`, `"ja-JP"`, `"en-US"`).
- `locale`이 주어지면 다음을 현지화한다:
  - 월 헤더 (예: `June 2026` → `2026년 6월`)
  - 요일 행 (예: `Su Mo Tu …` → `일 월 화 …`)
  - 트리거 표시 값 (단일 + 기간 모두)
  - 일자 버튼 `aria-label`
- `locale`이 없으면(`undefined`) **현재 영어 동작과 바이트 단위로 동일**해야 한다(회귀 방지).
- docs 미러: `[data-datepicker]` 컨트롤러가 `data-locale`를 읽어 동일하게 동작, ko-KR 데모 1개 추가, `component-api.json`에 `locale` 추가.
- 플레이그라운드에 ko-KR 예시 1개 추가.

**비범위 (YAGNI)**
- 일자 셀 숫자(`1`, `2` …)는 `date.getDate()` 그대로 둔다 — 아라비아 숫자 유지(로캘별 숫자 변환 안 함).
- RTL 레이아웃 / 양력 외 달력(이슬람력 등) 지원 안 함.
- 로캘 자동 감지(브라우저 기본값) 안 함 — `locale` 미지정 시 항상 결정적 영어.

## 데이터 계약 (불변)

`value` / `defaultValue` / `onChange` / `min` / `max`는 **항상 ISO `YYYY-MM-DD`** 문자열(기간은 `{ from, to }`)이다. `locale`은 **표시(presentation) 전용**이며 데이터 형식에는 일절 영향을 주지 않는다. 폼 제출·저장·비교는 모두 ISO 기준으로 유지된다.

## API 변경

```ts
export type DatePickerProps = {
  // ...기존 props 동일...
  /**
   * 표시 텍스트(월 헤더, 요일, 트리거 값, 일자 aria-label)를 현지화할 BCP 47 로캘.
   * 미지정 시 영어 기본 표기. value/onChange/min/max는 항상 ISO YYYY-MM-DD 유지.
   */
  locale?: string;
};
```

기본값 `undefined`. 다른 props·동작·기본값은 변경 없음.

## dateUtils 변경: 포매터 팩토리

현재 `dateUtils.ts`는 영어 리터럴(`MONTH_LABELS`, `WEEKDAY_LABELS`)을 직접 쓴다. 로캘별로 `Intl.DateTimeFormat` 인스턴스를 매 렌더 새로 만들면 비용이 크므로, **로캘 1개당 포매터 묶음 1개를 만드는 팩토리**를 도입한다.

```ts
export type DateFormatters = {
  monthLabel: (year: number, month: number) => string;
  weekdayLabels: (weekStartsOn: 0 | 1) => string[];
  display: (iso: string) => string;
  dayLabel: (date: Date) => string;
};

export const createDateFormatters = (locale?: string): DateFormatters => { ... };
```

**`locale`이 falsy일 때 (영어 폴백 — 기존 동작 그대로):**
- `monthLabel(y, m)` → `` `${MONTH_LABELS[m]} ${y}` `` (예: `June 2026`)
- `weekdayLabels(w)` → 기존 `weekdayLabels(w)` 로직 (2글자: `Su Mo …`)
- `display(iso)` → `iso` 그대로 반환 (트리거가 ISO를 그대로 보여줌 = 기존 동작)
- `dayLabel(date)` → `` `${MONTH_LABELS[m]} ${d}, ${y}` `` (예: `June 8, 2026`)

**`locale`이 주어졌을 때 (Intl 경로):** 팩토리 클로저 안에서 포매터를 1회 생성해 재사용한다.
- `monthFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" })`
- `weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" })`
- `displayFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" })`
- `dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" })`
- `monthLabel(y, m)` → `monthFmt.format(new Date(y, m, 1))`
- `weekdayLabels(w)` → 고정 기준 일요일(`new Date(2024, 0, 7)`은 일요일)에서 `(w + i) % 7`일 더해 `weekdayFmt.format(...)` 7개
- `display(iso)` → `parseISO(iso)` 성공 시 `displayFmt.format(date)`, 실패 시 `iso`
- `dayLabel(date)` → `dayLabelFmt.format(date)`

**견고성:** `Intl.DateTimeFormat`은 잘못된 로캘 문자열에 `RangeError`를 던질 수 있다. 팩토리는 생성자 호출을 `try/catch`로 감싸고, 실패 시 영어 폴백으로 안전하게 되돌린다(달력 전체 렌더 크래시 방지).

기존 `MONTH_LABELS`, `weekdayLabels`, `toISO`, `parseISO` 등은 **그대로 유지**한다(폴백 경로와 기존 import·skeleton-check 마커가 의존).

## DatePicker.tsx 변경

1. props 구조 분해에 `locale` 추가.
2. 포매터를 로캘당 1회 메모이즈:
   ```tsx
   const fmt = React.useMemo(() => createDateFormatters(locale), [locale]);
   ```
3. 사용처 4곳을 팩토리 메서드로 교체:
   - `monthLabel` 상수(L202): `fmt.monthLabel(view.year, view.month)`
   - 요일 행(L259): `fmt.weekdayLabels(weekStartsOn)`
   - 일자 `aria-label`(L277): `fmt.dayLabel(d)`
   - `display()` 함수: 단일/`pendingStart` → `fmt.display(iso)`, 기간 → `` `${fmt.display(from)} ~ ${fmt.display(to)}` ``
4. 직접 `MONTH_LABELS` import는 제거(팩토리로 대체). `weekdayLabels` 직접 import도 제거. `parseISO`/`toISO`/`buildMonthGrid`/`isWithin`/`addDays`/`addMonths`는 계속 사용.

`locale`이 없으면 `display()`가 ISO를 그대로 반환하므로 트리거·헤더·요일·aria-label 모두 기존 출력과 동일하다.

## docs 미러 (`docs/script.js`)

`[data-datepicker]` 컨트롤러에 인라인 포매터를 추가한다(컨트롤러는 공유 dateUtils를 못 쓰고 자체 헬퍼를 가짐).

- `const locale = root.getAttribute("data-locale") || "";`
- React 팩토리와 동일한 의미의 인라인 포매터 묶음 생성(영어 falsy 폴백 + `try/catch` Intl 경로).
- 적용처: `renderCalendar()`의 월 헤더 `textContent`, 요일 셀 `textContent`, 일자 버튼 `aria-label`, 그리고 `displayText()` 트리거 텍스트.
- `data-locale` 미지정 시 기존 영어 동작 유지.

**HTML 데모 추가** (`docs/src/pages/components-date-time.html`): `data-locale="ko-KR"`를 가진 ko-KR 단일 날짜 데모 1개 추가(예: 라벨 "마감일"). 기존 두 데모는 그대로.

**메타데이터** (`docs/component-api.json` `date-time` 항목): `props` 배열에 `"locale"` 추가.

## 플레이그라운드 (`examples/playground/src/sections/Inputs.tsx`)

DatePicker 그룹에 ko-KR 예시 1개 추가:
```tsx
<DatePicker label="마감일" locale="ko-KR" onChange={() => {}} />
```

## skeleton-check (`scripts/package-skeleton-check.js`)

회귀 락을 위해 마커 추가:
- `packages/ui-react/src/utils/dateUtils.ts`를 `requireFile` 목록에 추가하고, `requireIncludes(... , ["createDateFormatters", "Intl.DateTimeFormat"])`.
- `DatePicker.tsx` 마커에 `"locale"` 추가(기존 5개 마커에 더함).

## 검증

- `npm run check` → `site verification ok` + `package skeleton check ok`.
- 플레이그라운드(5199)에서 ko-KR DatePicker 열어: 헤더 `2026년 6월`, 요일 `일 월 화 …`, 일자 선택 시 트리거가 ko 형식(예: `2026. 6. 8.`)으로 표시, `value`/`onChange` 인자는 여전히 ISO인지 확인.
- 영어(locale 미지정) DatePicker가 기존과 동일하게 ISO 트리거·영어 헤더를 보이는지 회귀 확인.
- docs(8080) date-time 페이지에서 ko-KR 데모가 동일하게 동작하는지 확인.
- 키보드 내비게이션·기간 하이라이트·min/max 비활성 등 기존 동작은 영향 없음(표시 전용 변경).

## 파일 변경 요약

| 파일 | 변경 |
|------|------|
| `packages/ui-react/src/utils/dateUtils.ts` | `createDateFormatters` 팩토리 + `DateFormatters` 타입 추가 (기존 export 유지) |
| `packages/ui-react/src/components/DatePicker.tsx` | `locale` prop, `useMemo` 포매터, 표시 4곳 교체 |
| `docs/script.js` | `[data-datepicker]`에 `data-locale` + 인라인 포매터 |
| `docs/src/pages/components-date-time.html` | ko-KR 데모 1개 추가 |
| `docs/component-api.json` | `date-time.props`에 `"locale"` |
| `examples/playground/src/sections/Inputs.tsx` | ko-KR DatePicker 예시 1개 |
| `scripts/package-skeleton-check.js` | dateUtils + DatePicker locale 마커 |
