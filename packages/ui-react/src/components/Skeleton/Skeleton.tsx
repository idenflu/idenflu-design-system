import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Skeleton.module.css";
export type SkeletonProps = React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode;
};
export function Skeleton({ className, ...props }: SkeletonProps) { return <span {...props} aria-hidden="true" className={cn(styles.root, className)} />; }
