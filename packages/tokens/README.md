# @idenflu/ui-tokens

idenflu 제품 UI의 디자인 토큰 패키지입니다. 색, 간격, 타이포그래피, radius를 CSS Custom Property와 JS 객체로 제공합니다.

## 설치

GitHub Packages에서 배포합니다. 소비 프로젝트 `.npmrc`에 레지스트리를 추가합니다.

```txt
@idenflu:registry=https://npm.pkg.github.com
```

GitHub classic PAT의 `read:packages` 권한이 필요합니다.

```bash
npm login --scope=@idenflu --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @idenflu/ui-tokens
```

`@idenflu/ui-react`만 쓰는 경우에도 토큰 CSS는 `ui-react` 스타일에 이미 들어 있습니다. 토큰만 쓰거나, 컴포넌트 밖에서 직접 변수를 참조할 때 이 패키지를 설치합니다.

---

## 적용

### 1. CSS import

앱 진입 CSS에서 한 번만 가져옵니다.

```css
@import "@idenflu/ui-tokens/css/variables.css";
```

또는 JS/TS 엔트리에서:

```ts
import "@idenflu/ui-tokens/css/variables.css";
```

이 파일이 `:root`에 light 토큰을 넣고, `.dark`에 dark 시맨틱 값을 덮어씁니다.

`@idenflu/ui-react/styles.css`를 이미 import했다면 토큰 CSS를 다시 import하지 않습니다.

<br />

### 2. 토큰 사용

컴포넌트에는 HEX나 primitive(`--base-gray-900` 등) 대신 **역할 토큰**을 씁니다.

```css
.page {
  background-color: var(--surface-00);
  color: var(--text-primary);
  font: var(--body-md);
}

.card {
  background-color: var(--surface-02);
  border: 1px solid var(--border-primary);
  border-radius: var(--rounded-lg);
  padding: var(--spacing-06);
}

.title {
  font: var(--heading-md);
  color: var(--text-strong);
}

.error {
  color: var(--text-error);
}
```

타이포 스타일은 `font` shorthand입니다.

```css
.metric {
  font: var(--numeric-md);
  font-variant-numeric: tabular-nums;
}
```

<br />

### 3. 다크 모드

기본은 light(`:root`)입니다. dark는 조상 요소에 `dark` 클래스를 붙입니다.

```html
<html class="dark">
  <!-- --text-primary, --surface-00 등이 dark 값으로 바뀜 -->
</html>
```

컴포넌트 CSS에 light/dark 색을 따로 두지 않습니다. 같은 `var(--text-primary)`를 쓰면 됩니다.

<br />

### 4. 글꼴

`--font-family-sans` / `--font-family-base` 스택은 다음과 같습니다.

```text
'Pretendard Variable', Pretendard, 'Noto Sans KR', 'Noto Sans', system-ui, ...
```

**글꼴 파일과 `@font-face`는 이 패키지에 없습니다.** 로드하지 않으면 fallback 폰트가 보입니다.

권장: 공식 `pretendard` 패키지의 가변 + 다이나믹 서브셋.

```bash
npm install pretendard
```

```css
@import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
@import "@idenflu/ui-tokens/css/variables.css";
```

가변 CSS가 등록하는 family 이름은 `Pretendard Variable`입니다. 토큰 스택의 첫 이름과 같아야 합니다.

이미 CDN이나 `next/font`로 Pretendard를 넣고 있다면 토큰 CSS만 import하면 됩니다.

<br />

### 5. JavaScript

런타임에서 값이 필요할 때만 JS 객체를 씁니다. **테마는 light 기준**입니다. 화면 색은 CSS 변수를 쓰는 편이 맞습니다.

```ts
import tokens from "@idenflu/ui-tokens";

tokens["spacing-06"]; // "16px"
tokens["font-family-sans"];
```

```ts
import tokens from "@idenflu/ui-tokens/js/tokens.js";
```

---

## Export

| Import                                 | 내용                          |
| -------------------------------------- | ----------------------------- |
| `@idenflu/ui-tokens/css/variables.css` | `:root` + `.dark` CSS 변수    |
| `@idenflu/ui-tokens`                   | Light 기준 JS 토큰 객체       |
| `@idenflu/ui-tokens/js/tokens.js`      | 위와 동일, 경로를 명시한 경우 |

---

## 규칙

- 컴포넌트 스타일은 Theme 토큰(`surface`, `text`, `border`, `background`)을 우선한다.
- primitive(`--base-*`)와 HEX는 컴포넌트에 직접 쓰지 않는다.
- 타입 스타일은 `--heading-*`, `--body-*` 등을 쓰고, size/weight를 임의로 조합하지 않는다.

도메인 가이드: [typography](./src/typography/typo.md), [color](./src/colors/colors.md), [theme](./src/themes/themes.md), [spacing](./src/spacing/spacing.md), [rounded](./src/rounded/rounded.md).

---

## 유지보수

소스 JSON은 Style Dictionary로 `dist/`를 만듭니다. `dist`를 직접 수정하지 않습니다.

```bash
npm run build:tokens
```

버전은 `package.json`과 [CHANGELOG.md](./CHANGELOG.md)를 수동으로 올립니다. `main` 머지 후 GitHub Packages에 배포됩니다. 로컬 배포는 저장소 루트에서 `npm run release:tokens`입니다.
