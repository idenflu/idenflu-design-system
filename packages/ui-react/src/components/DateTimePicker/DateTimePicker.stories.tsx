import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DateTimePicker } from "./DateTimePicker";
import { DateTimeRange } from "./DateTimeRange";
import type { DateTimeRangeValue } from "./DateTimeRange";

/* ─── DateTimePicker ─────────────────────────────────────────────── */

const meta: Meta<typeof DateTimePicker> = {
  title: "Components/DateTimePicker",
  component: DateTimePicker,
  parameters: {
    docs: {
      description: {
        component:
          '날짜와 시간을 함께 선택하는 피커. `value`/`onChange`는 `Date#toISOString()` 형식(예: `"2026-07-02T05:30:00.000Z"`). 입력·표시는 `"YYYY-MM-DD HH:mm:ss"`(T, Z 제외). 범위 선택은 `DateTimePickerRange`를 사용하며, From 날짜·시간 선택 후 Next → To 날짜·시간 선택 → Done 순서로 진행합니다.',
      },
    },
  },
  args: {
    label: "날짜/시간",
    placeholder: "Select date & time",
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: "2026-07-02T05:30:00.000Z" },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <DateTimePicker {...args} variant="default" label="Default" />
      <DateTimePicker {...args} variant="filled" label="Filled" />
      <DateTimePicker {...args} variant="outlined" label="Outlined" />
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
      <DateTimePicker {...args} size="sm" label="Small" />
      <DateTimePicker {...args} size="md" label="Medium" />
      <DateTimePicker {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithError: Story = {
  args: { error: "날짜와 시간을 선택해야 합니다", required: true },
};

export const Disabled: Story = {
  args: { disabled: true, value: "2026-07-02T05:30:00.000Z" },
};

export const WithMinMax: Story = {
  args: {
    minDate: "2026-07-01",
    maxDate: "2026-07-31",
    label: "7월만 선택 가능",
  },
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState("2026-07-02T00:00:00.000Z");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <DateTimePicker label="Controlled" value={v} onChange={setV} />
        <p style={{ margin: 0, fontSize: 14 }}>선택된 값: {v || "없음"}</p>
      </div>
    );
  },
};

/* ─── DateTimePickerRange ────────────────────────────────────────── */

export const RangeDefault: StoryObj<typeof DateTimeRange> = {
  render: () => (
    <DateTimeRange
      label="날짜/시간 범위"
      placeholder="Select date & time range"
    />
  ),
  name: "Range / Default",
};

export const RangeControlled: StoryObj<typeof DateTimeRange> = {
  render: () => {
    const [v, setV] = React.useState<DateTimeRangeValue>({
      from: "2026-07-01T00:00:00.000Z",
      to: "2026-07-07T09:00:00.000Z",
    });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <DateTimeRange label="Controlled Range" value={v} onChange={setV} />
        <p style={{ margin: 0, fontSize: 14 }}>
          from: {v.from || "—"}
          <br />
          to: {v.to || "—"}
        </p>
      </div>
    );
  },
  name: "Range / Controlled",
};
