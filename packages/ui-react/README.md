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
import "@idenflu/ui-react/styles.css";
import { Button } from "@idenflu/ui-react";
```

## React 문서 앱

저장소 루트에서 `npm run docs:react`로 개발 서버를 실행하거나 `npm run build:react-docs`로 정적 사이트를 빌드합니다. 문서 앱은 `docs/react-studio`에 있으며 실제 패키지의 컴포넌트와 예제를 사용합니다.

## Select 마이그레이션

`Select`는 단일 선택, `SearchSelect`는 검색 가능한 단일 선택, `MultiSelect`는 다중 선택에 사용합니다. 세 컴포넌트는 `options`와 `label`을 받습니다. 기존 `SelectItem`, `multiple`, `valueDisplay`, `searchable`(단일 선택) 및 `Combobox` API는 제거되었습니다. 검색 가능한 다중 선택은 `MultiSelect searchable`을 사용합니다.

```tsx
import { Select, SearchSelect, MultiSelect } from "@idenflu/ui-react";

const options = [{ value: "design", label: "Design" }];
<Select label="Team" options={options} />;
<SearchSelect label="Team" options={options} />;
<MultiSelect label="Teams" options={options} searchable presentation="inline" />;
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

기본 글꼴은 Pretendard Variable입니다. `@idenflu/ui-react/styles.css`는 폰트, 토큰, 기본 글꼴 설정을 함께 불러옵니다. 기존의 `@idenflu/ui-react/fonts.css` 경로도 호환성을 위해 유지됩니다.

컴포넌트와 본문의 기본 글꼴은 `--font-family-body`를 사용합니다.

### 기본 (Pretendard)

```tsx
import "@idenflu/ui-react/styles.css";
```

### 다른 글꼴

앱 글꼴의 `@font-face`를 사용처에서 등록하고 `--font-family-body`를 덮어씁니다. `styles.css`는 Pretendard 폰트 정의를 포함하지만 다른 글꼴을 사용하는 경우 해당 글꼴 파일을 요청하지 않습니다.

```css
@import "@idenflu/ui-react/styles.css";

:root {
  --font-family-body: "App Sans", sans-serif;
}
```

`html { font-family }`만 바꾸면 본문만 바뀌고 컴포넌트는 Pretendard 스택을 유지합니다.


## Theme

`@idenflu/ui-react/styles.css`는 mono 토큰을 포함합니다. 테마는 문서 루트의 `data-theme`으로 설정합니다. 기본값은 light입니다.

```html
<html data-theme="dark">
```

기존 `.dark` 클래스는 ui-react 테마를 전환하지 않습니다. 사용처에서 운영체제 설정을 따르려면 `prefers-color-scheme`을 감지해 `data-theme`에 `light` 또는 `dark`를 설정하세요.
