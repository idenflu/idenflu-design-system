import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { Button } from "../Button/Button";
import {
  Tooltip,
  TooltipContent,
  type TooltipContentProps,
  type TooltipPosition,
  type TooltipProps,
  TooltipTrigger,
  TooltipProvider,
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
    gap: "calc(var(--space-unit) * 6)",
    padding: "calc(var(--space-unit) * 16)",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "calc(var(--space-unit) * 3)",
  },
  heading: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-caption)/var(--line-height-caption) var(--font-family-body)",
    margin: 0,
    textTransform: "uppercase" as const,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "calc(var(--space-unit) * 4)",
  },
  matrix: {
    display: "grid",
    gap: "calc(var(--space-unit) * 6)",
    gridTemplateColumns: "repeat(3, minmax(120px, 1fr))",
    justifyItems: "center",
    padding: "calc(var(--space-unit) * 16)",
  },
  variantGrid: {
    display: "grid",
    gap: "calc(var(--space-unit) * 4)",
    gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
    justifyItems: "center",
  },
  note: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-body)/var(--line-height-body) var(--font-family-body)",
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
        borderRadius: "var(--radius-control)",
        font: "var(--font-weight-regular) var(--font-size-caption)/var(--line-height-caption) var(--font-family-body)",
        marginInlineStart: "calc(var(--space-unit) * .5)",
        paddingBlock: "calc(var(--space-unit) * .25)",
        paddingInline: "calc(var(--space-unit) * .5)",
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
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "TooltipProvider / Tooltip / TooltipTrigger / TooltipContent 합성 API로 짧은 보충 설명을 제공합니다. Hover는 기본 500ms 뒤, 키보드 focus는 즉시 열립니다. Escape, blur, 활성화는 닫힘 지연 없이 닫힙니다. Tooltip은 focus를 받지 않으며 기존 aria-describedby를 보존합니다. 아이콘 버튼에는 별도 접근 가능한 이름이 필요하고, 필수 정보 및 disabled 사유를 Tooltip에만 넣지 않습니다.",
      },
    },
  },
  argTypes: {
    arrow: { control: "boolean" },
    content: { control: "text" },
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
          {tooltipVariants.map(
            ({ id, label, content, contentProps, rootProps }) => (
              <TooltipExample
                key={id}
                content={content}
                contentProps={contentProps}
                rootProps={rootProps}
              >
                <Button variant="outlined">{label}</Button>
              </TooltipExample>
            )
          )}
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

export const ImmediateDismissal: Story = {
  render: () => (
    <div>
      <Tooltip leaveDelayMs={300}>
        <TooltipTrigger>Dismissal target</TooltipTrigger>
        <TooltipContent>Dismissal description</TooltipContent>
      </Tooltip>
      <button type="button">Next target</button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Dismissal target" });
    await user.tab();
    await expect(trigger).toHaveFocus();
    await waitFor(() => expect(trigger).toHaveAttribute("aria-describedby"));
    await user.keyboard("{Escape}");
    await waitFor(
      () => expect(trigger).not.toHaveAttribute("aria-describedby"),
      { timeout: 150 }
    );
    await user.tab();
    await user.tab({ shift: true });
    await waitFor(() => expect(trigger).toHaveAttribute("aria-describedby"));
    await user.tab();
    await waitFor(
      () => expect(trigger).not.toHaveAttribute("aria-describedby"),
      { timeout: 150 }
    );
  },
};

const pause = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const HoverTiming: Story = {
  render: () => (
    <TooltipProvider enterDelayMs={200} skipDelayMs={300}>
      <div style={overviewStyles.row}>
        <Tooltip leaveDelayMs={300}>
          <TooltipTrigger>First hover target</TooltipTrigger>
          <TooltipContent>First hover description</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Second hover target</TooltipTrigger>
          <TooltipContent>Second hover description</TooltipContent>
        </Tooltip>
        <button type="button">Outside target</button>
      </div>
    </TooltipProvider>
  ),
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const first = canvas.getByRole("button", { name: "First hover target" });
    const second = canvas.getByRole("button", { name: "Second hover target" });
    const outside = canvas.getByRole("button", { name: "Outside target" });
    await user.hover(first);
    await pause(60);
    await expect(first).not.toHaveAttribute("aria-describedby");
    await waitFor(() => expect(first).toHaveAttribute("aria-describedby"), {
      timeout: 1000,
    });
    const content = document.querySelector<HTMLElement>(
      '[data-slot="tooltip-content"]'
    )!;
    await user.hover(content);
    await pause(350);
    await expect(first).toHaveAttribute("aria-describedby");
    await user.pointer({
      target: outside,
      coords: {
        clientX: outside.getBoundingClientRect().right,
        clientY: outside.getBoundingClientRect().bottom,
      },
    });
    await pause(60);
    await expect(first).toHaveAttribute("aria-describedby");
    await user.hover(first);
    await pause(350);
    await expect(first).toHaveAttribute("aria-describedby");
    await user.pointer({
      target: outside,
      coords: {
        clientX: outside.getBoundingClientRect().right,
        clientY: outside.getBoundingClientRect().bottom,
      },
    });
    await waitFor(() => expect(first).not.toHaveAttribute("aria-describedby"));
    await waitFor(() =>
      expect(within(document.body).queryByRole("tooltip")).toBeNull()
    );
    await user.hover(second);
    await waitFor(() => expect(second).toHaveAttribute("aria-describedby"), {
      timeout: 150,
    });
    await user.keyboard("{Escape}");
    await waitFor(
      () => expect(second).not.toHaveAttribute("aria-describedby"),
      { timeout: 150 }
    );
    await user.unhover(second);
    await pause(350);
    await user.hover(second);
    await pause(60);
    await expect(second).not.toHaveAttribute("aria-describedby");
    await waitFor(() => expect(second).toHaveAttribute("aria-describedby"), {
      timeout: 1000,
    });
    await user.keyboard("{Escape}");
    await user.unhover(second);
    await user.tab();
    await waitFor(() => expect(first).toHaveAttribute("aria-describedby"));
    await user.hover(first);
    await user.pointer({
      target: outside,
      coords: {
        clientX: outside.getBoundingClientRect().right,
        clientY: outside.getBoundingClientRect().bottom,
      },
    });
    await pause(350);
    await expect(first).toHaveAttribute("aria-describedby");
    await user.keyboard("{Escape}");
  },
};

function ControlledDescriptionExample() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <p id="tooltip-root-help">Root helper</p>
      <p id="tooltip-child-help">Child helper</p>
      <Tooltip open={open} onOpenChange={setOpen} leaveDelayMs={300}>
        <TooltipTrigger asChild aria-describedby="tooltip-root-help">
          <Button aria-describedby="tooltip-child-help">
            Controlled target
          </Button>
        </TooltipTrigger>
        <TooltipContent>Controlled description</TooltipContent>
      </Tooltip>
      <output aria-label="Tooltip state">{open ? "open" : "closed"}</output>
    </div>
  );
}

export const ControlledDescription: Story = {
  render: () => <ControlledDescriptionExample />,
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Controlled target" });
    const descriptionIds = () =>
      trigger.getAttribute("aria-describedby")?.split(" ");
    await expect(descriptionIds()).toEqual([
      "tooltip-root-help",
      "tooltip-child-help",
    ]);
    await user.tab();
    await waitFor(() =>
      expect(canvas.getByLabelText("Tooltip state")).toHaveTextContent("open")
    );
    const tooltip = within(document.body).getByRole("tooltip");
    await expect(descriptionIds()).toEqual([
      "tooltip-root-help",
      "tooltip-child-help",
      tooltip.id,
    ]);
    await user.keyboard("{Escape}");
    await waitFor(
      () =>
        expect(canvas.getByLabelText("Tooltip state")).toHaveTextContent(
          "closed"
        ),
      { timeout: 150 }
    );
    await expect(descriptionIds()).toEqual([
      "tooltip-root-help",
      "tooltip-child-help",
    ]);
    await expect(trigger).toHaveFocus();
    await user.tab();
    await user.tab({ shift: true });
    await waitFor(() =>
      expect(canvas.getByLabelText("Tooltip state")).toHaveTextContent("open")
    );
    await user.click(trigger);
    await waitFor(
      () =>
        expect(canvas.getByLabelText("Tooltip state")).toHaveTextContent(
          "closed"
        ),
      { timeout: 150 }
    );
  },
};

function LocalThemeExample() {
  return (
    <div style={{ ...overviewStyles.root, background: "var(--canvas)" }}>
      <Tooltip open>
        <TooltipTrigger>Theme target</TooltipTrigger>
        <TooltipContent arrow>
          테마 전환이 Portal에 유지됩니다.\n긴 설명은 화면 너비에 맞춰
          확인합니다.
        </TooltipContent>
      </Tooltip>
      <button
        type="button"
        onClick={() => {
          const root = document.documentElement;
          root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        }}
      >
        Toggle theme
      </button>
    </div>
  );
}

export const LocalDarkTheme: Story = {
  parameters: { themes: { themeOverride: "dark" } },
  render: () => <LocalThemeExample />,
  play: async ({ canvasElement }) => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    root.dataset.theme = "dark";
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const content = document.querySelector<HTMLElement>(
      '[data-slot="tooltip-content"]'
    )!;
    await waitFor(() =>
      expect(getComputedStyle(content).backgroundColor).toBe(
        "rgb(237, 237, 237)"
      )
    );
    await expect(getComputedStyle(content).color).toBe("rgb(20, 20, 20)");
    await expect(getComputedStyle(content).borderRadius).toBe("0px");
    const arrow = content.querySelector('[data-slot="tooltip-arrow"]')!;
    await expect(getComputedStyle(arrow).fill).toBe("rgb(237, 237, 237)");
    await user.click(canvas.getByRole("button", { name: "Toggle theme" }));
    await waitFor(() =>
      expect(getComputedStyle(content).backgroundColor).toBe("rgb(28, 28, 28)")
    );
    await expect(getComputedStyle(content).color).toBe("rgb(255, 255, 255)");
    await expect(getComputedStyle(arrow).fill).toBe("rgb(28, 28, 28)");
    if (previousTheme === null) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", previousTheme);
  },
};

function UnmountExample({ onOpenChange }: Pick<TooltipProps, "onOpenChange">) {
  const [mounted, setMounted] = React.useState(true);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  React.useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <TooltipProvider enterDelayMs={700} skipDelayMs={0}>
      <div style={overviewStyles.row}>
        {mounted && (
          <Tooltip
            enterDelayMs={100}
            leaveDelayMs={300}
            onOpenChange={onOpenChange}
          >
            <TooltipTrigger>Unmount target</TooltipTrigger>
            <TooltipContent>Unmount description</TooltipContent>
          </Tooltip>
        )}
        <button
          type="button"
          onPointerEnter={() => {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setMounted(false), 60);
          }}
        >
          Unmount after departure
        </button>
      </div>
    </TooltipProvider>
  );
}

export const DelayOverridesAndUnmount: Story = {
  args: { onOpenChange: fn() },
  render: ({ onOpenChange }) => <UnmountExample onOpenChange={onOpenChange} />,
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Unmount target" });
    await user.hover(trigger);
    await pause(40);
    await expect(trigger).not.toHaveAttribute("aria-describedby");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-describedby"), {
      timeout: 200,
    });
    const outside = canvas.getByRole("button", {
      name: "Unmount after departure",
    });
    await user.pointer({
      target: outside,
      coords: {
        clientX: outside.getBoundingClientRect().right,
        clientY: outside.getBoundingClientRect().bottom,
      },
    });
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: "Unmount target" })
      ).toBeNull()
    );
    await pause(350);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(1);
    await expect(args.onOpenChange).toHaveBeenCalledWith(true);
  },
};

export const DisabledReason: Story = {
  render: () => (
    <div style={overviewStyles.root}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled aria-describedby="tooltip-disabled-reason">
            저장
          </Button>
        </TooltipTrigger>
        <TooltipContent>저장하려면 제목을 입력하세요.</TooltipContent>
      </Tooltip>
      <p id="tooltip-disabled-reason" style={overviewStyles.note}>
        저장하려면 제목을 입력하세요.
      </p>
      <Button>다음 작업</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const user = userEvent.setup();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "저장" })).toBeDisabled();
    await user.tab();
    await expect(
      canvas.getByRole("button", { name: "다음 작업" })
    ).toHaveFocus();
    await expect(
      canvas.getByText("저장하려면 제목을 입력하세요.")
    ).toBeVisible();
  },
};

export const LongContent: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger>Long description target</TooltipTrigger>
      <TooltipContent arrow position="right">
        긴 설명과 공백 없는 단어도 화면 경계 안에서 줄바꿈합니다.
        veryLongUnbrokenDescriptionForNarrowScreenVerification
      </TooltipContent>
    </Tooltip>
  ),
};
