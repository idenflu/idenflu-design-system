import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./SegmentedProgress.module.css";
export type SegmentedProgressProps = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  value: number;
  total: number;
  label: string;
};
export function SegmentedProgress({ value, total, label, className, style, ...props }: SegmentedProgressProps) {
  const count = Number.isFinite(total) ? Math.max(1, Math.floor(total)) : 1;
  const current = Number.isFinite(value) ? Math.min(count, Math.max(0, Math.floor(value))) : 0;
  return <div {...props} className={cn(styles.root, className)} style={{ ...style, gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={count} aria-valuenow={current}>{Array.from({ length: count }, (_, index) => <span key={index} aria-hidden="true" data-complete={index < current || undefined} />)}</div>;
}
