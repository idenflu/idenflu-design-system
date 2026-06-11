# idenflu Foundations

idenflu 디자인 시스템의 기초층입니다. 토큰 값, 정의 규칙, 사용 철학을 도메인별로 관리합니다.

## 구조

| 도메인 | 토큰 | 문서 |
|--------|------|------|
| colors | `colors/colors.json` | [colors/README.md](./colors/README.md) |
| spacing | `spacing/tokens.json` | [spacing/README.md](./spacing/README.md) |
| typography | `typography/tokens.json` | [typography/README.md](./typography/README.md) |
| layout | `layout/tokens.json` | [layout/README.md](./layout/README.md) |
| border-radius | `border-radius/tokens.json` | [border-radius/README.md](./border-radius/README.md) |
| theme | `theme/light.tokens.json`, `theme/dark.tokens.json` | [theme/README.md](./theme/README.md) |

## 계층

1. **Primitive** — 테마에 무관한 기초 값 (colors, spacing, typography, layout, border-radius)
2. **Theme** — light/dark 시맨틱 토큰 (colors `Base.*` → Brand → Theme → Components 참조)

## 빌드

```bash
npm run build:foundations -w @idenflu/ui-foundations
```

Style Dictionary가 도메인 JSON을 읽어 `build/css/`에 theme CSS variables를 생성합니다.
