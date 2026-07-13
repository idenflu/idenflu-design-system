# Component API Contracts

프레임워크 공통 **API 계약**을 관리합니다.  
패키지 런타임에는 import하지 않습니다. 배포 전·CI에서만 검증합니다.

## 원칙

1. **엔지니어링 우선** — 공개 API는 구현(타입)이 진실. 계약은 구현 후 동기화한다.
2. **공유 범위** — 통일 `props` 이름, `states`, `accessibility`만 계약에 둔다.
3. **이벤트 제외** — `onClick` / `update:modelValue` 등은 프레임워크 관용. 계약에 넣지 않는다.
4. **검증은 프레임워크별** — 계약 JSON은 공통, sync 검증은 각 UI 패키지 스크립트가 담당한다.

## 디렉터리

```text
docs/api/
  README.md
  index.json                 # 등록된 컴포넌트 id 목록
  schema.json                # 계약 JSON Schema
  components/
    button.json              # 컴포넌트별 계약
```

## 워크플로

1. 패키지(`@idenflu/ui-react`)에서 prop/상태/a11y를 구현·변경한다.
2. 같은 PR에서 `docs/api/components/<id>.json`을 맞춘다.
3. 배포·CI 전에 React sync 검증을 통과시킨다.

```bash
npm run check:api-contracts -w @idenflu/ui-react
# 또는 루트에서
npm run check:api-contracts
```

## `props` 작성 규칙

- 이름은 **프레임워크 공통으로 쓸 이름**만 적는다 (`variant`, `loading`, `startIcon` …).
- `kind`: `boolean` | `string` | `number` | `enum` | `node` | `unknown`
- `enum`이면 `values` 필수.
- HTML 네이티브이지만 계약에 남길 개념(`disabled`)은 `native: true`로 표시한다.
- 구현에 없는 prop을 희망 목록으로 추가하지 않는다.

## `states` / `accessibility`

- 스토리·구현에서 **실제로 다루는 것**만 적는다.
- `states`는 문자열 배열을 유지한다. `status: implemented`이면
  `@idenflu/ui-react`의 `check:api-contracts`가 계약 `id`로부터
  `src/components/<PascalName>/<PascalName>.tsx`를 찾고, 같은 폴더의
  `.module.css` / `.stories.*`에서 **패턴 존재**만 확인한다
  (`hover` → `:hover`, `focus` → `:focus-visible`, `loading`/`disabled` → 식별자 등).
  `default`는 기본 렌더로 보고 추가 마커를 요구하지 않는다.
- 계약 JSON에 `source` 경로는 두지 않는다. 경로 해석은 각 프레임워크 패키지 검증 스크립트가 담당한다.
- `accessibility`는 `{ "id", "rule" }` 객체 배열을 권장한다 (게이트·문서 재사용).

## 패키지와의 관계

| 위치 | 역할 |
| --- | --- |
| `docs/api/components/*.json` | 프레임워크 공통 계약 |
| `packages/ui-react/scripts/validate-api-contracts.js` | React 구현 ↔ 계약 sync (배포 전) |
| `packages/ui-react` Storybook | **현재 유일한** React 사용·시각 문서 (수동 CSF) |
| `packages/ui-react/src/...` | 실제 타입·런타임 API |
| `docs/documentation-strategy.md` | Storybook ↔ 계약 ↔ 이후 공통 docs 로드맵 |
| `docs/component-api.json` | 레거시 체크리스트 (병행) |

Storybook은 계약을 import하지 않는다. 작성 시 계약을 체크리스트로 쓰고,
`check:api-contracts`로 이름·상태를 맞춘다. 상세는
[documentation-strategy.md](../documentation-strategy.md).

