import * as React from "react";
import { cn } from "../../utils/classNames";
import { DrawerHeaderContext } from "./DrawerHeaderContext";
import { DrawerTitle } from "./DrawerTitle";
import { DrawerDescription } from "./DrawerDescription";
import styles from "./DrawerHeader.module.css";

export type DrawerHeaderProps = React.HTMLAttributes<HTMLElement>;

const DrawerHeaderRoot = ({ className, ...props }: DrawerHeaderProps) => (
  <DrawerHeaderContext.Provider value={true}>
    <header
      className={cn(styles.header, className)}
      data-drawer-header
      {...props}
    />
  </DrawerHeaderContext.Provider>
);

DrawerHeaderRoot.displayName = "DrawerHeader";

export const DrawerHeader = Object.assign(DrawerHeaderRoot, {
  Title: DrawerTitle,
  Description: DrawerDescription,
});
