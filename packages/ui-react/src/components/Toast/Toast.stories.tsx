import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Alert, AlertTitle, type AlertSeverity } from "../Alert/Alert";
import { Button } from "../Button/Button";
import { Divider } from "../Divider";
import { Toast, type ToastCloseReason, type ToastPosition } from "./Toast";

const positions: ToastPosition[] = [
  "top-start",
  "top",
  "top-end",
  "bottom-start",
  "bottom",
  "bottom-end",
];

const severities: AlertSeverity[] = ["success", "info", "warning", "error"];

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
    gap: "calc(var(--space-unit) * 2)",
  },
  note: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-body)/var(--line-height-body) var(--font-family-body)",
    margin: 0,
    maxWidth: "720px",
  },
  list: {
    color: "var(--text-secondary)",
    font: "var(--font-weight-regular) var(--font-size-body)/var(--line-height-body) var(--font-family-body)",
    margin: 0,
    maxWidth: "720px",
    paddingInlineStart: "1.25rem",
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

function ToastDemo({
  autoHideDuration = 5000,
  children,
  position = "bottom-end",
  title = "Campaign saved",
  message = "Undo is available for 10 seconds.",
  action,
  hideCloseButton,
  dismissOnEscape,
  triggerLabel = "Show toast",
}: {
  action?: React.ReactNode;
  autoHideDuration?: number | null;
  children?: React.ReactNode;
  dismissOnEscape?: boolean;
  hideCloseButton?: boolean;
  message?: React.ReactNode;
  position?: ToastPosition;
  title?: React.ReactNode;
  triggerLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [lastReason, setLastReason] = React.useState<ToastCloseReason | null>(
    null
  );

  const handleClose = React.useCallback(
    (_event: Event | React.SyntheticEvent, reason: ToastCloseReason) => {
      setOpen(false);
      setLastReason(reason);
      fn()();
    },
    []
  );

  return (
    <>
      <div style={overviewStyles.row}>
        <Button onClick={() => setOpen(true)} size="sm" variant="outlined">
          {triggerLabel}
        </Button>
        {lastReason ? (
          <span style={overviewStyles.note}>Closed via: {lastReason}</span>
        ) : null}
      </div>
      <Toast
        action={action}
        autoHideDuration={autoHideDuration}
        dismissOnEscape={dismissOnEscape}
        hideCloseButton={hideCloseButton}
        message={children ? undefined : message}
        onClose={handleClose}
        open={open}
        position={position}
        title={children ? undefined : title}
      >
        {children}
      </Toast>
    </>
  );
}

type PlaygroundArgs = {
  alertSeverity: AlertSeverity;
  autoHideDuration: number;
  contentMode: "message" | "alert";
  dismissOnEscape: boolean;
  hideCloseButton: boolean;
  message: string;
  persistent: boolean;
  position: ToastPosition;
  showAction: boolean;
  title: string;
  triggerLabel: string;
};

const meta = {
  title: "Components/Toast",
  parameters: {
    docs: {
      description: {
        component:
          "Toast는 UI 위에 잠깐 떠 있는 비차단 알림 컨테이너입니다. `position`, `autoHideDuration`, `onClose`로 위치·자동 닫힘·닫힘 사유를 제어합니다. severity가 필요하면 `children`에 `Alert`를 넣어 표현합니다.",
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: positions,
    },
    contentMode: {
      control: "radio",
      options: ["message", "alert"],
    },
    alertSeverity: {
      control: "select",
      options: severities,
    },
    persistent: { control: "boolean" },
    autoHideDuration: {
      control: { type: "number", min: 1000, step: 500 },
      if: { arg: "persistent", truthy: false },
    },
    title: { control: "text" },
    message: { control: "text" },
    showAction: { control: "boolean" },
    hideCloseButton: { control: "boolean" },
    dismissOnEscape: { control: "boolean" },
    triggerLabel: { control: "text" },
  },
  args: {
    alertSeverity: "success",
    autoHideDuration: 5000,
    contentMode: "message",
    dismissOnEscape: true,
    hideCloseButton: false,
    message: "Undo is available for 10 seconds.",
    persistent: false,
    position: "bottom-end",
    showAction: false,
    title: "Campaign saved",
    triggerLabel: "Show toast",
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;

type Story = StoryObj<PlaygroundArgs>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "fullscreen",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Default">
        <p style={overviewStyles.note}>
          기본 `title`/`message` 조합으로 단순 알림을 표시합니다.
        </p>
        <ToastDemo autoHideDuration={null} />
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="With action">
        <p style={overviewStyles.note}>
          `action`은 content와 닫기 버튼 아래 행에 배치됩니다.
        </p>
        <ToastDemo
          action={
            <Button size="xs" variant="ghost">
              Undo
            </Button>
          }
        />
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="With Alert">
        <p style={overviewStyles.note}>
          severity 표현은 `children`에 `Alert`를 넣어 처리합니다.
        </p>
        <ToastDemo hideCloseButton autoHideDuration={null}>
          <Alert severity="success" variant="filled">
            <AlertTitle>Campaign saved</AlertTitle>
            Undo is available for 10 seconds.
          </Alert>
        </ToastDemo>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Alert severities">
        <p style={overviewStyles.note}>
          각 버튼으로 severity별 Alert toast를 열어볼 수 있습니다.
        </p>
        <div style={overviewStyles.row}>
          {severities.map((severity) => (
            <ToastDemo key={severity} hideCloseButton triggerLabel={severity}>
              <Alert severity={severity} variant="filled">
                <AlertTitle>{severity} alert</AlertTitle>
                상태 메시지는 Alert가 담당합니다.
              </Alert>
            </ToastDemo>
          ))}
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Persistent">
        <p style={overviewStyles.note}>
          `autoHideDuration={null}`이면 타임아웃 없이 수동으로만 닫힙니다.
        </p>
        <ToastDemo autoHideDuration={null} hideCloseButton>
          <Alert severity="error" variant="filled">
            <AlertTitle>Sync failed</AlertTitle>
            Retry when the workspace reconnects.
          </Alert>
        </ToastDemo>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Positions">
        <p style={overviewStyles.note}>
          `position`으로 viewport 모서리 배치를 제어합니다.
        </p>
        <div style={overviewStyles.row}>
          {positions.map((position) => (
            <ToastDemo
              key={position}
              autoHideDuration={4000}
              message={`Position: ${position}`}
              position={position}
              title="Toast position"
              triggerLabel={position}
            />
          ))}
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Accessibility">
        <ul style={overviewStyles.list}>
          <li>Toast shell은 `role="presentation"`입니다.</li>
          <li>기본 `title`/`message`는 내부 `role="status"`로 읽습니다.</li>
          <li>`Alert` children은 Alert의 `role`/`aria-live`를 따릅니다.</li>
          <li>키보드 포커스는 toast로 이동하지 않습니다.</li>
          <li>Escape, 닫기 버튼, 타임아웃으로 닫을 수 있습니다.</li>
          <li>바깥 클릭으로는 닫히지 않습니다.</li>
        </ul>
        <ToastDemo hideCloseButton>
          <Alert severity="error" variant="filled">
            <AlertTitle>Sync failed</AlertTitle>
            Changes are still local.
          </Alert>
        </ToastDemo>
      </OverviewSection>
    </div>
  ),
};

function PlaygroundToast({
  alertSeverity,
  autoHideDuration,
  contentMode,
  dismissOnEscape,
  hideCloseButton,
  message,
  persistent,
  position,
  showAction,
  title,
  triggerLabel,
}: PlaygroundArgs) {
  const [open, setOpen] = React.useState(false);

  const handleClose = React.useCallback(
    (_event: Event | React.SyntheticEvent, _reason: ToastCloseReason) => {
      setOpen(false);
      fn()();
    },
    []
  );

  const action = showAction ? (
    <Button size="xs" variant="ghost">
      Undo
    </Button>
  ) : undefined;

  const children =
    contentMode === "alert" ? (
      <Alert severity={alertSeverity} variant="filled">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    ) : undefined;

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" variant="outlined">
        {triggerLabel}
      </Button>
      <Toast
        action={action}
        autoHideDuration={persistent ? null : autoHideDuration}
        dismissOnEscape={dismissOnEscape}
        hideCloseButton={hideCloseButton}
        message={contentMode === "message" ? message : undefined}
        onClose={handleClose}
        open={open}
        position={position}
        title={contentMode === "message" ? title : undefined}
      >
        {children}
      </Toast>
    </>
  );
}

export const Playground: Story = {
  parameters: {
    layout: "centered",
  },
  render: (args) => <PlaygroundToast {...args} />,
};
