import * as React from "react";
import { Breadcrumb, Button, Dialog, DialogBody, DialogFooter, Drawer } from "@idenflu/ui-react";
import { Col, Group, Row, Section } from "../Section";

type DialogSize = "small" | "medium" | "large";
type DrawerSide = "left" | "right";

export function OverlaysSection() {
  const [dialogSize, setDialogSize] = React.useState<DialogSize | null>(null);
  const [drawerSide, setDrawerSide] = React.useState<DrawerSide | null>(null);

  return (
    <Section id="overlays" title="Navigation & overlays">
      <Group label="Breadcrumb">
        <Col>
          <Breadcrumb
            items={[
              { label: "Home", href: "#" },
              { label: "Campaigns", href: "#" },
              { label: "Detail", current: true },
            ]}
          />
          <Breadcrumb
            separator="›"
            items={[
              { label: "Workspace", href: "#" },
              { label: "Reviews", href: "#" },
              { label: "Q2", href: "#" },
              { label: "Campaign 042", current: true },
            ]}
          />
        </Col>
      </Group>
      <Group label="Dialog — sizes">
        <Row>
          <Button variant="primary" onClick={() => setDialogSize("small")}>
            Small dialog
          </Button>
          <Button variant="primary" onClick={() => setDialogSize("medium")}>
            Medium dialog
          </Button>
          <Button variant="primary" onClick={() => setDialogSize("large")}>
            Large dialog
          </Button>
        </Row>
        <Dialog open={dialogSize !== null} size={dialogSize ?? "medium"} onClose={() => setDialogSize(null)} title={`${dialogSize ?? ""} dialog`}>
          <DialogBody>이 작업을 진행하시겠습니까? (size: {dialogSize})</DialogBody>
          <DialogFooter>
            <Button variant="quiet" onClick={() => setDialogSize(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setDialogSize(null)}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      </Group>
      <Group label="Drawer — sides">
        <Row>
          <Button variant="secondary" onClick={() => setDrawerSide("left")}>
            Left drawer
          </Button>
          <Button variant="secondary" onClick={() => setDrawerSide("right")}>
            Right drawer
          </Button>
        </Row>
        <Drawer
          open={drawerSide !== null}
          side={drawerSide ?? "right"}
          onClose={() => setDrawerSide(null)}
          title="Filters"
          description={`side: ${drawerSide}`}
          footer={
            <Button variant="primary" onClick={() => setDrawerSide(null)}>
              Apply
            </Button>
          }
        >
          <p>사이드 패널 내용입니다.</p>
        </Drawer>
      </Group>
    </Section>
  );
}
