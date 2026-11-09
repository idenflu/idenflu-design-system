import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  Chip,
  type ChipColor,
  type ChipShape,
  type ChipSize,
  type ChipVariant,
} from "./Chip";
import { Icon } from "../Icon/Icon";

const variants: ChipVariant[] = ["filled", "outlined", "ghost"];
const colors: ChipColor[] = ["neutral", "info", "success", "warning", "error"];
const shapes: ChipShape[] = ["rounded", "pill"];
const sizes: ChipSize[] = ["sm", "md", "lg"];

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
    font: "300 var(--font-size-body)/var(--line-height-body) var(--font-family-body)",
    fontWeight: 500,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "var(--text-secondary)",
  },
  matrix: {
    alignItems: "center",
    display: "grid",
    gap: "calc(var(--space-unit) * 4) calc(var(--space-unit) * 6)",
    gridTemplateColumns: "80px repeat(5, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  stateMatrix: {
    alignItems: "center",
    display: "grid",
    gap: "calc(var(--space-unit) * 4) calc(var(--space-unit) * 6)",
    gridTemplateColumns: "80px repeat(2, minmax(116px, 1fr))",
    justifyItems: "center",
  },
  matrixHeader: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-caption)/var(--line-height-caption) var(--font-family-body)",
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-caption)/var(--line-height-caption) var(--font-family-body)",
    textTransform: "capitalize" as const,
  },
};

const stateColumns = [
  { id: "default", label: "Default", props: {} },
  { id: "deletable", label: "Deletable", props: { onDelete: handleDelete } },
] as const;

function handleDelete() {
  console.log("chip deleted");
}

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

function ColorSizeMatrix({ variant }: { variant: ChipVariant }) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {colors.map((color) => (
        <span key={color} style={overviewStyles.matrixHeader}>
          {color}
        </span>
      ))}
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <span style={overviewStyles.matrixRowLabel}>{size}</span>
          {colors.map((color) => (
            <Chip
              key={`${variant}-${size}-${color}`}
              color={color}
              size={size}
              variant={variant}
            >
              {color}
            </Chip>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

type PlaygroundArgs = Omit<React.ComponentProps<typeof Chip>, "onDelete"> & {
  onDelete?: boolean;
};

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          "Compact status, filter, or entity label. API follows MUI Chip's icon/delete slots and " +
          "Carbon Tag's dismissible behavior, adapted to a token-only Nova style. " +
          "Deletable chips use a native button for keyboard and screen reader behavior.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    color: { control: "select", options: colors },
    shape: { control: "inline-radio", options: shapes },
    size: { control: "select", options: sizes },
    deleteLabel: { control: "text" },
    onDelete: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

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
        <OverviewSection key={variant} title={`${variant} — size × color`}>
          <ColorSizeMatrix variant={variant} />
        </OverviewSection>
      ))}

      <OverviewSection title="States">
        <div style={overviewStyles.stateMatrix}>
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
                <Chip
                  key={`${variant}-${column.id}`}
                  color="info"
                  startIcon={<Icon name="filter" />}
                  variant={variant}
                  {...column.props}
                >
                  Audience
                </Chip>
              ))}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({ onDelete, ...args }) => (
    <Chip {...args} onDelete={onDelete ? handleDelete : undefined} />
  ),
  args: {
    children: "Audience",
    color: "neutral",
    deleteLabel: "Delete audience chip",
    shape: "pill",
    size: "md",
    startIcon: <Icon name="filter" />,
    variant: "filled",
    onDelete: true,
  },
};

export const Shapes: Story = {
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "calc(var(--space-unit) * 4)" }}>
      {shapes.map((shape) =>
        variants.map((variant) =>
          sizes.map((size) => (
            <Chip
              key={`${shape}-${variant}-${size}`}
              shape={shape}
              variant={variant}
              size={size}
            >
              {shape} / {variant} / {size}
            </Chip>
          ))
        )
      )}
    </div>
  ),
};

export const MonoSizes: Story = {
  render: () => (
    <div>
      {sizes.map((size) => (
        <Chip key={size} size={size} data-testid={`chip-${size}`} startIcon={<Icon name="filter" />} onDelete={handleDelete}>
          Label
        </Chip>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [size, height, padding, gap, icon] of [
      ["sm", 30, 10, 6, 14], ["md", 36, 12, 8, 16], ["lg", 42, 16, 10, 18],
    ] as const) {
      const chip = canvas.getByTestId(`chip-${size}`);
      const style = getComputedStyle(chip);
      await expect(chip.getBoundingClientRect().height).toBeCloseTo(height, 0);
      await expect(parseFloat(style.paddingInlineStart)).toBeCloseTo(padding, 0);
      await expect(parseFloat(style.columnGap)).toBeCloseTo(gap, 0);
      for (const svg of chip.querySelectorAll("svg")) {
        await expect(svg.getBoundingClientRect().width).toBeCloseTo(icon, 0);
      }
    }
  },
};

export const CompactSizes: Story = {
  render: () => <div>{sizes.map(size => <Chip key={size} size={size} density="compact" data-testid={`compact-${size}`} startIcon={<Icon name="filter" />}>Label</Chip>)}</div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const [size, height, font] of [["sm", 24, 12], ["md", 26, 13], ["lg", 30, 14]] as const) {
      const chip = canvas.getByTestId(`compact-${size}`);
      await expect(chip.getBoundingClientRect().height).toBeCloseTo(height, 0);
      await expect(parseFloat(getComputedStyle(chip).fontSize)).toBeCloseTo(font, 0);
      await expect(chip.querySelector("svg")?.getBoundingClientRect().width).toBeCloseTo(font, 0);
    }
  },
};

export const DeleteInteraction: Story = {
  render: () => <Chip deleteLabel="Remove audience" onDelete={onDelete}>Audience</Chip>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", { name: "Remove audience" });
    await expect(button.querySelector("svg path")).toBeInTheDocument();
    onDelete.mockClear();
    await userEvent.click(button);
    await expect(onDelete).toHaveBeenCalledOnce();
  },
};

const onDelete = fn();
