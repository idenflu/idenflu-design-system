import * as React from "react";
import { cn } from "../../utils/classNames";
import { Typography } from "../Typography/Typography";
import { useDrawerContext } from "./DrawerContext";
import { useDrawerHeaderContext } from "./DrawerHeaderContext";
import styles from "./DrawerTitle.module.css";

export type DrawerTitleProps = React.ComponentPropsWithoutRef<
  typeof Typography
>;

export const DrawerTitle = React.forwardRef<HTMLElement, DrawerTitleProps>(
  ({ children, className, id, variant = "title-sm", ...props }, ref) => {
    const { setTitlePresent, titleId } = useDrawerContext("DrawerHeader.Title");
    useDrawerHeaderContext("DrawerHeader.Title");

    React.useEffect(() => {
      setTitlePresent(true);
      return () => setTitlePresent(false);
    }, [setTitlePresent]);

    return (
      <Typography
        ref={ref}
        className={cn(styles.title, className)}
        component="h2"
        id={id ?? titleId}
        variant={variant}
        {...props}
      >
        {children}
      </Typography>
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";
