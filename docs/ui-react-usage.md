# ui-react usage

`@idenflu/ui-react`는 idenflu 제품 화면에서 반복되는 기본 UI를 React 컴포넌트로 쓰기 위한 패키지입니다.

## Install

소비 프로젝트의 `.npmrc`에 GitHub Packages registry를 추가합니다.

```txt
@idenflu:registry=https://npm.pkg.github.com
```

GitHub Packages 접근 권한이 필요합니다. 로컬에서는 GitHub classic PAT의 `read:packages` 권한으로 로그인합니다.

```bash
npm login --scope=@idenflu --auth-type=legacy --registry=https://npm.pkg.github.com
npm install @idenflu/ui-react @idenflu/ui-tokens @idenflu/ui-icons
```

## Import

앱 진입점에서 스타일을 한 번 import합니다.

```tsx
import "@idenflu/ui-react/styles.css";
```

컴포넌트는 필요한 것만 import합니다.

```tsx
import { Button, Card, CardBody, CardHeader, IconButton, TextField } from "@idenflu/ui-react";

const searchIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm5.5-2 5 5" />
  </svg>
);

export function CampaignForm() {
  return (
    <Card>
      <CardHeader>
        <strong>Campaign review</strong>
      </CardHeader>
      <CardBody>
        <TextField
          label="Campaign name"
          placeholder="Summer drop review"
          helperText="Visible label과 helper는 control에 연결됩니다."
          required
        />
        <TextField label="Creator rate" prefix="KRW" suffix="per reel" defaultValue="1,200,000" />
        <Button variant="primary" size="medium">Save</Button>
        <IconButton icon={searchIcon} label="Search campaign" variant="ghost" />
      </CardBody>
    </Card>
  );
}
```

## Theme

기본은 light theme입니다. dark theme은 root에 attribute를 둡니다.

```html
<html data-if-theme="dark">
```

## Components

- `Button`
- `IconButton`
- `TextField`
- `Textarea`
- `Select`
- `Badge`
- `Chip`
- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- `Table`, `TableEmptyRow`
- `EmptyState`

## Notes

- 현재 패키지는 alpha 초안입니다.
- 복잡한 picker나 data grid는 아직 포함하지 않습니다.
- 제품 적용 전 `npm run check`와 package dry-run으로 배포 구성을 확인합니다.
