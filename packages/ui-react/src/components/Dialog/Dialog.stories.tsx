import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../Button/Button";
import { TextInput } from "../TextInput/TextInput";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogSize,
} from "./Dialog";

const sizes: DialogSize[] = ["contain", "sm", "md", "lg"];

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

type ConfirmationDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  defaultOpen?: boolean;
  description?: string;
  dismissOnBackdrop?: boolean;
  dismissOnEscape?: boolean;
  onOpenChange?: (open: boolean) => void;
  showClose?: boolean;
  showDescription?: boolean;
  size?: DialogSize;
  title?: string;
  triggerLabel?: string;
};

function ConfirmationDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
  defaultOpen = false,
  description = "This action cannot be undone. The campaign and all related assets will be permanently removed.",
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  onOpenChange,
  showClose = true,
  showDescription = true,
  size = "md",
  title = "Delete campaign?",
  triggerLabel = "Open dialog",
}: ConfirmationDialogProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} size={size}>
      <DialogTrigger asChild>
        <Button variant="default">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent
        dismissOnBackdrop={dismissOnBackdrop}
        dismissOnEscape={dismissOnEscape}
        showClose={showClose}
        size={size}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {showDescription ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogBody>
        <DialogFooter>
          <Button
            color="neutral"
            onClick={() => handleOpenChange(false)}
            size="lg"
            variant="outlined"
          >
            {cancelLabel}
          </Button>
          <Button
            color="danger"
            onClick={() => handleOpenChange(false)}
            size="lg"
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ControlledDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open controlled dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Controlled dialog</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>
              Use <code>open</code> and <code>onOpenChange</code> for fully
              controlled state.
            </p>
          </DialogBody>
          <DialogFooter>
            <Button
              color="neutral"
              onClick={() => setOpen(false)}
              variant="outlined"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Invite member</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>
              Send an invitation email to add a new team member.
            </DialogDescription>
            <TextInput
              autoFocus
              label="Email address"
              placeholder="name@company.com"
              type="email"
              fullWidth
            />
            <TextInput
              label="Name"
              placeholder="John Doe"
              type="text"
              fullWidth
            />
          </DialogBody>
          <DialogFooter>
            <Button
              color="neutral"
              onClick={() => setOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ScrollableDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open scrollable dialog</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            ))}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Accept</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type PlaygroundArgs = {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  dismissOnBackdrop: boolean;
  dismissOnEscape: boolean;
  showClose: boolean;
  showDescription: boolean;
  size: DialogSize;
  title: string;
  triggerLabel: string;
};

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component:
          "Compound modal dialog. Focus is trapped while open, Escape closes by default, and focus returns to the trigger on close. Pair `DialogTitle` or `aria-label` on `DialogContent` for an accessible name.",
      },
    },
  },
  argTypes: {
    size: {
      control: "radio",
      options: sizes,
    },
    dismissOnBackdrop: { control: "boolean" },
    dismissOnEscape: { control: "boolean" },
    showClose: { control: "boolean" },
    showDescription: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    triggerLabel: { control: "text" },
    cancelLabel: { control: "text" },
    confirmLabel: { control: "text" },
  },
  args: {
    cancelLabel: "Cancel",
    confirmLabel: "Delete",
    description:
      "This action cannot be undone. The campaign and all related assets will be permanently removed.",
    dismissOnBackdrop: true,
    dismissOnEscape: true,
    showClose: true,
    showDescription: true,
    size: "md",
    title: "Delete campaign?",
    triggerLabel: "Open dialog",
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
      <OverviewSection title="Default">
        <ConfirmationDialog />
      </OverviewSection>

      <OverviewSection title="Sizes">
        <div style={overviewStyles.row}>
          {sizes.map((size) => (
            <ConfirmationDialog
              key={size}
              size={size}
              triggerLabel={`${size} dialog`}
            />
          ))}
        </div>
      </OverviewSection>

      <OverviewSection title="Controlled">
        <p style={overviewStyles.note}>
          Trigger와 dialog state를 분리해 <code>open</code>과{" "}
          <code>onOpenChange</code>로 완전 제어합니다.
        </p>
        <ControlledDialogDemo />
      </OverviewSection>

      <OverviewSection title="Form dialog">
        <p style={overviewStyles.note}>
          폼 필드가 있는 dialog에서는 첫 입력에 <code>autoFocus</code>를 두는
          것이 일반적입니다.
        </p>
        <FormDialogDemo />
      </OverviewSection>

      <OverviewSection title="Non dismissible backdrop">
        <p style={overviewStyles.note}>
          <code>dismissOnBackdrop=false</code>일 때 배경 클릭으로 닫히지
          않습니다. Escape는 기본적으로 동작합니다.
        </p>
        <ConfirmationDialog
          dismissOnBackdrop={false}
          triggerLabel="Open non-dismissible backdrop"
        />
      </OverviewSection>

      <OverviewSection title="Scrollable">
        <p style={overviewStyles.note}>
          본문이 길면 dialog surface 내부에서 스크롤됩니다.
        </p>
        <ScrollableDialogDemo />
      </OverviewSection>

      <OverviewSection title="Accessibility">
        <p style={overviewStyles.note}>
          Tab과 Shift+Tab으로 dialog 내부 focus를 순환합니다. Escape는{" "}
          <code>dismissOnEscape</code>가 활성화된 경우 dialog를 닫습니다. 닫힐
          때 focus는 trigger로 복원됩니다.
        </p>
        <p style={overviewStyles.note}>
          Surface는 <code>role=&quot;dialog&quot;</code>과{" "}
          <code>aria-modal=&quot;true&quot;</code>를 사용합니다.{" "}
          <code>DialogTitle</code>로 <code>aria-labelledby</code>를 연결하거나,
          visible title이 없으면 <code>aria-label</code>을{" "}
          <code>DialogContent</code>에 전달합니다.
        </p>
        <p style={overviewStyles.note}>
          Form dialog는 첫 입력에 focus를 두고, destructive confirmation은 덜
          파괴적인 action에 초기 focus를 두는 편이 좋습니다.
        </p>
        <ConfirmationDialog triggerLabel="Try keyboard navigation" />
      </OverviewSection>

      <OverviewSection title="With actions">
        <p style={overviewStyles.note}>
          <code>onOpenChange</code>로 open state 변화를 추적합니다. Actions
          패널에서 이벤트 로그를 확인하세요.
        </p>
        <ConfirmationDialog
          onOpenChange={fn()}
          triggerLabel="Open with actions"
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
    cancelLabel,
    confirmLabel,
    description,
    dismissOnBackdrop,
    dismissOnEscape,
    showClose,
    showDescription,
    size,
    title,
    triggerLabel,
  }) => (
    <ConfirmationDialog
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      description={description}
      dismissOnBackdrop={dismissOnBackdrop}
      dismissOnEscape={dismissOnEscape}
      onOpenChange={fn()}
      showClose={showClose}
      showDescription={showDescription}
      size={size}
      title={title}
      triggerLabel={triggerLabel}
    />
  ),
};
