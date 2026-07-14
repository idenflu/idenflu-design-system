/**
 * TimeScrollerPanel
 *
 * Drum-scroll picker for time. Each column shows 5 rows:
 *   [arrow-up, val-1, val (selected), val+1, arrow-down]
 *
 * The selected row is highlighted by a full-width overlay bar that spans
 * all three columns simultaneously, matching the Figma "Current Time Overlay".
 *
 * Accessibility: each column is a spinbutton (ARIA).
 *   - ArrowUp / ArrowDown adjust value while focused
 *   - Click prev/next rows or arrow buttons to adjust
 *   - Wheel event on a column adjusts value
 */
import * as React from "react";
import { cn } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./TimeScrollerPanel.module.css";

/* ─── helpers ─────────────────────────────────────────────────────── */

const pad2 = (n: number) => String(n).padStart(2, "0");

const wrap = (n: number, max: number) =>
  ((n % (max + 1)) + (max + 1)) % (max + 1);

/* ─── ScrollerColumn ─────────────────────────────────────────────── */

type ScrollerColumnProps = {
  label: string;
  value: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
};

/**
 * Pixel delta required before advancing one step in pixel-mode (trackpad).
 * Line-mode (mouse wheel) always advances one step per notch.
 */
const WHEEL_PIXEL_THRESHOLD = 40;

function ScrollerColumn({
  label,
  value,
  max,
  step,
  onChange,
}: ScrollerColumnProps) {
  const prevValue2 = wrap(value - 2 * step, max);
  const prevValue = wrap(value - step, max);
  const nextValue = wrap(value + step, max);
  const nextValue2 = wrap(value + 2 * step, max);
  const wheelAccum = React.useRef(0);

  const adjust = (delta: number) => {
    onChange(wrap(value + delta * step, max));
  };

  return (
    <div
      role="spinbutton"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={pad2(value)}
      tabIndex={0}
      className={styles.column}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          adjust(-1);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          adjust(1);
        }
      }}
      onWheel={(e) => {
        e.preventDefault();

        if (e.deltaMode !== 0) {
          adjust(e.deltaY > 0 ? 1 : -1);
          wheelAccum.current = 0;
          return;
        }

        wheelAccum.current += e.deltaY;
        while (Math.abs(wheelAccum.current) >= WHEEL_PIXEL_THRESHOLD) {
          adjust(wheelAccum.current > 0 ? 1 : -1);
          wheelAccum.current -=
            Math.sign(wheelAccum.current) * WHEEL_PIXEL_THRESHOLD;
        }
      }}
    >
      <button
        type="button"
        tabIndex={-1}
        className={cn(styles.slot, styles.slotArrow)}
        aria-label={`Decrease ${label}`}
        onClick={() => adjust(-1)}
      >
        <Icon name="keyboard-arrow-up" size="large" aria-hidden="true" />
      </button>
      <button
        type="button"
        tabIndex={-1}
        className={styles.slot}
        aria-label={`Previous ${label}`}
        onClick={() => onChange(prevValue2)}
      >
        {pad2(prevValue2)}
      </button>
      <button
        type="button"
        tabIndex={-1}
        className={styles.slot}
        aria-label={`Previous ${label}`}
        onClick={() => onChange(prevValue)}
      >
        {pad2(prevValue)}
      </button>
      <span className={cn(styles.slot, styles.slotSelected)} aria-hidden="true">
        {pad2(value)}
      </span>
      <button
        type="button"
        tabIndex={-1}
        className={styles.slot}
        aria-label={`Next ${label}`}
        onClick={() => onChange(nextValue)}
      >
        {pad2(nextValue)}
      </button>
      <button
        type="button"
        tabIndex={-1}
        className={styles.slot}
        aria-label={`Next ${label}`}
        onClick={() => onChange(nextValue2)}
      >
        {pad2(nextValue2)}
      </button>
      <button
        type="button"
        tabIndex={-1}
        className={cn(styles.slot, styles.slotArrow)}
        aria-label={`Increase ${label}`}
        onClick={() => adjust(1)}
      >
        <Icon name="keyboard-arrow-down" size="large" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ─── TimeScrollerPanel ──────────────────────────────────────────── */

export type TimeScrollerPanelProps = {
  /** "HH:mm:ss". Defaults to "00:00:00" if empty/missing. */
  value: string;
  onChange: (value: string) => void;
  minutesStep?: number;
  secondsStep?: number;
};

const parseTimeStr = (str: string): [number, number, number] => {
  const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(str ?? "");
  if (m) {
    const h = Number(m[1]);
    const mn = Number(m[2]);
    const s = Number(m[3]);
    if (h <= 23 && mn <= 59 && s <= 59) return [h, mn, s];
  }
  return [0, 0, 0];
};

export const TimeScrollerPanel = React.forwardRef<
  HTMLDivElement,
  TimeScrollerPanelProps
>(({ value, onChange, minutesStep = 1, secondsStep = 1 }, ref) => {
  const [h, m, s] = parseTimeStr(value);

  const emit = (nextH: number, nextM: number, nextS: number) => {
    onChange(`${pad2(nextH)}:${pad2(nextM)}:${pad2(nextS)}`);
  };

  return (
    <div ref={ref} className={styles.panel}>
      {/* Scroller: 3 columns + absolute overlay bar at selected row */}
      <div className={styles.scroller} aria-label="Select time">
        {/* Current Time Overlay — spans all 3 columns at the selected (middle) row */}
        <div className={styles.overlay} aria-hidden="true" />

        <ScrollerColumn
          label="Hours"
          value={h}
          max={23}
          step={1}
          onChange={(next) => emit(next, m, s)}
        />
        <ScrollerColumn
          label="Minutes"
          value={m}
          max={59}
          step={minutesStep}
          onChange={(next) => emit(h, next, s)}
        />
        <ScrollerColumn
          label="Seconds"
          value={s}
          max={59}
          step={secondsStep}
          onChange={(next) => emit(h, m, next)}
        />
      </div>
    </div>
  );
});

TimeScrollerPanel.displayName = "TimeScrollerPanel";
