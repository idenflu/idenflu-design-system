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
import { Divider } from "../Divider";

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
    gridTemplateColumns: "80px repeat(3, minmax(120px, 1fr))",
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
  { id: "withoutIcon", label: "Without icon" },
  { id: "disabled", label: "Disabled" },
  { id: "loading", label: "Loading" },
] as const;

type PlaygroundArgs = React.ComponentProps<typeof Button> & {
  endIconName?: IconName | "none";
  startIconName?: IconName | "none";
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
    startIconName: {
      control: "select",
      options: ["none", ...iconNames],
    },
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

      <Divider flexItem fullWidth />

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
                    column.id === "withoutIcon" ? undefined : (
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

      <Divider flexItem fullWidth />

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

      <Divider flexItem fullWidth />

      <OverviewSection title="Icons">
        <div style={overviewStyles.row}>
          {(
            [
              {
                id: "start",
                label: "startIcon",
                props: { startIcon: <Icon name="star" /> },
              },
              {
                id: "end",
                label: "endIcon",
                props: { endIcon: <Icon name="star" /> },
              },
              {
                id: "both",
                label: "both",
                props: {
                  endIcon: <Icon name="star" />,
                  startIcon: <Icon name="star" />,
                },
              },
            ] as const
          ).map(({ id, label, props }) => (
            <div key={id} style={overviewStyles.cell}>
              <p style={overviewStyles.label}>{label}</p>
              <Button color="primary" size="lg" variant="default" {...props}>
                Button
              </Button>
            </div>
          ))}
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

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
  render: ({
    endIconName = "star",
    startIconName = "none",
    children,
    fullWidth,
    ...args
  }) => {
    const button = (
      <Button
        {...args}
        endIcon={
          endIconName === "none" ? undefined : <Icon name={endIconName} />
        }
        startIcon={
          startIconName === "none" ? undefined : <Icon name={startIconName} />
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
    startIconName: "none",
    fullWidth: false,
    loading: false,
    size: "md",
    type: "button",
    variant: "default",
  },
};
