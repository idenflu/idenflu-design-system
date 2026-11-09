import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./CircleProgress.module.css";
export type CircleProgressProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  max?: number;
  label: string;
  variant?: "primary" | "success";
};
export function CircleProgress({ value, max = 100, label, variant = "primary", className, ...props }: CircleProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.min(safeMax, Math.max(0, value)) : 0;
  const percent = Math.round(safeValue / safeMax * 100);
  return <div {...props} className={cn(styles.root, className)} data-variant={variant} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue}>
    <svg viewBox="0 0 36 36" aria-hidden="true"><circle className={styles.track} cx="18" cy="18" r="15.9155" /><circle className={styles.value} cx="18" cy="18" r="15.9155" strokeDasharray={`${percent} ${100 - percent}`} /></svg><span aria-hidden="true">{percent}%</span>
  </div>;
}
