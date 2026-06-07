import * as React from "react";
import { classNames } from "../utils/classNames";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export const Badge = ({ className, tone = "neutral", ...props }: BadgeProps) => (
  <span className={classNames("if-badge", `if-badge--${tone}`, className)} {...props} />
);
