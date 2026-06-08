export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Indexed by Date.getDay() (0 = Sunday).
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** Date -> "YYYY-MM-DD" (local). */
export const toISO = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** "YYYY-MM-DD" -> Date (local midnight) or null. */
export const parseISO = (iso: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  const date = new Date(year, month, day);
  // Reject overflow (e.g. "2026-02-30" -> Mar 2) by requiring a clean round-trip.
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
};

export const addDays = (date: Date, n: number): Date => {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  return x;
};

/** First day of the month `n` months from `date`. */
export const addMonths = (date: Date, n: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + n, 1);

/** 42 dates (6 weeks) covering the month, leading days from `weekStartsOn`. */
export const buildMonthGrid = (year: number, month: number, weekStartsOn: 0 | 1): Date[] => {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

/** Weekday short labels rotated to `weekStartsOn`. */
export const weekdayLabels = (weekStartsOn: 0 | 1): string[] =>
  Array.from({ length: 7 }, (_, i) => WEEKDAY_LABELS[(weekStartsOn + i) % 7]);

/** ISO date strings compare lexically == chronologically. */
export const isWithin = (iso: string, min?: string, max?: string): boolean =>
  (!min || iso >= min) && (!max || iso <= max);

export type DateFormatters = {
  monthLabel: (year: number, month: number) => string;
  weekdayLabels: (weekStartsOn: 0 | 1) => string[];
  display: (iso: string) => string;
  dayLabel: (date: Date) => string;
};

// A known Sunday, used as the rotation anchor for Intl weekday labels.
const WEEKDAY_ANCHOR = new Date(2024, 0, 7);

const englishFormatters: DateFormatters = {
  monthLabel: (year, month) => `${MONTH_LABELS[month]} ${year}`,
  weekdayLabels,
  display: (iso) => iso,
  dayLabel: (date) => `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
};

/**
 * Presentation formatters for a locale. value/min/max stay ISO; this only formats
 * the calendar's human-readable text. A falsy or invalid locale falls back to
 * English with ISO-passthrough display (byte-identical to the no-locale behavior).
 */
export const createDateFormatters = (locale?: string): DateFormatters => {
  if (!locale) return englishFormatters;
  try {
    const monthFmt = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" });
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const displayFmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    const dayLabelFmt = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
    return {
      monthLabel: (year, month) => monthFmt.format(new Date(year, month, 1)),
      weekdayLabels: (weekStartsOn) =>
        Array.from({ length: 7 }, (_, i) => weekdayFmt.format(addDays(WEEKDAY_ANCHOR, (weekStartsOn + i) % 7))),
      display: (iso) => {
        const date = parseISO(iso);
        return date ? displayFmt.format(date) : iso;
      },
      dayLabel: (date) => dayLabelFmt.format(date),
    };
  } catch {
    return englishFormatters;
  }
};
