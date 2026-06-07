import * as React from "react";
import { classNames } from "../utils/classNames";

export type ToolbarAlign = "start" | "center" | "end" | "between";
export type ToolbarDensity = "comfortable" | "compact";

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: ToolbarAlign;
  density?: ToolbarDensity;
  label: string;
};

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ align = "start", className, density = "comfortable", label, ...props }, ref) => (
    <div
      ref={ref}
      role="toolbar"
      aria-label={label}
      aria-orientation="horizontal"
      className={classNames("if-toolbar", `if-toolbar--${align}`, `if-toolbar--${density}`, className)}
      {...props}
    />
  ),
);

Toolbar.displayName = "Toolbar";

export type ToolbarGroupAlign = "start" | "end";

export type ToolbarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: ToolbarGroupAlign;
  label?: string;
};

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ align = "start", className, label, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={classNames("if-toolbar__group", `if-toolbar__group--${align}`, className)}
      {...props}
    />
  ),
);

ToolbarGroup.displayName = "ToolbarGroup";
