import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  IconButton,
  type IconButtonColor,
  type IconButtonVariant,
} from "../IconButton/IconButton";
import type { ButtonSize } from "../Button/Button";
import { Icon } from "../Icon/Icon";

const variants: IconButtonVariant[] = ["default", "outlined", "ghost"];
const colors: IconButtonColor[] = ["primary", "neutral", "danger"];
const sizes: ButtonSize[] = ["lg", "md", "sm", "xs"];

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
  cell: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "72px",
  },
  label: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    margin: 0,
  },
  matrix: {
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "80px repeat(3, minmax(72px, 1fr))",
    alignItems: "center",
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

function OverviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={overviewStyles.section}>
      <h3 style={overviewStyles.heading}>{title}</h3>
      {children}
    </section>
  );
}

function VariantColorMatrix({
  disabled = false,
  loading = false,
  size = "lg",
}: {
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
}) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {colors.map((color) => (
        <span key={color} style={overviewStyles.matrixHeader}>
          {color}
        </span>
      ))}
      {variants.map((variant) => (
        <React.Fragment key={variant}>
          <span style={overviewStyles.matrixRowLabel}>{variant}</span>
          {colors.map((color) => (
            <IconButton
              key={`${variant}-${color}`}
              color={color}
              disabled={disabled}
              icon={<Icon name="star" />}
              label="Favorite"
              loading={loading}
              size={size}
              variant={variant}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          "Icon-only action button. Requires `label` for an accessible name. " +
          "Keyboard: Tab to focus, Enter/Space to activate. Focus ring uses " +
          "`--theme-border-focused`. Loading sets `aria-busy` and disables interaction.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    color: { control: "select", options: colors },
    size: { control: "select", options: sizes },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    color: "primary",
    disabled: false,
    icon: <Icon name="star" />,
    label: "Favorite",
    loading: false,
    size: "md",
    variant: "default",
  },
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Variant × Color">
        <VariantColorMatrix />
      </OverviewSection>

      <OverviewSection title="Sizes — Primary / Default">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <IconButton
                color="primary"
                icon={<Icon name="star" />}
                label="Favorite"
                size={size}
                variant="default"
              />
              <p style={overviewStyles.label}>{size}</p>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Disabled">
        <VariantColorMatrix disabled />
      </OverviewSection>

      <OverviewSection title="Loading">
        <VariantColorMatrix loading />
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  args: {
    color: "primary",
    disabled: false,
    icon: <Icon name="star" />,
    label: "Favorite",
    loading: false,
    size: "md",
    variant: "default",
  },
};
