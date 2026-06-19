import * as React from "react";
import { classNames } from "../../utils/classNames";
import "./Divider.css";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerTextAlign = "start" | "center" | "end";

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Optional label rendered between divider lines. */
  children?: React.ReactNode;
  /** Stretches a vertical divider inside flex layouts. */
  flexItem?: boolean;
  /** Removes the default middle spacing so the divider spans its full container. */
  fullWidth?: boolean;
  /** Divider direction. Defaults to "horizontal". */
  orientation?: DividerOrientation;
  /** Exposes the divider as a semantic separator when it marks a real content boundary. */
  semantic?: boolean;
  /** Label alignment for dividers with children. */
  textAlign?: DividerTextAlign;
};

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      children,
      className,
      flexItem = false,
      fullWidth = false,
      orientation = "horizontal",
      semantic = false,
      textAlign = "center",
      ...props
    },
    ref
  ) => {
    const hasChildren = children != null && children !== "";
    const isSemantic = semantic || hasChildren;

    return (
      <div
        ref={ref}
        aria-hidden={isSemantic ? undefined : true}
        aria-orientation={isSemantic ? orientation : undefined}
        className={classNames(
          "nova-divider",
          `nova-divider--${orientation}`,
          fullWidth && "nova-divider--full-width",
          hasChildren && "nova-divider--with-children",
          hasChildren && `nova-divider--text-${textAlign}`,
          flexItem && "nova-divider--flex-item",
          className
        )}
        role={isSemantic ? "separator" : undefined}
        {...props}
      >
        {hasChildren ? (
          <span className="nova-divider__label">{children}</span>
        ) : null}
      </div>
    );
  }
);

Divider.displayName = "Divider";
