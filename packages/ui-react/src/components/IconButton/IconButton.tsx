import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import type { ButtonColor, ButtonSize, ButtonVariant } from "../Button/Button";
import { ButtonSpinner } from "../Button/ButtonSpinner";
import styles from "./IconButton.module.css";

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

const iconButtonClassName = cva(styles.root, {
  defaultVariants: {
    color: "primary",
    loading: false,
    size: "md",
    variant: "default",
  },
  variants: {
    color: {
      danger: styles.colorDanger,
      primary: styles.colorPrimary,
      secondary: styles.colorSecondary,
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
        className={cn(
          iconButtonClassName({
            color,
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
        <span className={styles.icon} aria-hidden="true">
          {loading ? <ButtonSpinner size={size} /> : icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
