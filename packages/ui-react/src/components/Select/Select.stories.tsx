import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { MultiSelect, SearchSelect, Select } from "./Select";

const options = [
  { value: "analytics", label: "Analytics", description: "Analytics team" },
  { value: "campaigns", label: "Campaigns" },
  { value: "billing", label: "Billing", disabled: true },
  { value: "creators", label: "Creators" },
];

const meta = { title: "Components/Select", component: Select, args: { label: "Team", options } } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Search: Story = { render: () => <SearchSelect label="Team" options={options} /> };
export const Multiple: Story = { render: () => <MultiSelect label="Teams" options={options} searchable clearable /> };
export const Inline: Story = { render: () => <div style={{ width: 260 }}><MultiSelect label="Teams" options={options} presentation="inline" defaultValue={["analytics", "campaigns", "creators"]} maxVisibleTags={1} clearable searchable /></div> };
export const Sizes: Story = { render: () => <div style={{ display: "grid", gap: 16 }}>{(["sm", "md", "lg"] as const).map(size => <Select key={size} label={size} size={size} options={options} />)}</div> };
export const States: Story = { render: () => <div style={{ display: "grid", gap: 16 }}><Select label="Disabled" disabled options={options} /><Select label="Error" error="Choose a team" options={options} /><Select label="Hidden label" hideLabel options={options} /></div> };

export const KeyboardSelection: Story = {
  render: () => <Select label="Team" options={options} name="team" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveAccessibleName(/Campaigns/);
    await expect(canvasElement.querySelector('select[name="team"]')).toHaveValue("campaigns");
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
  },
};

export const SearchInteraction: Story = {
  render: () => <SearchSelect label="Team" options={options} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("combobox");
    await userEvent.type(input, "crea");
    await expect(canvas.getByRole("option", { name: /Creators/ })).toBeVisible();
    await expect(canvas.queryByRole("option", { name: /Analytics/ })).not.toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    await expect(input).toHaveValue("Creators");
  },
};

export const MultiInteraction: Story = {
  render: () => <MultiSelect label="Teams" options={options} searchable clearable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: /^Teams:/ }));
    const search = canvas.getByRole("combobox", { name: "Teams 검색" });
    await userEvent.type(search, "camp");
    await userEvent.click(canvas.getByRole("option", { name: /Campaigns/ }));
    await expect(canvas.getByRole("combobox", { name: /Teams: Campaigns/ })).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard("{Escape}");
    await userEvent.click(canvas.getByRole("button", { name: "모두 지우기" }));
    await expect(canvas.getByRole("combobox", { name: /Teams: 선택하세요/ })).toBeInTheDocument();
  },
};

export const FormReset: Story = {
  render: () => <form><Select label="Team" name="team" options={options} defaultValue="analytics" required /><button type="reset">Reset</button></form>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement); const trigger = canvas.getByRole("combobox");
    await userEvent.click(trigger); await userEvent.click(canvas.getByRole("option", { name: /Campaigns/ }));
    await expect(canvasElement.querySelector('select[name="team"]')).toHaveValue("campaigns");
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(canvasElement.querySelector('select[name="team"]')).toHaveValue("analytics");
  },
};

export const RequiredValidation: Story = {
  render: () => <form><Select label="Team" name="team" options={options} required /><button type="submit">Submit</button></form>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent("항목을 선택해주세요.");
    await expect(canvas.getByRole("combobox")).toHaveFocus();
    await expect(canvas.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  },
};

export const InlineInteraction: Story = {
  render: () => <div style={{ width: 300 }}><MultiSelect label="Teams" options={options} presentation="inline" defaultValue={["analytics", "campaigns"]} maxVisibleTags={1} clearable /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: /선택 항목 1개 더 보기/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Analytics 제거" }));
    await expect(canvas.getByRole("button", { name: "Campaigns 제거" })).toBeVisible();
    await expect(canvas.getByRole("combobox")).toHaveFocus();
  },
};
