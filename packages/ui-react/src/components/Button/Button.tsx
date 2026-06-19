import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import styles from "./Button.module.css";
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

const buttonClassName = cva(styles.root, {
  defaultVariants: {
    color: "primary",
    fullWidth: false,
    loading: false,
    loadingSolo: false,
    size: "md",
    variant: "default",
  },
  variants: {
    color: {
      danger: styles.colorDanger,
      primary: styles.colorPrimary,
      secondary: styles.colorSecondary,
    },
    fullWidth: {
      false: null,
      true: styles.fullWidth,
    },
    loading: {
      false: null,
      true: styles.loading,
    },
    loadingSolo: {
      false: null,
      true: styles.loadingSolo,
    },
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
      xs: styles.sizeXs,
    },
    variant: {
      default: styles.variantDefault,
      ghost: styles.variantGhost,
      outlined: styles.variantOutlined,
    },
  },
});

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
        className={cn(
          buttonClassName({
            color,
            fullWidth,
            loading,
            loadingSolo: showSpinnerInsteadOfLabel,
            size,
            variant,
          }),
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
          <span className={styles.label} aria-hidden="true">
            <ButtonSpinner size={size} />
          </span>
        ) : children != null && children !== "" ? (
          <span className={styles.label}>{children}</span>
        ) : null}
        {showSpinnerInIconSlot ? (
          <span className={styles.icon} aria-hidden="true">
            <ButtonSpinner size={size} />
          </span>
        ) : endIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {endIcon}
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";
