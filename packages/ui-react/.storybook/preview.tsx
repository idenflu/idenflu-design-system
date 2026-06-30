import * as React from "react";
import type { Preview } from "@storybook/react-vite";
import spriteUrl from "@idenflu/ui-icons/icons.svg?url";
import { IconSpriteProvider } from "../src/components/Icon/IconSpriteContext";
import { TooltipProvider } from "../src/components/Tooltip";
import "../src/styles.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <TooltipProvider>
        <IconSpriteProvider href={spriteUrl}>
          <Story />
        </IconSpriteProvider>
      </TooltipProvider>
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
