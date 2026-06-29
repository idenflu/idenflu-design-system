import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip, type ChipColor, type ChipSize, type ChipVariant } from "./Chip";
import { Icon } from "../Icon/Icon";

const variants: ChipVariant[] = ["filled", "outlined"];
const colors: ChipColor[] = ["neutral", "info", "success", "warning", "error"];
const sizes: ChipSize[] = ["lg", "md", "sm"];

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
    font: "var(--title-md)",
    fontWeight: 500,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "var(--text-secondary)",
  },
  matrix: {
    alignItems: "center",
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "80px repeat(5, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  stateMatrix: {
    alignItems: "center",
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "80px repeat(2, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  matrixHeader: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    textTransform: "capitalize" as const,
  },
};

const stateColumns = [
  { id: "default", label: "Default", props: {} },
  { id: "deletable", label: "Deletable", props: { onDelete: handleDelete } },
] as const;

function handleDelete() {
  console.log("chip deleted");
}

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

type PlaygroundArgs = Omit<React.ComponentProps<typeof Chip>, "onDelete"> & {
  onDelete?: boolean;
};

const meta = {
  title: "Components/Chip",
  component: Chip,
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
    onDelete: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

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
                  color="info"
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
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({ onDelete, ...args }) => (
    <Chip {...args} onDelete={onDelete ? handleDelete : undefined} />
  ),
  args: {
    children: "Audience",
    color: "neutral",
    deleteLabel: "Delete audience chip",
    size: "md",
    startIcon: <Icon name="filter" />,
    variant: "filled",
    onDelete: true,
  },
};
