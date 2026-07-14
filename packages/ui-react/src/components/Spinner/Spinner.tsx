import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";
import styles from "./Spinner.module.css";

export type SpinnerColor = "primary" | "neutral" | "inherit";
export type SpinnerSize = "xs" | "sm" | "md" | "lg";
export type SpinnerVariant = "ring" | "dot";

export type SpinnerProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** When false, shows a static indicator without animation. Defaults to true. */
  active?: boolean;
  /** Color token for the indicator. Defaults to "primary". */
  color?: SpinnerColor;
  /** Accessible name announced to screen readers. Defaults to "Loading". */
  label?: string;
  /** Size token. Defaults to "md". */
  size?: SpinnerSize;
  /** Visual style. Defaults to "ring". */
  variant?: SpinnerVariant;
};

const spinnerClassName = cva(styles.root, {
  defaultVariants: {
    active: true,
    color: "primary",
    size: "md",
    variant: "ring",
  },
  variants: {
    active: {
      false: styles.inactive,
      true: null,
    },
    color: {
      inherit: styles.colorInherit,
      primary: styles.colorPrimary,
      neutral: styles.colorNeutral,
    },
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
      xs: styles.sizeXs,
    },
    variant: {
      dot: styles.variantDot,
      ring: styles.variantRing,
    },
  },
});

function SpinnerIndicator({ variant }: { variant: SpinnerVariant }) {
  if (variant === "dot") {
    return (
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
    );
  }

  return <span className={styles.ring} aria-hidden="true" />;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      active = true,
      className,
      color = "primary",
      label = "Loading",
      size = "md",
      variant = "ring",
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      aria-hidden={active ? undefined : true}
      aria-label={active ? label : undefined}
      aria-live={active ? "polite" : undefined}
      className={cn(
        spinnerClassName({
          active,
          color,
          size,
          variant,
        }),
        className
      )}
      role={active ? "status" : undefined}
      {...props}
    >
      <SpinnerIndicator variant={variant} />
    </span>
  )
);

Spinner.displayName = "Spinner";
