import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./DrawerBody.module.css";

export type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

export const DrawerBody = ({ className, ...props }: DrawerBodyProps) => (
  <div className={cn(styles.body, className)} {...props} />
);

DrawerBody.displayName = "DrawerBody";
