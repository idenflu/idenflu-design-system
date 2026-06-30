import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import {
  Alert,
  AlertTitle,
  type AlertSeverity,
  type AlertVariant,
} from "./Alert";
import { Button } from "../Button/Button";
import { Divider } from "../Divider";

const variants: AlertVariant[] = ["outlined", "filled"];
const severities: AlertSeverity[] = ["success", "info", "warning", "error"];

const overviewStyles = {
  root: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "var(--spacing-07)",
    padding: "0 var(--spacing-10)",
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
  matrix: {
    display: "grid",
    gap: "var(--spacing-06) var(--spacing-07)",
    gridTemplateColumns: "minmax(88px, 120px) repeat(2, minmax(240px, 1fr))",
    alignItems: "center",
    justifyItems: "center",
  },
  matrixHeader: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    textAlign: "center" as const,
  },
  matrixRowLabel: {
    color: "var(--text-secondary)",
    font: "var(--label-md)",
    textTransform: "capitalize" as const,
  },
  stack: {
    display: "grid",
    gap: "var(--spacing-04)",
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

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          "Alert는 사용자의 동작 결과를 즉시 피드백하는 non-modal 메시지입니다. " +
          "MUI Alert처럼 severity와 variant를 중심으로 API를 구성하고, " +
          "Carbon Inline Notification처럼 페이지 흐름 안에서 포커스를 빼앗지 않습니다. " +
          "제목은 title prop이 아니라 AlertTitle 합성 컴포넌트로 제공합니다. " +
          "기본 role은 error일 때 alert, 그 외 severity는 status입니다.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    severity: {
      control: "select",
      options: severities,
    },
    icon: {
      control: false,
    },
    action: {
      control: false,
    },
    onClose: {
      control: false,
    },
  },
  args: {
    children: (
      <>
        <AlertTitle>저장 완료</AlertTitle>
        변경 사항이 저장되었습니다.
      </>
    ),
    onClose: fn(),
    severity: "success",
    variant: "outlined",
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: () => (
    <div style={overviewStyles.root}>
      <OverviewSection title="Variant × Severity">
        <div style={overviewStyles.matrix}>
          <div />
          {variants.map((variant) => (
            <span key={variant} style={overviewStyles.matrixHeader}>
              {variant}
            </span>
          ))}
          {severities.map((severity) => (
            <React.Fragment key={severity}>
              <span style={overviewStyles.matrixRowLabel}>{severity}</span>
              {variants.map((variant) => (
                <Alert
                  key={`${severity}-${variant}`}
                  severity={severity}
                  variant={variant}
                >
                  <AlertTitle>{severity} alert</AlertTitle>
                  사용자 동작에 대한 피드백 메시지입니다.
                </Alert>
              ))}
            </React.Fragment>
          ))}
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Composition">
        <div style={overviewStyles.stack}>
          <Alert
            action={
              <Button color="neutral" size="sm" variant="ghost">
                Undo
              </Button>
            }
            severity="success"
          >
            <AlertTitle>게시물이 발행되었습니다</AlertTitle>
            필요하면 실행 취소할 수 있습니다.
          </Alert>
          <Alert onClose={fn()} severity="warning">
            <AlertTitle>권한 설정을 확인하세요</AlertTitle>
            일부 사용자는 이 변경 사항을 볼 수 없습니다.
          </Alert>
          <Alert icon={false} role="status" severity="info">
            아이콘 없이 보조 안내로 사용할 수 있습니다.
          </Alert>
        </div>
      </OverviewSection>

      <Divider flexItem fullWidth />

      <OverviewSection title="Accessibility Notes">
        <div style={overviewStyles.stack}>
          <Alert severity="info">
            <AlertTitle>Screen readers</AlertTitle>
            error는 즉시 피드백을 위해 role=&quot;alert&quot;로, 나머지는
            role=&quot;status&quot;로 announce됩니다. 긴급도가 다르면 role
            prop으로 직접 조정하세요.
          </Alert>
          <Alert severity="warning">
            <AlertTitle>Keyboard</AlertTitle>
            컴포넌트 자체는 포커스를 이동하지 않습니다. action 또는 close
            button을 제공하면 해당 컨트롤이 자연스러운 탭 순서에 포함됩니다.
          </Alert>
        </div>
      </OverviewSection>
    </div>
  ),
};

export const Playground: Story = {};
