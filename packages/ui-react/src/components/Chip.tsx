import * as React from "react";
import { classNames } from "../utils/classNames";

export type ChipTone = "neutral" | "blue" | "mint" | "amber" | "coral";

export type ChipProps = React.HTMLAttributes<HTMLSpanElement> & {
  onRemove?: () => void;
  removeLabel?: string;
  selected?: boolean;
  tone?: ChipTone;
};

export const Chip = ({ children, className, onRemove, removeLabel, selected = false, tone = "neutral", ...props }: ChipProps) => (
  <span className={classNames("if-chip", `if-chip--${tone}`, selected && "is-selected", className)} {...props}>
    <span className="if-chip__label">{children}</span>
    {onRemove ? (
      <button className="if-chip__remove" type="button" aria-label={removeLabel ?? "Remove chip"} onClick={onRemove}>
        x
      </button>
    ) : null}
  </span>
);
