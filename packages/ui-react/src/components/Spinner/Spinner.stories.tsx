import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Spinner,
  type SpinnerColor,
  type SpinnerSize,
  type SpinnerVariant,
} from "./Spinner";

const sizes: SpinnerSize[] = ["xs", "sm", "md", "lg"];
const colors: SpinnerColor[] = ["primary", "neutral", "inherit"];
const variants: SpinnerVariant[] = ["ring", "dot"];

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
  inheritDemo: {
    alignItems: "center",
    color: "var(--text-brand)",
    display: "flex",
    gap: "8px",
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

function SizeColorMatrix({
  active = true,
  variant = "ring",
}: {
  active?: boolean;
  variant?: SpinnerVariant;
}) {
  return (
    <div style={overviewStyles.matrix}>
      <span />
      {colors.map((color) => (
        <span key={color} style={overviewStyles.matrixHeader}>
          {color}
        </span>
      ))}
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <span style={overviewStyles.matrixRowLabel}>{size}</span>
          {colors.map((color) => (
            <div
              key={`${size}-${color}`}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Spinner
                active={active}
                color={color}
                size={size}
                variant={variant}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component:
          'Indeterminate loading indicator. Announces status via `role="status"` and `aria-label`. ' +
          "Not focusable — pair with `aria-busy` on a parent region when loading page content. " +
          "Respects `prefers-reduced-motion`.",
      },
    },
  },
  argTypes: {
    active: { control: "boolean" },
    color: {
      control: "select",
      options: colors,
    },
    size: {
      control: "select",
      options: sizes,
    },
    variant: {
      control: "select",
      options: variants,
    },
    label: { control: "text" },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Overview: Story = {
  parameters: {
    layout: "padded",
    controls: { disable: true },
  },
  render: () => (
    <div style={overviewStyles.root}>
      {variants.map((variant) => (
        <OverviewSection key={variant} title={`Variant: ${variant}`}>
          <SizeColorMatrix variant={variant} />
        </OverviewSection>
      ))}

      <OverviewSection title="Inactive">
        <div style={overviewStyles.row}>
          {variants.map((variant) => (
            <div key={variant} style={overviewStyles.cell}>
              <Spinner
                active={false}
                color="primary"
                size="md"
                variant={variant}
              />
              <span style={overviewStyles.label}>{variant}</span>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Inherit Color">
        <div style={overviewStyles.inheritDemo}>
          <Spinner color="inherit" size="md" />
          <span>Saving changes…</span>
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  args: {
    active: true,
    color: "primary",
    label: "Loading",
    size: "md",
    variant: "ring",
  },
};
