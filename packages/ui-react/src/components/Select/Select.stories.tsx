import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  type SelectOption,
  type SelectSize,
  type SelectVariant,
} from "./Select";

const variants: SelectVariant[] = ["default", "filled", "outlined"];
const sizes: SelectSize[] = ["lg", "md", "sm"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "40px",
    fontFamily: "var(--if-font-family, Inter, system-ui, sans-serif)",
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
    alignItems: "start",
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "80px repeat(3, minmax(200px, 1fr))",
  },
  matrixHeader: {
    color: "var(--theme-text-tertiary)",
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--theme-text-tertiary)",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
  },
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "24px",
  },
  note: {
    color: "var(--theme-text-secondary)",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "680px",
  },
};

const stateColumns = [
  { id: "enabled", label: "Enabled", props: { helperText: "Helper Text" } },
  { id: "error", label: "Error", props: { error: "Helper Text" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
] as const;

const demoOptions: SelectOption[] = [
  { value: "analytics", label: "Analytics" },
  { value: "campaigns", label: "Campaigns" },
  { value: "audiences", label: "Audiences" },
  { value: "billing", label: "Billing", disabled: true },
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

function VariantStateMatrix({ variant }: { variant: SelectVariant }) {
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
            <Select
              key={`${variant}-${size}-${column.id}`}
              defaultValue="analytics"
              label="Label"
              size={size}
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

type PlaygroundArgs = React.ComponentProps<typeof Select>;

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
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
      {variants.map((variant) => (
        <OverviewSection key={variant} title={`${variant} — size × state`}>
          <VariantStateMatrix variant={variant} />
        </OverviewSection>
      ))}

      <OverviewSection title="Options Prop">
        <Select
          defaultValue="analytics"
          helperText="The same menu can be provided through the options prop."
          label="Label"
          options={demoOptions}
          variant="outlined"
        />
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Use a visible <code>label</code>, or provide <code>aria-label</code>{" "}
          when the visual label is omitted. Validation messages should use{" "}
          <code>error</code> so the trigger receives <code>aria-invalid</code>{" "}
          and helper text remains linked through <code>aria-describedby</code>.
        </p>
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
