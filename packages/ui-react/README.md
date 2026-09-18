# @idenflu/ui-react

idenflu 제품 UI용 React 컴포넌트 패키지입니다.

GitHub Packages에서 설치합니다.

```txt
@idenflu:registry=https://npm.pkg.github.com
```

```bash
npm install @idenflu/ui-react
```

```tsx
import "@idenflu/ui-react/fonts.css";
import "@idenflu/ui-react/styles.css";
import { Button } from "@idenflu/ui-react";
```

## Font

기본 글꼴은 Pretendard Variable입니다.

| Import | 역할 |
|--------|------|
| `@idenflu/ui-react/fonts.css` | Pretendard `@font-face` |
| `@idenflu/ui-react/styles.css` | 토큰, `html { font-family: var(--font-family-sans); }` |

컴포넌트 타입 스타일도 `var(--font-family-sans)`를 사용합니다. 이 변수를 덮으면 본문과 컴포넌트가 같이 바뀝니다.

### 기본 (Pretendard)

```tsx
import "@idenflu/ui-react/fonts.css";
import "@idenflu/ui-react/styles.css";
```

### 다른 글꼴

`fonts.css`는 넣지 않습니다. `--font-family-sans`와 `--font-family-base`를 덮고, 앱 글꼴 `@font-face`는 사용처에서 등록합니다.

```css
@import "@idenflu/ui-react/styles.css";

:root {
  --font-family-sans: "App Sans", sans-serif;
  --font-family-base: "App Sans", sans-serif;
}
```

`html { font-family }`만 바꾸면 본문만 바뀌고 컴포넌트는 Pretendard 스택을 유지합니다.
