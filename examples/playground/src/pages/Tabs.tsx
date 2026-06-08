import * as React from "react";
import { Badge, Icon, Tabs } from "@idenflu/ui-react";
import { Group, Section } from "../Section";
import { Example } from "../Example";

export function TabsSection() {
  const [tab, setTab] = React.useState("overview");
  const [iconTab, setIconTab] = React.useState("inbox");
  return (
    <Section id="tabs" title="Tabs">
      <Example
        title="주요 예시 — Tabs"
        code={`<Tabs
  label="Campaign detail"
  defaultValue="overview"
  tabs={[
    { value: "overview", label: "Overview", content: <p>요약</p> },
    { value: "creators", label: "Creators", content: <p>크리에이터</p> },
  ]}
/>`}
      >
        <div style={{ flex: 1, minWidth: 320 }}>
          <Tabs
            label="Campaign detail (example)"
            defaultValue="overview"
            tabs={[
              { value: "overview", label: "Overview", content: <p>요약</p> },
              { value: "creators", label: "Creators", content: <p>크리에이터</p> },
            ]}
          />
        </div>
      </Example>
      <Group label="Controlled · 화살표 키로 이동">
        <Tabs
          label="Campaign detail"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "overview", label: "Overview", content: <p>상태 · owner · revision · due를 한 화면에서 확인합니다.</p> },
            { value: "creators", label: "Creators", content: <p>배정된 크리에이터 목록과 응답 상태입니다.</p> },
            {
              value: "audit",
              label: "Audit",
              content: (
                <p>
                  변경 이력 <Badge tone="info">3 events</Badge>
                </p>
              ),
            },
            { value: "settings", label: "Settings", content: <p>접근 권한</p>, disabled: true },
          ]}
        />
      </Group>

      <Group label="With icons">
        <Tabs
          label="Workspace"
          value={iconTab}
          onChange={setIconTab}
          tabs={[
            { value: "inbox", label: "Inbox", icon: <Icon name="icon-mail" />, content: <p>읽지 않은 알림을 확인합니다.</p> },
            { value: "files", label: "Files", icon: <Icon name="icon-file" />, content: <p>첨부 파일과 산출물입니다.</p> },
            { value: "team", label: "Team", icon: <Icon name="icon-user" />, content: <p>멤버와 권한입니다.</p> },
          ]}
        />
      </Group>

      <Group label="Overflow · 가로 스크롤">
        <Tabs
          label="Months"
          defaultValue="m1"
          tabs={Array.from({ length: 12 }, (_, i) => ({
            value: `m${i + 1}`,
            label: `${i + 1}월`,
            content: <p>{i + 1}월 캠페인 지표입니다.</p>,
          }))}
        />
      </Group>
    </Section>
  );
}
