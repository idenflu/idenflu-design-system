import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  Select,
  SelectItem,
  type SelectSize,
  type SelectVariant,
} from "./Select";

const variants: SelectVariant[] = ["standard", "filled", "outlined"];
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
    a11y: { test: "error" },
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
    variant: "outlined",
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
        or text value display. Combobox is deprecated in favor of this
        component.
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

export const ChipInteractions: Story = {
  args: {
    label: "Channels",
    multiple: true,
    defaultValue: ["analytics", "campaigns"],
    searchable: false,
    onValueChange: fn(),
  },
  parameters: {
    a11y: {
      test: "error",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const remove = canvas.getByRole("button", { name: "Remove Analytics" });
    await expect(remove.parentElement?.closest("button")).toBeNull();

    await userEvent.click(remove);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["campaigns"]);
    await expect(page.queryByRole("listbox")).not.toBeInTheDocument();
    const trigger = canvas.getByRole("button", { name: "Channels Campaigns" });
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    await expect(page.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();

    await userEvent.click(canvas.getByText("Campaigns", { selector: "span:not([hidden])" }));
    await expect(page.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole("button", { name: "Remove Campaigns" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith([]);
    await expect(canvas.getByRole("button", { name: "Channels Select" })).toHaveFocus();
    await expect(page.queryByRole("listbox")).not.toBeInTheDocument();
  },
};

export const SingleChipInteractions: Story = {
  ...ChipInteractions,
  args: {
    label: "Channel",
    defaultValue: "analytics",
    searchable: false,
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Remove Analytics" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("");
    await expect(canvas.getByRole("button", { name: "Channel Select" })).toHaveFocus();
  },
};

export const LockedChips: Story = {
  args: { onOpenChange: fn(), onValueChange: fn() },
  parameters: ChipInteractions.parameters,
  render: (args) => (
    <>
      <Select {...args} label="Disabled" helperText="Disabled helper" defaultValue="analytics" disabled />
      <Select {...args} label="Read-only" defaultValue="campaigns" readOnly />
    </>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Disabled Analytics" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Read-only Campaigns" })).toBeDisabled();
    await expect(canvas.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();
    await expect(canvas.getByRole("group", { name: "Disabled" })).toHaveAttribute("aria-disabled", "true");
    await expect(canvas.getByRole("group", { name: "Read-only" })).not.toHaveAttribute("aria-disabled");
    await expect(canvas.getByText("Disabled helper").closest('[aria-disabled="true"]')).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Disabled Analytics" }));
    await expect(within(canvasElement.ownerDocument.body).queryByRole("listbox")).not.toBeInTheDocument();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
    await expect(args.onValueChange).not.toHaveBeenCalled();
  },
};

export const RemovableChips: Story = {
  args: ChipInteractions.args,
  parameters: ChipInteractions.parameters,
};

export const NarrowDarkChips: Story = {
  ...RemovableChips,
  args: { ...ChipInteractions.args, fullWidth: true, overflow: "ellipsis" },
  parameters: {
    ...ChipInteractions.parameters,
    themes: { themeOverride: "dark" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};


export const LockedChipsDark: Story = {
  ...LockedChips,
  parameters: {
    ...LockedChips.parameters,
    themes: { themeOverride: "dark" },
  },
};


export const SearchPanel: Story = {
  decorators: [
    (Story) => <div style={{ width: 320, maxWidth: "100%" }}><Story /></div>,
  ],
  args: {
    label: "Channels",
    defaultOpen: true,
    searchable: true,
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const search = page.getByRole("textbox", { name: "Search Channels" });
    await expect(search).toHaveFocus();
    await expect(page.queryByRole("button", { name: "Clear value" })).not.toBeInTheDocument();
    await userEvent.type(search, "camp");
    await expect(page.getAllByRole("option")).toHaveLength(1);
    await expect(page.getByRole("option", { name: "Campaigns" })).toBeInTheDocument();
    const clear = page.getByRole("button", { name: "Clear value" });
    await userEvent.click(clear);
    await expect(search).toHaveValue("");
    await expect(search).toHaveFocus();
    await expect(page.getAllByRole("option")).toHaveLength(demoOptions.length);

    await userEvent.type(search, "no-matching-option");
    await expect(page.getByRole("status")).toHaveTextContent("No results");
    await expect(search).not.toHaveAttribute("aria-controls");
    await userEvent.tab();
    await expect(page.getByRole("button", { name: "Clear value" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(search).toHaveValue("");
    await expect(search).toHaveFocus();
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard("{Escape}");
    const trigger = within(canvasElement).getByRole("button", { name: "Channels Select" });
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.type(page.getByRole("textbox", { name: "Search Channels" }), "camp");
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("campaigns");
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.tab();
    const listbox = page.getByRole("listbox");
    await expect(listbox).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(listbox).toHaveAttribute("aria-activedescendant", expect.stringContaining("option-campaigns"));
  },
};

export const SearchPanelDark: Story = {
  ...SearchPanel,
  decorators: [
    (Story) => <div style={{ width: 240, maxWidth: "100%" }}><Story /></div>,
  ],
  parameters: { themes: { themeOverride: "dark" } },
};
