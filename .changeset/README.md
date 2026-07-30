# Changesets

`@idenflu/ui-tokens` 버전과 `CHANGELOG.md`를 관리합니다.

## 사용 방법

토큰 패키지를 변경한 PR에서:

```bash
npm run changeset
```

1. `@idenflu/ui-tokens` 선택
2. bump 종류 선택 (`patch` / `minor` / `major`)
3. 한국어로 변경 요약 작성 (소비자 관점, 가능하면 토큰 키·CSS 변수명 포함)

## 릴리스 (main)

1. changeset이 쌓인 채 `main`에 머지되면 **Version Packages** PR이 열립니다.
2. 해당 PR을 리뷰·머지하면 version / `CHANGELOG.md`가 반영됩니다.
3. 머지 후 같은 워크플로가 `@idenflu/ui-tokens`를 GitHub Packages에 publish합니다.

현재 **alpha pre 모드**입니다. 버전은 `1.0.0-alpha.N` 형태입니다.

## 관련 명령

| 명령 | 설명 |
|------|------|
| `npm run changeset` | changeset 파일 추가 |
| `npm run version-packages` | version bump + CHANGELOG 반영 (CI / Version PR) |
| `npm run release:tokens` | tokens publish (`changeset publish`) |
