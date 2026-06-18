import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Chip, type ChipColor, type ChipSize, type ChipVariant } from "./Chip";
import { Icon } from "../Icon/Icon";

const variants: ChipVariant[] = ["filled", "outlined"];
const colors: ChipColor[] = [
  "neutral",
  "primary",
  "success",
  "warning",
  "danger",
];
const sizes: ChipSize[] = ["lg", "md", "sm"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-08)",
    fontFamily: "var(--font-family-sans)",
    width: "100%",
    maxWidth: "960px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-05)",
  },
  heading: {
    color: "var(--theme-text-secondary)",
    font: "var(--label-md)",
    fontWeight: "var(--font-weight-semibold)",
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  matrix: {
    alignItems: "center",
    display: "grid",
    gap: "var(--spacing-04) var(--spacing-05)",
    gridTemplateColumns: "80px repeat(5, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  stateMatrix: {
    alignItems: "center",
    display: "grid",
    gap: "var(--spacing-04) var(--spacing-05)",
    gridTemplateColumns: "80px repeat(2, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  matrixHeader: {
    color: "var(--theme-text-tertiary)",
    font: "var(--label-md)",
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--theme-text-tertiary)",
    font: "var(--label-md)",
    textTransform: "capitalize" as const,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "var(--spacing-03)",
  },
  note: {
    color: "var(--theme-text-secondary)",
    font: "var(--body-md)",
    margin: 0,
    maxWidth: "680px",
  },
};

const stateColumns = [
  { id: "default", label: "Default", props: {} },
  { id: "deletable", label: "Deletable", props: { onDelete: fn() } },
] as const;

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

function ColorSizeMatrix({ variant }: { variant: ChipVariant }) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {colors.map((color) => (
        <span key={color} style={overviewStyles.matrixHeader}>
          {color}
        </span>
      ))}
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <span style={overviewStyles.matrixRowLabel}>{size}</span>
          {colors.map((color) => (
            <Chip
              key={`${variant}-${size}-${color}`}
              color={color}
              size={size}
              variant={variant}
            >
              {color}
            </Chip>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Chip>;

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compact status, filter, or entity label. API follows MUI Chip's icon/delete slots and " +
          "Carbon Tag's dismissible behavior, adapted to a token-only Nova style. " +
          "Deletable chips use a native button for keyboard and screen reader behavior.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    color: { control: "select", options: colors },
    size: { control: "select", options: sizes },
    deleteLabel: { control: "text" },
  },
  args: {
    onDelete: fn(),
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Overview: Story = {
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  render: () => (
    <div style={overviewStyles.root}>
      {variants.map((variant) => (
        <OverviewSection key={variant} title={`${variant} — size × color`}>
          <ColorSizeMatrix variant={variant} />
        </OverviewSection>
      ))}

      <OverviewSection title="States">
        <div style={overviewStyles.stateMatrix}>
          <div />
          {stateColumns.map((column) => (
            <span key={column.id} style={overviewStyles.matrixHeader}>
              {column.label}
            </span>
          ))}
          {variants.map((variant) => (
            <React.Fragment key={variant}>
              <span style={overviewStyles.matrixRowLabel}>{variant}</span>
              {stateColumns.map((column) => (
                <Chip
                  key={`${variant}-${column.id}`}
                  color="primary"
                  startIcon={<Icon name="filter" />}
                  variant={variant}
                  {...column.props}
                >
                  Audience
                </Chip>
              ))}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Use <code>onDelete</code> for removable filters; the delete control
          renders a native <code>button</code>. Provide <code>deleteLabel</code>{" "}
          when the label needs domain-specific screen reader text.
        </p>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Audience",
    color: "neutral",
    deleteLabel: "Delete audience chip",
    size: "md",
    startIcon: <Icon name="filter" />,
    variant: "filled",
  },
};
