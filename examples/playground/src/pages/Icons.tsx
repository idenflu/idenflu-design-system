import * as React from "react";
import { Icon, iconNames } from "@idenflu/ui-react";
import { Group, Row, Section } from "../Section";
import { Example } from "../Example";

export function IconsSection() {
  return (
    <Section id="icons" title="Icons">
      <Example
        title="주요 예시 — 크기 / currentColor"
        code={`<Icon name="icon-search" size="large" />
<span style={{ color: "var(--if-color-primary)" }}>
  <Icon name="icon-check" size="large" />
</span>`}
      >
        <Icon name="icon-search" size="large" />
        <span style={{ color: "var(--if-color-primary)" }}>
          <Icon name="icon-check" size="large" />
        </span>
      </Example>
      <Group label="Sizes / color (currentColor)">
        <Row>
          <Icon name="icon-search" size="small" />
          <Icon name="icon-search" size="medium" />
          <Icon name="icon-search" size="large" />
          <span style={{ color: "var(--if-color-primary)" }}>
            <Icon name="icon-check" size="large" />
          </span>
          <span style={{ color: "var(--if-color-error)" }}>
            <Icon name="icon-alert" size="large" />
          </span>
          <Icon name="icon-user" label="User" size="large" />
        </Row>
      </Group>
      <Group label={`All symbols (${iconNames.length})`}>
        <div className="pg-grid">
          {iconNames.map((name) => (
            <div key={name} className="pg-icon-cell">
              <Icon name={name} size="large" />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </Group>
    </Section>
  );
}
