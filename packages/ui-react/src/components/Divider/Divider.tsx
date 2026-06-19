import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import styles from "./Divider.module.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerTextAlign = "start" | "center" | "end";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Optional label rendered between divider lines. */
  children?: React.ReactNode;
  /** Stretches a vertical divider inside flex layouts. */
  flexItem?: boolean;
  /** Removes the default middle spacing so the divider spans its full container. */
  fullWidth?: boolean;
  /** Divider direction. Defaults to "horizontal". */
  orientation?: DividerOrientation;
  /** Exposes the divider as a semantic separator when it marks a real content boundary. */
  semantic?: boolean;
  /** Label alignment for dividers with children. */
  textAlign?: DividerTextAlign;
};

const dividerClassName = cva(styles.root, {
  defaultVariants: {
    flexItem: false,
    fullWidth: false,
    orientation: "horizontal",
    textAlign: "center",
    withChildren: false,
  },
  variants: {
    flexItem: {
      false: null,
      true: styles.flexItem,
    },
    fullWidth: {
      false: null,
      true: styles.fullWidth,
    },
    orientation: {
      horizontal: styles.orientationHorizontal,
      vertical: styles.orientationVertical,
    },
    textAlign: {
      center: null,
      end: styles.textEnd,
      start: styles.textStart,
    },
    withChildren: {
      false: null,
      true: styles.withChildren,
    },
  },
});

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      children,
      className,
      flexItem = false,
      fullWidth = false,
      orientation = "horizontal",
      semantic = false,
      textAlign = "center",
      ...props
    },
    ref
  ) => {
    const hasChildren = children != null && children !== "";
    const isSemantic = semantic || hasChildren;

    return (
      <div
        ref={ref}
        aria-hidden={isSemantic ? undefined : true}
        aria-orientation={isSemantic ? orientation : undefined}
        className={cn(
          dividerClassName({
            flexItem,
            fullWidth,
            orientation,
            textAlign: hasChildren ? textAlign : "center",
            withChildren: hasChildren,
          }),
          className
        )}
        role={isSemantic ? "separator" : undefined}
        {...props}
      >
        {hasChildren ? (
          <span className={styles.label}>{children}</span>
        ) : null}
      </div>
    );
  }
);

Divider.displayName = "Divider";
