# Props API 설계 (구현 없음)

아래 항목을 채운 뒤 Cursor 채팅에 붙여넣으세요.

---

## Figma 디자인이 있는 경우 아래 링크를 완성한 뒤 함께 채팅에 전달

Figma: @https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System?node-id={NODE_ID}

---

## 요청

{Icon}의 **props API만** 설계해줘. **코드 작성은 하지 마.**

## 조사 순서

1. Carbon React — 동등 컴포넌트 props·a11y
   - Docs: https://react.carbondesignsystem.com/
   - Source: https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/{Icons}
2. MUI MCP — 동등 컴포넌트 props·composition (`useMuiDocs` → `fetchDocs`)

## 산출물 (문서 형식)

1. **MUI vs Carbon vs idenflu 비교표** — prop name, type, default, notes
2. **권장 idenflu API (1안)** — TypeScript interface (설계용, 파일 생성 X)
3. **Controlled / uncontrolled** — 어떤 prop이 controlled인지
4. **Slot / composition** — children, startIcon 등 slot 설계
5. **Accessibility** — 필수 ARIA, keyboard, label 요구사항
6. **Breaking risk** — 기존 `@idenflu/ui-react` API와 충돌 가능성

## 제약

- 시각 값은 `@idenflu/ui-foundations` 토큰 기준으로만 언급
- MUI/Carbon API를 그대로 복사하지 말고 idenflu 네이밍에 맞게 adapt
- 구현·Storybook·CSS 파일 생성 금지
