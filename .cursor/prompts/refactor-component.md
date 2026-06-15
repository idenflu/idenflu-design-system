# 기존 컴포넌트 리팩터 / Figma 동기화

아래 항목을 채운 뒤 Cursor 채팅에 붙여넣으세요.

---

## Figma 디자인이 있는 경우 아래 링크를 완성한 뒤 함께 채팅에 전달

Figma: @https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System?node-id={NODE_ID}

---

@packages/ui-react/src/components/{Button}/

## 요청

{Button}을 Figma 최신 디자인과 동기화하고, API·a11y를 점검해줘.

## 작업 순서

1. MUI MCP + Carbon — API·a11y best practice 확인
2. 기존 코드(`@packages/ui-react/src/components/{ComponentName}/`)와 diff 분석
3. 토큰: `@idenflu/ui-foundations` (`packages/ui-react/src/styles/tokens.css`) 매핑 검증
4. 필요 시에만 코드 수정 — scope 최소화

## 산출물

1. **Diff summary** — visual (Figma vs CSS), API (props 변경)
2. **Breaking changes** — 목록 + migration 가이드
3. **Token updates** — 추가/변경/제거된 CSS custom property
4. **a11y gaps** — 수정 항목
5. **Implementation** — diff가 있을 때만 코드·stories·export 수정

## 제약

- `@packages/ui-react/src/index.ts` public API 변경 시 migration note 필수
- unrelated 컴포넌트 수정 금지
- 하드코딩된 visual value → token 치환
