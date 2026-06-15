import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconName, iconNames } from "@idenflu/ui-icons";
import { IconButton } from "../IconButton/IconButton";
import { Icon, type IconSize } from "./Icon";

const sizes: IconSize[] = ["small", "medium", "large"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "40px",
    fontFamily: "var(Inter, system-ui, sans-serif)",
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
    color: "var(--theme-text-secondary, #566173)",
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  cell: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "72px",
  },
  label: {
    color: "var(--theme-text-secondary, #8792a5)",
    fontSize: "11px",
    margin: 0,
    textAlign: "center" as const,
  },
  grid: {
    display: "grid",
    gap: "16px 24px",
    gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
  },
  note: {
    color: "var(--theme-text-secondary, #566173)",
    fontSize: "13px",
    lineHeight: 1.5,
    margin: 0,
    maxWidth: "640px",
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

type IconStoryArgs = React.ComponentProps<typeof Icon>;

const meta = {
  title: "Components/Icon",
  component: Icon,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Sprite-based icon from `@idenflu/ui-icons`. Decorative by default (`aria-hidden`). " +
          "Provide `label` for standalone semantic icons. Inside `IconButton` / `Button`, keep icons decorative " +
          "and put the accessible name on the button (`label` / visible text). " +
          "Color inherits via `currentColor` — wrap with a parent using theme text tokens.",
      },
    },
  },
  argTypes: {
    name: {
      control: "select",
      options: iconNames,
    },
    size: {
      control: "select",
      options: [...sizes, 32],
    },
    label: {
      control: "text",
    },
  },
  args: {
    name: "search",
    size: "medium",
  },
} satisfies Meta<IconStoryArgs>;

export default meta;

type Story = StoryObj<IconStoryArgs>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {
    name: "search",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Size">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <Icon name="search" size={size} />
              <p style={overviewStyles.label}>{size}</p>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Color (default secondary, override via color)">
        <div style={overviewStyles.row}>
          <span>
            <Icon name="add" size="large" />
          </span>
          <span>
            <Icon
              name="info"
              size="large"
              style={{ color: "var(--theme-text-brand)" }}
            />
          </span>
          <span>
            <Icon
              name="warning"
              size="large"
              style={{ color: "var(--theme-text-danger)" }}
            />
          </span>
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Decorative (default): hidden from assistive tech. Semantic: pass
          `label` for `role="img"`. Icon-only actions must use `IconButton` with
          its own `label`.
        </p>
        <div style={overviewStyles.row}>
          <Icon name="help" size="large" label="Help" />
          <IconButton
            icon={<Icon name="search" size="small" />}
            label="Search"
            size="md"
            variant="ghost"
          />
        </div>
      </OverviewSection>

      <OverviewSection title={`All symbols (${iconNames.length})`}>
        <div style={overviewStyles.grid}>
          {iconNames.map((name) => (
            <div key={name} style={overviewStyles.cell}>
              <Icon name={name} size="medium" />
              <p style={overviewStyles.label}>{name.replace("icon-", "")}</p>
            </div>
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
};
