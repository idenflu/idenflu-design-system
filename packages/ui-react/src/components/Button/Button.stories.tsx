import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  Button,
  type ButtonColor,
  type ButtonSize,
  type ButtonVariant,
} from "./Button";
import { Icon } from "../Icon/Icon";

const variants: ButtonVariant[] = ["default", "outlined", "ghost"];
const colors: ButtonColor[] = ["primary", "secondary", "danger"];
const sizes: ButtonSize[] = ["lg", "md", "sm", "xs"];

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
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "#566173",
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
  },
  cell: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "120px",
  },
  label: {
    color: "#8792a5",
    fontSize: "11px",
    margin: 0,
  },
  matrix: {
    display: "grid",
    gap: "12px 16px",
    gridTemplateColumns: "80px repeat(3, minmax(120px, 1fr))",
    alignItems: "center",
  },
  matrixHeader: {
    color: "#8792a5",
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "#8792a5",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
  },
  fullWidthContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "320px",
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

function VariantColorMatrix({ size = "lg" }: { size?: ButtonSize }) {
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
            <Button
              key={`${variant}-${color}`}
              color={color}
              endIcon={<Icon name="star" />}
              size={size}
              variant={variant}
            >
              Button
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

const primaryVariantColumns = [
  { id: "withoutEndIcon", label: "Without end icon" },
  { id: "disabled", label: "Disabled" },
  { id: "loading", label: "Loading" },
] as const;

function PrimaryVariantStateMatrix({ size = "lg" }: { size?: ButtonSize }) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {primaryVariantColumns.map((column) => (
        <span key={column.id} style={overviewStyles.matrixHeader}>
          {column.label}
        </span>
      ))}
      {variants.map((variant) => (
        <React.Fragment key={variant}>
          <span style={overviewStyles.matrixRowLabel}>{variant}</span>
          {primaryVariantColumns.map((column) => (
            <Button
              key={`${variant}-${column.id}`}
              color="primary"
              disabled={column.id === "disabled"}
              endIcon={
                column.id === "withoutEndIcon" ? undefined : (
                  <Icon name="star" />
                )
              }
              loading={column.id === "loading"}
              size={size}
              variant={variant}
            >
              Button
            </Button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Button> & {
  showEndIcon?: boolean;
};

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    color: {
      control: "select",
      options: colors,
    },
    size: {
      control: "select",
      options: sizes,
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    showEndIcon: { control: "boolean" },
  },
  args: {
    onClick: fn(),
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
      <OverviewSection title="Variant × Color">
        <VariantColorMatrix />
      </OverviewSection>

      <OverviewSection title="Variant × State">
        <PrimaryVariantStateMatrix />
      </OverviewSection>

      <OverviewSection title="Sizes">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <Button
                color="primary"
                endIcon={<Icon name="star" />}
                size={size}
                variant="default"
              >
                Button
              </Button>
              <p style={overviewStyles.label}>{size}</p>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Full Width">
        <div style={overviewStyles.fullWidthContainer}>
          {variants.map((variant) => (
            <Button
              key={variant}
              color="primary"
              endIcon={<Icon name="star" />}
              fullWidth
              variant={variant}
            >
              Button
            </Button>
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
  render: ({ showEndIcon = true, children, fullWidth, ...args }) => {
    const button = (
      <Button
        {...args}
        endIcon={showEndIcon ? <Icon name="star" /> : undefined}
        fullWidth={fullWidth}
      >
        {children}
      </Button>
    );

    if (fullWidth) {
      return <div style={{ width: "320px" }}>{button}</div>;
    }

    return button;
  },
  args: {
    children: "Button",
    color: "primary",
    disabled: false,
    fullWidth: false,
    loading: false,
    showEndIcon: true,
    size: "md",
    type: "button",
    variant: "default",
  },
};
