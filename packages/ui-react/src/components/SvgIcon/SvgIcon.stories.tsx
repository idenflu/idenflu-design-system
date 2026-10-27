import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import * as icons from "@idenflu/ui-react/icons";

const { PlusIcon, SearchIcon, WarningIcon, AttachIcon, FolderInputIcon } =
  icons;

const meta = {
  title: "Components/Icons",
  component: PlusIcon,
  parameters: {
    layout: "padded",
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Import individual inline SVG components from @idenflu/ui-react/icons. No sprite, provider, or stylesheet is required. " +
          "size accepts a number and defaults to 16. Color inherits currentColor. Omit label inside buttons and label the button instead. " +
          "SVG attributes, className, style and SVG refs are forwarded. Drawings cannot be replaced with children.",
      },
    },
  },
  argTypes: { size: { control: "number" }, label: { control: "text" } },
} satisfies Meta<typeof PlusIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SizesAndAccessibility: Story = {
  render: () => {
    const ref = React.useRef<SVGSVGElement>(null);
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-04)",
          color: "var(--theme-text-primary)",
        }}
      >
        <PlusIcon
          ref={ref}
          data-testid="default-icon"
          className="consumer-icon"
        />
        <SearchIcon size={14} data-testid="small-icon" />
        <AttachIcon size={20} />
        <FolderInputIcon size={24} />
        <WarningIcon
          size={20}
          label="경고"
          style={{ color: "var(--theme-text-secondary)" }}
        />
        <button
          aria-label="추가"
          onClick={() => ref.current?.setAttribute("data-ref-works", "true")}
        >
          <PlusIcon />
        </button>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const decorative = canvas.getByTestId("default-icon");
    await expect(decorative).toHaveAttribute("width", "16");
    await expect(decorative).toHaveAttribute("height", "16");
    await expect(decorative).toHaveAttribute("aria-hidden", "true");
    await expect(decorative).toHaveClass("consumer-icon");
    await expect(canvas.getByTestId("small-icon")).toHaveAttribute(
      "width",
      "14",
    );
    await expect(canvas.getByRole("img", { name: "경고" })).not.toHaveAttribute(
      "aria-hidden",
    );
    await expect(canvasElement.querySelector("use")).toBeNull();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: "추가" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(decorative).toHaveAttribute("data-ref-works", "true");
  },
};

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--spacing-04)",
        color: "var(--theme-text-primary)",
      }}
    >
      {Object.entries(icons).map(([name, Component]) => (
        <span key={name} title={name}>
          <Component size={20} label={name} />
        </span>
      ))}
    </div>
  ),
};
