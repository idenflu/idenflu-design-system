import * as React from "react";

import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";

export type PrevButtonProps = {
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
};

export function PrevButton({
  disabled = false,
  label = "Previous page",
  size = "md",
  onClick,
}: PrevButtonProps) {
  return (
    <IconButton
      aria-disabled={disabled || undefined}
      color="neutral"
      disabled={disabled}
      icon={<Icon name="keyboard-arrow-left" />}
      label={label}
      onClick={onClick}
      size={size}
      variant="ghost"
    />
  );
}
