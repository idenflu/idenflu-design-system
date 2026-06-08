import * as React from "react";
import { Avatar, Badge, Chip } from "@idenflu/ui-react";
import { Group, Row, Section } from "../Section";
import { Example } from "../Example";

const sampleAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Crect width='48' height='48' fill='%233f6df6'/%3E%3Ctext x='24' y='31' font-size='20' fill='white' text-anchor='middle' font-family='sans-serif'%3EM%3C/text%3E%3C/svg%3E";

export function TagsSection() {
  return (
    <Section id="tags" title="Tags & identity">
      <Example
        title="주요 예시 — Badge + Chip + Avatar"
        code={`<Badge tone="success">Ready</Badge>
<Chip tone="blue" interactive onClick={() => {}}>Instagram</Chip>
<Avatar name="Mina Park" presence="online" />`}
      >
        <Badge tone="success">Ready</Badge>
        <Chip tone="blue" interactive onClick={() => {}}>
          Instagram
        </Chip>
        <Avatar name="Mina Park" presence="online" />
      </Example>
      <Group label="Badge — tones / removable / selected">
        <Row>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="info" selected>
            Selected
          </Badge>
          <Badge tone="neutral" onRemove={() => {}}>
            Removable
          </Badge>
        </Row>
      </Group>
      <Group label="Chip — tones / interactive / removable / disabled">
        <Row>
          <Chip tone="neutral">Neutral</Chip>
          <Chip tone="blue">Blue</Chip>
          <Chip tone="mint" interactive selected onClick={() => {}}>
            Selected
          </Chip>
          <Chip tone="amber" interactive onClick={() => {}}>
            Interactive
          </Chip>
          <Chip tone="coral" onRemove={() => {}}>
            Removable
          </Chip>
          <Chip tone="neutral" disabled>
            Disabled
          </Chip>
        </Row>
      </Group>
      <Group label="Avatar — image / initials / sizes / presence / unassigned">
        <Row>
          <Avatar name="Mina Park" image={sampleAvatar} label="Mina Park" />
          <Avatar name="Mina Park" size="small" />
          <Avatar name="Jiho Lee" size="medium" presence="online" />
          <Avatar name="Soo Kim" size="large" presence="busy" />
          <Avatar initials="+3" unassigned />
        </Row>
      </Group>
    </Section>
  );
}
