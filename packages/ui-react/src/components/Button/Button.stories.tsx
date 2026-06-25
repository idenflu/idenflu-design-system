import * as React from "react";
import { iconNames, type IconName } from "@idenflu/ui-icons";
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
const colors: ButtonColor[] = ["primary", "neutral", "danger"];
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
    fontWeight: 500,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
    color: "#566173",
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
    gap: "20px",
    minWidth: "120px",
  },
  label: {
    color: "#8792a5",
    fontSize: "12px",
  },
  matrix: {
    display: "grid",
    gap: "20px 40px",
    gridTemplateColumns: "80px repeat(3, minmax(120px, 1fr))",
    alignItems: "center",
    justifyItems: "center",
  },
  matrixHeader: {
    color: "#8792a5",
    fontSize: "12px",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "#8792a5",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
    width: "100%",
    textAlign: "left" as const,
  },
  fullWidthContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "240px",
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

const primaryVariantColumns = [
  { id: "withoutEndIcon", label: "Without end icon" },
  { id: "disabled", label: "Disabled" },
  { id: "loading", label: "Loading" },
] as const;

type PlaygroundArgs = React.ComponentProps<typeof Button> & {
  endIconName?: IconName | "none";
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
    endIconName: {
      control: "select",
      options: ["none", ...iconNames],
    },
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
                  size="lg"
                  variant={variant}
                >
                  Button
                </Button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Variant × State">
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
                  size="lg"
                  variant={variant}
                >
                  Button
                </Button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Sizes">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <p style={overviewStyles.label}>{size}</p>
              <Button
                color="primary"
                endIcon={<Icon name="star" />}
                size={size}
                variant="default"
              >
                Button
              </Button>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Full Width">
        <div style={overviewStyles.fullWidthContainer}>
          <Button
            color="primary"
            endIcon={<Icon name="star" />}
            fullWidth
            variant="default"
          >
            Button
          </Button>
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({ endIconName = "star", children, fullWidth, ...args }) => {
    const button = (
      <Button
        {...args}
        endIcon={
          endIconName === "none" ? undefined : <Icon name={endIconName} />
        }
        fullWidth={fullWidth}
        onClick={() => console.log("clicked")}
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
    endIconName: "star",
    fullWidth: false,
    loading: false,
    size: "md",
    type: "button",
    variant: "default",
  },
};
