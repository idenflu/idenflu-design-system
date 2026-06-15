import * as React from "react";
import { classNames } from "../../utils/classNames";
import { ButtonSpinner } from "./ButtonSpinner";

export type ButtonVariant = "default" | "outlined" | "ghost";
export type ButtonColor = "primary" | "secondary" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      color = "primary",
      disabled,
      endIcon,
      fullWidth = false,
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
    const showSpinnerInIconSlot = loading && Boolean(endIcon);
    const showSpinnerInsteadOfLabel = loading && !endIcon;

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        className={classNames(
          "nova-button",
          `nova-button--${variant}`,
          `nova-button--${color}`,
          `nova-button--${size}`,
          fullWidth && "nova-button--full-width",
          loading && "nova-button--loading",
          showSpinnerInsteadOfLabel && "nova-button--loading-solo",
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
        {showSpinnerInsteadOfLabel ? (
          <span className="nova-button__label" aria-hidden="true">
            <ButtonSpinner size={size} />
          </span>
        ) : children != null && children !== "" ? (
          <span className="nova-button__label">{children}</span>
        ) : null}
        {showSpinnerInIconSlot ? (
          <span className="nova-button__icon" aria-hidden="true">
            <ButtonSpinner size={size} />
          </span>
        ) : endIcon ? (
          <span className="nova-button__icon" aria-hidden="true">
            {endIcon}
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
