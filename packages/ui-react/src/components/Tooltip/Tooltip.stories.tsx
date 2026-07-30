import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  type TooltipPosition,
  type TooltipProps,
  TooltipTrigger,
} from "./Tooltip";

const positions: TooltipPosition[] = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-07)",
    padding: "var(--spacing-10)",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-05)",
  },
  heading: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "var(--spacing-06)",
  },
  matrix: {
    display: "grid",
    gap: "var(--spacing-07)",
    gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
    justifyItems: "center",
    padding: "var(--spacing-10)",
  },
  variantGrid: {
    display: "grid",
    gap: "var(--spacing-06)",
    gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
    justifyItems: "center",
  },
  note: {
    color: "var(--text-secondary)",
    font: "var(--body-md)",
    margin: 0,
    maxWidth: "720px",
  },
};

type TooltipVariantExample = {
  id: string;
  label: string;
  content: React.ReactNode;
  contentProps?: Omit<TooltipContentProps, "children">;
  rootProps?: Omit<TooltipProps, "children">;
};

const tooltipVariants: TooltipVariantExample[] = [
  {
    id: "default",
    label: "Default",
    content: "기본 안내 문구입니다.",
    rootProps: {
      enterDelayMs: 0,
    },
  },
  {
    id: "arrow",
    label: "Arrow",
    content: "화살표가 trigger와 tooltip의 관계를 보여줍니다.",
    contentProps: {
      arrow: true,
    },
    rootProps: {
      enterDelayMs: 0,
    },
  },
  {
    id: "two-line",
    label: "Two line",
    content: `작업을 저장하려면\n이 버튼을 선택하세요.`,
    contentProps: {
      arrow: true,
    },
    rootProps: {
      enterDelayMs: 0,
    },
  },
  {
    id: "fast",
    label: "Fast",
    content: "빠르게 나타나고 사라집니다.",
    contentProps: {
      transition: { enter: 80, out: 80 },
    },
    rootProps: {
      enterDelayMs: 0,
      leaveDelayMs: 0,
    },
  },
  {
    id: "soft-delay",
    label: "Soft delay",
    content: "조금 더 부드럽게 전환됩니다.",
    contentProps: {
      transition: { enter: 220, out: 160 },
    },
    rootProps: {
      enterDelayMs: 300,
      leaveDelayMs: 200,
    },
  },
  {
    id: "shortcut",
    label: "Shortcut",
    content: (
      <>
        Save Changes <Kbd>S</Kbd>
      </>
    ),
    contentProps: {
      arrow: true,
    },
    rootProps: {
      enterDelayMs: 0,
    },
  },
];

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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        border: "1px solid currentColor",
        borderRadius: "var(--rounded-sm)",
        font: "var(--caption-md)",
        marginInlineStart: "var(--spacing-02)",
        paddingBlock: "var(--spacing-01)",
        paddingInline: "var(--spacing-02)",
      }}
    >
      {children}
    </kbd>
  );
}

function TooltipExample({
  children,
  content,
  contentProps,
  rootProps,
}: {
  children: React.ReactElement;
  content: React.ReactNode;
  contentProps?: Omit<TooltipContentProps, "children">;
  rootProps?: Omit<TooltipProps, "children">;
}) {
  return (
    <Tooltip {...rootProps}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...contentProps}>{content}</TooltipContent>
    </Tooltip>
  );
}

type PlaygroundArgs = Omit<TooltipProps, "children"> &
  Omit<TooltipContentProps, "children"> & {
    content: React.ReactNode;
    triggerLabel: string;
  };

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    docs: {
      description: {
        component:
          "MUI Tooltip은 title, placement, arrow, enterDelay/leaveDelay, controlled open을 폭넓게 제공한다. Carbon Tooltip은 label, align, enterDelayMs/leaveDelayMs 중심이며 trigger의 기존 aria 속성을 존중한다. Nova Tooltip은 brief help text를 위한 단일 wrapper API로 두고, WAI-ARIA 패턴에 맞춰 trigger가 tooltip을 aria-describedby로 참조한다. tooltip content는 focus를 받지 않으며 Escape, blur, hover out으로 닫힌다.",
      },
    },
  },
  argTypes: {
    arrow: { control: "boolean" },
    content: { control: "text" },
    delay: { control: "number" },
    enterDelayMs: { control: "number" },
    leaveDelayMs: { control: "number" },
    position: {
      control: "select",
      options: positions,
    },
    offset: { control: "number" },
    transition: { control: "object" },
    triggerLabel: { control: "text" },
  },
  args: {
    arrow: false,
    content: `작업을 저장하려면 이 버튼을 선택하세요.`,
    enterDelayMs: 500,
    leaveDelayMs: 0,
    position: "top",
    offset: 8,
    transition: {
      enter: 140,
      out: 100,
    },
    triggerLabel: "Hover or focus",
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
      <OverviewSection title="Variants">
        <div style={overviewStyles.variantGrid}>
          {tooltipVariants.map(({ id, label, content, contentProps, rootProps }) => (
            <TooltipExample
              key={id}
              content={content}
              contentProps={contentProps}
              rootProps={rootProps}
            >
              <Button variant="outlined">{label}</Button>
            </TooltipExample>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Positions">
        <div style={overviewStyles.matrix}>
          {positions.map((position) => (
            <TooltipExample
              key={position}
              content={`position: ${position}`}
              contentProps={{ arrow: true, position }}
              rootProps={{ enterDelayMs: 0 }}
            >
              <Button variant="outlined">{position}</Button>
            </TooltipExample>
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Tooltip은 hover와 focus에서 열리고, Escape 또는 blur로 닫힙니다.
          tooltip 내부에는 focusable element를 넣지 않습니다. 상호작용이 필요한
          콘텐츠는 Dialog 또는 Popover 계열 컴포넌트를 사용합니다.
        </p>
        <TooltipExample content="키보드 focus로도 이 설명을 확인할 수 있습니다.">
          <Button>Focus target</Button>
        </TooltipExample>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({
    arrow,
    content,
    offset,
    position,
    transition,
    triggerLabel,
    ...rootProps
  }) => (
    <Tooltip {...rootProps}>
      <TooltipTrigger asChild>
        <Button>{triggerLabel}</Button>
      </TooltipTrigger>
      <TooltipContent
        arrow={arrow}
        offset={offset}
        position={position}
        transition={transition}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  ),
};
