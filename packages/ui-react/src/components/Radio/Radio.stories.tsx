import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "./Radio";

const meta = { title: "Components/Radio", component: Radio, args: { label: "Label" } } satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };
