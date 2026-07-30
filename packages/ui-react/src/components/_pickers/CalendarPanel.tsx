import * as React from "react";
import { cn } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import {
  addDays,
  addMonths,
  buildMonthGrid,
  createDateFormatters,
  isWithin,
  toISO,
} from "../../utils/dateUtils";
import styles from "./CalendarPanel.module.css";
import { IconButton } from "../IconButton/IconButton";

export type CalendarPanelProps = {
  year: number;
  month: number;
  /** ISO "YYYY-MM-DD" of the focused cell — managed by the parent. */
  focusISO: string;
  /** Single selection highlight. */
  selectedISO?: string;
  /** Range: committed start. */
  rangeFrom?: string;
  /** Range: committed end (null = not yet chosen). */
  rangeTo?: string | null;
  /** Range: first click placed, waiting for second click. */
  pendingFrom?: string;
  /** Range: day under the mouse during hover preview. */
  hoverISO?: string;
  minDate?: string;
  maxDate?: string;
  weekStartsOn?: 0 | 1;
  locale?: string;
  onMonthChange: (year: number, month: number) => void;
  onFocusChange: (iso: string) => void;
  onSelect: (iso: string) => void;
  onHover?: (iso: string) => void;
  onHoverEnd?: () => void;
};

export const CalendarPanel = React.forwardRef<
  HTMLDivElement,
  CalendarPanelProps
>(
  (
    {
      year,
      month,
      focusISO,
      selectedISO,
      rangeFrom,
      rangeTo,
      pendingFrom,
      hoverISO,
      minDate,
      maxDate,
      weekStartsOn = 0,
      locale,
      onMonthChange,
      onFocusChange,
      onSelect,
      onHover,
      onHoverEnd,
    },
    ref
  ) => {
    const todayISO = React.useMemo(() => toISO(new Date()), []);
    const dayRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
    const fmt = React.useMemo(() => createDateFormatters(locale), [locale]);
    const days = buildMonthGrid(year, month, weekStartsOn);

    React.useEffect(() => {
      dayRefs.current[focusISO]?.focus();
    }, [focusISO]);

    /* ── Slide direction ─────────────────────────────────────────────
     * Tied to the *target* month key so that:
     *  1. slideClass survives extra re-renders (focusISO etc.)
     *  2. a stale animationEnd from the previous grid cannot clear state
     *  3. consecutive same-direction navigations always update (new key)
     */
    type SlideAnim = { key: string; dir: "next" | "prev" };
    const [slideAnim, setSlideAnim] = React.useState<SlideAnim | null>(null);

    const gridKey = `${year}-${month}`;

    const changeMonth = (newYear: number, newMonth: number) => {
      const currNum = year * 12 + month;
      const nextNum = newYear * 12 + newMonth;
      const targetKey = `${newYear}-${newMonth}`;
      if (nextNum > currNum) setSlideAnim({ key: targetKey, dir: "next" });
      else if (nextNum < currNum) setSlideAnim({ key: targetKey, dir: "prev" });
      onMonthChange(newYear, newMonth);
    };

    const slideClass =
      slideAnim?.key === gridKey
        ? slideAnim.dir === "next"
          ? styles.slideNext
          : styles.slidePrev
        : undefined;

    const isRangeMode =
      rangeFrom !== undefined ||
      rangeTo !== undefined ||
      pendingFrom !== undefined;

    /** True when this date is a committed or pending endpoint. */
    const isEndpoint = (iso: string): boolean => {
      if (!isRangeMode) return iso === selectedISO;
      return iso === rangeFrom || iso === rangeTo || iso === pendingFrom;
    };

    /** True when this date falls between the two endpoints (exclusive). */
    const isIncluded = (iso: string): boolean => {
      if (!isRangeMode) return false;
      let a = "";
      let b = "";
      // pendingFrom 중에는 hoverISO가 있을 때만 프리뷰 범위 표시
      // (focusISO fallback 시 오늘~선택일 사이가 tint 되는 문제 방지)
      if (pendingFrom && hoverISO) {
        a = pendingFrom <= hoverISO ? pendingFrom : hoverISO;
        b = pendingFrom <= hoverISO ? hoverISO : pendingFrom;
      } else if (rangeFrom && rangeTo) {
        a = rangeFrom;
        b = rangeTo;
      }
      return Boolean(a && b && iso > a && iso < b);
    };

    /** True for the hovered potential end date during range selection. */
    const isEndRangeHovered = (iso: string): boolean =>
      Boolean(
        pendingFrom && hoverISO && iso === hoverISO && iso !== pendingFrom
      );

    const goMonth = (delta: number) => {
      const d = addMonths(new Date(year, month, 1), delta);
      changeMonth(d.getFullYear(), d.getMonth());
    };

    const moveFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const [y, m2, d] = focusISO.split("-").map(Number);
      const cur = new Date(y, m2 - 1, d);
      const weekday = (cur.getDay() - weekStartsOn + 7) % 7;
      let next: Date | null = null;

      if (e.key === "ArrowLeft") next = addDays(cur, -1);
      else if (e.key === "ArrowRight") next = addDays(cur, 1);
      else if (e.key === "ArrowUp") next = addDays(cur, -7);
      else if (e.key === "ArrowDown") next = addDays(cur, 7);
      else if (e.key === "PageUp")
        next = new Date(
          cur.getFullYear(),
          cur.getMonth() - 1,
          Math.min(
            cur.getDate(),
            new Date(cur.getFullYear(), cur.getMonth(), 0).getDate()
          )
        );
      else if (e.key === "PageDown")
        next = new Date(
          cur.getFullYear(),
          cur.getMonth() + 1,
          Math.min(
            cur.getDate(),
            new Date(cur.getFullYear(), cur.getMonth() + 2, 0).getDate()
          )
        );
      else if (e.key === "Home") next = addDays(cur, -weekday);
      else if (e.key === "End") next = addDays(cur, 6 - weekday);
      else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isWithin(focusISO, minDate, maxDate)) onSelect(focusISO);
        return;
      }

      if (next) {
        e.preventDefault();
        const nextISO = toISO(next);
        if (next.getFullYear() !== year || next.getMonth() !== month) {
          changeMonth(next.getFullYear(), next.getMonth());
        }
        onFocusChange(nextISO);
      }
    };

    return (
      <div ref={ref} className={styles.panel}>
        <div className={styles.header}>
          <IconButton
            variant="ghost"
            label="Previous month"
            icon={<Icon name="keyboard-arrow-left" />}
            size="md"
            color="neutral"
            onClick={() => goMonth(-1)}
          />
          <span className={styles.monthLabel}>
            {fmt.monthLabel(year, month)}
          </span>
          <IconButton
            variant="ghost"
            label="Next month"
            icon={<Icon name="keyboard-arrow-right" />}
            size="md"
            color="neutral"
            onClick={() => goMonth(1)}
          />
        </div>

        <div className={styles.weekdays} aria-hidden="true">
          {fmt.weekdayLabels(weekStartsOn).map((w, i) => (
            <span key={i} className={styles.weekday}>
              {w}
            </span>
          ))}
        </div>

        <div className={styles.gridWrapper}>
          <div
            key={gridKey}
            role="grid"
            aria-label={fmt.monthLabel(year, month)}
            className={cn(styles.grid, slideClass)}
            onKeyDown={moveFocus}
            onAnimationEnd={(e) => {
              if (e.target !== e.currentTarget) return;
              const endedKey = gridKey;
              setSlideAnim((prev) => (prev?.key === endedKey ? null : prev));
            }}
          >
            {Array.from({ length: 6 }, (_, row) => (
              <div role="row" key={row} className={styles.row}>
                {days.slice(row * 7, row * 7 + 7).map((d) => {
                  const iso = toISO(d);
                  const outside = d.getMonth() !== month;
                  const isDisabled = !isWithin(iso, minDate, maxDate);
                  const isToday = iso === todayISO;
                  const sel = isEndpoint(iso);
                  const included = isIncluded(iso);
                  const endRangeHovered = isEndRangeHovered(iso);

                  return (
                    <button
                      key={iso}
                      ref={(node) => {
                        dayRefs.current[iso] = node;
                      }}
                      type="button"
                      role="gridcell"
                      aria-label={fmt.dayLabel(d)}
                      aria-selected={sel}
                      aria-disabled={isDisabled || undefined}
                      tabIndex={iso === focusISO ? 0 : -1}
                      className={cn(
                        styles.day,
                        outside && styles.dayOutside,
                        isToday && !sel && !included && styles.dayToday,
                        isToday && sel && styles.dayTodaySelected,
                        isToday && included && styles.dayTodayIncluded,
                        sel && !isToday && styles.daySelected,
                        included && !isToday && styles.dayIncluded,
                        endRangeHovered && styles.dayEndRangeHovered,
                        isDisabled && styles.dayDisabled
                      )}
                      onMouseEnter={() => {
                        if (!isDisabled) onHover?.(iso);
                      }}
                      onMouseLeave={() => onHoverEnd?.()}
                      onClick={() => {
                        if (!isDisabled) onSelect(iso);
                      }}
                    >
                      <span className={styles.dayInner}>{d.getDate()}</span>
                      {/* Today dot — color varies by state */}
                      {isToday ? (
                        <span
                          className={cn(
                            styles.todayDot,
                            sel && styles.todayDotSelected,
                            included && styles.todayDotIncluded
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CalendarPanel.displayName = "CalendarPanel";
