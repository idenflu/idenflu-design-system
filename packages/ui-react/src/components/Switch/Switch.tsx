import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../utils/classNames";
import styles from "./Switch.module.css";

export type SwitchSize = "sm" | "md";

export type SwitchProps = Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  "children"
> & {
  /** Decorative icon rendered inside the thumb. */
  icon?: React.ReactNode;
  /** Control size. Defaults to `"md"`. */
  size?: SwitchSize;
};

const switchClassName = cva(styles.root, {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      md: styles.sizeMd,
      sm: styles.sizeSm,
    },
  },
});

const switchThumbClassName = cva(styles.thumb, {
  defaultVariants: {
    size: "md",
    withIcon: false,
  },
  variants: {
    size: {
      md: styles.thumbSizeMd,
      sm: styles.thumbSizeSm,
    },
    withIcon: {
      false: null,
      true: styles.thumbWithIcon,
    },
  },
});

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, icon, size = "md", ...props }, ref) => {
  const hasIcon = icon != null;

  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn(switchClassName({ size }), className)}
      data-size={size}
      data-slot="switch"
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={switchThumbClassName({ size, withIcon: hasIcon })}
        data-slot="switch-thumb"
      >
        {hasIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});

Switch.displayName = "Switch";
