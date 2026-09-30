import * as React from "react";
import { cn } from "../../utils/classNames";
import { type DrawerTransition } from "./DrawerContent";
import styles from "./DrawerOverlay.module.css";

type DrawerStyle = React.CSSProperties & {
  "--nova-drawer-enter-duration"?: string;
  "--nova-drawer-out-duration"?: string;
};

export type DrawerOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  transition?: DrawerTransition;
};

export const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  DrawerOverlayProps
>(({ className, style, transition, ...props }, ref) => {
  const overlayStyle: DrawerStyle = {
    "--nova-drawer-enter-duration": `${transition?.enter ?? 200}ms`,
    "--nova-drawer-out-duration": `${transition?.out ?? 160}ms`,
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(styles.overlay, className)}
      style={overlayStyle}
      {...props}
    />
  );
});

DrawerOverlay.displayName = "DrawerOverlay";
