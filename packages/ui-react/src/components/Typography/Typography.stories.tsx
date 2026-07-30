import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Typography,
  type TypographyAlign,
  type TypographyElement,
  type TypographyVariant,
} from "./Typography";

const variants: TypographyVariant[] = [
  "heading-lg",
  "heading-md",
  "heading-sm",
  "title-lg",
  "title-md",
  "title-sm",
  "body-lg",
  "body-md",
  "body-sm",
  "label-lg",
  "label-md",
  "caption-lg",
  "caption-md",
  "numeric-xl",
  "numeric-lg",
  "numeric-md",
  "numeric-sm",
  "numeric-xs",
];

const aligns: TypographyAlign[] = [
  "inherit",
  "left",
  "center",
  "right",
  "justify",
];

const components: TypographyElement[] = [
  "span",
  "p",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const overviewStyles = {
  root: {
    color: "var(--text-primary)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-07)",
    maxWidth: "760px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-04)",
  },
  row: {
    alignItems: "baseline",
    display: "grid",
    gap: "var(--spacing-05)",
    gridTemplateColumns: "120px minmax(0, 1fr)",
  },
  label: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
  },
  truncateBox: {
    border: "1px solid var(--border-subtle)",
    padding: "var(--spacing-04)",
    width: "280px",
  },
};

const sampleText =
  "캠페인 성과와 크리에이터 협업 현황을 한눈에 파악할 수 있습니다.";

function OverviewSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section style={overviewStyles.section}>
      <Typography component="h3" variant="title-lg">
        {title}
      </Typography>
      {children}
    </section>
  );
}

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    docs: {
      description: {
        component:
          "Token-based text primitive for consistent heading, title, body, label, caption, and numeric styles. " +
          "Only body variants render as paragraphs by default; other variants render as spans unless a semantic component is specified.",
      },
    },
  },
  argTypes: {
    align: { control: "select", options: aligns },
    component: { control: "select", options: components },
    noWrap: { control: "boolean" },
    variant: { control: "select", options: variants },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof Typography>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Variants">
        {variants.map((variant) => (
          <div key={variant} style={overviewStyles.row}>
            <span style={overviewStyles.label}>{variant}</span>
            <Typography variant={variant}>
              {variant.startsWith("numeric") ? "12,345,678" : sampleText}
            </Typography>
          </div>
        ))}
      </OverviewSection>

      <OverviewSection title="Semantic component">
        <Typography variant="heading-lg">heading-lg</Typography>
        <Typography component="h2" variant="heading-lg">
          h2로 렌더링되는 heading-lg
        </Typography>
        <Typography component="p" variant="body-md">
          heading/title variant는 기본 span이며, 제목 의미가 필요할 때
          component로 heading hierarchy를 명시합니다.
        </Typography>
      </OverviewSection>

      <OverviewSection title="No wrap">
        <div style={overviewStyles.truncateBox}>
          <Typography noWrap title={sampleText} variant="body-md">
            {sampleText}
          </Typography>
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    align: "inherit",
    children: sampleText,
    noWrap: false,
    variant: "body-md",
  },
};
