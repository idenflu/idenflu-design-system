# ui-react 컴포넌트 개발 규칙

이 규칙은 `packages/ui-react/` 전체에 적용한다. 경로는 별도 표기가 없으면 이 디렉토리 기준이다. 사용자 요청과 루트 `AGENTS.md`를 함께 따르고, 작업 범위를 벗어나는 변경은 하지 않는다.

## 1. 개발 전 확인
- 가장 가까운 기존 컴포넌트, 루트 `.cursor/rules/design-system.mdc`, `.cursor/rules/component-workflow.mdc`, `docs/api/README.md`를 확인한다. `docs/`는 저장소 루트 기준이다.
- 새 컴포넌트 구현에는 `new-component` 스킬을 적용한다. API 검토만 요청받았으면 구현하지 않는다.
- Figma 디자인이 있는 컴포넌트는 노드별 URL(`?node-id=...`)에서 시작한다. 기본 파일 키는 `aMK1ysrAI4RGk1mrFk0O41`이다. 디자인이 있는데 대상 노드가 불명확하면 구현 전에 확인한다.
- Figma 디자인을 코드로 옮길 때는 `figma-design-to-code` 스킬을 먼저 읽고 `get_design_context`를 호출한다. Code Connect 매핑이 있으면 기존 컴포넌트를 우선 재사용한다.
- 시각 사양은 Figma, API·접근성 패턴은 MUI와 Carbon React, 구현 방식은 로컬 코드를 참고한다. MUI MCP는 `useMuiDocs` → `fetchDocs` 순서로 사용한다. 참조 코드나 API를 그대로 복사하지 않는다.

## 2. 파일과 공개 API
- 기본 구성은 `src/components/<Name>/<Name>.tsx`, `<Name>.module.css`, `<Name>.stories.tsx`, `index.ts`이다. 역할상 필요한 보조 파일만 추가한다.
- 현재 구현은 CSS Modules를 사용한다. 오래된 안내의 `<Name>.css` / `nova-*` 규칙을 이유로 기존 컴포넌트의 스타일 방식을 변경하지 않는다. 일반 CSS를 사용하는 작업에서는 `nova-<kebab-name>` 접두사를 따른다.
- 컴포넌트와 공개 타입을 폴더 `index.ts` 및 `src/index.ts`에서 내보낸다. 내부 보조 구현은 공개 API에 불필요하게 추가하지 않는다.
- 자동 생성 개별 아이콘은 예외로 `src/icons/index.ts`와 배포용 `@idenflu/ui-react/icons`에서만 공개한다. `SvgIconProps`도 이 하위 경로에서만 공개하며 공통 `SvgIcon` 구현은 내부에 둔다. SVG 원본 수정 후 루트에서 `npm run generate:icons`를 실행하고 생성 파일을 함께 커밋한다.
- TypeScript strict를 유지하고 `any`를 사용하지 않는다. 유니온 타입과 해당 HTML 요소의 React 속성 타입으로 유효한 props를 표현한다.
- DOM 기반 컴포넌트는 용도에 맞게 `ref`, `className`, 네이티브 속성·이벤트를 전달한다. 내부 전용 props가 DOM으로 새지 않도록 한다.
- 상태가 필요한 컴포넌트는 기존 패턴에 맞춰 controlled/uncontrolled 동작, 기본값, 변경 콜백을 정의한다. 슬롯·합성 API는 현재 요구에 필요할 때만 추가한다.
- 공개 API 변경은 기존 사용처를 확인하고 필요한 호출부·문서도 함께 수정한다. 호환성에 영향을 주는 변경은 명시한다.

## 3. 스타일과 토큰
- 색상, 간격, 크기, 타이포그래피, 모서리 등 시각 값은 디자인 토큰의 CSS custom property를 사용한다. 임의의 hex, px 값이나 시각 값을 숨기는 하드코딩 fallback을 추가하지 않는다.
- 루트 지침의 토큰 기준은 `@idenflu/ui-foundations`이다. 현재 `src/styles/tokens.css`는 `@idenflu/ui-tokens/css/variables.css`를 가져오므로, 이 차이를 인지하고 실제 제공되는 변수와 `docs/foundations/`의 매핑을 확인한다. 컴포넌트 작업 중 토큰 패키지를 임의로 교체하지 않는다.
- 토큰은 기존 `src/styles.css` → `src/styles/tokens.css` 진입점을 사용한다. 컴포넌트마다 토큰 CSS를 중복 import하지 않는다. 필요한 토큰이 없으면 임의 값을 만들지 말고 누락을 명시한다.
- 클래스 조합은 `src/utils/classNames.ts`의 `cn` 또는 `classNames`를 사용한다. variant 조합은 가까운 컴포넌트의 `cva` 등 기존 패턴을 재사용한다.
- 라이트·다크 테마 및 hover, active, focus-visible, disabled 등 지원하는 상태에 토큰을 적용한다. 전역 스타일은 필요한 범위로 제한한다.

## 4. 접근성과 상호작용
- 의미에 맞는 네이티브 HTML 요소를 우선 사용한다. ARIA는 필요한 의미·상태를 보완하고 실제 동작과 일치시킨다.
- 키보드 조작, 보이는 포커스, 접근 가능한 이름을 제공한다. 아이콘만 있는 조작 요소에는 이름이 필요하며 장식용 아이콘은 스크린 리더에서 숨긴다.
- 입력 컴포넌트는 label, 설명, 오류 메시지를 입력과 연결한다. ID가 필요하면 기존 패턴 또는 `React.useId`로 인스턴스 간 충돌을 피한다.
- disabled, readOnly, loading을 지원할 때는 이벤트 차단·포커스·상태 전달을 각각 정의한다. loading 중에도 접근 가능한 이름을 유지한다.
- 다이얼로그·팝오버 등은 해당 패턴의 포커스 이동·복귀와 키보드 닫기를 확인한다. 기존 Radix 기반 구현을 우선 참고한다.
- 애니메이션이 있으면 `prefers-reduced-motion`을 고려한다. 변경된 동작의 키보드·ARIA·포커스 요구를 스토리 또는 필요한 코드 주석에 기록한다.

## 5. Storybook과 API 계약
- 각 컴포넌트에 타입이 지정된 Storybook 스토리를 제공한다. 지원하는 variant, size, 주요 상호작용, disabled·loading·오류 상태를 보여준다.
- 실제 사용 예와 접근성 요구를 설명한다. 스토리에 상태를 나열하는 것만으로 동작 검증을 완료했다고 보지 않는다.
- 공개 props·상태·접근성을 변경하면 같은 변경에서 루트 `docs/api/components/<id>.json`을 동기화한다. 새 계약 등록 시 `docs/api/index.json`과 스키마를 확인한다.
- 구현 타입이 공개 API의 기준이다. 계약에는 구현된 프레임워크 공통 props·상태·접근성만 기록하고, React 이벤트는 넣지 않는다. 계약 JSON을 런타임이나 스토리에 import하지 않는다.

## 6. 테스트 기준
- 상호작용이 있는 컴포넌트를 새로 만들거나 동작을 변경하면 Storybook `play` 테스트로 해당 동작을 검증한다. 클릭·키보드 입력, 값 변경과 콜백, controlled/uncontrolled 동작, disabled/loading의 이벤트 차단, 포커스 이동·복귀 중 지원하는 동작을 대상으로 한다.
- 날짜 파싱, 범위 검증, 정렬 등 복잡한 계산 로직을 추가하거나 변경하면 별도 단위 테스트를 작성한다. 정상 입력뿐 아니라 경계값과 유효하지 않은 입력도 확인한다. 테스트 파일은 대상 코드 가까이에 `<Name>.test.ts` 또는 `<Name>.test.tsx`로 둔다.
- 동작·로직 버그 수정에는 해당 실패를 재현하는 회귀 테스트를 추가한다. 가능하면 수정 전 실패와 수정 후 통과를 확인한다. 시각 버그는 해당 상태의 스토리와 브라우저 검증으로 재현·확인한다.
- 단순 표시 컴포넌트나 동작에 영향이 없는 스타일 변경에는 별도 단위 테스트 파일을 일괄 요구하지 않는다. 스토리와 시각 검증을 유지하고, 클래스명·내부 구조를 그대로 반복하는 테스트는 만들지 않는다.
- 테스트는 사용자가 관찰하는 결과를 검증한다. 접근 가능한 role·name으로 요소를 찾고 실제 입력과 결과를 확인한다. 자동 접근성 검사는 키보드·포커스 검증을 대신하지 않는다.
- 현재 Vitest·Playwright의 Storybook 테스트 설정은 `vite.config.ts`에 있다. 별도 단위 테스트를 추가하면 해당 파일이 실행 대상에 포함되는지 확인하고 필요한 설정을 함께 수정한다. 현재 설정만으로 일반 `.test.ts` 파일이 실행된다고 가정하지 않는다.
- 현재 `.storybook/preview.tsx`의 접근성 설정은 `a11y.test: "todo"`이므로 위반이 테스트 실패로 처리되지 않는다. 접근성을 완료 기준으로 삼는 테스트는 `"error"`로 설정하고, 검출된 위반을 해결한다. 테스트 범위를 벗어나는 전역 설정 변경은 피한다.

## 7. 완료 전 검증
- 최종 diff에서 요청 범위, 토큰 사용, 공개 export, 스토리, API 계약의 일치를 확인한다. 새로 사용하지 않게 된 코드는 제거하고 기존의 무관한 변경은 보존한다.
- API 계약 변경 시 저장소 루트에서 `npm run check:api-contracts -w @idenflu/ui-react`를 실행한다. 이 검사는 패턴·계약 동기화 검사이며 실제 접근성·상호작용 검증을 대신하지 않는다.
- 타입 변경은 설치된 TypeScript로 `tsc --noEmit -p packages/ui-react/tsconfig.json`을 검증한다. 스토리·구성 변경은 필요에 따라 `npm run build-storybook -w @idenflu/ui-react`를 실행한다. 존재하지 않는 lint/test 스크립트를 가정하지 않는다.
- 추가·수정한 테스트를 실제로 실행하고, 테스트가 수집되어 기대한 검증을 수행했는지 확인한다. 타입 검사, Storybook 빌드, API 계약 검사만 통과한 것을 동작 테스트 통과로 보고하지 않는다.
- 시각·상호작용 변경은 Storybook 또는 브라우저에서 해당 상태, 라이트·다크 테마, 좁은 화면, 키보드·포커스와 필요한 스크롤 동작을 확인한다.
- 실행 결과와 종료 상태를 확인한 뒤 완료를 보고한다. 통과한 범위, 실패한 검사, 실행하지 못한 검증은 구분하고, 확인하지 않은 시각·접근성 품질을 보장하지 않는다.
