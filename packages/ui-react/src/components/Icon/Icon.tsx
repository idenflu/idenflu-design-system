import * as React from "react";
import { getIconHref, type IconName } from "@idenflu/ui-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/classNames";
import { IconSpriteContext } from "./IconSpriteContext";
import styles from "./Icon.module.css";

export type IconSize = "small" | "medium" | "large";

const ICON_SIZES: Record<IconSize, number> = {
  small: 12,
  medium: 16,
  large: 20,
};

const iconClassName = cva(styles.root);

export type IconProps = Omit<React.SVGAttributes<SVGSVGElement>, "children"> & {
  /** Icon symbol name from @idenflu/ui-icons. */
  name: IconName;
  /** Accessible label. When omitted the icon is decorative (aria-hidden). */
  label?: string;
  /** Size token (small=16, medium=20, large=24) or explicit pixels. Defaults to "medium". */
  size?: IconSize | number;
  /** Override the sprite URL for this icon. Defaults to the IconSpriteProvider value. */
  spriteHref?: string;
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, label, name, size = "medium", spriteHref, ...props }, ref) => {
    const contextHref = React.useContext(IconSpriteContext);
    const px = typeof size === "number" ? size : ICON_SIZES[size];
    const a11y = label
      ? ({ role: "img", "aria-label": label } as const)
      : ({ "aria-hidden": true, focusable: false } as const);

    return (
      <svg
        ref={ref}
        width={px}
        height={px}
        viewBox="0 0 24 24"
        className={cn(iconClassName(), className)}
        {...a11y}
        {...props}
      >
        <use href={getIconHref(name, spriteHref ?? contextHref)} />
      </svg>
    );
  }
);

Icon.displayName = "Icon";
