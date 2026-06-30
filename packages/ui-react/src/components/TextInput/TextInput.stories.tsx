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
  fullWidthExample: {
    maxWidth: "100%",
    width: "640px",
  },
  matrix: {
    alignItems: "start",
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "80px repeat(5, minmax(200px, 1fr))",
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
  { id: "required", label: "Required", props: { required: true } },
  { id: "read-only", label: "Read-only", props: { readOnly: true } },
  { id: "error", label: "Error", props: { error: "Error Description" } },
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
            <TextInput
              key={`${variant}-${column.id}`}
              defaultValue="Value"
              label="Label"
              size="md"
              variant={variant}
              {...column.props}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function SizeDefaultMatrix() {
  return (
    <div style={overviewStyles.row}>
      {sizes.map((size) => (
        <TextInput
          key={size}
          defaultValue="Value"
          helperText={size}
          label="Label"
          size={size}
          variant="default"
        />
      ))}
    </div>
  );
}

function FullWidthExample() {
  return (
    <div style={overviewStyles.fullWidthExample}>
      <TextInput defaultValue="Value" fullWidth label="Label" variant="default" />
    </div>
  );
}

function HelperTextExample() {
  return (
    <div style={overviewStyles.row}>
      <TextInput
        defaultValue="Value"
        helperText="Helper Text"
        label="Label"
        variant="default"
      />
      <TextInput
        defaultValue="Value"
        error="Helper Text"
        label="Label"
        variant="default"
      />
    </div>
  );
}

function TypeExample() {
  return (
    <div style={overviewStyles.row}>
      {types.map((type) => (
        <TextInput
          key={type}
          defaultValue={type === "email" ? "value@example.com" : "Value"}
          helperText={type}
          label="Label"
          placeholder={
            type === "email"
              ? "you@example.com"
              : type === "password"
                ? "Password"
                : "Placeholder"
          }
          type={type}
          variant="default"
        />
      ))}
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof TextInput>;

const meta = {
  title: "Components/TextInput",
  component: TextInput,
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
    required: { control: "boolean" },
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

      <OverviewSection title="Size">
        <SizeDefaultMatrix />
      </OverviewSection>

      <OverviewSection title="FullWidth">
        <FullWidthExample />
      </OverviewSection>

      <OverviewSection title="Helper Text">
        <HelperTextExample />
      </OverviewSection>

      <OverviewSection title="Type">
        <TypeExample />
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
    required: false,
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
