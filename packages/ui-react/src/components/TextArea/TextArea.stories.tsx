import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea, type TextAreaVariant } from "./TextArea";

const variants: TextAreaVariant[] = ["default", "filled", "outlined"];

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
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "40px",
  },
  cell: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "72px",
  },
  label: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    margin: 0,
  },
  matrix: {
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "80px repeat(3, minmax(240px, 1fr))",
    alignItems: "start",
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

function OverviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={overviewStyles.section}>
      <h3 style={overviewStyles.heading}>{title}</h3>
      {children}
    </section>
  );
}

const stateColumns = [
  { id: "enabled", label: "Enabled", props: {} },
  { id: "error", label: "Error", props: { error: "Helper Text" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
] as const;

function VariantStateMatrix() {
  return (
    <div style={overviewStyles.matrix}>
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
            <TextArea
              key={`${variant}-${column.id}`}
              defaultValue="Value"
              helperText={column.id === "enabled" ? "Helper Text" : undefined}
              label="Label"
              rows={3}
              variant={variant}
              {...column.props}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof TextArea>;

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    docs: {
      description: {
        component:
          "Visual parity with TextInput. Keyboard: Tab to focus, type to edit. " +
          "Screen readers: label via `htmlFor`; helper/error and character count use `aria-describedby`; " +
          "error state sets `aria-invalid`. Resize is disabled. Use `autoGrow` for height expansion " +
          "or fixed `rows` for static height.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    fullWidth: { control: "boolean" },
    autoGrow: { control: "boolean" },
    showCount: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
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
      <OverviewSection title="Variant x State">
        <VariantStateMatrix />
      </OverviewSection>

      <OverviewSection title="Height modes">
        <div style={overviewStyles.row}>
          <div style={overviewStyles.cell}>
            <TextArea
              defaultValue={"Fixed height\nwith rows={4}"}
              helperText="Helper Text"
              label="Fixed (rows)"
              rows={4}
            />
            <p style={overviewStyles.label}>rows=4</p>
          </div>
          <div style={overviewStyles.cell}>
            <TextArea
              autoGrow
              defaultValue={"Auto-grow\nexpands with content"}
              helperText="Helper Text"
              label="Auto-grow"
              maxRows={6}
              minRows={3}
            />
            <p style={overviewStyles.label}>autoGrow, minRows=3, maxRows=6</p>
          </div>
        </div>
      </OverviewSection>

      <OverviewSection title="Character count">
        <div style={overviewStyles.row}>
          <div style={overviewStyles.cell}>
            <TextArea
              defaultValue="Counted text"
              helperText="최대 500자"
              label="With counter"
              maxLength={500}
              showCount
            />
          </div>
          <div style={overviewStyles.cell}>
            <TextArea
              defaultValue="Counter only"
              label="Counter without helper"
              maxLength={120}
              showCount
            />
          </div>
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { layout: "centered" },
  args: {
    autoGrow: false,
    defaultValue: "Value",
    disabled: false,
    fullWidth: false,
    helperText: "Helper Text",
    label: "Label",
    maxLength: 500,
    readOnly: false,
    rows: 4,
    showCount: false,
    variant: "default",
  },
  render: (args) => {
    if (args.fullWidth) {
      return (
        <div style={{ width: "320px" }}>
          <TextArea {...args} />
        </div>
      );
    }
    return <TextArea {...args} />;
  },
};
