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
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(date.getTime()) ? null : date;
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
