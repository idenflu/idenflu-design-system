import * as React from "react";
import { classNames } from "../utils/classNames";

export type ChipTone = "neutral" | "blue" | "mint" | "amber" | "coral";

export type ChipProps = React.HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  interactive?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  selected?: boolean;
  tone?: ChipTone;
};

export const Chip = ({
  children,
  className,
  disabled = false,
  interactive = false,
  onRemove,
  removeLabel,
  selected = false,
  tone = "neutral",
  ...props
}: ChipProps) => {
  const asButton = interactive && !onRemove;
  const rootClassName = classNames(
    "if-chip",
    `if-chip--${tone}`,
    asButton && "if-chip--interactive",
    selected && "is-selected",
    disabled && "is-disabled",
    className,
  );

  const body = (
    <>
      <span className="if-chip__label">{children}</span>
      {onRemove ? (
        <button
          className="if-chip__remove"
          type="button"
          aria-label={removeLabel ?? "Remove chip"}
          disabled={disabled}
          onClick={onRemove}
        >
          x
        </button>
      ) : null}
    </>
  );

  if (asButton) {
    return (
      <button className={rootClassName} type="button" aria-pressed={selected} disabled={disabled} {...props}>
        {body}
      </button>
    );
  }

  return (
    <span className={rootClassName} {...props}>
      {body}
    </span>
  );
};
