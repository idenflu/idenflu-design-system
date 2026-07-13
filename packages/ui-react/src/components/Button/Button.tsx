import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import styles from "./Button.module.css";
import { ButtonSpinner } from "./ButtonSpinner";

export type ButtonVariant = "default" | "outlined" | "ghost";
export type ButtonColor = "primary" | "neutral" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  variant?: ButtonVariant;
};

const buttonClassName = cva(styles.root, {
  defaultVariants: {
    color: "primary",
    fullWidth: false,
    hasStartIcon: false,
    loading: false,
    size: "md",
    variant: "default",
  },
  variants: {
    color: {
      danger: styles.colorDanger,
      primary: styles.colorPrimary,
      neutral: styles.colorNeutral,
    },
    fullWidth: {
      false: null,
      true: styles.fullWidth,
    },
    hasStartIcon: {
      false: null,
      true: styles.hasStartIcon,
    },
    loading: {
      false: null,
      true: styles.loading,
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
      startIcon,
      type = "button",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const hasIcon = Boolean(startIcon) || Boolean(endIcon);
    const hasBothIcons = Boolean(startIcon) && Boolean(endIcon);
    const showLoadingOverlay = loading && (!hasIcon || hasBothIcons);
    const contentHiddenClass = showLoadingOverlay
      ? styles.contentHidden
      : undefined;

    const labelEl =
      children != null && children !== "" ? (
        showLoadingOverlay ? (
          <span className={contentHiddenClass}>{children}</span>
        ) : (
          children
        )
      ) : null;
    const startIconEl = startIcon && (
      <span
        className={cn(styles.icon, styles.startIcon, contentHiddenClass)}
        aria-hidden="true"
      >
        {loading && !hasBothIcons ? <ButtonSpinner size="md" /> : startIcon}
      </span>
    );

    const endIconEl = endIcon && (
      <span
        className={cn(styles.icon, styles.endIcon, contentHiddenClass)}
        aria-hidden="true"
      >
        {loading && !hasBothIcons ? <ButtonSpinner size="md" /> : endIcon}
      </span>
    );

    const loadingOverlayEl = showLoadingOverlay && (
      <span className={styles.loadingOverlay} aria-hidden="true">
        <ButtonSpinner size="md" />
      </span>
    );

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        className={cn(
          buttonClassName({
            color,
            fullWidth,
            hasStartIcon: Boolean(startIcon),
            loading,
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
        {startIconEl}
        {labelEl}
        {endIconEl}
        {loadingOverlayEl}
      </button>
    );
  }
);

Button.displayName = "Button";
