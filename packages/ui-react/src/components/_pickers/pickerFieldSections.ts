import type { PickerInputMask } from "./pickerInputMask";

export type FieldSectionType =
  | "year"
  | "month"
  | "day"
  | "hours"
  | "minutes"
  | "seconds";

export type FieldSection = {
  type: FieldSectionType;
  maxLength: number;
  /** Digits typed so far (0..maxLength). Empty means placeholder. */
  value: string;
  placeholder: string;
  /** Literal text rendered after this section. */
  separatorAfter: string;
  min: number;
  max: number;
  rangePart?: "from" | "to";
};

type SectionTemplate = Omit<FieldSection, "value">;

const YEAR: SectionTemplate = {
  type: "year",
  maxLength: 4,
  placeholder: "YYYY",
  separatorAfter: "-",
  min: 1,
  max: 9999,
};

const MONTH: SectionTemplate = {
  type: "month",
  maxLength: 2,
  placeholder: "MM",
  separatorAfter: "-",
  min: 1,
  max: 12,
};

const DAY: SectionTemplate = {
  type: "day",
  maxLength: 2,
  placeholder: "DD",
  separatorAfter: "",
  min: 1,
  max: 31,
};

const HOURS: SectionTemplate = {
  type: "hours",
  maxLength: 2,
  placeholder: "HH",
  separatorAfter: ":",
  min: 0,
  max: 23,
};

const MINUTES: SectionTemplate = {
  type: "minutes",
  maxLength: 2,
  placeholder: "mm",
  separatorAfter: ":",
  min: 0,
  max: 59,
};

const SECONDS: SectionTemplate = {
  type: "seconds",
  maxLength: 2,
  placeholder: "ss",
  separatorAfter: "",
  min: 0,
  max: 59,
};

const cloneTemplate = (
  template: SectionTemplate,
  overrides?: Partial<SectionTemplate>
): FieldSection => ({
  ...template,
  ...overrides,
  value: "",
});

const dateTemplates = (rangePart?: "from" | "to"): FieldSection[] => [
  cloneTemplate(YEAR, { rangePart }),
  cloneTemplate(MONTH, { rangePart }),
  cloneTemplate(DAY, { rangePart }),
];

const timeTemplates = (rangePart?: "from" | "to"): FieldSection[] => [
  cloneTemplate(HOURS, { rangePart }),
  cloneTemplate(MINUTES, { rangePart }),
  cloneTemplate(SECONDS, { rangePart }),
];

const dateTimeTemplates = (rangePart?: "from" | "to"): FieldSection[] => {
  const date = dateTemplates(rangePart);
  date[date.length - 1] = {
    ...date[date.length - 1],
    separatorAfter: " ",
  };
  return [...date, ...timeTemplates(rangePart)];
};

const withRange = (
  first: FieldSection[],
  second: FieldSection[],
  separator: string
): FieldSection[] => {
  const left = first.map((section, index) =>
    index === first.length - 1
      ? { ...section, separatorAfter: separator }
      : section
  );
  return [...left, ...second];
};

export const createEmptySections = (mask: PickerInputMask): FieldSection[] => {
  switch (mask) {
    case "date":
      return dateTemplates();
    case "time":
      return timeTemplates();
    case "datetime":
      return dateTimeTemplates();
    case "dateRange":
      return withRange(dateTemplates("from"), dateTemplates("to"), " ~ ");
    case "timeRange":
      return withRange(timeTemplates("from"), timeTemplates("to"), " – ");
    case "datetimeRange":
      return withRange(
        dateTimeTemplates("from"),
        dateTimeTemplates("to"),
        " – "
      );
    default:
      return [];
  }
};

export const sectionDisplay = (section: FieldSection): string => {
  if (!section.value) return section.placeholder;
  if (section.value.length >= section.maxLength) {
    return section.value.slice(0, section.maxLength);
  }
  return section.value + section.placeholder.slice(section.value.length);
};

export const sectionsToString = (sections: FieldSection[]): string =>
  sections.map((section) => sectionDisplay(section) + section.separatorAfter).join("");

export const getSectionRanges = (
  sections: FieldSection[]
): Array<{ start: number; end: number }> => {
  const ranges: Array<{ start: number; end: number }> = [];
  let cursor = 0;
  for (const section of sections) {
    const content = sectionDisplay(section);
    ranges.push({ start: cursor, end: cursor + content.length });
    cursor += content.length + section.separatorAfter.length;
  }
  return ranges;
};

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const getSectionBounds = (
  sections: FieldSection[],
  index: number
): { min: number; max: number } => {
  const section = sections[index];
  if (section.type !== "day") {
    return { min: section.min, max: section.max };
  }

  const part = section.rangePart;
  const yearSection = sections.find(
    (item) => item.type === "year" && item.rangePart === part
  );
  const monthSection = sections.find(
    (item) => item.type === "month" && item.rangePart === part
  );
  const year = yearSection?.value.length === 4 ? Number(yearSection.value) : NaN;
  const month =
    monthSection?.value.length === 2 ? Number(monthSection.value) : NaN;

  if (Number.isFinite(year) && Number.isFinite(month) && month >= 1 && month <= 12) {
    return { min: 1, max: daysInMonth(year, month) };
  }
  return { min: 1, max: 31 };
};

const parseDateGroup = (
  text: string
): { year: string; month: string; day: string } | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!m) return null;
  return { year: m[1], month: m[2], day: m[3] };
};

const parseTimeGroup = (
  text: string
): { hours: string; minutes: string; seconds: string } | null => {
  const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(text.trim());
  if (!m) return null;
  return { hours: m[1], minutes: m[2], seconds: m[3] };
};

const parseDateTimeGroup = (
  text: string
): {
  year: string;
  month: string;
  day: string;
  hours: string;
  minutes: string;
  seconds: string;
} | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/.exec(
    text.trim()
  );
  if (!m) return null;
  return {
    year: m[1],
    month: m[2],
    day: m[3],
    hours: m[4],
    minutes: m[5],
    seconds: m[6],
  };
};

const applyGroupValues = (
  sections: FieldSection[],
  values: Partial<Record<FieldSectionType, string>>,
  rangePart?: "from" | "to"
): FieldSection[] =>
  sections.map((section) => {
    if (rangePart && section.rangePart !== rangePart) return section;
    const next = values[section.type];
    if (next === undefined) return section;
    return { ...section, value: next.slice(0, section.maxLength) };
  });

/** Parse a display/ISO-like string into sections for the given mask. */
export const parseValueToSections = (
  mask: PickerInputMask,
  value: string | undefined
): FieldSection[] => {
  const sections = createEmptySections(mask);
  const trimmed = (value ?? "").trim();
  if (!trimmed) return sections;

  const splitRange = (sep: RegExp) =>
    trimmed.split(sep).map((part) => part.trim()).filter(Boolean);

  /** Range separators only — must not match date hyphens (`-`). */
  const RANGE_SEP = /\s*[~–]\s*/;

  switch (mask) {
    case "date": {
      const parsed = parseDateGroup(trimmed);
      return parsed ? applyGroupValues(sections, parsed) : sections;
    }
    case "time": {
      const parsed = parseTimeGroup(trimmed);
      return parsed ? applyGroupValues(sections, parsed) : sections;
    }
    case "datetime": {
      const parsed = parseDateTimeGroup(trimmed);
      return parsed ? applyGroupValues(sections, parsed) : sections;
    }
    case "dateRange": {
      const parts = splitRange(RANGE_SEP);
      let next = sections;
      if (parts[0]) {
        const parsed = parseDateGroup(parts[0]);
        if (parsed) next = applyGroupValues(next, parsed, "from");
      }
      if (parts[1]) {
        const parsed = parseDateGroup(parts[1]);
        if (parsed) next = applyGroupValues(next, parsed, "to");
      }
      return next;
    }
    case "timeRange": {
      const parts = splitRange(RANGE_SEP);
      let next = sections;
      if (parts[0]) {
        const parsed = parseTimeGroup(parts[0]);
        if (parsed) next = applyGroupValues(next, parsed, "from");
      }
      if (parts[1]) {
        const parsed = parseTimeGroup(parts[1]);
        if (parsed) next = applyGroupValues(next, parsed, "to");
      }
      return next;
    }
    case "datetimeRange": {
      const parts = splitRange(RANGE_SEP);
      let next = sections;
      if (parts[0]) {
        const parsed = parseDateTimeGroup(parts[0]);
        if (parsed) next = applyGroupValues(next, parsed, "from");
      }
      if (parts[1]) {
        const parsed = parseDateTimeGroup(parts[1]);
        if (parsed) next = applyGroupValues(next, parsed, "to");
      }
      return next;
    }
    default:
      return sections;
  }
};

const formatSide = (
  sections: FieldSection[],
  part: "from" | "to"
): string =>
  sections
    .filter((section) => section.rangePart === part)
    .map((section) => {
      const content =
        section.value.length === section.maxLength
          ? section.value.padStart(section.maxLength, "0")
          : sectionDisplay(section);
      // Range separator lives on the last "from" section; strip it for side text.
      let sep = section.separatorAfter;
      if (sep.includes("~") || sep.includes("–")) sep = "";
      return content + sep;
    })
    .join("");

const formatSingle = (sections: FieldSection[]): string =>
  sections
    .map((section) => {
      const content =
        section.value.length === section.maxLength
          ? section.value.padStart(section.maxLength, "0")
          : sectionDisplay(section);
      return content + section.separatorAfter;
    })
    .join("");

/**
 * Build the commit string used by existing blur validators.
 * Incomplete placeholders stay visible; complete sides are zero-padded.
 */
export const sectionsToCommitValue = (
  mask: PickerInputMask,
  sections: FieldSection[]
): string => {
  const hasRange = sections.some((section) => section.rangePart);
  if (!hasRange) return formatSingle(sections);

  const fromSections = sections.filter((s) => s.rangePart === "from");
  const toSections = sections.filter((s) => s.rangePart === "to");
  const fromComplete = fromSections.every(
    (s) => s.value.length === s.maxLength
  );
  const toComplete = toSections.every((s) => s.value.length === s.maxLength);
  const toEmpty = toSections.every((s) => s.value.length === 0);

  if (fromComplete && toEmpty) {
    return formatSide(sections, "from");
  }

  if (!fromComplete && !toComplete) {
    return sectionsToString(sections);
  }

  const sep = mask === "dateRange" ? " ~ " : " – ";
  return `${formatSide(sections, "from")}${sep}${formatSide(sections, "to")}`;
};

export const findSectionIndexAtCaret = (
  sections: FieldSection[],
  caret: number
): number => {
  const ranges = getSectionRanges(sections);
  for (let i = 0; i < ranges.length; i += 1) {
    if (caret <= ranges[i].end) return i;
  }
  return Math.max(0, sections.length - 1);
};

export const applyDigitToSection = (
  sections: FieldSection[],
  index: number,
  digit: string
): { sections: FieldSection[]; nextIndex: number; edited: boolean } => {
  if (!/^\d$/.test(digit)) {
    return { sections, nextIndex: index, edited: false };
  }

  const current = sections[index];
  const bounds = getSectionBounds(sections, index);
  let nextValue = current.value;

  // If section was complete/selected, start fresh
  if (nextValue.length >= current.maxLength) {
    nextValue = digit;
  } else {
    nextValue = `${nextValue}${digit}`.slice(0, current.maxLength);
  }

  // Reject impossible first digits early (e.g. month starting with 2+)
  if (nextValue.length === current.maxLength) {
    const numeric = Number(nextValue);
    if (!Number.isFinite(numeric) || numeric < bounds.min || numeric > bounds.max) {
      // Keep first digit if possible, otherwise ignore
      if (current.maxLength === 2) {
        const asSingle = Number(digit);
        if (asSingle > bounds.max || (digit !== "0" && asSingle < bounds.min && bounds.min > 9)) {
          return { sections, nextIndex: index, edited: false };
        }
        nextValue = digit;
        const nextSections = sections.map((section, i) =>
          i === index ? { ...section, value: nextValue } : section
        );
        return { sections: nextSections, nextIndex: index, edited: true };
      }
      return { sections, nextIndex: index, edited: false };
    }
  } else if (current.maxLength === 2 && nextValue.length === 1) {
    const first = Number(nextValue);
    if (current.type === "month" && first > 1) {
      // Auto-complete month "2".."9" as 02..09
      nextValue = `0${nextValue}`;
    } else if (current.type === "day" && first > 3) {
      nextValue = `0${nextValue}`;
    } else if (current.type === "hours" && first > 2) {
      nextValue = `0${nextValue}`;
    } else if (
      (current.type === "minutes" || current.type === "seconds") &&
      first > 5
    ) {
      nextValue = `0${nextValue}`;
    }
  }

  if (nextValue.length === current.maxLength) {
    const numeric = Number(nextValue);
    const { min, max } = getSectionBounds(
      sections.map((section, i) =>
        i === index ? { ...section, value: nextValue } : section
      ),
      index
    );
    nextValue = String(clamp(numeric, min, max)).padStart(current.maxLength, "0");
  }

  const nextSections = sections.map((section, i) =>
    i === index ? { ...section, value: nextValue } : section
  );

  const shouldAdvance = nextValue.length >= current.maxLength;
  const nextIndex = shouldAdvance
    ? Math.min(index + 1, sections.length - 1)
    : index;

  return { sections: nextSections, nextIndex, edited: true };
};

export const clearSection = (
  sections: FieldSection[],
  index: number
): FieldSection[] =>
  sections.map((section, i) =>
    i === index ? { ...section, value: "" } : section
  );

export const backspaceSection = (
  sections: FieldSection[],
  index: number
): { sections: FieldSection[]; nextIndex: number } => {
  const current = sections[index];
  if (current.value.length > 0) {
    return {
      sections: sections.map((section, i) =>
        i === index
          ? { ...section, value: section.value.slice(0, -1) }
          : section
      ),
      nextIndex: index,
    };
  }
  if (index > 0) {
    const prev = index - 1;
    return {
      sections: clearSection(sections, prev),
      nextIndex: prev,
    };
  }
  return { sections, nextIndex: index };
};

export const adjustSectionValue = (
  sections: FieldSection[],
  index: number,
  delta: number
): FieldSection[] => {
  const current = sections[index];
  const { min, max } = getSectionBounds(sections, index);
  const fallback = delta > 0 ? min : max;
  const numeric =
    current.value.length === current.maxLength
      ? Number(current.value)
      : fallback;
  const span = max - min + 1;
  const next = ((((numeric - min + delta) % span) + span) % span) + min;
  return sections.map((section, i) =>
    i === index
      ? { ...section, value: String(next).padStart(section.maxLength, "0") }
      : section
  );
};

export const areSectionsEmpty = (sections: FieldSection[]): boolean =>
  sections.every((section) => section.value.length === 0);
