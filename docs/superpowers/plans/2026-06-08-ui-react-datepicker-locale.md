# DatePicker `locale` 지원 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `DatePicker`에 선택적 `locale` prop을 추가해 달력의 사람이 읽는 텍스트(월 헤더·요일·트리거 값·일자 aria-label)를 `Intl.DateTimeFormat`으로 현지화한다. 데이터(value/min/max/onChange)는 항상 ISO 유지.

**Architecture:** `dateUtils.ts`에 로캘당 1회 생성하는 포매터 팩토리 `createDateFormatters(locale)`를 추가하고, `DatePicker`가 이를 `useMemo`로 메모이즈해 4개 표시 지점에서 사용한다. `locale`이 없으면 영어 폴백(ISO 트리거 그대로)으로 기존 동작과 동일. docs 바닐라 컨트롤러는 동일한 인라인 팩토리를 `data-locale`로 구동한다.

**Tech Stack:** TypeScript + React (source-only, no build/tsc/tests), 브라우저 내장 `Intl.DateTimeFormat`, 바닐라 JS docs 컨트롤러.

**테스트 정책 (이 저장소 고유):** 단위 테스트 인프라 없음. 각 태스크 검증 = `npm run check`(`site verification ok` + `package skeleton check ok`) 통과 + grep 확인. 브라우저 시각 검증(플레이그라운드 5199 / docs 8080)은 컨트롤러가 태스크 경계 체크포인트에서 수행한다.

---

### Task 1: dateUtils — `createDateFormatters` 포매터 팩토리

**Files:**
- Modify: `packages/ui-react/src/utils/dateUtils.ts` (파일 끝에 추가)

기존 export(`MONTH_LABELS`, `weekdayLabels`, `toISO`, `parseISO`, `addDays` 등)는 **그대로 유지**한다. 팩토리는 이들을 재사용한다.

- [ ] **Step 1: 파일 끝에 팩토리 추가**

`packages/ui-react/src/utils/dateUtils.ts` 맨 끝(현재 마지막 줄 `isWithin` 정의 다음)에 아래를 **append**한다. `weekdayLabels`/`MONTH_LABELS`/`addDays`/`parseISO`가 위에 이미 선언돼 있으므로 참조 가능하다.

```ts

export type DateFormatters = {
  monthLabel: (year: number, month: number) => string;
  weekdayLabels: (weekStartsOn: 0 | 1) => string[];
  display: (iso: string) => string;
  dayLabel: (date: Date) => string;
};

// A known Sunday, used as the rotation anchor for Intl weekday labels.
const WEEKDAY_ANCHOR = new Date(2024, 0, 7);

const englishFormatters: DateFormatters = {
  monthLabel: (year, month) => `${MONTH_LABELS[month]} ${year}`,
  weekdayLabels,
  display: (iso) => iso,
  dayLabel: (date) => `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
};

/**
 * Presentation formatters for a locale. value/min/max stay ISO; this only formats
 * the calendar's human-readable text. A falsy or invalid locale falls back to
 * English with ISO-passthrough display (byte-identical to the no-locale behavior).
 */
export const createDateFormatters = (locale?: string): DateFormatters => {
  if (!locale) return englishFormatters;
  try {
    const monthFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const displayFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
    return {
      monthLabel: (year, month) => monthFmt.format(new Date(year, month, 1)),
      weekdayLabels: (weekStartsOn) =>
        Array.from({ length: 7 }, (_, i) => weekdayFmt.format(addDays(WEEKDAY_ANCHOR, (weekStartsOn + i) % 7))),
      display: (iso) => {
        const date = parseISO(iso);
        return date ? displayFmt.format(date) : iso;
      },
      dayLabel: (date) => dayLabelFmt.format(date),
    };
  } catch {
    return englishFormatters;
  }
};
```

- [ ] **Step 2: 검증 — 변경 없이 기존 동작 보존 확인**

Run: `npm run check`
Expected: `site verification ok` 와 `package skeleton check ok` 둘 다 출력 (exit 0). 이 단계에선 새 마커가 아직 없으니 실패 없음.

- [ ] **Step 3: grep 확인**

Run: `grep -n "createDateFormatters\|DateFormatters\|WEEKDAY_ANCHOR" packages/ui-react/src/utils/dateUtils.ts`
Expected: `export type DateFormatters`, `const WEEKDAY_ANCHOR`, `export const createDateFormatters` 라인이 보인다. 기존 `export const weekdayLabels`, `export const MONTH_LABELS`도 여전히 존재(`grep -n "export const weekdayLabels\|export const MONTH_LABELS" packages/ui-react/src/utils/dateUtils.ts` → 둘 다 매치).

- [ ] **Step 4: Commit**

```bash
git add packages/ui-react/src/utils/dateUtils.ts
git commit -m "feat(ui-react): add createDateFormatters locale factory to dateUtils

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: DatePicker — `locale` prop을 포매터로 연결

**Files:**
- Modify: `packages/ui-react/src/components/DatePicker.tsx`

- [ ] **Step 1: import 교체**

기존 (line 5):
```ts
import { MONTH_LABELS, addDays, addMonths, buildMonthGrid, isWithin, parseISO, toISO, weekdayLabels } from "../utils/dateUtils";
```
교체 후 (`MONTH_LABELS`·`weekdayLabels` 제거, `createDateFormatters` 추가):
```ts
import { addDays, addMonths, buildMonthGrid, createDateFormatters, isWithin, parseISO, toISO } from "../utils/dateUtils";
```

- [ ] **Step 2: props 타입에 `locale` 추가**

`DatePickerProps`의 `className?: string;` 바로 앞(또는 뒤)에 추가:
```ts
  /**
   * 표시 텍스트(월 헤더·요일·트리거 값·일자 aria-label)를 현지화할 BCP 47 로캘.
   * 미지정 시 영어 기본 표기. value/onChange/min/max는 항상 ISO YYYY-MM-DD 유지.
   */
  locale?: string;
```

- [ ] **Step 3: 구조 분해에 `locale` 추가**

기존 (line 39-43 부근):
```tsx
      label, helperText, error, required, state = error ? "invalid" : "default", disabled,
      range = false, value, defaultValue, onChange, min, max, weekStartsOn = 0,
      placeholder, id, className,
```
교체 후 (`weekStartsOn = 0,` 다음에 `locale,` 추가):
```tsx
      label, helperText, error, required, state = error ? "invalid" : "default", disabled,
      range = false, value, defaultValue, onChange, min, max, weekStartsOn = 0, locale,
      placeholder, id, className,
```

- [ ] **Step 4: 포매터 메모이즈 추가**

`dayRefs` 선언(line 78 `const dayRefs = React.useRef...`) 바로 다음 줄에 추가(모든 훅을 상단에 모음):
```tsx
    const fmt = React.useMemo(() => createDateFormatters(locale), [locale]);
```

- [ ] **Step 5: `display()` 트리거 함수 교체**

기존 (line 138-145):
```tsx
    const display = (): string | null => {
      if (range) {
        if (pendingStart) return pendingStart;
        if (rangeVal.from && rangeVal.to) return `${rangeVal.from} ~ ${rangeVal.to}`;
        return null;
      }
      return single || null;
    };
```
교체 후:
```tsx
    const display = (): string | null => {
      if (range) {
        if (pendingStart) return fmt.display(pendingStart);
        if (rangeVal.from && rangeVal.to) return `${fmt.display(rangeVal.from)} ~ ${fmt.display(rangeVal.to)}`;
        return null;
      }
      return single ? fmt.display(single) : null;
    };
```

- [ ] **Step 6: `monthLabel` 상수 교체**

기존 (line 202):
```tsx
    const monthLabel = `${MONTH_LABELS[view.month]} ${view.year}`;
```
교체 후:
```tsx
    const monthLabel = fmt.monthLabel(view.year, view.month);
```

- [ ] **Step 7: 요일 행 교체**

기존 (line 259):
```tsx
                {weekdayLabels(weekStartsOn).map((w, i) => (
```
교체 후:
```tsx
                {fmt.weekdayLabels(weekStartsOn).map((w, i) => (
```

- [ ] **Step 8: 일자 `aria-label` 교체**

기존 (line 277):
```tsx
                          aria-label={`${MONTH_LABELS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
```
교체 후:
```tsx
                          aria-label={fmt.dayLabel(d)}
```

- [ ] **Step 9: 검증**

Run: `npm run check`
Expected: `site verification ok` + `package skeleton check ok` (exit 0).

Run: `grep -n "MONTH_LABELS\|weekdayLabels" packages/ui-react/src/components/DatePicker.tsx`
Expected: **출력 없음** (직접 참조가 모두 `fmt.*`로 대체됨).

Run: `grep -n "createDateFormatters\|fmt.display\|fmt.monthLabel\|fmt.weekdayLabels\|fmt.dayLabel\|locale" packages/ui-react/src/components/DatePicker.tsx`
Expected: import의 `createDateFormatters`, `useMemo`의 `createDateFormatters(locale)`, `fmt.display`(3곳), `fmt.monthLabel`, `fmt.weekdayLabels`, `fmt.dayLabel`, props `locale?: string`가 보인다.

- [ ] **Step 10: Commit**

```bash
git add packages/ui-react/src/components/DatePicker.tsx
git commit -m "feat(ui-react): localize DatePicker display via optional locale prop

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: skeleton-check 마커 + 플레이그라운드 예시

**Files:**
- Modify: `scripts/package-skeleton-check.js`
- Modify: `examples/playground/src/sections/Inputs.tsx`

- [ ] **Step 1: requireFile 목록에 dateUtils 추가**

`scripts/package-skeleton-check.js`에서 `requireFile` 배열의 DatePicker 줄(line 144 `"packages/ui-react/src/components/DatePicker.tsx",`) 바로 다음에 추가:
```js
  "packages/ui-react/src/utils/dateUtils.ts",
```

- [ ] **Step 2: dateUtils 마커 블록 추가**

DatePicker `requireIncludes` 블록(현재 line 252-264, `".if-datecal__day",` 로 끝나는 styles.css 블록) 바로 다음에 새 블록 추가:
```js

requireIncludes("packages/ui-react/src/utils/dateUtils.ts", [
  "export const createDateFormatters",
  "Intl.DateTimeFormat",
]);
```

- [ ] **Step 3: DatePicker 마커에 `locale` 추가**

기존 (line 252-258):
```js
requireIncludes("packages/ui-react/src/components/DatePicker.tsx", [
  "export type DateRange",
  "role=\"dialog\"",
  "role=\"grid\"",
  "if-datepicker__trigger",
  "DatePicker.displayName",
]);
```
교체 후 (`"locale?: string",` 추가):
```js
requireIncludes("packages/ui-react/src/components/DatePicker.tsx", [
  "export type DateRange",
  "role=\"dialog\"",
  "role=\"grid\"",
  "if-datepicker__trigger",
  "locale?: string",
  "DatePicker.displayName",
]);
```

- [ ] **Step 4: 플레이그라운드 ko-KR 예시 추가**

`examples/playground/src/sections/Inputs.tsx`의 DatePicker 그룹에서 "Within June" 줄(line 95) 바로 다음에 추가:
```tsx
          <DatePicker label="마감일" locale="ko-KR" defaultValue="2026-06-12" onChange={() => {}} />
```

- [ ] **Step 5: 검증**

Run: `npm run check`
Expected: `site verification ok` + `package skeleton check ok` (exit 0). dateUtils·DatePicker 마커가 모두 매치돼야 통과한다. (Task 1·2가 완료돼 있으므로 통과.)

- [ ] **Step 6: Commit**

```bash
git add scripts/package-skeleton-check.js examples/playground/src/sections/Inputs.tsx
git commit -m "chore: lock DatePicker locale markers and add ko-KR playground example

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: docs 미러 — `data-locale` 컨트롤러 + ko-KR 데모 + API 메타데이터

**Files:**
- Modify: `docs/script.js`
- Modify: `docs/src/pages/components-date-time.html`
- Modify: `docs/component-api.json`

- [ ] **Step 1: script.js에 인라인 포매터 팩토리 추가**

`docs/script.js`에서 `dpIsWithin` 정의(line 856) 다음, `dpNavButton`(line 858) 앞에 추가. `DATEPICKER_MONTHS`·`dpWeekdayLabels`·`dpAddDays`·`dpParseISO`가 위에 이미 정의돼 있으므로 참조 가능:
```js

// A known Sunday, used as the rotation anchor for Intl weekday labels.
const DATEPICKER_WEEKDAY_ANCHOR = new Date(2024, 0, 7);

const dpEnglishFormatters = {
  monthLabel: (year, month) => `${DATEPICKER_MONTHS[month]} ${year}`,
  weekdayLabels: dpWeekdayLabels,
  display: (iso) => iso,
  dayLabel: (date) => `${DATEPICKER_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
};

// Presentation formatters for a locale. Falsy/invalid locale -> English (ISO-passthrough display).
const dpCreateFormatters = (locale) => {
  if (!locale) return dpEnglishFormatters;
  try {
    const monthFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const displayFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
    return {
      monthLabel: (year, month) => monthFmt.format(new Date(year, month, 1)),
      weekdayLabels: (weekStartsOn) =>
        Array.from({ length: 7 }, (_, index) =>
          weekdayFmt.format(dpAddDays(DATEPICKER_WEEKDAY_ANCHOR, (weekStartsOn + index) % 7))),
      display: (iso) => {
        const date = dpParseISO(iso);
        return date ? displayFmt.format(date) : iso;
      },
      dayLabel: (date) => dayLabelFmt.format(date),
    };
  } catch (error) {
    return dpEnglishFormatters;
  }
};
```

- [ ] **Step 2: 컨트롤러에서 locale 읽기 + 포매터 생성**

`document.querySelectorAll("[data-datepicker]").forEach((root) => {` 내부, `const todayISO = dpToISO(new Date());`(line 882) 다음에 추가:
```js
  const locale = root.getAttribute("data-locale") || "";
  const formatters = dpCreateFormatters(locale);
```

- [ ] **Step 3: `displayText()` 교체**

기존 (line 915-922):
```js
  const displayText = () => {
    if (isRange) {
      if (pendingStart) return pendingStart;
      if (rangeVal.from && rangeVal.to) return `${rangeVal.from} ~ ${rangeVal.to}`;
      return null;
    }
    return single || null;
  };
```
교체 후:
```js
  const displayText = () => {
    if (isRange) {
      if (pendingStart) return formatters.display(pendingStart);
      if (rangeVal.from && rangeVal.to) return `${formatters.display(rangeVal.from)} ~ ${formatters.display(rangeVal.to)}`;
      return null;
    }
    return single ? formatters.display(single) : null;
  };
```

- [ ] **Step 4: 월 헤더 교체**

기존 (line 1045):
```js
    monthLabel.textContent = `${DATEPICKER_MONTHS[view.month]} ${view.year}`;
```
교체 후:
```js
    monthLabel.textContent = formatters.monthLabel(view.year, view.month);
```

- [ ] **Step 5: 요일 행 교체**

기존 (line 1055):
```js
    dpWeekdayLabels(weekStartsOn).forEach((label) => {
```
교체 후:
```js
    formatters.weekdayLabels(weekStartsOn).forEach((label) => {
```

- [ ] **Step 6: 일자 aria-label 교체**

기존 (line 1078):
```js
        button.setAttribute("aria-label", `${DATEPICKER_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);
```
교체 후:
```js
        button.setAttribute("aria-label", formatters.dayLabel(date));
```

- [ ] **Step 7: ko-KR HTML 데모 추가**

`docs/src/pages/components-date-time.html`에서 기간 데모 `</article>`(line 71) 다음, `</div>`(`date-time-demo-grid` 닫기, line 72) 앞에 추가:
```html
    <article class="date-time-demo-surface">
      <div class="datepicker" data-datepicker data-view="2026-06" data-locale="ko-KR">
        <span class="datepicker__label" id="ko-date-label">마감일</span>
        <button type="button" class="datepicker__trigger" data-datepicker-trigger aria-haspopup="dialog" aria-expanded="false" aria-labelledby="ko-date-label">
          <span class="datepicker__value is-placeholder" data-datepicker-value data-placeholder="날짜 선택">날짜 선택</span>
          <span class="datepicker__icon" aria-hidden="true"><svg class="button-icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-calendar"></use></svg></span>
        </button>
        <div class="datepicker__popover" data-datepicker-popover role="dialog" aria-label="마감일" hidden></div>
      </div>
      <p class="select-output"><code>data-locale="ko-KR"</code>를 주면 월 헤더·요일·트리거 표시가 한국어로 바뀝니다. 저장 값은 여전히 <code>YYYY-MM-DD</code>입니다.</p>
    </article>
```

- [ ] **Step 8: React 안내 문구에 locale 추가**

기존 (line 73):
```html
  <p class="select-output">React: <code>&lt;DatePicker label="Due date" range min max weekStartsOn /&gt;</code> 가 같은 동작을 제공합니다. <code>range</code>는 기간 선택, <code>min</code>/<code>max</code>는 선택 가능 범위, <code>weekStartsOn</code>은 주 시작 요일(0=일, 1=월)을 정합니다.</p>
```
교체 후 (`locale` 한 문장 추가):
```html
  <p class="select-output">React: <code>&lt;DatePicker label="Due date" range min max weekStartsOn locale /&gt;</code> 가 같은 동작을 제공합니다. <code>range</code>는 기간 선택, <code>min</code>/<code>max</code>는 선택 가능 범위, <code>weekStartsOn</code>은 주 시작 요일(0=일, 1=월), <code>locale</code>은 표시 언어(예: <code>"ko-KR"</code>)를 정합니다.</p>
```

- [ ] **Step 9: component-api.json에 locale 추가**

기존 (line 168):
```json
      "props": ["value", "range", "min date", "max date", "weekStartsOn", "validation"],
```
교체 후:
```json
      "props": ["value", "range", "min date", "max date", "weekStartsOn", "locale", "validation"],
```

- [ ] **Step 10: 사이트 재빌드 후 검증**

Run: `node docs/scripts/build-site.js`
Expected: 빌드 성공 출력 (date-time 페이지가 재생성됨).

Run: `npm run check`
Expected: `site verification ok` + `package skeleton check ok` (exit 0).

Run: `grep -n "data-locale\|dpCreateFormatters\|formatters.display\|formatters.monthLabel" docs/script.js`
Expected: `dpCreateFormatters` 정의·호출, `formatters.display`, `formatters.monthLabel` 라인이 보인다.

- [ ] **Step 11: Commit**

```bash
git add docs/script.js docs/src/pages/components-date-time.html docs/component-api.json docs/components-date-time.html
git commit -m "docs: mirror DatePicker locale support with ko-KR demo

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

> 참고: `build-site.js`가 `docs/` 아래 빌드 산출물(예: `docs/components-date-time.html`)을 갱신할 수 있다. 커밋 전에 `git status`로 변경된 산출물 파일을 모두 스테이지한다.

---

## 브라우저 검증 (모든 태스크 완료 후, 컨트롤러 수행)

1. 플레이그라운드(5199) Inputs 섹션에서 `label="마감일" locale="ko-KR"` DatePicker 열기:
   - 월 헤더가 `2026년 6월` 형태인지
   - 요일 행이 `일 월 화 수 목 금 토` 인지
   - 6월 12일 선택 시 트리거가 ko 형식(예: `2026. 6. 12.`)으로 표시되는지
   - `onChange` 인자/내부 값은 여전히 `2026-06-12` (ISO)인지 (콘솔/DOM 확인)
2. 영어(locale 미지정) DatePicker는 헤더 `June 2026`, 요일 `Su Mo …`, 트리거 ISO 그대로인지 (회귀 확인).
3. docs(8080) date-time 페이지에서 ko-KR 데모가 동일하게 동작하는지.

## Self-Review (작성자 체크)

- **Spec 커버리지:** API(`locale` prop)=Task 2 / dateUtils 팩토리=Task 1 / 월·요일·트리거·aria-label 4지점=Task 2 Steps 5-8 / 영어 폴백 불변=Task 1 englishFormatters + Task 2 Step 9 grep / 견고성 try-catch=Task 1 / docs 미러·ko 데모·api.json=Task 4 / 플레이그라운드=Task 3 / skeleton-check=Task 3. 데이터 계약 ISO 불변=value/min/max를 건드리지 않음(표시 함수만 교체). 비범위(일자 숫자 getDate 유지, RTL/달력/자동감지 없음) 준수. 갭 없음.
- **Placeholder 스캔:** TODO/TBD/"적절히 처리" 없음. 모든 코드 블록은 실제 코드.
- **타입 일관성:** `DateFormatters` 메서드명(`monthLabel`/`weekdayLabels`/`display`/`dayLabel`)이 Task 1 정의와 Task 2·4 사용처에서 동일. React `createDateFormatters`와 docs `dpCreateFormatters`는 의도적으로 다른 이름(다른 파일·전역 네임스페이스). 마커 `"locale?: string"`은 Task 2 Step 2가 만드는 텍스트와 일치.
