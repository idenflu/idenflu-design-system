import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectItem,
  type SelectSize,
  type SelectVariant,
} from "./Select";
import { Icon } from "../Icon/Icon";

const variants: SelectVariant[] = ["default", "filled", "outlined"];
const sizes: SelectSize[] = ["lg", "md", "sm"];

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
    color: "var(--theme-text-secondary)",
    fontSize: "13px",
    fontWeight: 600,
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  matrix: {
    alignItems: "start",
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "80px repeat(3, minmax(200px, 1fr))",
  },
  matrixHeader: {
    color: "var(--theme-text-tertiary)",
    fontSize: "11px",
    fontWeight: 500,
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--theme-text-tertiary)",
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "capitalize" as const,
  },
  row: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "24px",
  },
  note: {
    color: "var(--theme-text-secondary)",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "680px",
  },
};

const stateColumns = [
  { id: "enabled", label: "Enabled", props: { helperText: "Helper Text" } },
  { id: "error", label: "Error", props: { error: "Helper Text" } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
] as const;

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

function renderDemoItems({ withIcon = false }: { withIcon?: boolean } = {}) {
  return (
    <>
      <SelectItem
        value="analytics"
        startIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
        endIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
      >
        Analytics
      </SelectItem>
      <SelectItem
        value="campaigns"
        startIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
        endIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
      >
        Campaigns
      </SelectItem>
      <SelectItem
        value="audiences"
        startIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
        endIcon={withIcon ? <Icon name="star" size="medium" /> : undefined}
      >
        Audiences
      </SelectItem>
      <SelectItem value="billing" disabled>
        Billing
      </SelectItem>
    </>
  );
}

function VariantStateMatrix({ variant }: { variant: SelectVariant }) {
  return (
    <div style={overviewStyles.matrix}>
      <div />
      {stateColumns.map((column) => (
        <span key={column.id} style={overviewStyles.matrixHeader}>
          {column.label}
        </span>
      ))}
      {sizes.map((size) => (
        <React.Fragment key={size}>
          <span style={overviewStyles.matrixRowLabel}>{size}</span>
          {stateColumns.map((column) => (
            <Select
              key={`${variant}-${size}-${column.id}`}
              defaultValue="analytics"
              label="Label"
              size={size}
              variant={variant}
              {...column.props}
            >
              {renderDemoItems()}
            </Select>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Select>;

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma Input/Menu (nodes 84:3474, 78:1208). Keyboard: Enter/Space opens, " +
          "Arrow/Home/End moves active option, Enter/Space selects, Escape closes. " +
          "Screen readers: trigger uses combobox + listbox semantics; helper/error text is connected with aria-describedby.",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
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
      {variants.map((variant) => (
        <OverviewSection key={variant} title={`${variant} — size × state`}>
          <VariantStateMatrix variant={variant} />
        </OverviewSection>
      ))}

      <OverviewSection title="Menu With Start / End Icon">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <Select
              key={size}
              defaultValue="analytics"
              label="Label"
              size={size}
              variant="outlined"
            >
              {renderDemoItems({ withIcon: true })}
            </Select>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Use a visible <code>label</code>, or provide <code>aria-label</code>{" "}
          when the visual label is omitted. Validation messages should use{" "}
          <code>error</code> so the trigger receives <code>aria-invalid</code>{" "}
          and helper text remains linked through <code>aria-describedby</code>.
        </p>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: { layout: "centered" },
  args: {
    disabled: false,
    fullWidth: false,
    helperText: "Helper Text",
    label: "Label",
    placeholder: "Select",
    readOnly: false,
    size: "md",
    variant: "default",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem
        value="analytics"
        startIcon={<Icon name="star" size="medium" />}
        endIcon={<Icon name="star" size="medium" />}
      >
        Analytics
      </SelectItem>
      <SelectItem
        value="campaigns"
        startIcon={<Icon name="star" size="medium" />}
        endIcon={<Icon name="star" size="medium" />}
      >
        Campaigns
      </SelectItem>
      <SelectItem
        value="audiences"
        startIcon={<Icon name="star" size="medium" />}
        endIcon={<Icon name="star" size="medium" />}
      >
        Audiences
      </SelectItem>
      <SelectItem value="billing" disabled>
        Billing
      </SelectItem>
    </Select>
  ),
};
