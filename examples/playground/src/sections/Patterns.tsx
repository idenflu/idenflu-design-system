import * as React from "react";
import {
  Avatar,
  Badge,
  Banner,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Chip,
  Icon,
  IconButton,
  SegmentedControl,
  Select,
  Skeleton,
  Switch,
  Table,
  TextField,
  Textarea,
  Toolbar,
  ToolbarGroup,
} from "@idenflu/ui-react";
import { Group, Section } from "../Section";

const channelOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X (잠금)", disabled: true },
];

/** A real composition card constrained to a readable column width. */
function Panel({ children, width = 380 }: { children: React.ReactNode; width?: number }) {
  return <div style={{ flex: `1 1 ${width}px`, maxWidth: width, minWidth: 280 }}>{children}</div>;
}

export function PatternsSection() {
  const [digest, setDigest] = React.useState("weekly");
  const [view, setView] = React.useState("table");
  const [channel, setChannel] = React.useState("instagram");

  return (
    <Section id="patterns" title="Patterns (compositions)">
      <p className="pg-section-note">
        실제 화면에서 컴포넌트가 어떻게 조합되는지 보여주는 예시입니다. 단일 컴포넌트보다 조합 맥락이 디자인 의도를 더 잘 드러냅니다.
      </p>

      <Group label="Settings panel · Switch + Select + Card">
        <div className="pg-row">
          <Panel>
            <Card>
              <CardHeader>
                <strong>Notification settings</strong>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: 14 }}>
                  <Switch label="Auto-assign reviewers" defaultChecked description="제출 즉시 담당자를 배정합니다." />
                  <Switch label="Email me on rejection" helperText="반려 시에만 메일을 받습니다." />
                  <Select
                    label="Digest frequency"
                    value={digest}
                    onChange={(e) => setDigest(e.target.value)}
                    options={[
                      { value: "daily", label: "Daily" },
                      { value: "weekly", label: "Weekly" },
                      { value: "off", label: "Off" },
                    ]}
                  />
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="quiet" size="small">
                  Cancel
                </Button>
                <Button variant="primary" size="small">
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </Panel>

          <Panel>
            <Card>
              <CardHeader>
                <strong>Review queue</strong>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: 14 }}>
                  {[
                    { name: "Mina Park", presence: "online" as const, tone: "warning" as const, status: "Review pending" },
                    { name: "Jiho Lee", presence: "busy" as const, tone: "success" as const, status: "Approved" },
                  ].map((row) => (
                    <div key={row.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar name={row.name} presence={row.presence} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong>{row.name}</strong>
                          <Badge tone={row.tone}>{row.status}</Badge>
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                          <Chip tone="blue">Instagram</Chip>
                          <Chip tone="mint">Reels</Chip>
                        </div>
                      </div>
                      <IconButton icon={<Icon name="icon-check" />} label={`Approve ${row.name}`} variant="default" />
                      <IconButton icon={<Icon name="icon-x" />} label={`Reject ${row.name}`} variant="danger" />
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Panel>
        </div>
      </Group>

      <Group label="Filtered data view · Toolbar + SegmentedControl + Chip + Table">
        <Card>
          <Toolbar label="Campaign filters">
            <ToolbarGroup>
              <SegmentedControl
                label="View"
                size="small"
                value={view}
                onChange={setView}
                options={[
                  { value: "table", label: "Table" },
                  { value: "grid", label: "Grid" },
                ]}
              />
              <Chip tone="blue" interactive selected onClick={() => {}}>
                Instagram
              </Chip>
              <Chip tone="neutral" interactive onClick={() => {}}>
                TikTok
              </Chip>
            </ToolbarGroup>
            <ToolbarGroup align="end">
              <Button variant="primary" size="small" icon={<Icon name="icon-download" />}>
                Export
              </Button>
            </ToolbarGroup>
          </Toolbar>
          <div style={{ marginTop: 12 }}>
            <Table density="compact">
              <thead>
                <tr>
                  <th>Creator</th>
                  <th>Channel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Mina Park</td>
                  <td>Instagram</td>
                  <td>
                    <Badge tone="success">Ready</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Jiho Lee</td>
                  <td>Instagram</td>
                  <td>
                    <Badge tone="warning">Waiting</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Soo Kim</td>
                  <td>TikTok</td>
                  <td>
                    <Badge tone="danger">Blocked</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card>
      </Group>

      <Group label="Create form · validation summary + fields">
        <div className="pg-row">
          <Panel width={420}>
            <Card>
              <CardHeader>
                <strong>Create campaign</strong>
              </CardHeader>
              <CardBody>
                <div style={{ display: "grid", gap: 14 }}>
                  <Banner tone="error" title="2개 항목을 확인하세요" icon={<Icon name="icon-alert" />}>
                    필수 항목이 비어 있거나 올바르지 않습니다.
                  </Banner>
                  <TextField label="Campaign name" required state="invalid" error="이름을 입력하세요." placeholder="2026 Spring" />
                  <Select
                    label="Channel"
                    required
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    options={channelOptions}
                  />
                  <Textarea label="Brief" placeholder="캠페인 개요를 입력하세요." />
                  <Checkbox label="게시 전 검토 정책에 동의합니다." />
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="quiet" size="small">
                  Cancel
                </Button>
                <Button variant="primary" size="small">
                  Create
                </Button>
              </CardFooter>
            </Card>
          </Panel>

          <Panel>
            <Card>
              <CardHeader>
                <strong>Loading…</strong>
              </CardHeader>
              <CardBody>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skeleton variant="circle" />
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" lines={2} />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <Skeleton variant="text" lines={3} />
                </div>
              </CardBody>
            </Card>
          </Panel>
        </div>
      </Group>
    </Section>
  );
}
