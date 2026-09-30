import * as React from "react";

export const DrawerHeaderContext = React.createContext(false);

export function useDrawerHeaderContext(component: string) {
  if (!React.useContext(DrawerHeaderContext)) {
    throw new Error(`${component} must be used within Drawer.Header.`);
  }
}
