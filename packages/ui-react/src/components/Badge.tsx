import * as React from "react";
import { classNames } from "../utils/classNames";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  onRemove?: () => void;
  removeLabel?: string;
  selected?: boolean;
  tone?: BadgeTone;
};

export const Badge = ({ children, className, onRemove, removeLabel, selected = false, tone = "neutral", ...props }: BadgeProps) => (
  <span className={classNames("if-badge", `if-badge--${tone}`, selected && "is-selected", className)} {...props}>
    {onRemove ? (
      <>
        <span className="if-badge__label">{children}</span>
        <button className="if-badge__remove" type="button" aria-label={removeLabel ?? "Remove"} onClick={onRemove}>
          x
        </button>
      </>
    ) : (
      children
    )}
  </span>
);
