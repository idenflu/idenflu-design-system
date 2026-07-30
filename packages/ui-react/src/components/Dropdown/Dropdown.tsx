import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import { Divider, type DividerProps } from "../Divider/Divider";
import styles from "./Dropdown.module.css";

export type DropdownSize = "lg" | "md" | "sm";

export type DropdownPosition =
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

export type DropdownTransition = {
  /** Enter animation duration in milliseconds. Defaults to 200. */
  enter?: number;
  /** Exit animation duration in milliseconds. Defaults to 100. */
  out?: number;
};

type DropdownContextValue = {
  size: DropdownSize;
};

type DropdownStyle = React.CSSProperties & {
  "--nova-dropdown-enter-duration"?: string;
  "--nova-dropdown-out-duration"?: string;
};

type DropdownSide = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>["side"];

type DropdownAlign = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>["align"];

const DropdownContext = React.createContext<DropdownContextValue>({
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

function getPosition(position: DropdownPosition): {
  align: DropdownAlign;
  side: DropdownSide;
} {
  const [side, align = "center"] = position.split("-") as [
    DropdownSide,
    DropdownAlign?,
  ];

  return { align, side };
}

export type DropdownProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
> & {
  /** Menu item density. Defaults to `md`. */
  size?: DropdownSize;
};

export const Dropdown = ({
  children,
  size = "md",
  ...props
}: DropdownProps) => {
  const contextValue = React.useMemo(() => ({ size }), [size]);

  return (
    <DropdownContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root data-slot="dropdown" {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownContext.Provider>
  );
};

Dropdown.displayName = "Dropdown";

export type DropdownTriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

export const DropdownTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownTriggerProps
>(({ ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    data-slot="dropdown-trigger"
    {...props}
  />
));

DropdownTrigger.displayName = "DropdownTrigger";

type DropdownContentPrimitiveProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  "align" | "side" | "sideOffset"
>;

export type DropdownContentProps = DropdownContentPrimitiveProps & {
  /** Distance between the trigger and menu panel. Defaults to 0. */
  offset?: number;
  /** Menu position relative to the trigger. Defaults to `bottom-start`. */
  position?: DropdownPosition;
  /** Menu item density override. */
  size?: DropdownSize;
  /** Enter and exit animation durations in milliseconds. */
  transition?: DropdownTransition;
};

export const DropdownContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownContentProps
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
    ref
  ) => {
    const context = React.useContext(DropdownContext);
    const size = sizeProp ?? context.size;
    const { align, side } = getPosition(position);
    const contentStyle: DropdownStyle = {
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
  }
);

DropdownContent.displayName = "DropdownContent";

export type DropdownItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  /** Optional icon rendered at the end of the item row. */
  endIcon?: React.ReactNode;
};

export const DropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ children, className, endIcon, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(styles.item, className)}
    data-slot="dropdown-item"
    {...props}
  >
    <span className={styles.label}>{children}</span>
    {endIcon ? (
      <span className={styles.endIcon} aria-hidden="true">
        {endIcon}
      </span>
    ) : null}
  </DropdownMenuPrimitive.Item>
));

DropdownItem.displayName = "DropdownItem";

export type DropdownGroupProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;

export const DropdownGroup = ({ className, ...props }: DropdownGroupProps) => (
  <DropdownMenuPrimitive.Group
    className={className}
    data-slot="dropdown-group"
    {...props}
  />
);

DropdownGroup.displayName = "DropdownGroup";

export type DropdownLabelProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;

export const DropdownLabel = ({ className, ...props }: DropdownLabelProps) => (
  <DropdownMenuPrimitive.Label
    className={cn(styles.groupLabel, className)}
    data-slot="dropdown-label"
    {...props}
  />
);

DropdownLabel.displayName = "DropdownLabel";

export type DropdownSeparatorProps = DividerProps;

export const DropdownSeparator = ({
  className,
  fullWidth = true,
  orientation = "horizontal",
  semantic = true,
  ...props
}: DropdownSeparatorProps) => (
  <Divider
    className={cn(styles.separator, className)}
    data-slot="dropdown-separator"
    fullWidth={fullWidth}
    orientation={orientation}
    semantic={semantic}
    {...props}
  />
);

DropdownSeparator.displayName = "DropdownSeparator";
