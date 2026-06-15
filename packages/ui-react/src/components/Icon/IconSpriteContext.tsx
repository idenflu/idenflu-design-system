import * as React from "react";
import { iconSpriteHref } from "@idenflu/ui-icons";

export const IconSpriteContext = React.createContext<string>(iconSpriteHref);

export type IconSpriteProviderProps = {
  /** Bundler-resolved URL of the @idenflu/ui-icons sprite. */
  href: string;
  children: React.ReactNode;
};

export const IconSpriteProvider = ({
  href,
  children,
}: IconSpriteProviderProps) => (
  <IconSpriteContext.Provider value={href}>{children}</IconSpriteContext.Provider>
);

IconSpriteProvider.displayName = "IconSpriteProvider";
