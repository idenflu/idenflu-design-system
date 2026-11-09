import * as React from "react";
import { cn } from "../../utils/classNames";
import { Icon } from "../Icon";
import styles from "./Accordion.module.css";
export type AccordionProps = React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode };
export type AccordionItemProps = Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, "title"> & { title: React.ReactNode };
export function Accordion({ className, ...props }: AccordionProps) { return <div {...props} className={cn(styles.root, className)} />; }
export function AccordionItem({ title, children, ...props }: AccordionItemProps) { return <details {...props}><summary>{title}<Icon name="keyboard-arrow-down" aria-hidden="true" /></summary>{children}</details>; }
