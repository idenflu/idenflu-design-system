# 신규 컴포넌트 구현 (Figma → Code)

아래 항목을 채운 뒤 Cursor 채팅에 붙여넣으세요.

---

@packages/ui-react/src/components/{ComponentName}/

Figma: https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System?node-id={NODE_ID}

## 요청

{ComponentName} 컴포넌트를 구현해줘.

## 작업 순서

1. Figma MCP `get_design_context`로 디자인·variant·상태 확인 (fileKey: `aMK1ysrAI4RGk1mrFk0O41`)
2. MUI MCP로 동등 컴포넌트 API·a11y 패턴 조회 (`useMuiDocs` → `fetchDocs`)
3. Carbon React 동등 컴포넌트 문서/소스와 비교
4. `@idenflu/ui-foundations` 토큰만 사용 (`packages/ui-react/src/styles/tokens.css` 경유)
5. 기존 컴포넌트(예: Button) 폴더 구조·네이밍 컨벤션 따르기

## 산출물

- `{ComponentName}.tsx`, `{ComponentName}.css`, `{ComponentName}.stories.tsx`, `index.ts`
- `packages/ui-react/src/index.ts` export 추가
- CSS 클래스 prefix: `nova-{kebab-name}`
- Storybook: variant/size/state matrix
- a11y: keyboard, ARIA, focus 관련 notes

## 제약

- Figma/MUI/Carbon 출력 코드를 그대로 붙이지 말 것
- 색상·spacing·typography 하드코딩 금지
- MUI/Carbon과 다른 API 선택 시 이유를 짧게 명시
