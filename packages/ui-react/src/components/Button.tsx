import * as React from "react";
import { classNames } from "../utils/classNames";

export type ButtonVariant = "primary" | "secondary" | "quiet" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
  loading?: boolean;
  selected?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, disabled, icon, loading = false, selected = false, size = "md", type = "button", variant = "quiet", ...props }, ref) => (
    <button
      ref={ref}
      aria-busy={loading || undefined}
      className={classNames("if-button", `if-button--${variant}`, `if-button--${size}`, selected && "is-selected", loading && "is-loading", className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {icon ? <span className="if-button__icon" aria-hidden="true">{icon}</span> : null}
      <span className="if-button__label">{children}</span>
    </button>
  ),
);

Button.displayName = "Button";
