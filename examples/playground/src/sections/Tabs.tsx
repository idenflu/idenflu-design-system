import * as React from "react";
import { Badge, Tabs } from "@idenflu/ui-react";
import { Group, Section } from "../Section";

export function TabsSection() {
  const [tab, setTab] = React.useState("overview");
  return (
    <Section id="tabs" title="Tabs">
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
    </Section>
  );
}
