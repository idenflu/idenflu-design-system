import * as React from "react";
import {
  DrawerContext,
  type DrawerContextValue,
  type DrawerSide,
  type DrawerSize,
} from "./DrawerContext";
import { DrawerTrigger } from "./DrawerTrigger";
import { DrawerContent } from "./DrawerContent";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerBody } from "./DrawerBody";
import { DrawerFooter } from "./DrawerFooter";
import { DrawerClose } from "./DrawerClose";
import { DrawerPortal } from "./DrawerPortal";
import { DrawerOverlay } from "./DrawerOverlay";

export type DrawerProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  /** Callback fired when the drawer requests to close. */
  onClose: () => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Edge from which the drawer panel slides in. */
  side: DrawerSide;
  /** Panel width preset for left/right drawers. Defaults to `md`. */
  size?: DrawerSize;
};

const DrawerRoot = ({
  children,
  defaultOpen = false,
  onClose,
  onOpenChange,
  open,
  side,
  size = "md",
}: DrawerProps) => {
  const titleId = React.useId();
  const descriptionId = React.useId();
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const [titlePresent, setTitlePresent] = React.useState(false);
  const [descriptionPresent, setDescriptionPresent] = React.useState(false);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);

      if (!nextOpen) {
        onClose();
      }
    },
    [isControlled, onClose, onOpenChange],
  );

  const contextValue = React.useMemo<DrawerContextValue>(
    () => ({
      descriptionId,
      descriptionPresent,
      open: isOpen,
      setDescriptionPresent,
      setOpen,
      setTitlePresent,
      side,
      size,
      titleId,
      titlePresent,
    }),
    [
      descriptionId,
      descriptionPresent,
      isOpen,
      setOpen,
      side,
      size,
      titleId,
      titlePresent,
    ],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <div>{children}</div>
    </DrawerContext.Provider>
  );
};

DrawerRoot.displayName = "Drawer";

/** Drawer parts are grouped to make the intended structure discoverable. */
export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Close: DrawerClose,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
});

export type { DrawerSide, DrawerSize } from "./DrawerContext";
