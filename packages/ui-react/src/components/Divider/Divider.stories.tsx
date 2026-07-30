import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Divider,
  type DividerOrientation,
  type DividerTextAlign,
} from "./Divider";

const orientations: DividerOrientation[] = ["horizontal", "vertical"];
const textAligns: DividerTextAlign[] = ["start", "center", "end"];

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
  matrix: {
    display: "grid",
    gap: "20px 40px",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    alignItems: "center",
    justifyItems: "center",
  },
  sample: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    width: "100%",
  },
  variantFrame: {
    border: "thin dashed #e0e0e0",
    padding: "8px",
  },
  horizontalRow: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
    minHeight: "48px",
  },
  verticalRow: {
    alignItems: "center",
    display: "flex",
    gap: "24px",
    minHeight: "48px",
  },
  label: {
    color: "#8792a5",
    fontSize: "12px",
  },
};

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

function LabeledSample({ children }: { children: React.ReactNode }) {
  return <div style={overviewStyles.sample}>{children}</div>;
}

type PlaygroundArgs = React.ComponentProps<typeof Divider>;

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    docs: {
      description: {
        component:
          "Visually separates related content or groups. Dividers are decorative by default; " +
          'pass `semantic` when the divider marks a real content boundary and should expose `role="separator"` with `aria-orientation`. API follows MUI\'s ' +
          "orientation/text alignment concepts and Carbon's separator usage pattern, adapted to Nova tokens.",
      },
    },
  },
  argTypes: {
    flexItem: { control: "boolean" },
    fullWidth: { control: "boolean" },
    orientation: { control: "select", options: orientations },
    semantic: { control: "boolean" },
    textAlign: { control: "select", options: textAligns },
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
      <OverviewSection title="Width">
        <div style={overviewStyles.matrix}>
          {[
            { fullWidth: false, label: "default (middle spacing)" },
            { fullWidth: true, label: "fullWidth" },
          ].map(({ fullWidth, label }) => (
            <LabeledSample key={label}>
              <p style={overviewStyles.label}>{label}</p>
              <div style={overviewStyles.variantFrame}>
                <Divider fullWidth={fullWidth} />
              </div>
            </LabeledSample>
          ))}
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Orientation">
        <LabeledSample>
          <p style={overviewStyles.label}>horizontal</p>
          <div style={overviewStyles.horizontalRow}>
            <span>Navigation</span>
            <Divider flexItem orientation="horizontal" />
            <span>Content</span>
          </div>
        </LabeledSample>

        <LabeledSample>
          <p style={overviewStyles.label}>vertical</p>
          <div style={overviewStyles.verticalRow}>
            <span>Navigation</span>
            <Divider flexItem orientation="vertical" />
            <span>Content</span>
          </div>
        </LabeledSample>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Text Alignment">
        {textAligns.map((textAlign) => (
          <LabeledSample key={textAlign}>
            <p style={overviewStyles.label}>{textAlign}</p>
            <Divider textAlign={textAlign}>Section</Divider>
          </LabeledSample>
        ))}
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  args: {
    children: "",
    flexItem: false,
    fullWidth: false,
    orientation: "horizontal",
    semantic: false,
    textAlign: "center",
  },
  render: ({ orientation, ...args }) => {
    if (orientation === "vertical") {
      return (
        <div style={overviewStyles.verticalRow}>
          <span>Before</span>
          <Divider orientation="vertical" {...args} />
          <span>After</span>
        </div>
      );
    }

    return (
      <div style={{ width: "min(100vw, var(--spacing-12))" }}>
        <Divider orientation="horizontal" {...args} />
      </div>
    );
  },
};
