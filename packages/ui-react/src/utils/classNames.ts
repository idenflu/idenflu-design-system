export const cn = (...values: Array<false | null | string | undefined>) =>
  values.filter(Boolean).join(" ");

export const classNames = (
  ...values: Array<false | null | string | undefined>
) => cn(...values);
