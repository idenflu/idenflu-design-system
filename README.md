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

`@idenflu/ui-tokens`는 `packages/tokens/package.json` 버전과 `CHANGELOG.md`를 수동으로 관리합니다. 토큰을 변경한 PR에서 버전을 올리고 CHANGELOG에 요약을 남긴 뒤 `main`에 머지하면 publish 워크플로가 새 버전을 배포합니다.

## Commands

```bash
npm run check
npm run check:docs
npm run check:packages
npm run release:tokens
```

## Docs

문서 사이트 진입점은 `docs/index.html`입니다.

- `docs/react-package-plan.md`
- `docs/ui-react-usage.md`
