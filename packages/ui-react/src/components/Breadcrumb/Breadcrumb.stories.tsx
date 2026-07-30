import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../Icon";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  type BreadcrumbItem as BreadcrumbItemData,
  type BreadcrumbSize,
} from "./Breadcrumb";
import { Divider } from "../Divider";

const sizes: BreadcrumbSize[] = ["md", "sm"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    gap: "40px",
    fontFamily: "var(--if-font-family, Inter, system-ui, sans-serif)",
    padding: "0 120px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  heading: {
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "#566173",
  },
  matrix: {
    display: "grid",
    gap: "20px 40px",
    gridTemplateColumns: "80px 1fr",
    alignItems: "center",
    justifyItems: "center",
  },
  matrixLabel: {
    color: "#8792a5",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
    width: "100%",
    textAlign: "left" as const,
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

      <Divider flexItem fullWidth />

      <OverviewSection title="Truncated">
        <Breadcrumb items={longItems} maxItems={3} />
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Icons and Custom Separator">
        <Breadcrumb
          items={[
            {
              id: "home",
              icon: <Icon name="star" size={16} />,
              label: "Home",
            },
            {
              id: "settings",
              icon: <Icon name="star" size={16} />,
              label: "Settings",
            },
            {
              id: "profile",
              icon: <Icon name="star" size={16} />,
              label: "Profile",
              current: true,
            },
          ]}
          separator=">"
        />
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

export const Composition: Story = {
  parameters: { layout: "centered" },
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem label="Home" />
        <BreadcrumbSeparator />
        <BreadcrumbItem label="Campaigns" />
        <BreadcrumbSeparator />
        <BreadcrumbItem current label="Performance Report" />
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
