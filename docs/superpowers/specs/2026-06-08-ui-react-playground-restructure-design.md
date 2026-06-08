# ui-react 플레이그라운드 정리·고도화 — 설계 문서

**날짜:** 2026-06-08
**대상:** `examples/playground` (Vite + React 쇼케이스, `@idenflu/ui-react` 소비)
**상태:** 승인됨 (브레인스토밍 완료)

## 목표

플레이그라운드가 10개 섹션 단일 스크롤로 커지면서 탐색이 어려워졌다. 두 가지로 정리·고도화한다.

1. **카테고리별 페이지 분리** — 단일 스크롤을 사이드바 + 해시 라우팅 기반 카테고리 페이지로 전환.
2. **주요 예시와 샘플코드** — 컴포넌트별 대표 예시를 라이브 렌더와 함께 복사 가능한 코드블록으로 제공.

## 범위 / 비범위

**범위**
- 자체 해시 라우터(의존성 0)로 카테고리 페이지 분리.
- 사이드바 네비게이션(카테고리 링크 + 활성 강조 + 테마 토글).
- `<Example>` 프리미티브: 라이브 프리뷰 + plain `<pre>` 코드블록 + 복사 버튼.
- 컴포넌트별 주요 예시 1~2개를 코드와 함께 큐레이션. 부가 변형은 라이브로 간결 유지.
- Overview 랜딩 페이지(`#/`).
- `playground.css` 확장(사이드바/nav/example/코드블록/복사/반응형).

**비범위 (YAGNI)**
- 구문 강조 라이브러리(shiki/prism 등) 없음 — plain monospace.
- 모바일 햄버거 메뉴 없음 — 좁은 폭에서는 CSS로 사이드바 스택.
- 코드 자동 추출(Vite `?raw`/AST) 없음 — 코드 문자열은 손으로 작성.
- 전역 컴포넌트 검색/필터 없음.
- 컴포넌트 라이브러리(`packages/ui-react`) 자체는 변경하지 않음 — 표현/구조만.

## 제약

- **라이트 툴링 유지**: 새 런타임 의존성 추가 금지(해시 라우터·코드블록 모두 자체 구현).
- 플레이그라운드는 `npm run check`에서 격리돼 있음 → 이 작업은 `check`에 영향 없음. 검증은 브라우저(Claude Preview) 중심, 안전 확인용으로 `check`도 1회 실행.
- 기존 컴포넌트 동작·기능은 그대로. 표현 계층만 재구성.

## 아키텍처

### 해시 라우터

```
examples/playground/src/useHashRoute.ts   (신규)
```
- `useHashRoute(): string` — `window.location.hash`에서 라우트 키 파싱(`#/buttons` → `"buttons"`, 빈 해시 → `"overview"`), `hashchange` 이벤트 구독, 언마운트 시 해제.
- 알 수 없는 키 → `"overview"` 폴백.

### 라우트 테이블

```
examples/playground/src/routes.tsx   (신규)
```
- `export type RouteKey`(11개: overview, buttons, inputs, controls, tags, feedback, data, overlays, tabs, patterns, icons).
- `export const ROUTES: { key: RouteKey; label: string; Component: () => JSX.Element }[]` — 순서가 사이드바 순서.

### 셸 (App.tsx)

- `IconSpriteProvider` 유지.
- 레이아웃: 좌측 `<nav class="pg-nav">`(사이드바) + 우측 `<main class="pg-main">`(아웃렛).
- 사이드바: 앱 타이틀, 카테고리 링크(`<a href="#/{key}">`, 현재 라우트와 비교해 `is-active`), 하단 테마 토글(기존 `SegmentedControl` 재사용 — 현재 동작 유지).
- 아웃렛: `useHashRoute()`로 현재 키 → `ROUTES`에서 매칭되는 `Component` 렌더.
- 테마 `useEffect`(`data-if-theme`)는 현행 유지.

### 페이지

```
examples/playground/src/pages/   (sections/ 에서 디렉터리 rename)
  Overview.tsx   (신규)
  Buttons.tsx, Inputs.tsx, Controls.tsx, Tags.tsx, Feedback.tsx,
  Data.tsx, Overlays.tsx, Tabs.tsx, Patterns.tsx, Icons.tsx
```
- 기존 10개 섹션 파일을 `pages/`로 옮기고, 각 파일이 한 카테고리 페이지 본문이 됨.
- export 이름은 현행 유지(`ButtonsSection` 등) — 단순화를 위해 함수명은 그대로 두고 `routes.tsx`에서 매핑. (rename 최소화.)
- `Overview.tsx`: 짧은 소개 + 카테고리 카드/링크 목록(각 `#/{key}`).

### `<Example>` 프리미티브

```
examples/playground/src/Example.tsx   (신규)
```
- Props: `title?: string`, `code: string`, `children: React.ReactNode`.
- 렌더 구조:
  - `.pg-example`
    - (title 있으면) `.pg-example__title`
    - `.pg-example__preview` — `children`(라이브)
    - `.pg-example__codewrap`
      - `<button class="pg-example__copy">` — `navigator.clipboard.writeText(code)`; 클릭 후 잠깐 "복사됨" 텍스트(2초 후 복귀, `setTimeout`).
      - `<pre class="pg-example__code"><code>{code}</code></pre>`
- 하이라이터 없음. 코드 문자열은 손으로 작성하며 라이브 렌더와 일치하도록 작성(큐레이션 예시라 드리프트 위험 낮고 허용).

### 콘텐츠 큐레이션

- 각 페이지에서 컴포넌트별 **주요 예시 1~2개**를 `<Example code>`로 감싸 코드와 함께 제시.
- 부가 변형(크기/톤/상태 변형 등)은 기존처럼 `Group`/`Row`/`Col` 라이브 예시로 간결하게 유지(코드블록 없이).
- 기존 `Section`/`Group`/`Row`/`Col`은 페이지 내부 레이아웃에 계속 사용.

## CSS (`playground.css`)

- `.pg-shell`: 사이드바+메인 2열 그리드(예: `grid-template-columns: 240px 1fr`). 좁은 폭(`@media max-width`)에서 1열 스택.
- `.pg-nav`, `.pg-nav__title`, `.pg-nav__link`, `.pg-nav__link.is-active`, `.pg-nav__theme`.
- `.pg-main` 패딩/최대폭.
- `.pg-example`, `.pg-example__title`, `.pg-example__preview`, `.pg-example__codewrap`, `.pg-example__code`, `.pg-example__copy` — 디자인 토큰(`--if-*`) 사용, 코드블록은 monospace + surface 배경.
- 기존 `.pg-topbar` 등 미사용 규칙 정리.

## 검증

플레이그라운드는 `npm run check`에서 격리 → 브라우저 검증이 1차.

1. `#/`(overview) 로드, 카테고리 링크 클릭 시 해당 페이지 렌더.
2. 사이드바 활성 강조가 현재 라우트와 일치.
3. 주소창 `#/inputs` 직접 입력(딥링크) 시 해당 페이지, 브라우저 뒤로가기 동작.
4. 알 수 없는 해시(`#/zzz`) → overview 폴백.
5. `<Example>` 코드블록 렌더 + 복사 버튼 클릭 시 클립보드 복사 & "복사됨" 피드백.
6. 라이트/다크 토글이 모든 페이지에서 동작.
7. 콘솔 에러 0.
8. 안전 확인용 `npm run check` → `site verification ok` + `package skeleton check ok`(플레이그라운드 무관하게 그대로 통과).

## 파일 변경 요약

| 파일 | 변경 |
|------|------|
| `examples/playground/src/useHashRoute.ts` | 신규 — 해시 라우터 훅 |
| `examples/playground/src/routes.tsx` | 신규 — 라우트 테이블 |
| `examples/playground/src/Example.tsx` | 신규 — `<Example>` 프리미티브 |
| `examples/playground/src/App.tsx` | 셸 재작성(사이드바 + 아웃렛) |
| `examples/playground/src/pages/*` | `sections/` rename + `<Example>` 큐레이션 리팩터 |
| `examples/playground/src/pages/Overview.tsx` | 신규 랜딩 |
| `examples/playground/src/playground.css` | 사이드바/example/코드블록/반응형 스타일 |
