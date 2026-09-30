import * as React from "react";

export type DrawerSide = "bottom" | "left" | "right" | "top";
export type DrawerSize = "lg" | "md" | "sm";

export type DrawerContextValue = {
  descriptionId: string;
  descriptionPresent: boolean;
  open: boolean;
  setDescriptionPresent: (present: boolean) => void;
  setOpen: (open: boolean) => void;
  setTitlePresent: (present: boolean) => void;
  side: DrawerSide;
  size: DrawerSize;
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
