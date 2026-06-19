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
    gap: "var(--spacing-08)",
    fontFamily: "var(--font-family-sans)",
    width: "100%",
    maxWidth: "960px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-05)",
  },
  heading: {
    color: "var(--theme-text-secondary)",
    font: "var(--label-md)",
    fontWeight: "var(--font-weight-semibold)",
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  matrix: {
    display: "grid",
    gap: "var(--spacing-05)",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  sample: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-04)",
  },
  variantFrame: {
    border: "thin dashed var(--theme-border-default)",
    padding: "var(--spacing-04)",
  },
  horizontalRow: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-06)",
    minHeight: "var(--spacing-12)",
  },
  verticalRow: {
    alignItems: "center",
    display: "flex",
    gap: "var(--spacing-06)",
    minHeight: "var(--spacing-12)",
  },
  label: {
    color: "var(--theme-text-tertiary)",
    font: "var(--label-md)",
    margin: 0,
  },
  note: {
    color: "var(--theme-text-secondary)",
    font: "var(--body-md)",
    margin: 0,
    maxWidth: "680px",
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
  tags: ["autodocs"],
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

      <OverviewSection title="Text Alignment">
        {textAligns.map((textAlign) => (
          <LabeledSample key={textAlign}>
            <p style={overviewStyles.label}>{textAlign}</p>
            <Divider textAlign={textAlign}>Section</Divider>
          </LabeledSample>
        ))}
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Dividers are hidden from assistive technology by default because they
          are usually visual separators. Set <code>semantic</code> when the
          divider communicates a meaningful content boundary. Dividers with
          labels are always exposed as separators so the label is not hidden.
        </p>
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
