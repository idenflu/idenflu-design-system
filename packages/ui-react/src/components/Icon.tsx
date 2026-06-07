import * as React from "react";
import { getIconHref, iconSpriteHref, type IconName } from "@idenflu/ui-icons";
import { classNames } from "../utils/classNames";

export type IconSize = "small" | "medium" | "large";

const ICON_SIZES: Record<IconSize, number> = {
  small: 16,
  medium: 20,
  large: 24,
};

const IconSpriteContext = React.createContext<string>(iconSpriteHref);

export type IconSpriteProviderProps = {
  /** Bundler-resolved URL of the @idenflu/ui-icons sprite. */
  href: string;
  children: React.ReactNode;
};

export const IconSpriteProvider = ({ href, children }: IconSpriteProviderProps) => (
  <IconSpriteContext.Provider value={href}>{children}</IconSpriteContext.Provider>
);

IconSpriteProvider.displayName = "IconSpriteProvider";

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
        className={classNames("if-icon", className)}
        {...a11y}
        {...props}
      >
        <use href={getIconHref(name, spriteHref ?? contextHref)} />
      </svg>
    );
  },
);

Icon.displayName = "Icon";
