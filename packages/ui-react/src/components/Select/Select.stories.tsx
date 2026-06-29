import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select, type SelectSize, type SelectVariant } from "./Select";

const variants: SelectVariant[] = ["default", "filled", "outlined"];
const sizes: SelectSize[] = ["lg", "md", "sm"];

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
    gridTemplateColumns: "80px repeat(3, minmax(200px, 1fr))",
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
  { id: "enabled", label: "Enabled", props: {} },
  { id: "error", label: "Error", props: { error: "Error Description" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
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

function renderDemoItems() {
  return (
    <>
      <option value="analytics">Analytics</option>
      <option value="campaigns">Campaigns</option>
      <option value="audiences">Audiences</option>
      <option value="billing" disabled>
        Billing
      </option>
    </>
  );
}

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
            <Select
              key={`${variant}-${column.id}`}
              defaultValue="analytics"
              label="Label"
              size="md"
              variant={variant}
              {...column.props}
            >
              {renderDemoItems()}
            </Select>
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
        <Select
          key={size}
          defaultValue="analytics"
          helperText={size}
          label="Label"
          size={size}
          variant="default"
        >
          {renderDemoItems()}
        </Select>
      ))}
    </div>
  );
}

function FullWidthExample() {
  return (
    <div style={overviewStyles.fullWidthExample}>
      <Select
        defaultValue="analytics"
        fullWidth
        label="Label"
        variant="default"
      >
        {renderDemoItems()}
      </Select>
    </div>
  );
}

function HelperTextExample() {
  return (
    <div style={overviewStyles.row}>
      <Select
        defaultValue="analytics"
        helperText="Helper Text"
        label="Label"
        variant="default"
      >
        {renderDemoItems()}
      </Select>
      <Select
        defaultValue="analytics"
        error="Helper Text"
        label="Label"
        variant="default"
      >
        {renderDemoItems()}
      </Select>
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Select>;

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          "Figma Input/Menu visual treatment adapted to a native select element. " +
          "Keyboard and screen reader behavior follows the platform <select>/<option> semantics. " +
          "Helper/error text is connected with aria-describedby and error state sets aria-invalid.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
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
    </div>
  ),
};

export const Playground: Story = {
  parameters: { layout: "centered" },
  args: {
    disabled: false,
    fullWidth: false,
    helperText: "Helper Text",
    label: "Label",
    placeholder: "Select",
    readOnly: false,
    size: "md",
    variant: "default",
  },
  render: (args) => (
    <Select {...args}>
      <option value="analytics">Analytics</option>
      <option value="campaigns">Campaigns</option>
      <option value="audiences">Audiences</option>
      <option value="billing" disabled>
        Billing
      </option>
    </Select>
  ),
};
