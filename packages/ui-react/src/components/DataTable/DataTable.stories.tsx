import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { DataTable, type DataTableColumn } from "./DataTable";
import { Icon } from "../Icon/Icon";
import { Chip } from "../Chip/Chip";

type CampaignRow = {
  due: string;
  id: string;
  owner: string;
  revision: string;
  status: string;
  subtitle: string;
  title: string;
  tone: "info" | "success" | "warning";
};

const campaigns: CampaignRow[] = [
  {
    due: "Today 18:00",
    id: "summer-drop",
    owner: "Mina",
    revision: "Rev 03",
    status: "Review",
    subtitle: "8 creators · Instagram reels",
    title: "Summer drop review",
    tone: "warning",
  },
  {
    due: "Jun 10",
    id: "creator-shortlist",
    owner: "Alex",
    revision: "Rev 01",
    status: "Recruit",
    subtitle: "12 profiles · beauty segment",
    title: "Creator shortlist",
    tone: "info",
  },
  {
    due: "Jun 12",
    id: "paid-social",
    owner: "Jae",
    revision: "Rev 04",
    status: "Ready",
    subtitle: "4 assets · paid usage rights",
    title: "Paid social assets",
    tone: "success",
  },
  {
    due: "Tomorrow",
    id: "june-skincare",
    owner: "Hana",
    revision: "Rev 02",
    status: "Review",
    subtitle: "6 creators · TikTok shorts",
    title: "June skincare launch",
    tone: "warning",
  },
  {
    due: "Jun 14",
    id: "back-to-school",
    owner: "Sam",
    revision: "Rev 01",
    status: "Draft",
    subtitle: "15 creators · YouTube integrations",
    title: "Back to school push",
    tone: "info",
  },
  {
    due: "Jun 15",
    id: "influencer-seeding",
    owner: "Erin",
    revision: "Rev 02",
    status: "Recruit",
    subtitle: "20 kits · lifestyle creators",
    title: "Influencer seeding wave 2",
    tone: "info",
  },
  {
    due: "Jun 16",
    id: "brand-ambassador",
    owner: "Chris",
    revision: "Rev 05",
    status: "Live",
    subtitle: "3 ambassadors · quarterly contract",
    title: "Brand ambassador program",
    tone: "success",
  },
  {
    due: "Jun 17",
    id: "ugc-contest",
    owner: "Leo",
    revision: "Rev 01",
    status: "Review",
    subtitle: "Contest entries · Instagram stories",
    title: "UGC summer contest",
    tone: "warning",
  },
  {
    due: "Jun 18",
    id: "product-launch-q3",
    owner: "Nina",
    revision: "Rev 03",
    status: "Ready",
    subtitle: "Launch assets · cross-platform",
    title: "Q3 product launch",
    tone: "success",
  },
  {
    due: "Jun 19",
    id: "micro-influencer-pool",
    owner: "Mina",
    revision: "Rev 02",
    status: "Recruit",
    subtitle: "50 profiles · nano & micro tier",
    title: "Micro influencer pool",
    tone: "info",
  },
  {
    due: "Jun 20",
    id: "holiday-preview",
    owner: "Alex",
    revision: "Rev 01",
    status: "Draft",
    subtitle: "Early concepts · holiday season",
    title: "Holiday preview campaign",
    tone: "info",
  },
  {
    due: "Jun 21",
    id: "tiktok-challenge",
    owner: "Jae",
    revision: "Rev 04",
    status: "Review",
    subtitle: "Hashtag challenge · Gen Z segment",
    title: "TikTok challenge series",
    tone: "warning",
  },
  {
    due: "Jun 22",
    id: "affiliate-push",
    owner: "Hana",
    revision: "Rev 02",
    status: "Live",
    subtitle: "Affiliate links · conversion focus",
    title: "Affiliate push June",
    tone: "success",
  },
  {
    due: "Jun 23",
    id: "podcast-sponsorship",
    owner: "Sam",
    revision: "Rev 01",
    status: "Recruit",
    subtitle: "8 podcasts · audio ads",
    title: "Podcast sponsorship bundle",
    tone: "info",
  },
  {
    due: "Jun 24",
    id: "retail-collab",
    owner: "Erin",
    revision: "Rev 03",
    status: "Review",
    subtitle: "In-store displays · 12 locations",
    title: "Retail collaboration",
    tone: "warning",
  },
  {
    due: "Jun 25",
    id: "email-creator-spotlight",
    owner: "Chris",
    revision: "Rev 02",
    status: "Ready",
    subtitle: "Newsletter feature · creator stories",
    title: "Email creator spotlight",
    tone: "success",
  },
  {
    due: "Jun 26",
    id: "sustainability-series",
    owner: "Leo",
    revision: "Rev 01",
    status: "Draft",
    subtitle: "ESG messaging · long-form content",
    title: "Sustainability content series",
    tone: "info",
  },
  {
    due: "Jun 27",
    id: "flash-sale-promo",
    owner: "Nina",
    revision: "Rev 05",
    status: "Live",
    subtitle: "48-hour sale · urgency creatives",
    title: "Flash sale promotion",
    tone: "success",
  },
  {
    due: "Jun 28",
    id: "creator-workshop",
    owner: "Mina",
    revision: "Rev 01",
    status: "Recruit",
    subtitle: "Virtual event · 30 invitees",
    title: "Creator workshop invite",
    tone: "info",
  },
  {
    due: "Jun 29",
    id: "reels-remix",
    owner: "Alex",
    revision: "Rev 03",
    status: "Review",
    subtitle: "Remix trend · brand audio",
    title: "Reels remix campaign",
    tone: "warning",
  },
  {
    due: "Jun 30",
    id: "loyalty-refresh",
    owner: "Jae",
    revision: "Rev 02",
    status: "Ready",
    subtitle: "Member perks · loyalty tier update",
    title: "Loyalty program refresh",
    tone: "success",
  },
  {
    due: "Jul 1",
    id: "independence-day",
    owner: "Hana",
    revision: "Rev 01",
    status: "Draft",
    subtitle: "Seasonal promo · US market",
    title: "Independence Day promo",
    tone: "info",
  },
  {
    due: "Jul 2",
    id: "unboxing-series",
    owner: "Sam",
    revision: "Rev 04",
    status: "Recruit",
    subtitle: "10 creators · unboxing format",
    title: "Unboxing video series",
    tone: "info",
  },
  {
    due: "Jul 3",
    id: "community-ama",
    owner: "Erin",
    revision: "Rev 02",
    status: "Review",
    subtitle: "Live AMA · community managers",
    title: "Community AMA session",
    tone: "warning",
  },
  {
    due: "Jul 4",
    id: "paid-search-sync",
    owner: "Chris",
    revision: "Rev 01",
    status: "Live",
    subtitle: "Search ads · landing page sync",
    title: "Paid search sync",
    tone: "success",
  },
  {
    due: "Jul 5",
    id: "wholesale-outreach",
    owner: "Leo",
    revision: "Rev 03",
    status: "Recruit",
    subtitle: "B2B partners · wholesale channel",
    title: "Wholesale partner outreach",
    tone: "info",
  },
  {
    due: "Jul 6",
    id: "app-install-push",
    owner: "Nina",
    revision: "Rev 02",
    status: "Ready",
    subtitle: "App installs · performance creatives",
    title: "App install push",
    tone: "success",
  },
  {
    due: "Jul 7",
    id: "creator-contract-renewal",
    owner: "Mina",
    revision: "Rev 06",
    status: "Review",
    subtitle: "Contract renewals · top 15 creators",
    title: "Creator contract renewal",
    tone: "warning",
  },
  {
    due: "Jul 8",
    id: "regional-expansion-kr",
    owner: "Alex",
    revision: "Rev 01",
    status: "Draft",
    subtitle: "KR market · localized creators",
    title: "Regional expansion KR",
    tone: "info",
  },
  {
    due: "Jul 9",
    id: "year-end-wrap",
    owner: "Jae",
    revision: "Rev 02",
    status: "Draft",
    subtitle: "Planning doc · annual recap",
    title: "Year-end campaign wrap",
    tone: "info",
  },
];

const campaignColumns: DataTableColumn<CampaignRow>[] = [
  {
    id: "campaign",
    header: "Campaign",
    render: (row) => (
      <>
        <strong>{row.title}</strong>
        <br />
        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
          {row.subtitle}
        </span>
      </>
    ),
  },
  {
    id: "status",
    header: "Status",
    render: (row) => (
      <Chip color={row.tone} size="sm">
        {row.status}
      </Chip>
    ),
  },
  {
    id: "owner",
    accessor: "owner",
    header: "Owner",
  },
  {
    id: "revision",
    accessor: "revision",
    header: "Revision",
  },
  {
    id: "due",
    accessor: "due",
    header: "Due",
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
          "Client pagination is uncontrolled by default (pass pageSizeOptions only). " +
          "Server pagination uses controlled page/pageSize with manualPagination.",
      },
    },
  },
  title: "Components/DataTable",
} satisfies Meta<typeof DataTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "ClientPagination",
  render: () => {
    const total = campaigns.length;

    return (
      <DataTable defaultPageSize={10}>
        <DataTable.Header>
          <DataTable.HeaderContent>
            <DataTable.Title>Campaign review queue</DataTable.Title>
            <DataTable.Description>
              Client pagination — page and pageSize are owned by DataTable.
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
        <DataTable.Content
          columns={campaignColumns}
          getRowId={(row) => row.id}
          rows={campaigns}
        />
        <DataTable.Footer>
          <DataTable.RowCount itemLabel="campaigns" />
          <DataTable.Pagination
            aria-label="Campaign table pages"
            pageSizeOptions={[10, 25, 50, 100, { label: "All", value: total }]}
          />
        </DataTable.Footer>
      </DataTable>
    );
  },
};

export const ServerPagination: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const total = campaigns.length;
    const pageRows = campaigns.slice((page - 1) * pageSize, page * pageSize);

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.HeaderContent>
            <DataTable.Title>Campaign review queue</DataTable.Title>
            <DataTable.Description>
              Server pagination — parent owns page state and supplies the
              current page rows.
            </DataTable.Description>
          </DataTable.HeaderContent>
        </DataTable.Header>
        <DataTable.Content
          columns={campaignColumns}
          getRowId={(row) => row.id}
          manualPagination
          rows={pageRows}
          total={total}
        />
        <DataTable.Footer>
          <DataTable.RowCount itemLabel="campaigns" />
          <DataTable.Pagination
            aria-label="Campaign table pages"
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            page={page}
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
    <DataTable aria-label="Compact campaign table" defaultPageSize={10}>
      <DataTable.Header>
        <DataTable.HeaderContent>
          <DataTable.Title>Compact queue</DataTable.Title>
          <DataTable.Description>
            Showing the latest visible rows.
          </DataTable.Description>
        </DataTable.HeaderContent>
      </DataTable.Header>
      <DataTable.Content
        columns={campaignColumns}
        getRowId={(row) => row.id}
        rows={campaigns}
      />
      <DataTable.Footer>
        <DataTable.RowCount itemLabel="campaigns" />
        <DataTable.Pagination aria-label="Compact campaign pages" />
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
      <DataTable.Content
        columns={campaignColumns}
        getRowId={(row) => row.id}
        rows={campaigns}
      />
      <DataTable.Footer>
        <DataTable.RowCount itemLabel="campaigns" />
        <DataTable.Pagination aria-label="Accessible table pages" />
      </DataTable.Footer>
    </DataTable>
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable aria-label="Empty campaign table">
      <DataTable.Header>
        <DataTable.HeaderContent>
          <DataTable.Title>Campaign review queue</DataTable.Title>
          <DataTable.Description>
            No campaigns match the current filters.
          </DataTable.Description>
        </DataTable.HeaderContent>
      </DataTable.Header>
      <DataTable.Content
        columns={campaignColumns}
        emptyMessage="No campaigns found."
        rows={[]}
      />
      <DataTable.Footer>
        <DataTable.RowCount itemLabel="campaigns" />
      </DataTable.Footer>
    </DataTable>
  ),
};
