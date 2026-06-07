# Tabs component — design spec

작성일: 2026-06-07
브랜치: `feat/ui-react-tabs`
패키지: `@idenflu/ui-react`

## 1. 목적 / 배경

운영 화면(캠페인 상세, 워크스페이스 모드 등)에서 같은 영역의 뷰를 전환하는 `Tabs`를 `@idenflu/ui-react`에 추가한다. 문서(`docs/components-tabs.html`)에 contract와 마크업 패턴이 이미 정리돼 있다.

### 문서 계약 (출처: `docs/component-api.json` → `tabs`, `docs/components-tabs.html`)

- **Props**: tabs, selected, panel, disabled, overflow
- **States**: selected, hover, focus, disabled, loading panel
- **A11y**: role tablist, aria-selected, aria-controls, **arrow key navigation**
- **마크업 패턴**: `<div class="tab-list" role="tablist" aria-label>` + `<button role="tab" aria-selected aria-controls id tabindex>` (roving tabindex: 선택 0, 나머지 -1) + `<div role="tabpanel" aria-labelledby hidden>`.

## 2. 결정 사항 (확정)

- **API 스타일**: data-driven (`tabs` 배열) — 패키지의 기존 패턴(Select/RadioGroup/SegmentedControl) 및 contract `tabs` prop과 일치.
- **키보드 활성화**: automatic activation (화살표 이동 = 선택 + 포커스).
- **패널 렌더**: 모든 패널을 렌더하되 비선택은 `hidden` — aria-controls 참조가 항상 유효(문서의 hidden 패턴).

## 3. 목표 / 비목표

**목표**
- data-driven Tabs: 탭 리스트 + 패널, controlled/uncontrolled.
- WAI-ARIA tabs 패턴: role tablist/tab/tabpanel, aria-selected/controls/labelledby, roving tabindex, ArrowLeft/Right·Home/End 키보드(비활성 건너뜀).
- 기존 컨벤션(forwardRef, classNames, `if-` 클래스, `--if-*` 토큰, source-only, displayName, a11y) 준수.
- 문서 사이트 tabs 페이지 React 노트 + 플레이그라운드 섹션 연결.

**비목표 (YAGNI)**
- overflow 드롭다운 메뉴(가로 스크롤로 대체), vertical orientation, manual activation, lazy panel mount, per-panel loading 상태.
- tsc/테스트 인프라 — 기존 방침(skeleton-check) 유지.

## 4. 파일 구조

| 파일 | 책임 |
|---|---|
| `packages/ui-react/src/components/Tabs.tsx` | 신규 Tabs (data-driven) |

## 5. API

```ts
export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

export type TabsProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  tabs: TabItem[];
  label: string;            // tablist aria-label (필수)
  value?: string;           // controlled
  defaultValue?: string;    // uncontrolled (기본 = 첫 활성 탭)
  onChange?: (value: string) => void;
};
```

- `forwardRef<HTMLDivElement>` → 루트 div. `Tabs.displayName = "Tabs"`.
- controlled/uncontrolled: `value` 있으면 controlled, 없으면 `defaultValue ?? 첫 활성 탭`을 초기값으로 내부 state. `select(next)`는 uncontrolled면 state 갱신 + 항상 `onChange?.(next)`.
- id는 `React.useId()` 기반: 탭 `${base}-tab-${value}`, 패널 `${base}-panel-${value}`.

## 6. 마크업 & 접근성

```tsx
<div ref={ref} className={classNames("if-tabs", className)} {...props}>
  <div role="tablist" aria-label={label} className="if-tabs__list">
    {tabs.map((tab, index) => {
      const selected = tab.value === current;
      return (
        <button
          key={tab.value}
          ref={(node) => { tabRefs.current[index] = node; }}
          type="button"
          role="tab"
          id={`${base}-tab-${tab.value}`}
          aria-selected={selected}
          aria-controls={`${base}-panel-${tab.value}`}
          tabIndex={selected ? 0 : -1}
          disabled={tab.disabled}
          className={classNames("if-tabs__tab", selected && "is-selected")}
          onClick={() => select(tab.value)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {tab.icon != null ? <span className="if-tabs__icon" aria-hidden="true">{tab.icon}</span> : null}
          <span className="if-tabs__label">{tab.label}</span>
        </button>
      );
    })}
  </div>
  {tabs.map((tab) => (
    <div
      key={tab.value}
      role="tabpanel"
      id={`${base}-panel-${tab.value}`}
      aria-labelledby={`${base}-tab-${tab.value}`}
      tabIndex={0}
      hidden={tab.value !== current}
      className="if-tabs__panel"
    >
      {tab.content}
    </div>
  ))}
</div>
```

- **roving tabindex**: 선택 탭만 `tabIndex=0`, 나머지 `-1` → Tab 키로 tablist 진입 시 선택 탭에 포커스.
- **키보드(automatic activation)**: tablist의 각 탭 `onKeyDown` — ArrowRight/Left는 다음/이전 **비활성 건너뛰며 wrap**해서 선택+포커스, Home/End는 첫/마지막 활성 탭. preventDefault.
- 패널은 `tabIndex=0`(포커스 가능한 자식 없을 때 대비, APG 권장), 비선택은 `hidden`.

## 7. 비주얼 / CSS (`packages/ui-react/src/styles.css`에 append)

토큰만 사용(확인: `--if-color-primary`, `--if-color-ink`, `--if-color-ink-muted`, `--if-color-hairline`, `--if-focus-ring`, `--if-space-*`, `--if-font-*`).

- `.if-tabs__list`: `display:flex; gap; border-bottom:1px solid var(--if-color-hairline); overflow-x:auto`(overflow 대체).
- `.if-tabs__tab`: 투명 배경, `color:var(--if-color-ink-muted)`, 하단 2px 투명 보더(선택 시 표시), padding, `cursor:pointer`, `:hover`→ink, `transition`(motion 토큰).
- `.if-tabs__tab.is-selected`: `color:var(--if-color-primary)` + `border-bottom-color:var(--if-color-primary)`(underline).
- `.if-tabs__tab:disabled`: opacity, not-allowed.
- `.if-tabs__tab:focus-visible`: `box-shadow:0 0 0 3px var(--if-focus-ring); outline:0`.
- `.if-tabs__icon`: inline-flex. `.if-tabs__panel`: `padding-top:var(--if-space-md)`.
- `prefers-reduced-motion: reduce`로 transition 제거.

## 8. 통합 지점

**패키지 코드**
- `index.ts`: `export { Tabs }` + `export type { TabsProps, TabItem }`.
- `styles.css`: `.if-tabs*` append.
- `scripts/package-skeleton-check.js`: Tabs 파일 requireFile, index 마커 `Tabs`, 컴포넌트 마커(`role="tab"`, `aria-selected`, `if-tabs__list`, `tabIndex`, `Tabs.displayName`), styles.css cssMarker(`.if-tabs`, `.if-tabs__tab.is-selected`).

**패키지 문서**
- `docs/ui-react-usage.md`: Components 목록 + Tabs 사용 예시(controlled/uncontrolled).
- `docs/react-package-plan.md`: 추가 컴포넌트로 반영.

**문서 사이트**
- `docs/src/pages/components-tabs.html`: React `<Tabs tabs={[...]} />` 노트 추가(verify 마커 보존) → `node docs/scripts/build-site.js` 재빌드.

**플레이그라운드**
- `examples/playground/src/sections/`에 Tabs 데모 추가(또는 기존 섹션에) — 실제 렌더·키보드 확인.

## 9. 검증 계획

- `npm run check`(verify-site + skeleton) 그린.
- 토큰 교차검증(미정의 `--if-*` 0), export 심볼 검증(0 missing).
- 플레이그라운드 빌드/렌더 — Tabs 전환·키보드 동작 확인(스크린샷).
- tsc/런타임 단위는 인프라 미도입으로 정적+수동 검증.

## 10. 파일 영향 요약

| 파일 | 변경 |
|---|---|
| `packages/ui-react/src/components/Tabs.tsx` | 신규 |
| `packages/ui-react/src/index.ts` | Tabs export |
| `packages/ui-react/src/styles.css` | `.if-tabs*` |
| `scripts/package-skeleton-check.js` | 마커 추가 |
| `docs/ui-react-usage.md` | Tabs 사용 예시 |
| `docs/react-package-plan.md` | 목록 반영 |
| `docs/src/pages/components-tabs.html` | React 노트 (소스) |
| `examples/playground/src/sections/*` | Tabs 데모 |
