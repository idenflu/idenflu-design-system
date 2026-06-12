import * as React from "react";
import { classNames } from "../../utils/classNames";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "quiet"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";
export type IconButtonVariant = "default" | "ghost" | "danger";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  loading?: boolean;
  pressed?: boolean;
  selected?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      icon,
      loading = false,
      onClick,
      pressed,
      selected = false,
      size = "medium",
      type = "button",
      variant = "quiet",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      aria-pressed={pressed ?? undefined}
      className={classNames(
        "if-button",
        `if-button--${variant}`,
        `if-button--${size}`,
        selected && "is-selected",
        loading && "is-loading",
        className
      )}
      disabled={disabled}
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
      {icon ? (
        <span className="if-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="if-button__label">{children}</span>
    </button>
  )
);

Button.displayName = "Button";

export type IconButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  size?: ButtonSize;
  variant?: IconButtonVariant;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      label,
      selected = false,
      size = "medium",
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      aria-label={label}
      aria-pressed={selected || undefined}
      className={classNames(
        "if-icon-button",
        `if-icon-button--${variant}`,
        `if-icon-button--${size}`,
        selected && "is-selected",
        className
      )}
      type={type}
      {...props}
    >
      <span className="if-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  )
);

IconButton.displayName = "IconButton";
