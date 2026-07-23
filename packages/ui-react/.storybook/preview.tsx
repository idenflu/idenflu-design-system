import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { IconSpriteProvider } from "../src/components/Icon/IconSpriteContext";
import { TooltipProvider } from "../src/components/Tooltip";
import "../src/styles.css";
import { createTheme, ThemeProvider } from "../src/theme";

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

const theme = createTheme({
  components: {
    Button: {
      defaultProps: {
        variant: "ghost",
      },
    },
  },
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <IconSpriteProvider href={spriteUrl}>
            <Story />
          </IconSpriteProvider>
        </TooltipProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
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
