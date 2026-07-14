import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Combobox,
  ComboboxItem,
  type ComboboxSize,
  type ComboboxVariant,
} from "./Combobox";

const variants: ComboboxVariant[] = ["default", "filled", "outlined"];
const sizes: ComboboxSize[] = ["lg", "md", "sm"];

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

function MultipleExample() {
  const [value, setValue] = React.useState<string[]>([
    "analytics",
    "campaigns",
  ]);

  return (
    <div style={overviewStyles.fullWidthExample}>
      <Combobox
        fullWidth
        helperText="Selected values render as Chip. Backspace removes the last chip."
        label="Channels"
        multiple
        options={[...demoOptions]}
        placeholder="Search channels…"
        value={value}
        variant="default"
        onValueChange={(next) => setValue(next as string[])}
      />
    </div>
  );
}

function EllipsisChipsExample() {
  const [value, setValue] = React.useState<string[]>([
    "analytics",
    "campaigns",
    "audiences",
    "creators",
    "insights",
  ]);

  return (
    <div style={overviewStyles.fullWidthExample}>
      <Combobox
        overflow="ellipsis"
        fullWidth
        helperText='overflow="ellipsis" — one line with hidden horizontal scroll.'
        label="Overflow ellipsis"
        multiple
        options={[...demoOptions]}
        placeholder="Search…"
        value={value}
        onValueChange={(next) => setValue(next as string[])}
      />
    </div>
  );
}

function SingleExample() {
  const [value, setValue] = React.useState("analytics");

  return (
    <Combobox
      helperText="Single selection closes the list after pick."
      label="Channel"
      options={[...demoOptions]}
      placeholder="Search…"
      value={value}
      variant="outlined"
      onValueChange={(next) => setValue(String(next))}
    />
  );
}

function SizeMatrix() {
  return (
    <div style={overviewStyles.row}>
      {sizes.map((size) => (
        <Combobox
          key={size}
          defaultValue={["analytics"]}
          helperText={size}
          label="Label"
          multiple
          size={size}
          variant="default"
        >
          <ComboboxItem value="analytics">Analytics</ComboboxItem>
          <ComboboxItem value="campaigns">Campaigns</ComboboxItem>
          <ComboboxItem value="audiences">Audiences</ComboboxItem>
        </Combobox>
      ))}
    </div>
  );
}

function VariantMatrix() {
  return (
    <div style={overviewStyles.row}>
      {variants.map((variant) => (
        <Combobox
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
      <Combobox
        defaultValue={["analytics"]}
        helperText="Helper Text"
        label="Enabled"
        multiple
        options={[...demoOptions]}
      />
      <Combobox
        defaultValue={["analytics"]}
        error="Error Description"
        label="Error"
        multiple
        options={[...demoOptions]}
      />
      <Combobox
        defaultValue={["analytics"]}
        disabled
        helperText="Disabled"
        label="Disabled"
        multiple
        options={[...demoOptions]}
      />
      <Combobox
        defaultValue={["analytics"]}
        helperText="Read-only"
        label="Read-only"
        multiple
        options={[...demoOptions]}
        readOnly
      />
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Combobox>;

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  parameters: {
    docs: {
      description: {
        component:
          "Searchable combobox built with Radix Popover (positioning/dismiss) and a custom listbox. " +
          "Radix has no Combobox primitive; Select cannot host a filter input reliably. " +
          "With `multiple`, selected values render as deletable Chip. " +
          "Keyboard: Arrow Up/Down, Enter, Escape, Backspace (remove last chip when input is empty).",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
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
      <p style={overviewStyles.note}>
        Prefer Combobox for type-to-filter and multi-select with chips. Use
        Select for closed-list single choice without search.
      </p>

      <OverviewSection title="Multiple + Chip">
        <MultipleExample />
      </OverviewSection>

      <OverviewSection title="Field overflow ellipsis">
        <EllipsisChipsExample />
      </OverviewSection>

      <OverviewSection title="Single">
        <SingleExample />
      </OverviewSection>

      <OverviewSection title="Size">
        <SizeMatrix />
      </OverviewSection>

      <OverviewSection title="Variant">
        <VariantMatrix />
      </OverviewSection>

      <OverviewSection title="States">
        <StatesExample />
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
    multiple: true,
    placeholder: "Search…",
    readOnly: false,
    required: false,
    size: "md",
    variant: "default",
  },
  render: (args) => {
    const [value, setValue] = React.useState<string | string[]>(
      args.multiple ? ["analytics"] : "analytics"
    );

    React.useEffect(() => {
      setValue(args.multiple ? ["analytics"] : "analytics");
    }, [args.multiple]);

    return (
      <div style={{ width: 360 }}>
        <Combobox
          {...args}
          options={[...demoOptions]}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};
