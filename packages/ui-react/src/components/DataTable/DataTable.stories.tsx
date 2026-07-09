import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Badge } from "../Badge";
import { Button } from "../Button/Button";
import { DataTable } from "./DataTable";
import { Icon } from "../Icon/Icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "../Table";

const campaigns = [
  {
    due: "Today 18:00",
    id: "summer-drop",
    owner: "Mina",
    revision: "Rev 03",
    status: "Review",
    subtitle: "8 creators · Instagram reels",
    title: "Summer drop review",
    tone: "warning" as const,
  },
  {
    due: "Jun 10",
    id: "creator-shortlist",
    owner: "Alex",
    revision: "Rev 01",
    status: "Recruit",
    subtitle: "12 profiles · beauty segment",
    title: "Creator shortlist",
    tone: "info" as const,
  },
  {
    due: "Jun 12",
    id: "paid-social",
    owner: "Jae",
    revision: "Rev 04",
    status: "Ready",
    subtitle: "4 assets · paid usage rights",
    title: "Paid social assets",
    tone: "success" as const,
  },
  {
    due: "Tomorrow",
    id: "june-skincare",
    owner: "Hana",
    revision: "Rev 02",
    status: "Review",
    subtitle: "6 creators · TikTok shorts",
    title: "June skincare launch",
    tone: "warning" as const,
  },
];

const meta = {
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Compound data table shell for structured row and column content. " +
          "Compose header metadata, table body, and footer pagination with subcomponents.",
      },
    },
  },
  title: "Components/DataTable",
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

function CampaignTable() {
  return (
    <Table density="comfortable">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Campaign</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Owner</TableHeaderCell>
          <TableHeaderCell>Revision</TableHeaderCell>
          <TableHeaderCell>Due</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.id}>
            <TableCell>
              <strong>{campaign.title}</strong>
              <br />
              <span
                style={{ color: "var(--text-secondary)", fontSize: "13px" }}
              >
                {campaign.subtitle}
              </span>
            </TableCell>
            <TableCell>
              <Badge tone={campaign.tone}>{campaign.status}</Badge>
            </TableCell>
            <TableCell>{campaign.owner}</TableCell>
            <TableCell>{campaign.revision}</TableCell>
            <TableCell>{campaign.due}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const Default: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(25);
    const total = 128;
    const isShowingAllRows = pageSize >= total;
    const pageCount = isShowingAllRows
      ? 1
      : Math.max(1, Math.ceil(total / pageSize));

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.HeaderContent>
            <DataTable.Title>Campaign review queue</DataTable.Title>
            <DataTable.Description>
              24 campaigns · filtered by review stage · updated 2 min ago
            </DataTable.Description>
          </DataTable.HeaderContent>
          <DataTable.Actions>
            <Button
              size="sm"
              startIcon={<Icon name="filter" />}
              variant="ghost"
            >
              Status
            </Button>
            <Button size="sm" variant="ghost">
              Owner
            </Button>
            <Button
              size="sm"
              startIcon={<Icon name="download" />}
              variant="outlined"
            >
              Export
            </Button>
          </DataTable.Actions>
        </DataTable.Header>
        <DataTable.Content>
          <CampaignTable />
        </DataTable.Content>
        <DataTable.Footer>
          <DataTable.RowCount total={total} itemLabel="campaigns" />
          <DataTable.Pagination
            aria-label="Campaign table pages"
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            page={page}
            pageCount={pageCount}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100, { label: "All", value: total }]}
          />
        </DataTable.Footer>
      </DataTable>
    );
  },
};

export const CompoundAliases: Story = {
  render: () => (
    <DataTable aria-label="Compact campaign table">
      <DataTable.Header>
        <DataTable.HeaderContent>
          <DataTable.Title>Compact queue</DataTable.Title>
          <DataTable.Description>
            Showing the latest visible rows.
          </DataTable.Description>
        </DataTable.HeaderContent>
      </DataTable.Header>
      <DataTable.Content>
        <CampaignTable />
      </DataTable.Content>
      <DataTable.Footer>
        <DataTable.RowCount total={24} itemLabel="campaigns" />
        <DataTable.Pagination
          aria-label="Compact campaign pages"
          onPageChange={fn()}
          onPageSizeChange={fn()}
          page={2}
          pageCount={6}
          pageSize={25}
        />
      </DataTable.Footer>
    </DataTable>
  ),
};

export const AccessibilityNotes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "DataTable.Title and DataTable.Description wire aria-labelledby on the region. " +
          "Pagination renders a nav landmark with labelled previous/next controls and native page selectors.",
      },
    },
  },
  render: () => (
    <DataTable>
      <DataTable.Header>
        <DataTable.HeaderContent>
          <DataTable.Title>Accessible table shell</DataTable.Title>
          <DataTable.Description>
            Region name comes from the title and description pair.
          </DataTable.Description>
        </DataTable.HeaderContent>
      </DataTable.Header>
      <DataTable.Content>
        <CampaignTable />
      </DataTable.Content>
      <DataTable.Footer>
        <DataTable.RowCount total={4} itemLabel="campaigns" />
        <DataTable.Pagination
          aria-label="Accessible table pages"
          page={1}
          pageCount={1}
        />
      </DataTable.Footer>
    </DataTable>
  ),
};
