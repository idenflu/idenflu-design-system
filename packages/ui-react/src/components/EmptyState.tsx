import * as React from "react";
import { classNames } from "../utils/classNames";

export type EmptyStateTone = "empty" | "filtered" | "permission" | "error";

export type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  action?: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
  tone?: EmptyStateTone;
};

export const EmptyState = ({ action, className, description, title, tone = "empty", ...props }: EmptyStateProps) => (
  <div className={classNames("if-empty-state", `if-empty-state--${tone}`, className)} {...props}>
    <strong className="if-empty-state__title">{title}</strong>
    <p className="if-empty-state__description">{description}</p>
    {action ? <div className="if-empty-state__action">{action}</div> : null}
  </div>
);
