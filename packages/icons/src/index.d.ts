export declare const iconNames: readonly [
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
];

export type IconName = (typeof iconNames)[number];

export declare const iconSpriteHref = "@idenflu/ui-icons/icons.svg";

export declare const getIconHref: (name: IconName, spriteHref?: string) => string;
