import * as React from "react";
import { classNames } from "../utils/classNames";

export type BannerTone = "info" | "success" | "warning" | "error";

export type BannerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Severity tone. Drives the semantic color and the derived live-region role. Defaults to `"info"`. */
  tone?: BannerTone;
  /** Bold lead line shown above the message body. */
  title?: React.ReactNode;
  /** Leading status glyph. Always pair tone with text — never signal state by color alone. */
  icon?: React.ReactNode;
  /** Trailing action slot (e.g. a button or link). */
  action?: React.ReactNode;
  /** When provided, renders a dismiss button wired to this handler. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. Defaults to `"Dismiss"`. */
  dismissLabel?: string;
};

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ action, children, className, dismissLabel, icon, onDismiss, title, tone = "info", ...props }, ref) => (
    <div
      ref={ref}
      role={tone === "error" ? "alert" : "status"}
      {...props}
      className={classNames("if-banner", `if-banner--${tone}`, className)}
    >
      {icon != null ? (
        <span className="if-banner__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="if-banner__body">
        {title != null ? <strong className="if-banner__title">{title}</strong> : null}
        {children != null ? <p className="if-banner__message">{children}</p> : null}
      </div>
      {action != null ? <div className="if-banner__action">{action}</div> : null}
      {onDismiss ? (
        <button
          className="if-banner__dismiss"
          type="button"
          aria-label={dismissLabel ?? "Dismiss"}
          onClick={onDismiss}
        >
          x
        </button>
      ) : null}
    </div>
  ),
);

Banner.displayName = "Banner";
