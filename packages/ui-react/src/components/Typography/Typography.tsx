import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";
import styles from "./Typography.module.css";

export type TypographyVariant =
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "title-lg"
  | "title-md"
  | "title-sm"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "label-lg"
  | "label-md"
  | "caption-lg"
  | "caption-md"
  | "numeric-xl"
  | "numeric-lg"
  | "numeric-md"
  | "numeric-sm"
  | "numeric-xs";

export type TypographyAlign =
  | "inherit"
  | "left"
  | "center"
  | "right"
  | "justify";

export type TypographyElement = keyof React.JSX.IntrinsicElements;

export type TypographyProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> & {
  align?: TypographyAlign;
  component?: TypographyElement;
  noWrap?: boolean;
  variant?: TypographyVariant;
};

const variantComponentMap: Record<TypographyVariant, TypographyElement> = {
  "heading-lg": "span",
  "heading-md": "span",
  "heading-sm": "span",
  "title-lg": "span",
  "title-md": "span",
  "title-sm": "span",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "label-lg": "span",
  "label-md": "span",
  "caption-lg": "span",
  "caption-md": "span",
  "numeric-xl": "span",
  "numeric-lg": "span",
  "numeric-md": "span",
  "numeric-sm": "span",
  "numeric-xs": "span",
};

const typographyClassName = cva(styles.root, {
  defaultVariants: {
    align: "inherit",
    noWrap: false,
    variant: "body-md",
  },
  variants: {
    align: {
      inherit: styles.alignInherit,
      left: styles.alignLeft,
      center: styles.alignCenter,
      right: styles.alignRight,
      justify: styles.alignJustify,
    },
    noWrap: {
      false: null,
      true: styles.noWrap,
    },
    variant: {
      "heading-lg": styles.headingLg,
      "heading-md": styles.headingMd,
      "heading-sm": styles.headingSm,
      "title-lg": styles.titleLg,
      "title-md": styles.titleMd,
      "title-sm": styles.titleSm,
      "body-lg": styles.bodyLg,
      "body-md": styles.bodyMd,
      "body-sm": styles.bodySm,
      "label-lg": styles.labelLg,
      "label-md": styles.labelMd,
      "caption-lg": styles.captionLg,
      "caption-md": styles.captionMd,
      "numeric-xl": styles.numericXl,
      "numeric-lg": styles.numericLg,
      "numeric-md": styles.numericMd,
      "numeric-sm": styles.numericSm,
      "numeric-xs": styles.numericXs,
    },
  },
});

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      align = "inherit",
      children,
      className,
      component,
      noWrap = false,
      variant = "body-md",
      ...props
    },
    ref
  ) => {
    const Component = component ?? variantComponentMap[variant];

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          typographyClassName({ align, noWrap, variant }),
          className
        ),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";
