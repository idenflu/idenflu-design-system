import * as React from "react";
import { iconAccessibility } from "../Icon/iconAccessibility";

export type SvgIconProps = Omit<
  React.SVGAttributes<SVGSVGElement>,
  "children" | "dangerouslySetInnerHTML" | "name"
> & {
  /** Width and height in pixels. Defaults to 16. */
  size?: number;
  /** Accessible label. Omit for decorative icons, including icons inside buttons. */
  label?: string;
};

// Only generated components supply drawings; consumers cannot replace them.
type InternalSvgIconProps = SvgIconProps & { children?: React.ReactNode };

export const SvgIcon = React.forwardRef<SVGSVGElement, InternalSvgIconProps>(
  ({ size = 16, label, style, children, ...props }, ref) => (
    <svg
      {...iconAccessibility(label)}
      {...props}
      ref={ref}
      width={size}
      height={size}
      style={{
        display: "inline-block",
        flex: "0 0 auto",
        verticalAlign: "middle",
        ...style,
      }}
    >
      {children}
    </svg>
  ),
);

SvgIcon.displayName = "SvgIcon";
