# idenflu Foundations

idenflu 디자인 시스템의 기초층입니다. 토큰 값, 정의 규칙, 사용 철학을 도메인별로 관리합니다.

## 구조

| 도메인 | 소스 (src/) | 문서 |
|--------|-------------|------|
| colors | `src/colors/colors.tokens.json` | [src/colors/colors.md](./src/colors/colors.md) |
| spacing | `src/spacing/spacing.tokens.json` | [src/spacing/spacing.md](./src/spacing/spacing.md) |
| typography | `src/typography/typo.tokens.json`, `styles.tokens.json` | [src/typography/typo.md](./src/typography/typo.md) |
| layout | `src/layout/tokens.json` | [src/layout/layout.md](./src/layout/layout.md) |
| border-radius | `src/rounded/rounded.tokens.json` | [src/rounded/rounded.md](./src/rounded/rounded.md) |
| theme | `src/themes/light.tokens.json`, `dark.tokens.json` | [src/themes/themes.md](./src/themes/themes.md) |

## 계층

1. **Primitive** — 테마에 무관한 기초 값 (colors, spacing, typography, layout, border-radius)
2. **Theme** — light/dark 시맨틱 토큰 (colors `Base.*` → Brand → Theme → Components 참조)

## 빌드

```bash
npm run build:foundations -w @idenflu/ui-foundations
```

Style Dictionary가 `src/**/*.json`을 읽어 `dist/css/`, `dist/js/`에 산출물을 생성합니다.

## 배포 산출물 (dist/)

| 경로 | 설명 |
|------|------|
| `dist/css/variables.css` | `:root`(primitive + light) 및 `.dark`(dark 시맨틱 오버라이드) |
| `dist/js/tokens.js` | Light 테마 기준 JS 토큰 객체 |

패키지 소비자는 `@idenflu/ui-tokens/css/variables.css` export 경로를 사용합니다.
