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
/* ─── Time utilities ─────────────────────────────────────────────── */

/** "HH:mm:ss" → [h, m, s] (24h) or null on invalid input. */
export const parseTime = (str: string): [number, number, number] | null => {
  const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(str ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const mn = Number(m[2]);
  const s = Number(m[3]);
  if (h > 23 || mn > 59 || s > 59) return null;
  return [h, mn, s];
};

/** [h, m, s] → "HH:mm:ss". */
export const formatTime = (h: number, m: number, s: number): string =>
  `${pad2(h)}:${pad2(m)}:${pad2(s)}`;

/** Time-only value anchor (local midnight on 1970-01-01). */
export const TIME_VALUE_ANCHOR_DATE = "1970-01-01";

/** Stored date value (toISOString) → local `"YYYY-MM-DD"`. */
export const parseDateValue = (value: string): string => {
  if (!value) return "";
  const parts = parseDateTimeISO(value);
  return parts?.date ?? "";
};

/** Local `"YYYY-MM-DD"` → Date#toISOString() (local midnight). */
export const formatDateISO = (date: string): string =>
  formatDateTimeISO(date, "00:00:00");

/** Stored date value → display/input `"YYYY-MM-DD"`. */
export const formatDateDisplay = (value: string): string =>
  parseDateValue(value);

/** `"YYYY-MM-DD"` or ISO string → local Date at midnight or null. */
export const parseDateInput = (str: string): Date | null => {
  const trimmed = str.trim();
  if (!trimmed) return null;

  const dateOnly = parseISO(trimmed);
  if (dateOnly) return dateOnly;

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** Stored time value (toISOString) → local `"HH:mm:ss"`. */
export const parseTimeValue = (value: string): string => {
  if (!value) return "";
  const parts = parseDateTimeISO(value);
  return parts?.time ?? "";
};

/** Local `"HH:mm:ss"` → Date#toISOString() (anchored to 1970-01-01 local). */
export const formatTimeISO = (time: string): string =>
  formatDateTimeISO(TIME_VALUE_ANCHOR_DATE, time);

/** Stored time value → display/input `"HH:mm:ss"`. */
export const formatTimeDisplay = (value: string): string =>
  parseTimeValue(value);

/** `"HH:mm:ss"` or ISO string → local Date on time anchor or null. */
export const parseTimeInput = (str: string): Date | null => {
  const trimmed = str.trim();
  if (!trimmed) return null;

  const time = parseTime(trimmed);
  if (time) {
    return new Date(1970, 0, 1, time[0], time[1], time[2]);
  }

  return parseDateTimeInput(trimmed);
};

/** Compare stored date value against `YYYY-MM-DD` min/max bounds. */
export const isWithinDateValue = (
  value: string,
  min?: string,
  max?: string
): boolean => {
  const date = parseDateValue(value);
  if (!date) return true;
  return isWithin(date, min, max);
};

export type InputValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export const DATE_INPUT_FORMAT = "YYYY-MM-DD";
export const TIME_INPUT_FORMAT = "HH:mm:ss";
export const DATETIME_INPUT_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DATE_RANGE_INPUT_FORMAT = "YYYY-MM-DD ~ YYYY-MM-DD";
export const TIME_RANGE_INPUT_FORMAT = "HH:mm:ss – HH:mm:ss";
export const DATETIME_RANGE_INPUT_FORMAT =
  "YYYY-MM-DD HH:mm:ss – YYYY-MM-DD HH:mm:ss";

const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_INPUT_PATTERN = /^\d{2}:\d{2}:\d{2}$/;
const DATETIME_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const RANGE_SEP_PATTERN = /\s*[~–]\s*/;

export const splitRangeInput = (
  str: string
): [string] | [string, string] | null => {
  const trimmed = str.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(RANGE_SEP_PATTERN).filter(Boolean);
  if (parts.length === 1) return [parts[0]];
  if (parts.length === 2) return [parts[0], parts[1]];
  return null;
};

type ValidateOptions = {
  required?: boolean;
  minDate?: string;
  maxDate?: string;
};

export const validateDateInput = (
  str: string,
  { required = false, minDate, maxDate }: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return required
      ? { valid: false, message: `${DATE_INPUT_FORMAT} 형식으로 입력해 주세요.` }
      : { valid: true };
  }

  if (!DATE_INPUT_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: `${DATE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  if (!parseISO(trimmed)) {
    return { valid: false, message: "유효하지 않은 날짜입니다." };
  }

  const next = formatDateISO(trimmed);
  if (!isWithinDateValue(next, minDate, maxDate)) {
    return {
      valid: false,
      message: "선택 가능한 날짜 범위를 벗어났습니다.",
    };
  }

  return { valid: true };
};

export const validateTimeInput = (
  str: string,
  { required = false }: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return required
      ? { valid: false, message: `${TIME_INPUT_FORMAT} 형식으로 입력해 주세요.` }
      : { valid: true };
  }

  if (!TIME_INPUT_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: `${TIME_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  if (!parseTime(trimmed)) {
    return { valid: false, message: "유효하지 않은 시간입니다." };
  }

  return { valid: true };
};

export const validateDateTimeInput = (
  str: string,
  { required = false, minDate, maxDate }: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return required
      ? {
          valid: false,
          message: `${DATETIME_INPUT_FORMAT} 형식으로 입력해 주세요.`,
        }
      : { valid: true };
  }

  if (!DATETIME_INPUT_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: `${DATETIME_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  const parsed = parseDateTimeInput(trimmed);
  if (!parsed) {
    return { valid: false, message: "유효하지 않은 날짜/시간입니다." };
  }

  const next = formatDateTimeISO(
    toISO(parsed),
    formatTime(
      parsed.getHours(),
      parsed.getMinutes(),
      parsed.getSeconds()
    )
  );
  if (!isWithinDateValue(next, minDate, maxDate)) {
    return {
      valid: false,
      message: "선택 가능한 날짜 범위를 벗어났습니다.",
    };
  }

  return { valid: true };
};

export const validateDateRangeInput = (
  str: string,
  options: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return options.required
      ? {
          valid: false,
          message: `${DATE_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
        }
      : { valid: true };
  }

  const parts = splitRangeInput(trimmed);
  if (!parts) {
    return {
      valid: false,
      message: `${DATE_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  if (parts.length === 1) {
    return validateDateInput(parts[0], options);
  }

  const fromResult = validateDateInput(parts[0], options);
  if (!fromResult.valid) return fromResult;

  const toResult = validateDateInput(parts[1], options);
  if (!toResult.valid) return toResult;

  if (parts[0] > parts[1]) {
    return {
      valid: false,
      message: "시작일은 종료일보다 이후일 수 없습니다.",
    };
  }

  return { valid: true };
};

export const validateTimeRangeInput = (
  str: string,
  { required = false }: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return required
      ? {
          valid: false,
          message: `${TIME_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
        }
      : { valid: true };
  }

  const parts = splitRangeInput(trimmed);
  if (!parts) {
    return {
      valid: false,
      message: `${TIME_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  if (parts.length === 1) {
    return validateTimeInput(parts[0], { required });
  }

  const fromResult = validateTimeInput(parts[0], { required });
  if (!fromResult.valid) return fromResult;

  const toResult = validateTimeInput(parts[1], { required });
  if (!toResult.valid) return toResult;

  if (parts[0] > parts[1]) {
    return {
      valid: false,
      message: "시작 시간은 종료 시간보다 이후일 수 없습니다.",
    };
  }

  return { valid: true };
};

export const validateDateTimeRangeInput = (
  str: string,
  options: ValidateOptions = {}
): InputValidationResult => {
  const trimmed = str.trim();

  if (!trimmed) {
    return options.required
      ? {
          valid: false,
          message: `${DATETIME_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
        }
      : { valid: true };
  }

  const parts = splitRangeInput(trimmed);
  if (!parts) {
    return {
      valid: false,
      message: `${DATETIME_RANGE_INPUT_FORMAT} 형식으로 입력해 주세요.`,
    };
  }

  if (parts.length === 1) {
    return validateDateTimeInput(parts[0], options);
  }

  const fromResult = validateDateTimeInput(parts[0], options);
  if (!fromResult.valid) return fromResult;

  const toResult = validateDateTimeInput(parts[1], options);
  if (!toResult.valid) return toResult;

  const fromParsed = parseDateTimeInput(parts[0]);
  const toParsed = parseDateTimeInput(parts[1]);
  if (!fromParsed || !toParsed) {
    return { valid: false, message: "유효하지 않은 날짜/시간입니다." };
  }

  if (fromParsed.getTime() > toParsed.getTime()) {
    return {
      valid: false,
      message: "시작 일시는 종료 일시보다 이후일 수 없습니다.",
    };
  }

  return { valid: true };
};

/** "YYYY-MM-DDTHH:mm:ss" | Date#toISOString → { date, time } (local) or null. */
export const parseDateTimeISO = (
  str: string
): { date: string; time: string } | null => {
  const trimmed = str?.trim() ?? "";
  if (!trimmed) return null;

  const fromDate = (date: Date): { date: string; time: string } => ({
    date: toISO(date),
    time: formatTime(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ),
  });

  const legacy = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})$/.exec(trimmed);
  if (legacy) {
    const date = parseISO(legacy[1]);
    const time = parseTime(legacy[2]);
    if (!date || !time) return null;
    return fromDate(
      new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time[0],
        time[1],
        time[2]
      )
    );
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return fromDate(parsed);
};

/** Local date + time → Date#toISOString(). */
export const formatDateTimeISO = (date: string, time: string): string => {
  const day = parseISO(date);
  const parts = parseTime(time);
  if (!day || !parts) return "";
  return new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    parts[0],
    parts[1],
    parts[2]
  ).toISOString();
};

/** Stored ISO value → display/input `"YYYY-MM-DD HH:mm:ss"` (local, no T/Z). */
export const formatDateTimeDisplay = (value: string): string => {
  const parts = parseDateTimeISO(value);
  if (!parts) return "";
  return `${parts.date} ${parts.time}`;
};

/** Display/input or ISO string → local Date or null. */
export const parseDateTimeInput = (str: string): Date | null => {
  const trimmed = str.trim();
  if (!trimmed) return null;

  const displayMatch =
    /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})(\.\d{1,3})?$/.exec(trimmed);
  if (displayMatch) {
    const date = parseISO(displayMatch[1]);
    const time = parseTime(displayMatch[2]);
    if (!date || !time) return null;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time[0],
      time[1],
      time[2]
    );
  }

  const legacyMatch = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})$/.exec(trimmed);
  if (legacyMatch) {
    const date = parseISO(legacyMatch[1]);
    const time = parseTime(legacyMatch[2]);
    if (!date || !time) return null;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time[0],
      time[1],
      time[2]
    );
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/* ─── Locale formatters ───────────────────────────────────────────── */

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
