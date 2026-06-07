import * as React from "react";
import { Button, Icon, IconButton } from "@idenflu/ui-react";
import { Group, Row, Section } from "../Section";

export function ButtonsSection() {
  return (
    <Section id="buttons" title="Buttons">
      <Group label="Variants">
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Row>
      </Group>
      <Group label="Sizes">
        <Row>
          <Button variant="primary" size="small">
            Small
          </Button>
          <Button variant="primary" size="medium">
            Medium
          </Button>
          <Button variant="primary" size="large">
            Large
          </Button>
        </Row>
      </Group>
      <Group label="States">
        <Row>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="secondary" selected>
            Selected
          </Button>
          <Button variant="secondary" icon={<Icon name="icon-plus" />}>
            With icon
          </Button>
        </Row>
      </Group>
      <Group label="IconButton — variants / sizes">
        <Row>
          <IconButton icon={<Icon name="icon-settings" />} label="Settings" variant="default" />
          <IconButton icon={<Icon name="icon-more" />} label="More" variant="ghost" />
          <IconButton icon={<Icon name="icon-x" />} label="Delete" variant="danger" />
          <IconButton icon={<Icon name="icon-search" />} label="Search" size="small" />
          <IconButton icon={<Icon name="icon-search" />} label="Search" size="large" />
          <IconButton icon={<Icon name="icon-check" />} label="Done" selected />
        </Row>
      </Group>
    </Section>
  );
}
