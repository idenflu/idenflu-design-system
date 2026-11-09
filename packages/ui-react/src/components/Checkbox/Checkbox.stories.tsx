import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";

const meta = { title: "Components/Checkbox", component: Checkbox, args: { label: "Label" } } satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
export const Indeterminate: Story = { args: { indeterminate: true } };
