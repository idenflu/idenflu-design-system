import * as React from "react";
import { classNames } from "../../utils/classNames";
import type { ButtonColor, ButtonSize, ButtonVariant } from "./Button";

export type IconButtonVariant = ButtonVariant;
export type IconButtonColor = ButtonColor;

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  /** Semantic color token. Defaults to `primary`. */
  color?: IconButtonColor;
  /** Icon element (decorative; use `label` for the accessible name). */
  icon: React.ReactNode;
  /** Accessible name — required for icon-only buttons. */
  label: string;
  loading?: boolean;
  size?: ButtonSize;
  variant?: IconButtonVariant;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      color = "primary",
      disabled,
      icon,
      label,
      loading = false,
      onClick,
      size = "md",
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        aria-label={label}
        className={classNames(
          "nova-button",
          "nova-button--icon-only",
          `nova-button--${variant}`,
          `nova-button--${color}`,
          `nova-button--${size}`,
          className
        )}
        disabled={isDisabled}
        onClick={(event) => {
          if (loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        type={type}
        {...props}
      >
        <span className="nova-button__icon" aria-hidden="true">
          {icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
