# idenflu Design System

idenflu 제품 UI를 위한 디자인 시스템입니다. 문서 사이트와 재사용 가능한 UI 패키지 초안을 함께 관리합니다.

## Structure

```txt
docs/       GitHub Pages 문서 사이트
packages/   tokens, icons, React UI packages
scripts/    package 검증 스크립트
```

## Packages

- `@idenflu/ui-tokens`
- `@idenflu/ui-icons`
- `@idenflu/ui-react`

GitHub Packages 배포 설정은 `.github/workflows/publish-packages.yml`에 있습니다.

## Commands

```bash
npm run check
npm run check:docs
npm run check:packages
```

## Docs

문서 사이트 진입점은 `docs/index.html`입니다.

- `docs/react-package-plan.md`
- `docs/ui-react-usage.md`
