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
    alignItems: "flex-start",
    gap: "40px",
    fontFamily: "var(--if-font-family, Inter, system-ui, sans-serif)",
    padding: "0 120px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    width: "100%",
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
    gap: "20px",
    minWidth: "72px",
  },
  label: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  grid: {
    display: "grid",
    gap: "var(--spacing-08) var(--spacing-07)",
    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
    width: "100%",
  },
  note: {
    color: "var(--text-secondary)",
    fontSize: "12px",
    margin: 0,
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

      <OverviewSection title="Color">
        <div>
          <p style={overviewStyles.note}>
            style 속성으로 color 제어 (text token 사용을 권장)
          </p>
          <p
            style={overviewStyles.note}
          >{`style={{ color: "var(--text-link)" }}`}</p>
        </div>
        <div style={overviewStyles.row}>
          <span>
            <Icon name="add" size="large" />
          </span>
          <span>
            <Icon
              name="info"
              size="large"
              style={{ color: "var(--text-link)" }}
            />
          </span>
          <span>
            <Icon
              name="warning"
              size="large"
              style={{ color: "var(--text-error)" }}
            />
          </span>
        </div>
      </OverviewSection>

      <OverviewSection title={`All symbols (${iconNames.length})`}>
        <div style={overviewStyles.grid}>
          {iconNames.map((name) => (
            <div key={name} style={overviewStyles.cell}>
              <Icon
                name={name}
                size="large"
                style={{ color: "var(--text-secondary)" }}
              />
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
