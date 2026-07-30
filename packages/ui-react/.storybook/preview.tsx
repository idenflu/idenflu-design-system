import * as React from "react";
import type { Decorator, Preview, Renderer } from "@storybook/react-vite";
import { DecoratorHelpers } from "@storybook/addon-themes";
import { useEffect } from "storybook/preview-api";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { IconSpriteProvider } from "../src/components/Icon/IconSpriteContext";
import { TooltipProvider } from "../src/components/Tooltip";
import "../src/styles.css";
import "./preview.css";

const { initializeThemeState, pluckThemeFromContext } = DecoratorHelpers;

type ThemeChoice = "system" | "light" | "dark";

const THEME_NAMES: ThemeChoice[] = ["system", "light", "dark"];
const DEFAULT_THEME: ThemeChoice = "system";
const DARK_CLASS = "dark";

initializeThemeState(THEME_NAMES, DEFAULT_THEME);

const resolveIsDark = (theme: ThemeChoice): boolean => {
  if (theme === "dark") {
    return true;
  }

  if (theme === "light") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const withIdenfluTheme: Decorator<Renderer> = (StoryFn, context) => {
  const themeOverride = context.parameters.themes?.themeOverride as
    | ThemeChoice
    | undefined;
  const selectedFromGlobals = pluckThemeFromContext(context) as ThemeChoice | "";
  const selectedTheme: ThemeChoice =
    themeOverride || selectedFromGlobals || DEFAULT_THEME;

  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      root.classList.toggle(DARK_CLASS, resolveIsDark(selectedTheme));
    };

    apply();

    if (selectedTheme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply();
    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [selectedTheme]);

  return <StoryFn />;
};

const appendFontLink = (id: string, linkAttributes: Record<string, string>) => {
  if (typeof document === "undefined") {
    return;
  }

  if (document.getElementById(id)) {
    return;
  }

  const link = document.createElement("link");
  link.id = id;

  Object.entries(linkAttributes).forEach(([key, value]) => {
    link.setAttribute(key, value);
  });

  document.head.appendChild(link);
};

const appendNotoSansKrFontLinks = () => {
  appendFontLink("noto-sans-kr-googleapis-preconnect", {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  });
  appendFontLink("noto-sans-kr-gstatic-preconnect", {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "",
  });
  appendFontLink("noto-sans-kr-stylesheet", {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap",
  });
};

appendNotoSansKrFontLinks();

const preview: Preview = {
  decorators: [
    withIdenfluTheme,
    (Story) => (
      <TooltipProvider>
        <IconSpriteProvider href={spriteUrl}>
          <Story />
        </IconSpriteProvider>
      </TooltipProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      // Canvas background comes from token-backed preview.css + `.dark`.
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
