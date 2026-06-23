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
    gap: "var(--spacing-08)",
    maxWidth: "960px",
    width: "100%",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-04)",
  },
  heading: {
    color: "var(--theme-text-secondary)",
    font: "var(--label-md)",
    margin: 0,
  },
  panel: {
    color: "var(--theme-text-secondary)",
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
  const listRef = React.useRef<HTMLDivElement>(null);

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

  const scrollTabs = (direction: "previous" | "next") => {
    listRef.current?.scrollBy({
      behavior: "smooth",
      left: direction === "next" ? 160 : -160,
    });
  };

  if (items.length === 0) {
    return (
      <Tabs defaultValue={defaultValue} orientation={orientation} variant={variant}>
        <TabsList aria-label={ariaLabel} orientation={orientation} variant={variant} />
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
        ref={listRef}
        aria-label={ariaLabel}
        orientation={orientation}
        showScrollButtons={showScrollButtons}
        variant={variant}
        onEndScrollButtonClick={() => scrollTabs("next")}
        onStartScrollButtonClick={() => scrollTabs("previous")}
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
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Figma Tabs를 Radix Tabs primitive 위에 구성한 컴포넌트입니다. `TabsList`에는 반드시 `aria-label` 또는 `aria-labelledby`를 제공하고, 방향키와 Home/End 이동 및 Enter/Space 활성화는 Radix의 WAI-ARIA tabs 패턴을 따릅니다.",
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
