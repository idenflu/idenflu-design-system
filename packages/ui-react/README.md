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

## Icons

새 React 코드에서는 개별 아이콘을 사용합니다. SVG 도형이 포함되어 sprite URL, Provider, 스타일시트 설정 없이 렌더링됩니다.

```tsx
import { PlusIcon, WarningIcon, type SvgIconProps } from "@idenflu/ui-react/icons";

<PlusIcon />; // 기본 16 × 16px, 장식용
<PlusIcon size={20} />;
<WarningIcon size={20} label="경고" />;
```

`size?: number`는 너비와 높이를 지정하며 기본값은 `16`입니다. `label`을 생략하면 `aria-hidden`, 제공하면 `role="img"`와 `aria-label`이 적용됩니다. 버튼 안에서는 아이콘의 `label`을 생략하고 버튼에 접근 가능한 이름을 제공합니다. `className`, `style`, 네이티브 SVG 속성·이벤트와 SVG `ref`를 지원합니다. 색은 `currentColor`로 상속하므로 부모 색상이나 `style.color`에 디자인 토큰을 사용합니다. `children`, `name`, `spriteHref`는 받지 않습니다.

정적 named import로 사용한 아이콘만 번들에 포함할 수 있습니다. 문자열로 선택해야 하면 필요한 아이콘만 매핑하고, 전체 아이콘을 모은 레지스트리는 피합니다. 기존 `Icon`과 `IconSpriteProvider`는 같은 API로 계속 사용할 수 있습니다.

### 아이콘 생성과 검증

`packages/icons/src/icons.svg`가 도형 원본입니다. 생성된 TSX와 export 목록은 Git에 포함하며 직접 수정하지 않습니다.

```bash
npm run generate:icons
npm run test:icons -w @idenflu/ui-react
```

`check:icons`는 생성 결과가 오래되었으면 실패합니다. `build:icons`는 JavaScript ESM과 타입 선언을 `dist`에 만들고, `prepack`에서도 실행됩니다. 배포 소비자에게 SVGR 설정은 필요하지 않습니다. 로컬에서 처음 사용하거나 원본을 변경한 뒤에는 `npm run build:icons -w @idenflu/ui-react`를 실행합니다.

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
