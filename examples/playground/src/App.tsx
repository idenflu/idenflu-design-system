import * as React from "react";
import {
  Avatar,
  Badge,
  Banner,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  Drawer,
  EmptyState,
  ErrorState,
  Icon,
  IconButton,
  IconSpriteProvider,
  iconNames,
  LoadingState,
  RadioGroup,
  SegmentedControl,
  Select,
  Skeleton,
  Switch,
  Table,
  TableEmptyRow,
  TextField,
  Textarea,
  Toolbar,
  ToolbarGroup,
} from "@idenflu/ui-react";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";

type Theme = "light" | "dark";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pg-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function App() {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [switchOn, setSwitchOn] = React.useState(true);
  const [allRows, setAllRows] = React.useState(false);
  const [seg, setSeg] = React.useState("today");
  const [radio, setRadio] = React.useState("ready");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [bannerOpen, setBannerOpen] = React.useState(true);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-if-theme", theme);
  }, [theme]);

  return (
    <IconSpriteProvider href={spriteUrl}>
      <div className="pg-shell">
        <header className="pg-topbar">
          <div>
            <h1>idenflu ui-react</h1>
            <p>로컬 플레이그라운드 — source-only 패키지를 Vite로 직접 소비합니다.</p>
          </div>
          <SegmentedControl
            label="Theme"
            value={theme}
            onChange={(v) => setTheme(v as Theme)}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </header>

        <Section title="Buttons">
          <div className="pg-row">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="pg-row">
            <Button variant="primary" size="small">
              Small
            </Button>
            <Button variant="primary" size="medium">
              Medium
            </Button>
            <Button variant="primary" size="large">
              Large
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" icon={<Icon name="icon-plus" />}>
              With icon
            </Button>
            <IconButton icon={<Icon name="icon-settings" />} label="Settings" />
          </div>
        </Section>

        <Section title="Inputs">
          <div className="pg-col">
            <TextField label="Email" placeholder="you@idenflu.com" helperText="회사 이메일을 입력하세요." />
            <TextField label="Required" required placeholder="필수 값" />
            <TextField label="Invalid" state="invalid" error="이 값은 사용할 수 없습니다." defaultValue="bad" />
            <Textarea label="Notes" placeholder="메모를 입력하세요." />
            <Select
              label="Status"
              options={[
                { value: "draft", label: "Draft" },
                { value: "review", label: "In review" },
                { value: "done", label: "Done" },
              ]}
            />
          </div>
        </Section>

        <Section title="Controls">
          <div className="pg-row">
            <div className="pg-col">
              <Switch
                label="Auto-assign reviewers"
                description="새 제출물에 즉시 적용됩니다."
                checked={switchOn}
                onChange={(e) => setSwitchOn(e.target.checked)}
              />
              <Checkbox label="Select all rows" checked={allRows} indeterminate={!allRows} onChange={(e) => setAllRows(e.target.checked)} />
              <Switch label="Disabled" disabled />
            </div>
            <div className="pg-col">
              <RadioGroup
                label="Review status"
                value={radio}
                onChange={setRadio}
                options={[
                  { value: "all", label: "All" },
                  { value: "risk", label: "Risk" },
                  { value: "ready", label: "Ready" },
                ]}
              />
              <SegmentedControl
                label="Time range"
                value={seg}
                onChange={setSeg}
                options={[
                  { value: "today", label: "Today" },
                  { value: "7d", label: "7 days" },
                  { value: "30d", label: "30 days" },
                ]}
              />
            </div>
          </div>
        </Section>

        <Section title="Tags & identity">
          <div className="pg-row">
            <Badge tone="info">Info</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Chip tone="blue">Filter</Chip>
            <Chip tone="mint" selected interactive onClick={() => {}}>
              Selected
            </Chip>
            <Chip tone="coral" onRemove={() => {}}>
              Removable
            </Chip>
          </div>
          <div className="pg-row">
            <Avatar name="Mina Park" presence="online" />
            <Avatar name="Jiho Lee" size="large" presence="busy" />
            <Avatar initials="+3" unassigned />
            <Avatar name="Search" label="Search owner" />
          </div>
        </Section>

        <Section title="Feedback">
          {bannerOpen ? (
            <Banner
              tone="warning"
              title="검토 대기 중"
              icon={<Icon name="icon-alert" />}
              action={
                <Button variant="quiet" size="small">
                  Review
                </Button>
              }
              onDismiss={() => setBannerOpen(false)}
            >
              3건의 제출물이 검토를 기다리고 있습니다.
            </Banner>
          ) : (
            <Button variant="quiet" size="small" onClick={() => setBannerOpen(true)}>
              Banner 다시 보기
            </Button>
          )}
          <div className="pg-row" style={{ marginTop: 16 }}>
            <Banner tone="info" title="Info">
              일반 안내 메시지입니다.
            </Banner>
            <Banner tone="success" title="Success">
              저장되었습니다.
            </Banner>
            <Banner tone="error" title="Error">
              저장에 실패했습니다.
            </Banner>
          </div>
          <div className="pg-row" style={{ marginTop: 16 }}>
            <LoadingState label="Loading reviewers" description="잠시만 기다려 주세요." />
            <ErrorState title="불러오기 실패" description="네트워크를 확인하세요." action={<Button variant="quiet" size="small">Retry</Button>} />
            <EmptyState title="결과 없음" description="필터를 조정해 보세요." />
          </div>
          <div className="pg-col" style={{ marginTop: 16 }}>
            <Skeleton variant="text" lines={3} />
            <div className="pg-row">
              <Skeleton variant="circle" />
              <Skeleton variant="block" width={200} height={48} />
            </div>
          </div>
        </Section>

        <Section title="Data & surfaces">
          <Toolbar label="Review toolbar">
            <ToolbarGroup>
              <Button variant="quiet" size="small" icon={<Icon name="icon-filter" />}>
                Filter
              </Button>
              <Button variant="quiet" size="small" icon={<Icon name="icon-refresh" />}>
                Refresh
              </Button>
            </ToolbarGroup>
            <ToolbarGroup align="end">
              <Button variant="primary" size="small" icon={<Icon name="icon-download" />}>
                Export
              </Button>
            </ToolbarGroup>
          </Toolbar>
          <div className="pg-row" style={{ marginTop: 16 }}>
            <Card>
              <CardHeader>
                <strong>Campaign</strong>
              </CardHeader>
              <CardBody>운영 화면 객체 요약 카드입니다.</CardBody>
              <CardFooter>
                <Button variant="quiet" size="small">
                  Open
                </Button>
              </CardFooter>
            </Card>
            <Card state="loading">
              <CardHeader>
                <strong>Loading card</strong>
              </CardHeader>
              <CardBody>aria-busy 상태입니다.</CardBody>
            </Card>
          </div>
          <Table style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mina Park</td>
                <td>
                  <Badge tone="success">Ready</Badge>
                </td>
              </tr>
              <tr>
                <td>Jiho Lee</td>
                <td>
                  <Badge tone="warning">Waiting</Badge>
                </td>
              </tr>
              <TableEmptyRow colSpan={2}>더 이상 항목이 없습니다.</TableEmptyRow>
            </tbody>
          </Table>
        </Section>

        <Section title="Navigation & overlays">
          <Breadcrumb
            items={[
              { label: "Home", href: "#" },
              { label: "Campaigns", href: "#" },
              { label: "Detail", current: true },
            ]}
          />
          <div className="pg-row" style={{ marginTop: 16 }}>
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              Open dialog
            </Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open drawer
            </Button>
          </div>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm action">
            <DialogBody>이 작업을 진행하시겠습니까?</DialogBody>
            <DialogFooter>
              <Button variant="quiet" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </DialogFooter>
          </Dialog>
          <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Filters" footer={<Button variant="primary" onClick={() => setDrawerOpen(false)}>Apply</Button>}>
            <p>사이드 패널 내용입니다.</p>
          </Drawer>
        </Section>

        <Section title="Icons">
          <div className="pg-grid">
            {iconNames.map((name) => (
              <div key={name} className="pg-icon-cell">
                <Icon name={name} size="large" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </IconSpriteProvider>
  );
}
