import * as React from "react";
import { Checkbox, RadioGroup, SegmentedControl, Switch } from "@idenflu/ui-react";
import { Col, Group, Row, Section } from "../Section";
import { Example } from "../Example";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "risk", label: "Risk" },
  { value: "ready", label: "Ready", description: "검토가 끝난 항목" },
];

export function ControlsSection() {
  const [switchOn, setSwitchOn] = React.useState(true);
  const [checked, setChecked] = React.useState(false);
  const [vRadio, setVRadio] = React.useState("ready");
  const [hRadio, setHRadio] = React.useState("all");
  const [seg, setSeg] = React.useState("today");
  const [view, setView] = React.useState("table");

  return (
    <Section id="controls" title="Controls">
      <Example
        title="주요 예시 — Switch + Checkbox"
        code={`<Switch label="Auto-assign reviewers" defaultChecked />
<Checkbox label="검토 정책에 동의합니다" />`}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Switch label="Auto-assign reviewers" defaultChecked />
          <Checkbox label="검토 정책에 동의합니다" />
        </div>
      </Example>
      <Group label="Switch & Checkbox">
        <Row>
          <Col>
            <Switch label="Medium" checked={switchOn} onChange={(e) => setSwitchOn(e.target.checked)} description="즉시 적용되는 설정" />
            <Switch label="Small" size="small" defaultChecked />
            <Switch label="Disabled" disabled />
          </Col>
          <Col>
            <Checkbox label="Checked" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <Checkbox label="Indeterminate" indeterminate />
            <Checkbox label="With description" description="부가 설명이 붙는 경우" defaultChecked />
            <Checkbox label="Disabled" disabled />
          </Col>
        </Row>
      </Group>
      <Group label="RadioGroup — vertical / horizontal">
        <Row>
          <RadioGroup label="Review status" value={vRadio} onChange={setVRadio} options={statusOptions} />
          <RadioGroup
            label="Inline"
            orientation="horizontal"
            value={hRadio}
            onChange={setHRadio}
            options={[
              { value: "all", label: "All" },
              { value: "mine", label: "Mine" },
              { value: "team", label: "Team", disabled: true },
            ]}
          />
        </Row>
      </Group>
      <Group label="SegmentedControl — sizes / icons / disabled">
        <Row>
          <SegmentedControl
            label="Time range"
            value={seg}
            onChange={setSeg}
            options={[
              { value: "today", label: "Today" },
              { value: "7d", label: "7 days" },
              { value: "30d", label: "30 days", disabled: true },
            ]}
          />
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
        </Row>
      </Group>
    </Section>
  );
}
