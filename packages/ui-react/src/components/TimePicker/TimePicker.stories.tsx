import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { TimePicker } from "./TimePicker";
import { TimeRange } from "./TimeRange";
import type { TimeRangeValue } from "./TimeRange";

/* ─── TimePicker ─────────────────────────────────────────────────── */

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: {
    docs: {
      description: {
        component:
          '시간 선택 드럼 피커. `value`/`onChange`는 `Date#toISOString()` 형식(1970-01-01 로컬 기준). 입력·표시는 `"HH:mm:ss"`. 범위 선택은 `TimePickerRange`를 사용.',
      },
    },
  },
  args: {
    label: "시간",
    placeholder: "HH:mm:ss",
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: new Date(1970, 0, 1, 14, 30, 0).toISOString() },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <TimePicker {...args} variant="default" label="Default" />
      <TimePicker {...args} variant="filled" label="Filled" />
      <TimePicker {...args} variant="outlined" label="Outlined" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 24,
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      <TimePicker {...args} size="sm" label="Small" />
      <TimePicker {...args} size="md" label="Medium" />
      <TimePicker {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithMinutesStep: Story = {
  args: { minutesStep: 15, label: "분 단계: 15" },
  parameters: {
    docs: {
      description: {
        story:
          "`minutesStep=15`으로 분 선택이 0, 15, 30, 45 단위로 이동합니다.",
      },
    },
  },
};

export const WithError: Story = {
  args: { error: "시간을 선택해야 합니다", required: true },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date(1970, 0, 1, 14, 30, 0).toISOString(),
  },
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState(() =>
      new Date(1970, 0, 1, 14, 30, 0).toISOString()
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <TimePicker label="Controlled" value={v} onChange={setV} />
        <p style={{ margin: 0, fontSize: 14 }}>선택된 값: {v}</p>
      </div>
    );
  },
};

/* ─── TimePickerRange ────────────────────────────────────────────── */

export const RangeDefault: StoryObj<typeof TimeRange> = {
  render: () => (
    <TimeRange label="시간 범위" placeholder="HH:mm:ss – HH:mm:ss" />
  ),
  name: "Range / Default",
};

export const RangeControlled: StoryObj<typeof TimeRange> = {
  render: () => {
    const [v, setV] = React.useState<TimeRangeValue>(() => ({
      from: new Date(1970, 0, 1, 9, 0, 0).toISOString(),
      to: new Date(1970, 0, 1, 18, 0, 0).toISOString(),
    }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <TimeRange label="Controlled Range" value={v} onChange={setV} />
        <p style={{ margin: 0, fontSize: 14 }}>
          from: {v.from || "—"} / to: {v.to || "—"}
        </p>
      </div>
    );
  },
  name: "Range / Controlled",
};

/**
 * ## Keyboard navigation (TimeScrollerPanel spinbutton)
 *
 * | Key | 동작 |
 * |-----|------|
 * | `ArrowUp` | 값 감소 |
 * | `ArrowDown` | 값 증가 |
 * | `Tab` | 다음 컬럼으로 이동 |
 * | `Escape` | 닫기 |
 */
export const KeyboardNavigation: Story = {
  args: { label: "Keyboard navigation" },
  name: "A11y / Keyboard navigation",
};
