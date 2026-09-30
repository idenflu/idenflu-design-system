import * as React from "react";
import { cn } from "../../utils/classNames";
import { type DrawerTransition } from "./DrawerContext";
import styles from "./DrawerBackdrop.module.css";

type DrawerStyle = React.CSSProperties & {
  "--nova-drawer-enter-duration"?: string;
  "--nova-drawer-out-duration"?: string;
};

export type DrawerBackdropProps = React.HTMLAttributes<HTMLDivElement> & {
  transition?: DrawerTransition;
  visible?: boolean;
};

export const DrawerBackdrop = React.forwardRef<
  HTMLDivElement,
  DrawerBackdropProps
>(({ className, style, transition, visible = true, ...props }, ref) => {
  const overlayStyle: DrawerStyle = {
    "--nova-drawer-enter-duration": `${transition?.enter ?? 200}ms`,
    "--nova-drawer-out-duration": `${transition?.out ?? 160}ms`,
    ...style,
  };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(styles.backdrop, className)}
      data-hidden={visible ? undefined : ""}
      style={overlayStyle}
      {...props}
    />
  );
});

DrawerBackdrop.displayName = "DrawerBackdrop";
