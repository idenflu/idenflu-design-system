import * as React from "react";

export type DrawerSide = "bottom" | "left" | "right" | "top";
export type DrawerSize = "lg" | "md" | "sm";

export type DrawerTransition = {
  /** Enter animation duration in milliseconds. Defaults to 200. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 160. */
  out?: number;
};

export type DrawerContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  setDescriptionPresent: (present: boolean) => void;
  setOpen: (open: boolean) => void;
  setTitlePresent: (present: boolean) => void;
  titleId: string;
  titlePresent: boolean;
};

export const DrawerContext = React.createContext<DrawerContextValue | null>(
  null,
);

export function useDrawerContext(component: string) {
  const context = React.useContext(DrawerContext);

  if (!context) {
    throw new Error(`${component} must be used within Drawer.`);
  }

  return context;
}
