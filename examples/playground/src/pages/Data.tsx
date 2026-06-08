import * as React from "react";
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Icon, Table, TableEmptyRow, Toolbar, ToolbarGroup } from "@idenflu/ui-react";
import { Group, Row, Section } from "../Section";
import { Example } from "../Example";

function DemoTable({ density }: { density: "compact" | "comfortable" | "spacious" }) {
  return (
    <Table density={density}>
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
  );
}

export function DataSection() {
  return (
    <Section id="data" title="Data & surfaces">
      <Example
        title="주요 예시 — Card"
        code={`<Card>
  <CardHeader><strong>Campaign</strong></CardHeader>
  <CardBody>캠페인 요약입니다.</CardBody>
  <CardFooter><Button variant="quiet" size="small">Open</Button></CardFooter>
</Card>`}
      >
        <div style={{ maxWidth: 320 }}>
          <Card>
            <CardHeader>
              <strong>Campaign</strong>
            </CardHeader>
            <CardBody>캠페인 요약입니다.</CardBody>
            <CardFooter>
              <Button variant="quiet" size="small">
                Open
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Example>
      <Group label="Toolbar — default / compact / aligned">
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
        <div style={{ marginTop: 12 }}>
          <Toolbar label="Compact toolbar" density="compact" align="between">
            <Button variant="quiet" size="small">
              Left
            </Button>
            <Button variant="quiet" size="small">
              Right
            </Button>
          </Toolbar>
        </div>
      </Group>
      <Group label="Card — states">
        <Row>
          <Card>
            <CardHeader>
              <strong>Default</strong>
            </CardHeader>
            <CardBody>기본 카드입니다.</CardBody>
            <CardFooter>
              <Button variant="quiet" size="small">
                Open
              </Button>
            </CardFooter>
          </Card>
          <Card selected>
            <CardHeader>
              <strong>Selected</strong>
            </CardHeader>
            <CardBody>선택된 카드.</CardBody>
          </Card>
          <Card state="loading">
            <CardHeader>
              <strong>Loading</strong>
            </CardHeader>
            <CardBody>aria-busy 상태.</CardBody>
          </Card>
          <Card state="locked">
            <CardHeader>
              <strong>Locked</strong>
            </CardHeader>
            <CardBody>잠긴 카드.</CardBody>
          </Card>
          <Card state="error">
            <CardHeader>
              <strong>Error</strong>
            </CardHeader>
            <CardBody>오류 카드.</CardBody>
          </Card>
        </Row>
      </Group>
      <Group label="Table — densities">
        <Row>
          <div>
            <p style={{ fontSize: 12, opacity: 0.6, margin: "0 0 6px" }}>compact</p>
            <DemoTable density="compact" />
          </div>
          <div>
            <p style={{ fontSize: 12, opacity: 0.6, margin: "0 0 6px" }}>comfortable</p>
            <DemoTable density="comfortable" />
          </div>
          <div>
            <p style={{ fontSize: 12, opacity: 0.6, margin: "0 0 6px" }}>spacious</p>
            <DemoTable density="spacious" />
          </div>
        </Row>
      </Group>
    </Section>
  );
}
