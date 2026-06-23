import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../Icon";
import {
  Breadcrumb,
  type BreadcrumbItem as BreadcrumbItemData,
  type BreadcrumbSize,
} from "./Breadcrumb";

const sizes: BreadcrumbSize[] = ["md", "sm"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "40px",
    width: "100%",
    maxWidth: "960px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  heading: {
    color: "var(--theme-text-secondary)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  matrix: {
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "80px 1fr",
  },
  matrixLabel: {
    color: "var(--theme-text-secondary)",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
  },
  note: {
    color: "var(--theme-text-secondary)",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "680px",
  },
};

const demoItems: BreadcrumbItemData[] = [
  { id: "home", label: "Home" },
  { id: "campaigns", label: "Campaigns" },
  { id: "spring", label: "Spring Launch" },
  { id: "report", label: "Performance Report", current: true },
];

const longItems: BreadcrumbItemData[] = [
  { id: "home", label: "Home" },
  { id: "workspace", label: "Workspace" },
  { id: "audiences", label: "Audience Segments" },
  { id: "enterprise", label: "Enterprise Growth Cohort" },
  { id: "detail", label: "Activation Journey Detail", current: true },
];

function OverviewSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section style={overviewStyles.section}>
      <h3 style={overviewStyles.heading}>{title}</h3>
      {children}
    </section>
  );
}

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumb renders the current page path as an ordered text trail. It does not provide link or action behavior. Current items receive aria-current="page", and visual separators are hidden from assistive technology.',
      },
    },
  },
  argTypes: {
    size: { control: "select", options: sizes },
    maxItems: { control: "number" },
    separator: { control: "text" },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Overview: Story = {
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Size">
        <div style={overviewStyles.matrix}>
          {sizes.map((size) => (
            <React.Fragment key={size}>
              <span style={overviewStyles.matrixLabel}>{size}</span>
              <Breadcrumb items={demoItems} size={size} />
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Truncated">
        <Breadcrumb items={longItems} maxItems={3} />
      </OverviewSection>

      <OverviewSection title="Icons and Custom Separator">
        <Breadcrumb
          items={[
            {
              id: "home",
              icon: <Icon name="arrow-right" size={16} />,
              label: "Home",
            },
            { id: "settings", label: "Settings" },
            { id: "profile", label: "Profile", current: true },
          ]}
          separator=">"
        />
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Use <code>current</code> or item <code>current</code> to mark the
          active page. Breadcrumb items are text only, so keyboard focus remains
          with the page content instead of the path indicator.
        </p>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { layout: "centered" },
  args: {
    items: demoItems,
    maxItems: undefined,
    separator: "/",
    size: "md",
  },
};
