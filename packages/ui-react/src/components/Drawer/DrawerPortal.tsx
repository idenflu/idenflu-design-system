import * as React from "react";
import { createPortal } from "react-dom";

export type DrawerPortalProps = {
  children?: React.ReactNode;
  container?: HTMLElement | null;
  /** When `false`, nothing is portaled. Used for exit animations. */
  mounted?: boolean;
};

export const DrawerPortal = ({
  children,
  container,
  mounted = true,
}: DrawerPortalProps) => {
  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, container ?? document.body);
};

DrawerPortal.displayName = "DrawerPortal";
