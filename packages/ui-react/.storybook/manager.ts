import { addons } from "storybook/manager-api";
import {
  GLOBALS_UPDATED,
  SET_GLOBALS,
  UPDATE_GLOBALS,
} from "storybook/internal/core-events";
import { themes, type ThemeVars } from "storybook/theming";

type ThemeChoice = "system" | "light" | "dark";

const ADDON_ID = "idenflu/manager-theme-sync";
const THEME_GLOBAL_KEY = "theme";

const getThemeFromUrl = (): ThemeChoice | null => {
  const globals = new URLSearchParams(window.location.search).get("globals");
  const match = globals?.match(/(?:^|,)theme:([^,]+)/);
  const value = match?.[1];

  if (value === "system" || value === "light" || value === "dark") {
    return value;
  }

  return null;
};

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

let selectedTheme: ThemeChoice = getThemeFromUrl() ?? "system";
let appliedTheme: ThemeVars | null = null;

const resolveManagerTheme = (): ThemeVars => {
  if (selectedTheme === "dark") {
    return themes.dark;
  }

  if (selectedTheme === "light") {
    return themes.light;
  }

  return mediaQuery.matches ? themes.dark : themes.light;
};

const readThemeFromGlobals = (
  globals?: Record<string, unknown>,
): ThemeChoice | null => {
  const nextTheme = globals?.[THEME_GLOBAL_KEY];

  if (nextTheme === "system" || nextTheme === "light" || nextTheme === "dark") {
    return nextTheme;
  }

  return null;
};

// Initial paint before the addon API is ready.
addons.setConfig({
  theme: resolveManagerTheme(),
});

addons.register(ADDON_ID, (api) => {
  const applyManagerTheme = () => {
    const nextTheme = resolveManagerTheme();

    if (appliedTheme === nextTheme) {
      return;
    }

    appliedTheme = nextTheme;
    // setOptions triggers a live manager re-render; setConfig alone does not.
    api.setOptions({ theme: nextTheme });
  };

  applyManagerTheme();

  const onGlobals = (payload: { globals?: Record<string, unknown> }) => {
    const nextTheme = readThemeFromGlobals(payload.globals);

    if (!nextTheme) {
      return;
    }

    selectedTheme = nextTheme;
    applyManagerTheme();
  };

  api.on(SET_GLOBALS, onGlobals);
  api.on(UPDATE_GLOBALS, onGlobals);
  api.on(GLOBALS_UPDATED, onGlobals);

  const onSystemPreferenceChange = () => {
    if (selectedTheme === "system") {
      applyManagerTheme();
    }
  };

  mediaQuery.addEventListener("change", onSystemPreferenceChange);
});
