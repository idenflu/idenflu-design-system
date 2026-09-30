import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../Button/Button";
import { Drawer, type DrawerSide, type DrawerSize } from "./Drawer";

const sides: DrawerSide[] = ["left", "right", "top", "bottom"];
const sizes: DrawerSize[] = ["sm", "md", "lg"];

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
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "var(--spacing-05)",
  },
  note: {
    color: "var(--text-secondary)",
    font: "var(--body-md)",
    margin: 0,
    maxWidth: "720px",
  },
  nav: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-02)",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navItem: {
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    font: "var(--body-md)",
    padding: "var(--spacing-03) var(--spacing-04)",
    textDecoration: "none",
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

type SidebarDrawerProps = {
  defaultOpen?: boolean;
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  onOpenChange?: (open: boolean) => void;
  showClose?: boolean;
  showDescription?: boolean;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: string;
  openButtonLabel?: string;
};

function SidebarDrawer({
  defaultOpen = false,
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  onOpenChange,
  showClose = true,
  showDescription = true,
  side = "left",
  size = "md",
  title = "Navigation",
  openButtonLabel = "Open sidebar",
}: SidebarDrawerProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outlined">
        {openButtonLabel}
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        onOpenChange={handleOpenChange}
        side={side}
        size={size}
        dismissOnBackdrop={dismissOnBackdrop}
        dismissOnEscape={dismissOnEscape}
        showClose={showClose}
      >
        <Drawer.Header>
          <Drawer.Header.Title>{title}</Drawer.Header.Title>
          {showDescription ? (
            <Drawer.Header.Description>
              Temporary navigation drawer for sidebar destinations.
            </Drawer.Header.Description>
          ) : null}
        </Drawer.Header>
        <Drawer.Body>
          <nav aria-label="Sidebar">
            <ul style={overviewStyles.nav}>
              {["Dashboard", "Campaigns", "Reports", "Settings"].map((item) => (
                <li key={item}>
                  <a href="#" style={overviewStyles.navItem}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button color="neutral" size="lg" variant="outlined">
              Close
            </Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}

function ControlledDrawerDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={overviewStyles.row}>
      <Button onClick={() => setOpen(true)} variant="default">
        Open controlled drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        onOpenChange={setOpen}
        side="right"
        size="md"
      >
        <Drawer.Header>
          <Drawer.Header.Title>Controlled drawer</Drawer.Header.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p>
            <code>open</code>과 <code>onClose</code>로 외부에서 상태를
            제어합니다.
          </p>
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

function ScrollableDrawerDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outlined">
        Open scrollable drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" size="sm">
        <Drawer.Header>
          <Drawer.Header.Title>Filters</Drawer.Header.Title>
        </Drawer.Header>
        <Drawer.Body>
          {Array.from({ length: 24 }, (_, index) => (
            <p key={index}>Filter option {index + 1}</p>
          ))}
        </Drawer.Body>
        <Drawer.Footer>
          <Button onClick={() => setOpen(false)} size="lg">
            Apply
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}

type PlaygroundArgs = SidebarDrawerProps & {
  description?: string;
};

const meta = {
  title: "Components/Drawer",
  component: SidebarDrawer,
  tags: ["autodocs"],
  argTypes: {
    side: {
      control: "select",
      options: sides,
    },
    size: {
      control: "select",
      options: sizes,
    },
    dismissOnBackdrop: { control: "boolean" },
    dismissOnEscape: { control: "boolean" },
    showClose: { control: "boolean" },
    showDescription: { control: "boolean" },
    title: { control: "text" },
    openButtonLabel: { control: "text" },
  },
  args: {
    dismissOnBackdrop: true,
    dismissOnEscape: true,
    showClose: true,
    showDescription: true,
    side: "left",
    size: "md",
    title: "Navigation",
    openButtonLabel: "Open sidebar",
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
      <OverviewSection title="Default sidebar">
        <SidebarDrawer />
      </OverviewSection>

      <OverviewSection title="Sides">
        <div style={overviewStyles.row}>
          {sides.map((side) => (
            <SidebarDrawer
              key={side}
              side={side}
              openButtonLabel={`${side} drawer`}
            />
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Sizes">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <SidebarDrawer
              key={size}
              size={size}
              openButtonLabel={`${size} drawer`}
            />
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Controlled">
        <p style={overviewStyles.note}>
          외부 버튼에서 <code>open</code>과 <code>onClose</code>로 완전 제어할
          수 있습니다.
        </p>
        <ControlledDrawerDemo />
      </OverviewSection>

      <OverviewSection title="Scrollable body">
        <ScrollableDrawerDemo />
      </OverviewSection>

      <OverviewSection title="Non dismissible backdrop">
        <SidebarDrawer
          dismissOnBackdrop={false}
          openButtonLabel="Open non-dismissible backdrop"
        />
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Tab과 Shift+Tab으로 drawer 내부 focus를 순환합니다. Escape는{" "}
          <code>dismissOnEscape</code>가 활성화된 경우 drawer를 닫습니다. 닫힐
          때 focus는 열기 전 활성 요소로 복원됩니다.
        </p>
        <p style={overviewStyles.note}>
          Surface는 <code>role=&quot;dialog&quot;</code>과{" "}
          <code>aria-modal=&quot;true&quot;</code>를 사용합니다.{" "}
          <code>Drawer.Header.Title</code>로 <code>aria-labelledby</code>를
          연결하거나, visible title이 없으면 <code>aria-label</code>을{" "}
          <code>Drawer</code>에 전달합니다.
        </p>
        <SidebarDrawer openButtonLabel="Try keyboard navigation" />
      </OverviewSection>

      <OverviewSection title="With actions">
        <SidebarDrawer
          onOpenChange={fn()}
          openButtonLabel="Open with actions"
        />
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: ({
    dismissOnBackdrop,
    dismissOnEscape,
    showClose,
    showDescription,
    side,
    size,
    title,
    openButtonLabel,
  }) => (
    <SidebarDrawer
      dismissOnBackdrop={dismissOnBackdrop}
      dismissOnEscape={dismissOnEscape}
      onOpenChange={fn()}
      showClose={showClose}
      showDescription={showDescription}
      side={side}
      size={size}
      title={title}
      openButtonLabel={openButtonLabel}
    />
  ),
};
