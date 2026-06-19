import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { Icon } from "../Icon/Icon";
import styles from "./Chip.module.css";

export type ChipVariant = "filled" | "outlined";
export type ChipColor =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";
export type ChipSize = "sm" | "md" | "lg";

export type ChipProps = Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children" | "color"
> & {
  children: React.ReactNode;
  color?: ChipColor;
  deleteLabel?: string;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  size?: ChipSize;
  startIcon?: React.ReactNode;
  variant?: ChipVariant;
};

const chipClassName = cva(styles.root, {
  defaultVariants: {
    color: "neutral",
    deletable: false,
    size: "md",
    variant: "filled",
  },
  variants: {
    color: {
      danger: styles.colorDanger,
      neutral: styles.colorNeutral,
      primary: styles.colorPrimary,
      success: styles.colorSuccess,
      warning: styles.colorWarning,
    },
    deletable: {
      false: null,
      true: styles.deletable,
    },
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
    variant: {
      filled: styles.variantFilled,
      outlined: styles.variantOutlined,
    },
  },
});

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      children,
      className,
      color = "neutral",
      deleteLabel = "Delete chip",
      onDelete,
      size = "md",
      startIcon,
      variant = "filled",
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        chipClassName({
          color,
          deletable: Boolean(onDelete),
          size,
          variant,
        }),
        className
      )}
      {...props}
    >
      {startIcon ? (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {onDelete ? (
        <button
          aria-label={deleteLabel}
          className={styles.delete}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(event);
          }}
          type="button"
        >
          <Icon name="close" />
        </button>
      ) : null}
    </span>
  )
);

Chip.displayName = "Chip";
