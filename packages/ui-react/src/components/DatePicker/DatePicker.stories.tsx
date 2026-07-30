import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DatePicker } from "./DatePicker";
import { DateRange } from "./DateRange";
import type { DateRangeValue } from "./DateRange";

/* ─── DatePicker ─────────────────────────────────────────────────── */

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component:
          '날짜 선택 팝업 피커. `value`/`onChange`는 `Date#toISOString()` 형식. 입력·표시는 `"YYYY-MM-DD"`. 범위 선택은 `DatePickerRange`를 사용.',
      },
    },
  },
  args: {
    label: "날짜",
    // placeholder: "YYYY-MM-DD",
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: new Date(2026, 6, 2).toISOString() },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <DatePicker {...args} variant="default" label="Default" />
      <DatePicker {...args} variant="filled" label="Filled" />
      <DatePicker {...args} variant="outlined" label="Outlined" />
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
      <DatePicker {...args} size="sm" label="Small" />
      <DatePicker {...args} size="md" label="Medium" />
      <DatePicker {...args} size="lg" label="Large" />
    </div>
  ),
};

export const WithError: Story = {
  args: { error: "날짜를 선택해야 합니다", required: true },
};

export const WithHelperText: Story = {
  args: { helperText: "YYYY-MM-DD 형식으로 입력됩니다" },
};

export const Disabled: Story = {
  args: { disabled: true, value: new Date(2026, 6, 2).toISOString() },
};

export const ReadOnly: Story = {
  args: { readOnly: true, value: new Date(2026, 6, 2).toISOString() },
};

export const WithMinMax: Story = {
  args: { minDate: "2026-07-01", maxDate: "2026-07-31" },
  parameters: {
    docs: {
      description: {
        story: "`minDate`/`maxDate` 범위 외 날짜는 비활성화됩니다.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [v, setV] = React.useState(() => new Date(2026, 6, 2).toISOString());
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <DatePicker
          label="Controlled"
          value={v}
          onChange={setV}
          placeholder="날짜를 선택하세요"
        />
        <p style={{ margin: 0, fontSize: 14 }}>선택된 값: {v || "없음"}</p>
      </div>
    );
  },
};

/* ─── DatePickerRange ────────────────────────────────────────────── */

export const RangeDefault: StoryObj<typeof DateRange> = {
  render: () => <DateRange label="날짜 범위" placeholder="범위를 선택하세요" />,
  name: "Range / Default",
};

export const RangeControlled: StoryObj<typeof DateRange> = {
  render: () => {
    const [v, setV] = React.useState<DateRangeValue>(() => ({
      from: new Date(2026, 6, 1).toISOString(),
      to: new Date(2026, 6, 7).toISOString(),
    }));
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <DateRange label="Controlled Range" value={v} onChange={setV} />
        <p style={{ margin: 0, fontSize: 14 }}>
          from: {v.from || "—"} / to: {v.to || "—"}
        </p>
      </div>
    );
  },
  name: "Range / Controlled",
};

/**
 * ## Keyboard navigation
 *
 * | Key | 동작 |
 * |-----|------|
 * | `ArrowLeft/Right` | 하루 이동 |
 * | `ArrowUp/Down` | 일주일 이동 |
 * | `PageUp/Down` | 한 달 이동 |
 * | `Home/End` | 해당 주 첫날/마지막날 |
 * | `Enter / Space` | 날짜 선택 |
 * | `Escape` | 닫기 |
 */
export const KeyboardNavigation: Story = {
  args: { label: "Keyboard navigation" },
  name: "A11y / Keyboard navigation",
};
