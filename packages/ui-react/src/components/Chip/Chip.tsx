import * as React from "react";
import { classNames } from "../../utils/classNames";
import { Icon } from "../Icon/Icon";
import "./Chip.css";

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
      className={classNames(
        "nova-chip",
        `nova-chip--${variant}`,
        `nova-chip--${color}`,
        `nova-chip--${size}`,
        onDelete && "nova-chip--deletable",
        className
      )}
      {...props}
    >
      {startIcon ? (
        <span className="nova-chip__icon" aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      <span className="nova-chip__label">{children}</span>
      {onDelete ? (
        <button
          aria-label={deleteLabel}
          className="nova-chip__delete"
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
