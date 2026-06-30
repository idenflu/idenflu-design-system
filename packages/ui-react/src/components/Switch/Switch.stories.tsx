import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Switch, type SwitchSize } from "./Switch";

const sizes: SwitchSize[] = ["sm", "md"];
const labelledSwitchId = "switch-with-label";

const overviewStyles = {
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "var(--if-font-family, Inter, system-ui, sans-serif)",
    gap: "40px",
    padding: "0 120px",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
  },
  heading: {
    color: "var(--text-secondary)",
    font: "var(--title-md)",
    letterSpacing: "0.02em",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  row: {
    alignItems: "center",
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
  a11yText: {
    color: "var(--text-secondary)",
    font: "var(--body-md)",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "720px",
  },
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 8.25 6.75 11 12 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

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

function ControlledSwitch({
  defaultChecked = false,
  ...props
}: React.ComponentProps<typeof Switch>) {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <Switch
      {...props}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        props.onCheckedChange?.(nextChecked);
      }}
    />
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Switch> & {
  showIcon?: boolean;
};

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: {
    docs: {
      description: {
        component:
          "Binary setting control built on Radix Switch. API keeps idenflu additions small (`size`, `icon`) while following MUI's controlled/uncontrolled switch pattern and Carbon Toggle's explicit `sm`/`md` sizing and accessible-label guidance. Provide a visible `<label>` or `aria-label`/`aria-labelledby` for every switch.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    size: { control: "select", options: sizes },
    showIcon: { control: "boolean" },
  },
  args: {
    "aria-label": "알림 받기",
    onCheckedChange: fn(),
    size: "md",
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Size">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <Switch aria-label={`${size} switch`} size={size} />
              <span style={overviewStyles.label}>{size}</span>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="State">
        <div style={overviewStyles.row}>
          <div style={overviewStyles.cell}>
            <Switch aria-label="Unchecked switch" />
            <span style={overviewStyles.label}>unchecked</span>
          </div>
          <div style={overviewStyles.cell}>
            <Switch aria-label="Checked switch" defaultChecked />
            <span style={overviewStyles.label}>checked</span>
          </div>
          <div style={overviewStyles.cell}>
            <Switch aria-label="Disabled switch" disabled />
            <span style={overviewStyles.label}>disabled</span>
          </div>
          <div style={overviewStyles.cell}>
            <Switch aria-label="Disabled checked switch" defaultChecked disabled />
            <span style={overviewStyles.label}>disabled checked</span>
          </div>
        </div>
      </OverviewSection>

      <OverviewSection title="Icon">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <div key={size} style={overviewStyles.cell}>
              <Switch
                aria-label={`${size} icon switch`}
                defaultChecked
                icon={<CheckIcon />}
                size={size}
              />
              <span style={overviewStyles.label}>{size}</span>
            </div>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.a11yText}>
          Switch는 단일 설정의 on/off 상태를 즉시 변경할 때 사용합니다. 모든
          인스턴스는 보이는 label, 또는 `aria-label`/`aria-labelledby`로 이름을
          가져야 하며, Space/Enter 키보드 토글과 `aria-checked` 상태는 Radix
          Switch primitive가 제공합니다.
        </p>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  render: ({ showIcon = false, ...args }) => (
    <ControlledSwitch {...args} icon={showIcon ? <CheckIcon /> : undefined} />
  ),
};

export const WithLabel: Story = {
  parameters: {
    controls: { disable: true },
    layout: "centered",
  },
  render: () => (
    <label
      htmlFor={labelledSwitchId}
      style={{
        alignItems: "center",
        color: "var(--text-primary)",
        display: "inline-flex",
        font: "var(--body-md)",
        gap: "var(--spacing-04)",
      }}
    >
      마케팅 알림 받기
      <Switch id={labelledSwitchId} />
    </label>
  ),
};
