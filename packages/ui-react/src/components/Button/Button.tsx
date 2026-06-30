import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import styles from "./Button.module.css";
import { ButtonSpinner } from "./ButtonSpinner";

export type ButtonVariant = "default" | "outlined" | "ghost";
export type ButtonColor = "primary" | "neutral" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";
type ButtonIconLayout = "both" | "endOnly" | "none" | "startOnly";

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
    iconLayout: "none",
    loading: false,
    loadingSolo: false,
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
    iconLayout: {
      both: styles.iconLayoutBoth,
      endOnly: styles.iconLayoutEndOnly,
      none: null,
      startOnly: styles.iconLayoutStartOnly,
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

function resolveIconLayout(
  startIcon?: React.ReactNode,
  endIcon?: React.ReactNode
): ButtonIconLayout {
  const hasStartIcon = Boolean(startIcon);
  const hasEndIcon = Boolean(endIcon);

  if (hasStartIcon && hasEndIcon) {
    return "both";
  }

  if (hasStartIcon) {
    return "startOnly";
  }

  if (hasEndIcon) {
    return "endOnly";
  }

  return "none";
}

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
    const iconLayout = resolveIconLayout(startIcon, endIcon);
    const hasIcon = iconLayout !== "none";
    const showSpinnerInsteadOfLabel = loading && !hasIcon;

    const labelElement = showSpinnerInsteadOfLabel ? (
      <span className={styles.label} aria-hidden="true">
        <ButtonSpinner size={size} />
      </span>
    ) : children != null && children !== "" ? (
      <span className={styles.label}>{children}</span>
    ) : null;

    const startIconElement = startIcon ? (
      <span className={styles.icon} aria-hidden="true">
        {loading ? <ButtonSpinner size={size} /> : startIcon}
      </span>
    ) : null;

    const endIconElement = endIcon ? (
      <span className={styles.icon} aria-hidden="true">
        {loading ? <ButtonSpinner size={size} /> : endIcon}
      </span>
    ) : null;

    return (
      <button
        ref={ref}
        aria-busy={loading || undefined}
        className={cn(
          buttonClassName({
            color,
            fullWidth,
            hasStartIcon: Boolean(startIcon),
            iconLayout,
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
        {startIconElement}
        {labelElement}
        {endIconElement}
      </button>
    );
  }
);

Button.displayName = "Button";
