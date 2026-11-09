import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { Divider, type DividerProps } from "../Divider/Divider";
import styles from "./DropdownMenu.module.css";

export type DropdownMenuSize = "lg" | "md" | "sm";

export type DropdownMenuPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export type DropdownMenuTransition = {
  /** Enter animation duration in milliseconds. Defaults to 200. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 100. */
  out?: number;
};

type DropdownMenuContextValue = {
  size: DropdownMenuSize;
};

type DropdownMenuStyle = React.CSSProperties & {
  "--nova-dropdown-enter-duration"?: string;
  "--nova-dropdown-out-duration"?: string;
};

type DropdownMenuSide = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>["side"];

type DropdownMenuAlign = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>["align"];

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  size: "md",
});

const contentClassName = cva(styles.content, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      lg: styles.sizeLg,
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

function getPosition(position: DropdownMenuPosition): {
  align: DropdownMenuAlign;
  side: DropdownMenuSide;
} {
  const [side, align = "center"] = position.split("-") as [
    DropdownMenuSide,
    DropdownMenuAlign?,
  ];

  return { align, side };
}

export type DropdownMenuProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
> & {
  /** Menu item density. Defaults to `md`. */
  size?: DropdownMenuSize;
};

export const DropdownMenu = ({
  children,
  size = "md",
  ...props
}: DropdownMenuProps) => {
  const contextValue = React.useMemo(() => ({ size }), [size]);

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root data-slot="dropdown" {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  );
};

DropdownMenu.displayName = "DropdownMenu";

export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

export const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    data-slot="dropdown-trigger"
    {...props}
  />
));

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type DropdownMenuContentPrimitiveProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  "align" | "side" | "sideOffset"
>;

export type DropdownMenuContentProps = DropdownMenuContentPrimitiveProps & {
  /** Distance between the trigger and menu panel. Defaults to 0. */
  offset?: number;
  /** Menu position relative to the trigger. Defaults to `bottom-start`. */
  position?: DropdownMenuPosition;
  /** Menu item density override. */
  size?: DropdownMenuSize;
  /** Enter and exit animation durations in milliseconds. */
  transition?: DropdownMenuTransition;
};

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      children,
      className,
      offset = 0,
      position = "bottom-start",
      size: sizeProp,
      style,
      transition,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(DropdownMenuContext);
    const size = sizeProp ?? context.size;
    const { align, side } = getPosition(position);
    const contentStyle: DropdownMenuStyle = {
      "--nova-dropdown-enter-duration": `${transition?.enter ?? 200}ms`,
      "--nova-dropdown-out-duration": `${transition?.out ?? 100}ms`,
      ...style,
    };

    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          align={align}
          className={cn(contentClassName({ size }), className)}
          data-size={size}
          data-slot="dropdown-content"
          side={side}
          sideOffset={offset}
          style={contentStyle}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  },
);

DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  /** Optional decorative icon rendered before the label. */
  startIcon?: React.ReactNode;
  /** Optional icon rendered at the end of the item row. */
  endIcon?: React.ReactNode;
};

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ asChild, children, className, endIcon, startIcon, ...props }, ref) => {
  const child = asChild
    ? (React.Children.only(children) as React.ReactElement<{
        children?: React.ReactNode;
      }>)
    : null;
  const content = (
    <>
      {startIcon != null ? (
        <span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>
      ) : null}
      <span className={styles.label}>
        {child ? child.props.children : children}
      </span>
      {endIcon != null ? (
        <span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>
      ) : null}
    </>
  );

  return (
    <DropdownMenuPrimitive.Item
      asChild={asChild}
      ref={ref}
      className={cn(styles.item, className)}
      data-slot="dropdown-item"
      {...props}
    >
      {child ? React.cloneElement(child, undefined, content) : content}
    </DropdownMenuPrimitive.Item>
  );
});

DropdownMenuItem.displayName = "DropdownMenuItem";

export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;

export const DropdownMenuGroup = ({ className, ...props }: DropdownMenuGroupProps) => (
  <DropdownMenuPrimitive.Group
    className={className}
    data-slot="dropdown-group"
    {...props}
  />
);

DropdownMenuGroup.displayName = "DropdownMenuGroup";

export type DropdownMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;

export const DropdownMenuLabel = ({ className, ...props }: DropdownMenuLabelProps) => (
  <DropdownMenuPrimitive.Label
    className={cn(styles.groupLabel, className)}
    data-slot="dropdown-label"
    {...props}
  />
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

export type DropdownMenuSeparatorProps = DividerProps;

export const DropdownMenuSeparator = ({
  className,
  fullWidth = true,
  orientation = "horizontal",
  semantic = true,
  ...props
}: DropdownMenuSeparatorProps) => (
  <Divider
    className={cn(styles.separator, className)}
    data-slot="dropdown-separator"
    fullWidth={fullWidth}
    orientation={orientation}
    semantic={semantic}
    {...props}
  />
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
