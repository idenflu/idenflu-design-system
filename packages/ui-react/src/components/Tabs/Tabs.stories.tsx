import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type TabsOrientation,
  type TabsVariant,
} from "./Tabs";

const variants: TabsVariant[] = ["standard", "scrollable", "fullWidth"];
const orientations: TabsOrientation[] = ["horizontal", "vertical"];

const demoTabs = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
] as const;

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
  panel: {
    color: "var(--text-secondary)",
    paddingBlockStart: "var(--spacing-04)",
  },
  constrained: {
    inlineSize: "min(100%, 360px)",
  },
};

type DemoTabsProps = {
  ariaLabel?: string;
  closable?: boolean;
  defaultValue?: string;
  orientation?: TabsOrientation;
  showScrollButtons?: boolean;
  variant?: TabsVariant;
};

function DemoTabs({
  ariaLabel = "콘텐츠 섹션",
  closable = false,
  defaultValue = "overview",
  orientation = "horizontal",
  showScrollButtons = false,
  variant = "standard",
}: DemoTabsProps) {
  const [items, setItems] = React.useState(() => [...demoTabs]);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setItems([...demoTabs]);
    setValue(defaultValue);
  }, [defaultValue]);

  const closeTab = (closedValue: string) => {
    setItems((currentItems) => {
      const nextItems = currentItems.filter((tab) => tab.value !== closedValue);

      if (value === closedValue) {
        setValue(nextItems[0]?.value ?? "");
      }

      return nextItems;
    });
  };

  if (items.length === 0) {
    return (
      <Tabs
        defaultValue={defaultValue}
        orientation={orientation}
        variant={variant}
      >
        <TabsList
          aria-label={ariaLabel}
          orientation={orientation}
          variant={variant}
        />
        <TabsContent value={defaultValue}>
          <div style={overviewStyles.panel}>열린 탭이 없습니다.</div>
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      variant={variant}
    >
      <TabsList
        aria-label={ariaLabel}
        orientation={orientation}
        showScrollButtons={showScrollButtons}
        variant={variant}
      >
        {items.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.value === "reports" && variant === "fullWidth"}
            closable={closable}
            closeLabel={`${tab.label} 탭 닫기`}
            onClose={() => closeTab(tab.value)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div style={overviewStyles.panel}>{tab.label} 패널 콘텐츠</div>
        </TabsContent>
      ))}
    </Tabs>
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

type PlaygroundArgs = DemoTabsProps;

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component:
          "Figma Tabs를 Radix Tabs primitive 위에 구성한 컴포넌트입니다. `TabsList`에는 반드시 `aria-label` 또는 `aria-labelledby`를 제공하고, `scrollable`은 선택 탭을 자동으로 노출하며, `showScrollButtons`는 기본 이동과 경계 비활성화를 제공합니다. 기존 버튼 클릭 콜백은 기본 이동을 대체하고, disabled prop을 명시하면 자동 계산보다 우선합니다. `ref`는 스크롤 래퍼가 아닌 tablist를 가리킵니다. 방향키와 Home/End 이동 및 Enter/Space 활성화는 Radix의 WAI-ARIA tabs 패턴을 따릅니다.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: orientations,
    },
    variant: {
      control: "select",
      options: variants,
    },
    closable: { control: "boolean" },
    showScrollButtons: { control: "boolean" },
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
      <OverviewSection title="Standard">
        <DemoTabs closable />
      </OverviewSection>

      <OverviewSection title="Scrollable with Buttons">
        <div style={overviewStyles.constrained}>
          <DemoTabs showScrollButtons variant="scrollable" />
        </div>
      </OverviewSection>

      <OverviewSection title="Full Width + Disabled">
        <DemoTabs variant="fullWidth" />
      </OverviewSection>

      <OverviewSection title="Vertical">
        <DemoTabs orientation="vertical" />
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => <DemoTabs {...args} />,
  args: {
    ariaLabel: "탭 예시",
    closable: true,
    defaultValue: "overview",
    orientation: "horizontal",
    showScrollButtons: false,
    variant: "standard",
  },
};
