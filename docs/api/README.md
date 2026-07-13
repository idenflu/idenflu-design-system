# Component API Contracts

프레임워크 공통 **API 계약**을 관리합니다.  
패키지 구현에는 import하지 않고, docs·검증만 사용합니다.

## 원칙

1. **엔지니어링 우선** — 공개 API는 구현(타입)이 진실. 계약은 구현 후 동기화한다.
2. **공유 범위** — 통일 `props` 이름, `states`, `accessibility`만 계약에 둔다.
3. **이벤트 제외** — `onClick` / `update:modelValue` 등은 프레임워크 관용. 계약에 넣지 않는다.

## 디렉터리

```text
docs/contracts/
  README.md
  index.json                 # 등록된 컴포넌트 id 목록
  schema.json                # 계약 JSON Schema
  components/
    button.json              # 컴포넌트별 계약 (예시)
```

## 워크플로

1. 패키지(`@idenflu/ui-react`)에서 prop/상태/a11y를 구현·변경한다.
2. 같은 PR에서 `docs/contracts/components/<id>.json`을 맞춘다.
3. `npm run check:contracts`로 스키마·등록·(선택) React prop 이름 대조를 통과시킨다.

## `props` 작성 규칙

- 이름은 **프레임워크 공통으로 쓸 이름**만 적는다 (`variant`, `loading`, `startIcon` …).
- `kind`: `boolean` | `string` | `number` | `enum` | `node` | `unknown`
- `enum`이면 `values` 필수.
- HTML 네이티브이지만 계약에 남길 개념(`disabled`)은 `native: true`로 표시한다.
- 구현에 없는 prop을 희망 목록으로 추가하지 않는다.

## `states` / `accessibility`

- 스토리·구현에서 **실제로 다루는 것**만 적는다.
- `states`는 문자열 배열을 유지한다. `status: implemented`이면 `check:api-contracts`가
  `source.react`와 같은 폴더의 `.module.css` / `.stories.*`에서 **패턴 존재**만 확인한다
  (`hover` → `:hover`, `focus` → `:focus-visible`, `loading`/`disabled` → 식별자 등).
  `default`는 기본 렌더로 보고 추가 마커를 요구하지 않는다.
- `accessibility`는 `{ "id", "rule" }` 객체 배열을 권장한다 (게이트·문서 재사용).

## 패키지와의 관계

| 위치                               | 역할                     |
| ---------------------------------- | ------------------------ |
| `packages/ui-react/...`            | 실제 타입·런타임 API     |
| `docs/contracts/components/*.json` | 공유 계약 (docs·CI)      |
| `docs/component-api.json`          | 레거시 체크리스트 (병행) |
