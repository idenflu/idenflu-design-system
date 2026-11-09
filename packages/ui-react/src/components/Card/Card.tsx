import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./Card.module.css";
export type CardProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};
export function Card({ className, ...props }: CardProps) { return <article {...props} className={cn(styles.root, className)} />; }
