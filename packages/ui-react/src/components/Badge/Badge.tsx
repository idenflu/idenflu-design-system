import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Badge.module.css";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger";
export type BadgeAppearance = "default" | "solid";
export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: BadgeSize;
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
};
export function Badge({ size, variant = "neutral", appearance = "default", className, ...props }: BadgeProps) {
  return <span {...props} className={cn(styles.root, className)} data-size={size} data-variant={variant} data-appearance={appearance} />;
}
