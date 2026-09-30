import * as React from "react";
import { cn } from "../../utils/classNames";
import { Typography } from "../Typography/Typography";
import { useDrawerContext } from "./DrawerContext";
import { useDrawerHeaderContext } from "./DrawerHeaderContext";
import styles from "./DrawerDescription.module.css";

export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DrawerDescription = React.forwardRef<
  HTMLElement,
  DrawerDescriptionProps
>(({ children, className, id, variant = "body-sm", ...props }, ref) => {
  const { descriptionId, setDescriptionPresent } = useDrawerContext(
    "DrawerHeader.Description",
  );
  useDrawerHeaderContext("DrawerHeader.Description");

  React.useEffect(() => {
    setDescriptionPresent(true);
    return () => setDescriptionPresent(false);
  }, [setDescriptionPresent]);

  return (
    <Typography
      ref={ref}
      className={cn(styles.description, className)}
      component="p"
      id={id ?? descriptionId}
      variant={variant}
      {...props}
    >
      {children}
    </Typography>
  );
});

DrawerDescription.displayName = "DrawerDescription";
