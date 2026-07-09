export type PickerInputMask =
  | "date"
  | "time"
  | "datetime"
  | "dateRange"
  | "timeRange"
  | "datetimeRange";

const MASK_MAX_DIGITS: Record<PickerInputMask, number> = {
  date: 8,
  time: 6,
  datetime: 14,
  dateRange: 16,
  timeRange: 12,
  datetimeRange: 28,
};

const extractDigits = (value: string, maxDigits: number): string =>
  value.replace(/\D/g, "").slice(0, maxDigits);

const formatDateDigits = (digits: string): string => {
  let result = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i === 4 || i === 6) result += "-";
    result += digits[i];
  }
  return result;
};

const formatTimeDigits = (digits: string): string => {
  let result = "";
  for (let i = 0; i < digits.length; i += 1) {
    if (i === 2 || i === 4) result += ":";
    result += digits[i];
  }
  return result;
};

const formatDateTimeDigits = (digits: string): string => {
  const dateDigits = digits.slice(0, 8);
  const timeDigits = digits.slice(8, 14);
  const datePart = formatDateDigits(dateDigits);

  if (!timeDigits) return datePart;

  const needsSpace = dateDigits.length === 8;
  return `${datePart}${needsSpace ? " " : ""}${formatTimeDigits(timeDigits)}`;
};

const formatRangeDigits = (
  digits: string,
  segmentLength: number,
  formatSegment: (segment: string) => string,
  separator: string
): string => {
  const firstDigits = digits.slice(0, segmentLength);
  const secondDigits = digits.slice(segmentLength, segmentLength * 2);
  const firstPart = formatSegment(firstDigits);

  if (!secondDigits) {
    if (digits.length > segmentLength) {
      return `${firstPart}${separator}`;
    }
    return firstPart;
  }

  return `${firstPart}${separator}${formatSegment(secondDigits)}`;
};

/** 숫자만 허용하고 `-`, `:`, 구분자를 자동 삽입합니다. */
export const applyPickerInputMask = (
  mask: PickerInputMask,
  value: string
): string => {
  const digits = extractDigits(value, MASK_MAX_DIGITS[mask]);

  switch (mask) {
    case "date":
      return formatDateDigits(digits);
    case "time":
      return formatTimeDigits(digits);
    case "datetime":
      return formatDateTimeDigits(digits);
    case "dateRange":
      return formatRangeDigits(digits, 8, formatDateDigits, " ~ ");
    case "timeRange":
      return formatRangeDigits(digits, 6, formatTimeDigits, " – ");
    case "datetimeRange":
      return formatRangeDigits(digits, 14, formatDateTimeDigits, " – ");
    default:
      return value;
  }
};

export const getPickerInputMaxLength = (mask: PickerInputMask): number => {
  switch (mask) {
    case "date":
      return 10;
    case "time":
      return 8;
    case "datetime":
      return 19;
    case "dateRange":
      return 23;
    case "timeRange":
      return 19;
    case "datetimeRange":
      return 41;
    default:
      return undefined as never;
  }
};
