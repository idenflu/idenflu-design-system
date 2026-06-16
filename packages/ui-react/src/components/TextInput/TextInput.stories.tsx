import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TextInput,
  type TextInputSize,
  type TextInputType,
  type TextInputVariant,
} from "./TextInput";

const variants: TextInputVariant[] = ["default", "filled", "outlined"];
const sizes: TextInputSize[] = ["lg", "md", "sm"];
const types: TextInputType[] = ["text", "password", "email"];

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
    minWidth: "240px",
  },
  label: {
    color: "var(--theme-text-tertiary, #8792a5)",
    fontSize: "11px",
    margin: 0,
  },
  matrix: {
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "80px repeat(3, minmax(200px, 1fr))",
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

function VariantStateMatrix({ variant }: { variant: TextInputVariant }) {
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
            <TextInput
              key={`${variant}-${size}-${column.id}`}
              defaultValue="Value"
              helperText={column.id === "enabled" ? "Helper Text" : undefined}
              label="Label"
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

type PlaygroundArgs = React.ComponentProps<typeof TextInput>;

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma Input (node 84:2177). Keyboard: Tab to focus, type to edit. " +
          "Screen readers: label is associated via `htmlFor`; helper/error text uses `aria-describedby`; " +
          "error state sets `aria-invalid`. Focus ring is conveyed through the control border.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    type: { control: "select", options: types },
    fullWidth: { control: "boolean" },
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

      <OverviewSection title="Input types">
        <div style={overviewStyles.row}>
          {types.map((type) => (
            <div key={type} style={overviewStyles.cell}>
              <TextInput
                defaultValue={type === "email" ? "value@example.com" : "value"}
                helperText="Helper Text"
                label="Label"
                placeholder={
                  type === "email"
                    ? "you@example.com"
                    : type === "password"
                      ? "••••••••"
                      : "Placeholder"
                }
                type={type}
              />
              <p style={overviewStyles.label}>{type}</p>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.a11yNote}>
          Use a visible <code>label</code> (or <code>aria-label</code> when
          label is omitted). Pair validation messages with <code>error</code> so
          they are linked through <code>aria-describedby</code>. Password fields
          include a visibility toggle with <code>aria-label</code> and{" "}
          <code>aria-pressed</code>.
        </p>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { layout: "centered" },
  args: {
    defaultValue: "Value",
    disabled: false,
    fullWidth: false,
    helperText: "Helper Text",
    label: "Label",
    readOnly: false,
    size: "lg",
    type: "text",
    variant: "default",
  },
  render: (args) => {
    if (args.fullWidth) {
      return (
        <div style={{ width: "320px" }}>
          <TextInput {...args} />
        </div>
      );
    }
    return <TextInput {...args} />;
  },
};
