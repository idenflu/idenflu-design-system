export const iconNames = [
  "icon-plus",
  "icon-filter",
  "icon-download",
  "icon-check",
  "icon-x",
  "icon-refresh",
  "icon-more",
  "icon-search",
  "icon-calendar",
  "icon-user",
  "icon-file",
  "icon-table",
  "icon-alert",
  "icon-settings",
  "icon-lock",
  "icon-sun",
  "icon-moon",
] as const;

export type IconName = (typeof iconNames)[number];

export const iconSpriteHref = "@idenflu/ui-icons/icons.svg";

export const getIconHref = (name: IconName, spriteHref = iconSpriteHref) => `${spriteHref}#${name}`;
