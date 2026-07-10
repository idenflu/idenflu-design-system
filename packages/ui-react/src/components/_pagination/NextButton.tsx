import * as React from "react";

import { Icon } from "../Icon/Icon";
import { IconButton, IconButtonProps } from "../IconButton/IconButton";

export type NextButtonProps = {
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
};

export function NextButton({
  disabled = false,
  label = "Next page",
  size = "md",
  onClick,
}: NextButtonProps) {
  return (
    <IconButton
      aria-disabled={disabled || undefined}
      color="neutral"
      disabled={disabled}
      icon={<Icon name="keyboard-arrow-right" />}
      label={label}
      onClick={onClick}
      size={size}
      variant="ghost"
    />
  );
}
