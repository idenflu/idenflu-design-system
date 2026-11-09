import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./NovaSpinner.module.css";
export type NovaSpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: number;
  appearance?: "orbit" | "mark";
  variant?: "brand" | "neutral" | "inverse";
  label?: string;
};
export function NovaSpinner({ size = 48, appearance = "orbit", variant = "brand", label = "로딩 중", className, style, ...props }: NovaSpinnerProps) {
  const dimension = Number.isFinite(size) && size > 0 ? size : 48;
  return <span {...props} role="status" aria-label={label} className={cn(styles.root, className)} data-variant={variant} style={{ ...style, width: dimension, height: dimension }}>
    <svg viewBox="0 0 108 108" fill="none" aria-hidden="true" focusable="false">
      {appearance === "orbit" && <><circle className={styles.track} cx="54" cy="54" r="50" /><g className={styles.orbit}><circle cx="54" cy="54" r="50" strokeDasharray="56 258.16" strokeLinecap="round" /></g></>}
      <g transform={appearance === "orbit" ? "translate(20.52 20.52) scale(0.62)" : undefined}><g transform="translate(11.5 6)">
        <path className={cn(styles.facet, styles.left)} d="M0 10.6667L21.25 0V85.3333L0 96V10.6667Z" />
        <path className={cn(styles.facet, styles.diagonal)} d="M0 10.6667L21.25 0L85 85.3333L63.75 96L0 10.6667Z" />
        <path className={cn(styles.facet, styles.right)} d="M63.75 10.6667L85 0V85.3333L63.75 96V10.6667Z" />
      </g></g>
    </svg>
  </span>;
}
