import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Progress.module.css";
export type ProgressProps = React.ProgressHTMLAttributes<HTMLProgressElement> & {
  thickness?: "thin" | "normal" | "thick";
  variant?: "primary" | "success" | "warning" | "danger";
};
export const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(function Progress({ thickness = "normal", variant = "primary", className, ...props }, ref) {
  return <progress {...props} ref={ref} className={cn(styles.root, className)} data-thickness={thickness} data-variant={variant} />;
});
