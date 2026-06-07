import * as React from "react";
import { classNames } from "../utils/classNames";

export type ErrorStateTone = "error" | "warning" | "critical";

export type ErrorStateProps = React.HTMLAttributes<HTMLDivElement> & {
  action?: React.ReactNode;
  description?: React.ReactNode;
  title: React.ReactNode;
  tone?: ErrorStateTone;
};

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ action, className, description, title, tone = "error", ...props }, ref) => (
    <div
      ref={ref}
      role={tone === "warning" ? "status" : "alert"}
      className={classNames("if-error-state", `if-error-state--${tone}`, className)}
      {...props}
    >
      <strong className="if-error-state__title">{title}</strong>
      {description ? <p className="if-error-state__description">{description}</p> : null}
      {action ? <div className="if-error-state__action">{action}</div> : null}
    </div>
  ),
);

ErrorState.displayName = "ErrorState";
