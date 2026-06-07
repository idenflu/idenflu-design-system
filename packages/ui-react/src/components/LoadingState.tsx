import * as React from "react";
import { classNames } from "../utils/classNames";

export type LoadingStateSize = "small" | "medium" | "large";

export type LoadingStateProps = React.HTMLAttributes<HTMLDivElement> & {
  description?: React.ReactNode;
  label: React.ReactNode;
  size?: LoadingStateSize;
};

export const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, description, label, size = "medium", ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={classNames("if-loading-state", `if-loading-state--${size}`, className)}
      {...props}
    >
      <span className="if-loading-state__spinner" aria-hidden="true" />
      <div className="if-loading-state__body">
        <strong className="if-loading-state__label">{label}</strong>
        {description ? <p className="if-loading-state__description">{description}</p> : null}
      </div>
    </div>
  ),
);

LoadingState.displayName = "LoadingState";
