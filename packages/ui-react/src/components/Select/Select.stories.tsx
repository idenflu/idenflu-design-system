import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectItem,
  type SelectSize,
  type SelectVariant,
} from "./Select";

const variants: SelectVariant[] = ["default", "filled", "outlined"];
const sizes: SelectSize[] = ["lg", "md", "sm"];

const demoOptions = [
  { label: "Analytics", value: "analytics" },
  { label: "Campaigns", value: "campaigns" },
  { label: "Audiences", value: "audiences" },
  { label: "Billing", value: "billing", disabled: true },
  { label: "Creators", value: "creators" },
  { label: "Insights", value: "insights" },
  { label: "Reports", value: "reports" },
  { label: "Settings", value: "settings" },
  { label: "Help", value: "help" },
  { label: "Support", value: "support" },
] as const;

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
  note: {
    color: "var(--text-secondary)",
    font: "var(--body-md)",
    margin: 0,
    maxWidth: "640px",
  },
};

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

function SingleChipExample() {
  const [value, setValue] = React.useState("analytics");

  return (
    <div style={overviewStyles.fullWidthExample}>
      <Select
        fullWidth
        helperText="Single select uses string; chip display still available."
        label="Channel"
        options={[...demoOptions]}
        value={value}
        onValueChange={(next) => setValue(String(next))}
      />
    </div>
  );
}

function SingleTextExample() {
  const [value, setValue] = React.useState("campaigns");

  return (
    <Select
      helperText='valueDisplay="text" for plain label.'
      label="Channel"
      options={[...demoOptions]}
      value={value}
      valueDisplay="text"
      variant="outlined"
      onValueChange={(next) => setValue(String(next))}
    />
  );
}

function MultipleExample() {
  const [value, setValue] = React.useState<string[]>([
    "analytics",
    "campaigns",
  ]);

  return (
    <div style={overviewStyles.fullWidthExample}>
      <Select
        fullWidth
        helperText="Panel search filters options. Multi keeps the panel open."
        label="Channels"
        multiple
        options={[...demoOptions]}
        value={value}
        onValueChange={(next) => setValue(next as string[])}
      />
    </div>
  );
}

function NoSearchExample() {
  const [value, setValue] = React.useState("");

  return (
    <Select
      helperText="searchable={false} — button trigger only."
      label="Stage"
      options={[...demoOptions]}
      searchable={false}
      value={value}
      onValueChange={(next) => setValue(String(next))}
    />
  );
}

function SizeMatrix() {
  return (
    <div style={overviewStyles.row}>
      {sizes.map((size) => (
        <Select
          key={size}
          defaultValue="analytics"
          helperText={size}
          label="Label"
          size={size}
        >
          <SelectItem value="analytics">Analytics</SelectItem>
          <SelectItem value="campaigns">Campaigns</SelectItem>
          <SelectItem value="audiences">Audiences</SelectItem>
        </Select>
      ))}
    </div>
  );
}

function VariantMatrix() {
  return (
    <div style={overviewStyles.row}>
      {variants.map((variant) => (
        <Select
          key={variant}
          defaultValue={["campaigns"]}
          helperText={variant}
          label="Label"
          multiple
          options={[...demoOptions]}
          variant={variant}
        />
      ))}
    </div>
  );
}

function StatesExample() {
  return (
    <div style={overviewStyles.row}>
      <Select
        defaultValue="analytics"
        helperText="Helper Text"
        label="Enabled"
        options={[...demoOptions]}
      />
      <Select
        defaultValue="analytics"
        error="Error Description"
        label="Error"
        options={[...demoOptions]}
      />
      <Select
        defaultValue="analytics"
        disabled
        helperText="Disabled"
        options={[...demoOptions]}
      />
      <Select
        defaultValue="analytics"
        helperText="Read-only"
        label="Read-only"
        options={[...demoOptions]}
        readOnly
      />
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
          "Select with button trigger, optional panel search, multi-select, " +
          "and chip or text values. No Radix. " +
          "`value` / `defaultValue` / `onValueChange` use `string | string[]` " +
          "(string when single, string[] when multiple). " +
          "Prefer Select over deprecated Combobox.",
      },
    },
  },
  args: {
    label: "Label",
    multiple: false,
    options: [...demoOptions],
    placeholder: "Select",
    searchable: true,
    size: "md",
    valueDisplay: "chip",
    variant: "default",
  },
  argTypes: {
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    size: { control: "inline-radio", options: sizes },
    valueDisplay: { control: "inline-radio", options: ["chip", "text"] },
    variant: { control: "inline-radio", options: variants },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div style={overviewStyles.root}>
      <p style={overviewStyles.note}>
        Select supports single/multi selection, optional panel search, and chip
        or text value display. Combobox is deprecated in favor of this component.
      </p>
      <OverviewSection title="Single + chip (string)">
        <SingleChipExample />
      </OverviewSection>
      <OverviewSection title="Single + text">
        <SingleTextExample />
      </OverviewSection>
      <OverviewSection title="Multiple">
        <MultipleExample />
      </OverviewSection>
      <OverviewSection title="Without panel search">
        <NoSearchExample />
      </OverviewSection>
      <OverviewSection title="Sizes">
        <SizeMatrix />
      </OverviewSection>
      <OverviewSection title="Variants">
        <VariantMatrix />
      </OverviewSection>
      <OverviewSection title="States">
        <StatesExample />
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string | string[]>(
      args.multiple ? [] : ""
    );
    return (
      <Select
        {...args}
        value={value}
        onValueChange={(next) => setValue(next)}
      />
    );
  },
};
