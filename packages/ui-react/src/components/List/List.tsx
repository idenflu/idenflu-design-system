import * as React from "react";
import { cn } from "../../utils/classNames";
import styles from "./List.module.css";

export type ListProps = React.HTMLAttributes<HTMLUListElement> & {
  children?: React.ReactNode;
};
export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement>;
export type SelectableListProps = React.HTMLAttributes<HTMLDivElement>;
export type SelectableListItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export function List({ className, ...props }: ListProps) { return <ul {...props} className={cn(styles.list, className)} />; }
export function ListItem(props: ListItemProps) { return <li {...props} />; }
export function SelectableList({ className, role = "group", ...props }: SelectableListProps) { return <div {...props} role={role} className={cn(styles.selectable, className)} />; }
export const SelectableListItem = React.forwardRef<HTMLButtonElement, SelectableListItemProps>(function SelectableListItem({ type = "button", ...props }, ref) { return <button {...props} ref={ref} type={type} />; });
