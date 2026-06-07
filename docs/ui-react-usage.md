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
- `Dialog`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogClose`
- `Drawer`
- `Toolbar`, `ToolbarGroup`
- `LoadingState`
- `ErrorState`
- `Switch`
- `Checkbox`
- `RadioGroup`
- `SegmentedControl`
- `Icon`, `IconSpriteProvider`

## Icon

`Icon`은 `@idenflu/ui-icons` sprite의 symbol을 타입 안전하게 렌더합니다. 앱 루트에서 `IconSpriteProvider`로 sprite URL을 한 번 주입합니다(번들러가 해석한 URL).

```tsx
import spriteUrl from "@idenflu/ui-icons/icons.svg";
import { Icon, IconSpriteProvider, Button } from "@idenflu/ui-react";

function App() {
  return (
    <IconSpriteProvider href={spriteUrl}>
      {/* 장식 아이콘 (기본 aria-hidden) — 버튼이 접근 이름 제공 */}
      <Button icon={<Icon name="icon-search" />}>Search</Button>

      {/* 단독 의미 아이콘 — label로 노출 */}
      <Icon name="icon-alert" label="Warning" size="large" />
    </IconSpriteProvider>
  );
}
```

## Switch

`Switch`는 즉시 적용되는 on/off 설정에 씁니다(일회성 명령은 `Button`). 네이티브 `<input type="checkbox" role="switch">`를 pill 형태로 스타일링해 키보드·focus·폼 제출이 기본으로 동작합니다.

```tsx
import { Switch } from "@idenflu/ui-react";

// controlled
<Switch
  label="Auto-assign reviewers"
  description="Applies immediately to new submissions"
  checked={autoAssign}
  onChange={(event) => setAutoAssign(event.target.checked)}
/>

// uncontrolled, small
<Switch label="Notify creator" defaultChecked size="small" />

// label 없이 쓸 때(예: 테이블 셀) — aria-label 필수
<Switch aria-label="Enable row" checked={enabled} onChange={onToggle} />
```

## Controls family

`Checkbox`/`RadioGroup`/`SegmentedControl`은 `Switch`와 함께 controls 패밀리를 이룹니다. Checkbox·RadioGroup은 네이티브 input 기반, SegmentedControl은 단일 선택 버튼 그룹입니다.

```tsx
import { Checkbox, RadioGroup, SegmentedControl } from "@idenflu/ui-react";

// Checkbox — controlled, with indeterminate
<Checkbox
  label="Select all rows"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={(event) => toggleAll(event.target.checked)}
/>

// RadioGroup — data-driven, uncontrolled
<RadioGroup
  label="Review status"
  name="review-status"
  defaultValue="ready"
  options={[
    { value: "all", label: "All" },
    { value: "risk", label: "Risk" },
    { value: "ready", label: "Ready" },
  ]}
  onChange={(value) => setStatus(value)}
/>

// SegmentedControl — single-select, controlled
<SegmentedControl
  label="Time range"
  value={range}
  onChange={setRange}
  options={[
    { value: "today", label: "Today" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
  ]}
/>
```

## Tier-2 components

2차 컴포넌트는 overlay, container, feedback 패턴을 다룹니다. 모든 컴포넌트는 controlled/presentational이며 icon-only action에는 accessible name을 요구합니다.

### Dialog

```tsx
import { Dialog, DialogBody, DialogFooter, Button } from "@idenflu/ui-react";
import "@idenflu/ui-react/styles.css";

function RequestChangesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} size="medium" title="Request changes?" closeLabel="Close dialog">
      <DialogBody>
        <p>Rev 03에 남길 사유와 알림 대상을 확인합니다.</p>
      </DialogBody>
      <DialogFooter>
        <Button variant="quiet" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={onClose}>Request</Button>
      </DialogFooter>
    </Dialog>
  );
}
```

### Drawer

```tsx
import { Drawer, Button } from "@idenflu/ui-react";
import "@idenflu/ui-react/styles.css";

function CreatorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="right"
      size="md"
      title="Creator Hana"
      description="Rev 03 · Disclosure missing · Due today"
      closeLabel="Close creator details"
      footer={
        <>
          <Button variant="quiet" onClick={onClose}>Close</Button>
          <Button variant="primary">Request changes</Button>
        </>
      }
    >
      <p>Owner: Mina</p>
      <p>Next action: Request caption change</p>
    </Drawer>
  );
}
```

### Toolbar

```tsx
import { Toolbar, ToolbarGroup, Button, IconButton, TextField } from "@idenflu/ui-react";
import "@idenflu/ui-react/styles.css";

<Toolbar label="Campaign filters" density="compact" align="between">
  <ToolbarGroup label="Search and filters">
    <TextField label="Search campaigns" type="search" />
    <Button variant="quiet" size="small">Status</Button>
    <Button variant="quiet" size="small">Owner</Button>
  </ToolbarGroup>
  <ToolbarGroup align="end" label="Actions">
    <Button variant="ghost" size="small" disabled>Reset</Button>
    <IconButton label="Refresh list" icon={<RefreshIcon />} size="small" />
  </ToolbarGroup>
</Toolbar>
```

### LoadingState

```tsx
import { LoadingState } from "@idenflu/ui-react";

<LoadingState
  label="Loading roster"
  description="Fetching your creator roster. This usually takes a few seconds."
  size="medium"
/>
```

### ErrorState

```tsx
import { ErrorState, Button } from "@idenflu/ui-react";
import "@idenflu/ui-react/styles.css";

<ErrorState
  tone="error"
  title="Rows failed to sync"
  description="Retry keeps your selected rows and filters."
  action={<Button variant="danger" onClick={retry}>Retry</Button>}
/>
```

## Notes

- 현재 패키지는 alpha 초안입니다.
- 복잡한 picker나 data grid는 아직 포함하지 않습니다.
- 제품 적용 전 `npm run check`와 package dry-run으로 배포 구성을 확인합니다.
