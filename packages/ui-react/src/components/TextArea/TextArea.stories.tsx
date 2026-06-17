import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TextArea,
  type TextAreaSize,
  type TextAreaVariant,
} from "./TextArea";

const variants: TextAreaVariant[] = ["default", "filled", "outlined"];
const sizes: TextAreaSize[] = ["lg", "md", "sm"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "40px",
    fontFamily: "var(Inter, system-ui, sans-serif)",
    width: "100%",
    maxWidth: "960px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  heading: {
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "var(--theme-text-secondary, #566173)",
  },
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "24px",
  },
  cell: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "280px",
  },
  label: {
    color: "var(--theme-text-tertiary, #8792a5)",
    fontSize: "11px",
    margin: 0,
  },
  matrix: {
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "80px repeat(3, minmax(240px, 1fr))",
    alignItems: "start",
  },
  matrixHeader: {
    color: "var(--theme-text-tertiary, #8792a5)",
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--theme-text-tertiary, #8792a5)",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
  },
  a11yNote: {
    color: "var(--theme-text-secondary, #566173)",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "640px",
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

function VariantStateMatrix({ variant }: { variant: TextAreaVariant }) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {stateColumns.map((column) => (
        <span key={column.id} style={overviewStyles.matrixHeader}>
          {column.label}
        </span>
      ))}
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <span style={overviewStyles.matrixRowLabel}>{size}</span>
          {stateColumns.map((column) => (
            <TextArea
              key={`${variant}-${size}-${column.id}`}
              defaultValue="Value"
              helperText={column.id === "enabled" ? "Helper Text" : undefined}
              label="Label"
              rows={3}
              size={size}
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
  tags: ["autodocs"],
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
    size: { control: "select", options: sizes },
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
      {variants.map((variant) => (
        <OverviewSection key={variant} title={`${variant} — size × state`}>
          <VariantStateMatrix variant={variant} />
        </OverviewSection>
      ))}

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

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.a11yNote}>
          Use a visible <code>label</code> (or <code>aria-label</code> when
          label is omitted). Pair validation messages with <code>error</code> so
          they are linked through <code>aria-describedby</code>. When{" "}
          <code>showCount</code> is enabled, pass <code>maxLength</code> and the
          counter is included in <code>aria-describedby</code> with{" "}
          <code>aria-live=&quot;polite&quot;</code>.
        </p>
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
    size: "lg",
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
