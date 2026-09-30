import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./DrawerFooter.module.css";

export type DrawerFooterProps = React.HTMLAttributes<HTMLElement>;

export const DrawerFooter = ({ className, ...props }: DrawerFooterProps) => (
  <footer className={cn(styles.footer, className)} {...props} />
);

DrawerFooter.displayName = "DrawerFooter";
