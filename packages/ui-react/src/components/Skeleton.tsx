import * as React from "react";
import { classNames } from "../utils/classNames";

export type SkeletonVariant = "text" | "block" | "circle";

export type SkeletonProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Shape preset. Defaults to "text". */
  variant?: SkeletonVariant;
  /** Explicit width, applied as an inline style when provided. */
  width?: number | string;
  /** Explicit height, applied as an inline style when provided. */
  height?: number | string;
  /** Number of bars rendered for the "text" variant (last bar is shorter). Defaults to 1. */
  lines?: number;
};

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ className, height, lines = 1, style, variant = "text", width, ...props }, ref) => {
    const inlineStyle = width != null || height != null ? { ...style, width, height } : style;
    const count = Math.max(1, lines);

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={classNames("if-skeleton", `if-skeleton--${variant}`, className)}
        style={inlineStyle}
        {...props}
      >
        {variant === "text"
          ? Array.from({ length: count }, (_, index) => (
              <span
                key={index}
                className={classNames("if-skeleton__line", count > 1 && index === count - 1 && "is-last")}
              />
            ))
          : null}
      </span>
    );
  },
);

Skeleton.displayName = "Skeleton";
