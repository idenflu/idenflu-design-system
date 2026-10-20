import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "../../utils/classNames";
import styles from "./PickerPopover.module.css";

const OFFSET_PX = 4;

export type PickerPopoverProps = {
  open: boolean;
  anchorRef:
    | React.RefObject<HTMLElement | null>
    | React.MutableRefObject<HTMLElement | null>;
  popoverRef: React.MutableRefObject<HTMLDivElement | null>;
  id?: string;
  className?: string;
  "aria-label"?: string;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Portals the picker panel to document.body and pins it under the trigger,
 * matching Select so nested overflow (Popover/Dialog) does not clip it.
 */
export function PickerPopover({
  open,
  anchorRef,
  popoverRef,
  id,
  className,
  "aria-label": ariaLabel,
  onClose,
  children,
}: PickerPopoverProps) {
  const [position, setPosition] = React.useState<{
    left: number;
    top: number;
  }>();

  const updatePosition = React.useCallback(() => {
    const node = anchorRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setPosition({
      left: rect.left,
      top: rect.bottom + OFFSET_PX,
    });
  }, [anchorRef]);

  React.useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    const node = anchorRef.current;
    if (!node) return;

    const observer = new ResizeObserver(updatePosition);
    observer.observe(node);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorRef, updatePosition]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={(el) => {
        popoverRef.current = el;
      }}
      id={id}
      role="dialog"
      aria-label={ariaLabel}
      aria-modal="true"
      className={cn(styles.root, className)}
      style={{
        left: position?.left,
        top: position?.top,
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      {children}
    </div>,
    document.body
  );
}
