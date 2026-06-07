# Icon component — design spec

작성일: 2026-06-07
브랜치: `feat/ui-react-icon`
패키지: `@idenflu/ui-react`

## 1. 목적 / 배경

현재 `@idenflu/ui-react` 소비자는 아이콘이 필요할 때 raw `<svg>`를 직접 inline해야 한다(ui-react-usage.md의 `searchIcon` 예시). `@idenflu/ui-icons`는 sprite(`icons.svg`, 15개 symbol)와 `iconNames`/`getIconHref`/`iconSpriteHref`를 이미 제공하므로, 이를 감싸는 타입 안전한 React `Icon` 컴포넌트를 추가해 DX를 개선한다. Button/IconButton 등의 `icon` prop에 바로 넣어 쓸 수 있다.

### 아이콘 패키지 사실

- `icons.svg`: `<symbol id="icon-*" viewBox="0 0 24 24">` 15개, 전부 `stroke="currentColor"`(색은 currentColor 상속).
- `iconNames`: 15개 const, `IconName` union 타입.
- `iconSpriteHref = "@idenflu/ui-icons/icons.svg"`, `getIconHref(name, spriteHref = iconSpriteHref) => "${spriteHref}#${name}"`.
- 패키지 exports: `.`(index), `./icons.svg`(sprite 파일).

## 2. 결정 사항 (확정)

- **sprite 전략**: 외부 sprite를 `<use href>`로 참조 + `IconSpriteProvider` 컨텍스트로 sprite URL을 한 번 주입. 인스턴스별 `spriteHref` prop으로 override. (inline path data 방식은 채택 안 함 — sprite 기반 설계 유지.)

## 3. 목표 / 비목표

**목표**
- 타입 안전한 `name: IconName` 기반 `<Icon>`.
- 장식 기본(aria-hidden), `label`로 의미 아이콘(role="img") 전환.
- size 토큰(small/medium/large) + number(px), 색은 currentColor.
- 기존 컨벤션(forwardRef, classNames, `if-` 클래스, displayName, 무의존성 source-only) 준수.
- 문서 사이트 icons 페이지에 React 노트 연결.

**비목표 (YAGNI)**
- inline path data / 아이콘별 개별 컴포넌트.
- color prop(컬러는 CSS `color`로).
- 아이콘 추가/sprite 생성 변경(기존 15개 그대로).
- tsc/테스트 인프라 — 기존 방침(skeleton-check) 유지.

## 4. 파일 구조

| 파일 | 책임 |
|---|---|
| `packages/ui-react/src/components/Icon.tsx` | `Icon` + `IconSpriteProvider` + 내부 `IconSpriteContext` |

## 5. API

```ts
import { getIconHref, iconSpriteHref, type IconName } from "@idenflu/ui-icons";

export type IconSize = "small" | "medium" | "large"; // 16 / 20 / 24

export type IconSpriteProviderProps = {
  href: string;                 // 번들러가 해석한 sprite URL
  children: React.ReactNode;
};

export type IconProps = Omit<React.SVGAttributes<SVGSVGElement>, "children"> & {
  name: IconName;
  label?: string;               // 있으면 role="img"+aria-label, 없으면 장식(aria-hidden)
  size?: IconSize | number;     // 기본 "medium"
  spriteHref?: string;          // 인스턴스 override (기본 = Provider 값 → iconSpriteHref)
};
```

- 내부: `const IconSpriteContext = React.createContext<string>(iconSpriteHref);`
- `IconSpriteProvider` = `<IconSpriteContext.Provider value={href}>`.
- sprite 해석 우선순위: `spriteHref` prop > Provider 값 > 기본 `iconSpriteHref`(sentinel — Provider 없이는 런타임 미해석, 문서에 명시).
- 사이즈 매핑: `{ small: 16, medium: 20, large: 24 }`. number면 그대로 px.
- `Icon`은 `React.forwardRef<SVGSVGElement>`, `Icon.displayName = "Icon"`.
- **편의 재export**: ui-react `index.ts`에서 `type IconName`과 `iconNames`(const)를 재export.

## 6. 마크업 & 접근성

```tsx
const px = typeof size === "number" ? size : ICON_SIZES[size];
const href = getIconHref(name, spriteHref ?? contextHref);
const a11y = label
  ? { role: "img", "aria-label": label }
  : { "aria-hidden": true, focusable: false };

return (
  <svg
    ref={ref}
    width={px}
    height={px}
    viewBox="0 0 24 24"
    className={classNames("if-icon", className)}
    {...a11y}
    {...props}
  >
    <use href={href} />
  </svg>
);
```

- 기본 **장식(aria-hidden, focusable=false)**: Button/IconButton 내부에 들어갈 때 버튼이 접근 이름을 제공(패키지 원칙 "icon-only는 버튼에 accessible name"과 정합).
- `label` 제공 시 단독 의미 아이콘으로 노출(role="img" + aria-label).
- `<use href>`(모던 문법; peer React >=18 환경).
- `a11y`를 `{...props}` **앞에** 두어 소비자가 필요 시 role/aria override 가능.

## 7. 비주얼 / CSS (`packages/ui-react/src/styles.css`에 append)

```css
.if-icon {
  color: inherit;
  display: inline-block;
  flex: 0 0 auto;
  vertical-align: middle;
}
```
- symbol이 `currentColor`라 색은 부모 CSS `color`로 제어. 별도 토큰 불필요. 다크 모드는 부모 색 상속으로 자동.

## 8. 통합 지점

**패키지 코드**
- `index.ts`: `export { Icon, IconSpriteProvider }`, `export type { IconProps, IconSize, IconSpriteProviderProps }`. 추가로 `export { iconNames } from "@idenflu/ui-icons"; export type { IconName } from "@idenflu/ui-icons";`.
- `styles.css`: `.if-icon` append.
- `scripts/package-skeleton-check.js`: Icon 파일 requireFile, index 마커 `Icon`/`IconSpriteProvider`, 컴포넌트 마커, styles.css cssMarker `.if-icon`.

**패키지 문서**
- `docs/ui-react-usage.md`: inline `<svg>` 예시를 `<Icon name="search" />` + `IconSpriteProvider` 설정 예시로 교체/추가.
- `docs/react-package-plan.md`: 추가 컴포넌트로 반영.

**문서 사이트**
- `docs/src/pages/components-icons.html`: React `<Icon name="…" />` + Provider 노트 추가(partial/depth/component 마커 보존) → `node docs/scripts/build-site.js` 재빌드.

## 9. 검증 계획

- `npm run check`(verify-site + skeleton) 그린.
- `node docs/scripts/build-site.js` 후 의도한 변경만 + 재현성.
- 토큰 교차검증(미정의 `--if-*` 0 — `.if-icon`은 토큰 미사용), export 심볼 검증(0 missing), 수동 리뷰(TSX 유효성, a11y, 컨벤션).
- tsc/런타임 렌더는 인프라 미도입으로 미수행(한계 기록).

## 10. 파일 영향 요약

| 파일 | 변경 |
|---|---|
| `packages/ui-react/src/components/Icon.tsx` | 신규 |
| `packages/ui-react/src/index.ts` | Icon/Provider/타입 export + IconName/iconNames 재export |
| `packages/ui-react/src/styles.css` | `.if-icon` |
| `scripts/package-skeleton-check.js` | 마커 추가 |
| `docs/ui-react-usage.md` | Icon 사용 예시 |
| `docs/react-package-plan.md` | 목록 반영 |
| `docs/src/pages/components-icons.html` | React 노트 (소스) |
| `docs/components-icons.html` | build-site.js 산출물 |
