import * as React from "react";
import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { useDrawerContext } from "./DrawerContext";
import { composeRefs } from "./Drawer.utils";

export type DrawerCloseProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "color"
> & {
  asChild?: boolean;
  children?: React.ReactNode;
  color?: React.ComponentProps<typeof IconButton>["color"];
  /** Accessible name for the icon close control. Defaults to `"Close"`. */
  label?: string;
  size?: React.ComponentProps<typeof IconButton>["size"];
  variant?: React.ComponentProps<typeof IconButton>["variant"];
};

export const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  DrawerCloseProps
>(
  (
    {
      asChild = false,
      children,
      className,
      color = "neutral",
      label = "Close",
      onClick,
      size = "md",
      type = "button",
      variant = "ghost",
      ...props
    },
    ref,
  ) => {
    const { setOpen } = useDrawerContext("DrawerClose");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        setOpen(false);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: React.MouseEventHandler;
        ref?: React.Ref<HTMLButtonElement>;
      }>;

      return React.cloneElement(child, {
        ...(props as Partial<typeof child.props>),
        "data-slot": "drawer-close",
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(event);
          handleClick(event);
        },
        ref: composeRefs(ref, child.props.ref),
      } as Partial<typeof child.props>);
    }

    return (
      <IconButton
        ref={ref}
        className={className}
        color={color}
        data-slot="drawer-close"
        icon={<Icon name="close" />}
        label={label}
        onClick={handleClick}
        size={size}
        type={type}
        variant={variant}
        {...props}
      />
    );
  },
);

DrawerClose.displayName = "DrawerClose";
