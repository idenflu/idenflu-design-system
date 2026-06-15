import * as React from "react";
import { classNames } from "../../utils/classNames";

export type SpinnerColor = "primary" | "secondary" | "inherit";
export type SpinnerSize = "xs" | "sm" | "md" | "lg";
export type SpinnerVariant = "ring" | "dot" | "equalizer";

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

function SpinnerIndicator({ variant }: { variant: SpinnerVariant }) {
  if (variant === "dot") {
    return (
      <span className="nova-spinner__dots" aria-hidden="true">
        <span className="nova-spinner__dot" />
        <span className="nova-spinner__dot" />
        <span className="nova-spinner__dot" />
      </span>
    );
  }

  if (variant === "equalizer") {
    return (
      <span className="nova-spinner__bars" aria-hidden="true">
        <span className="nova-spinner__bar" />
        <span className="nova-spinner__bar" />
        <span className="nova-spinner__bar" />
        <span className="nova-spinner__bar" />
      </span>
    );
  }

  return <span className="nova-spinner__ring" aria-hidden="true" />;
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
      className={classNames(
        "nova-spinner",
        `nova-spinner--${variant}`,
        `nova-spinner--${size}`,
        `nova-spinner--${color}`,
        !active && "nova-spinner--inactive",
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
