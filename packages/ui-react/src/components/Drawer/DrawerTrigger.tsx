import * as React from "react";
import { useDrawerContext } from "./DrawerContext";
import { composeRefs } from "./Drawer.utils";

export type DrawerTriggerProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

export const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  DrawerTriggerProps
>(({ asChild = false, children, onClick, type = "button", ...props }, ref) => {
  const { setOpen } = useDrawerContext("DrawerTrigger");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      setOpen(true);
    }
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: React.MouseEventHandler;
      ref?: React.Ref<HTMLElement>;
    }>;

    return React.cloneElement(child, {
      ...(props as Partial<typeof child.props>),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(event);
        handleClick(event);
      },
      ref: composeRefs(ref, child.props.ref),
    } as Partial<typeof child.props>);
  }

  return (
    <button ref={ref} onClick={handleClick} type={type} {...props}>
      {children}
    </button>
  );
});

DrawerTrigger.displayName = "DrawerTrigger";
