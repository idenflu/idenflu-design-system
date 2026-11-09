import * as React from "react";
import { Popover as Primitive } from "radix-ui";
import { Button } from "../Button";
import styles from "./Popover.module.css";
export type PopupAlign = "start" | "center" | "end";
export type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  label?: string;
  triggerLabel?: string;
  iconOnly?: boolean;
  align?: PopupAlign;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};
export function Popover({ trigger, children, label, triggerLabel, iconOnly = false, align = "start", open, defaultOpen, onOpenChange }: PopoverProps) {
  return <Primitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <Primitive.Trigger asChild><Button variant="outlined" aria-label={triggerLabel} data-icon-only={iconOnly || undefined}>{trigger}</Button></Primitive.Trigger>
    <Primitive.Portal><Primitive.Content className={styles.content} align={align} aria-label={label}>{children}</Primitive.Content></Primitive.Portal>
  </Primitive.Root>;
}
