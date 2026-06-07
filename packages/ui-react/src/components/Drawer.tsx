import * as React from "react";
import { classNames } from "../utils/classNames";

export type DrawerSide = "left" | "right";
export type DrawerSize = "sm" | "md" | "lg";

export type DrawerProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  closeIcon?: React.ReactNode;
  closeLabel?: string;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  label?: string;
  onClose: () => void;
  open: boolean;
  side?: DrawerSide;
  size?: DrawerSize;
  title?: React.ReactNode;
};

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      children,
      className,
      closeIcon = "×",
      closeLabel = "Close",
      closeOnBackdrop = true,
      closeOnEsc = true,
      description,
      footer,
      label,
      onClose,
      open,
      side = "right",
      size = "md",
      title,
      ...props
    },
    ref,
  ) => {
    const headingId = React.useId();
    const descriptionId = React.useId();
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const restoreFocusRef = React.useRef<HTMLElement | null>(null);

    const setPanelRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      if (!open || !closeOnEsc) return;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, closeOnEsc, onClose]);

    React.useEffect(() => {
      if (!open) return;
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      panelRef.current?.focus();
      return () => restoreFocusRef.current?.focus?.();
    }, [open]);

    if (!open) return null;

    const labelledBy = title ? headingId : undefined;

    return (
      <>
        <div
          className="if-drawer__backdrop"
          aria-hidden="true"
          onClick={closeOnBackdrop ? onClose : undefined}
        />
        <div
          ref={setPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label={labelledBy ? undefined : label}
          aria-labelledby={labelledBy}
          aria-describedby={description ? descriptionId : undefined}
          className={classNames("if-drawer", `if-drawer--${side}`, `if-drawer--${size}`, className)}
          tabIndex={-1}
          {...props}
        >
          <header className="if-drawer__header">
            <div className="if-drawer__heading">
              {title ? (
                <h2 id={headingId} className="if-drawer__title">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p id={descriptionId} className="if-drawer__description">
                  {description}
                </p>
              ) : null}
            </div>
            <button type="button" className="if-drawer__close" aria-label={closeLabel} onClick={onClose}>
              <span className="if-drawer__close-icon" aria-hidden="true">
                {closeIcon}
              </span>
            </button>
          </header>
          <div className="if-drawer__body">{children}</div>
          {footer ? <footer className="if-drawer__footer">{footer}</footer> : null}
        </div>
      </>
    );
  },
);

Drawer.displayName = "Drawer";
