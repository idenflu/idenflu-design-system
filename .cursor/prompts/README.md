# Cursor Prompt Templates

`packages/ui-react` 컴포넌트 작업용 프롬프트 템플릿입니다.

## 사용법

1. 아래 파일 중 하나를 연다.
2. `{ComponentName}`, `{NODE_ID}`, `{CarbonComponentName}` 등 placeholder를 채운다.
3. 내용 전체를 Cursor Agent 채팅에 붙여넣는다.
<!-- 4. Figma node URL은 컴포넌트 frame을 선택한 뒤 **Copy link**로 얻는다 (`node-id` 필수). -->

## Templates

| File                                             | 용도                      |
| ------------------------------------------------ | ------------------------- |
| [new-component.md](./new-component.md)           | Figma 디자인 → 신규 구현  |
| [api-design.md](./api-design.md)                 | props API 설계만 (코드 X) |
| [refactor-component.md](./refactor-component.md) | 동기화·리팩터             |

<!-- ## Figma

- File: [Idenflu Design System](https://www.figma.com/design/aMK1ysrAI4RGk1mrFk0O41/Idenflu-Design-System)
- fileKey: `aMK1ysrAI4RGk1mrFk0O41` -->

## Related Rules

- `.cursor/rules/design-system.mdc`
- `.cursor/rules/component-workflow.mdc`
- `AGENTS.md`
