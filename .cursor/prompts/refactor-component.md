# 기존 컴포넌트 리팩터 / Figma 동기화

아래 항목을 채운 뒤 Cursor 채팅에 붙여넣으세요.

---

@packages/ui-react/src/components/{ComponentName}/

Figma: https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System?node-id={NODE_ID}

## 요청

{ComponentName}을 Figma 최신 디자인과 동기화하고, API·a11y를 점검해줘.

## 작업 순서

1. Figma MCP `get_design_context` — 현재 Figma spec 추출
2. 기존 코드(`@packages/ui-react/src/components/{ComponentName}/`)와 diff 분석
3. MUI MCP + Carbon — API·a11y best practice 재확인
4. 토큰: `@idenflu/ui-foundations` (`packages/ui-react/src/styles/tokens.css`) 매핑 검증
5. 필요 시에만 코드 수정 — scope 최소화

## 산출물

1. **Diff summary** — visual (Figma vs CSS), API (props 변경)
2. **Breaking changes** — 목록 + migration 가이드
3. **Token updates** — 추가/변경/제거된 CSS custom property
4. **a11y gaps** — 수정 항목
5. **Implementation** — diff가 있을 때만 코드·stories·export 수정

## 제약

- `@packages/ui-react/src/index.ts` public API 변경 시 migration note 필수
- unrelated 컴포넌트 수정 금지
- 하드코oded visual value → token 치환
- Figma reference code(Tailwind 등) 그대로 사용 금지
