import { writable } from "svelte/store";

export const LOCAL_STORAGE_KEY = "current:theme";

export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const MATCH_DARK_THEME = "(prefers-color-scheme: dark)";

export const IS_USER_PREFERNCE_DARK =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia(MATCH_DARK_THEME).matches;

export const STORED =
  typeof window !== "undefined" && localStorage.getItem(LOCAL_STORAGE_KEY);

export const DEFAULT_THEME = STORED
  ? STORED
  : IS_USER_PREFERNCE_DARK
  ? THEMES.DARK
  : THEMES.LIGHT;

export const theme = writable(DEFAULT_THEME);

export function toggleTheme() {
  theme.update((current) =>
    current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
  );
}

export function onSystemThemeChange(e) {
  const newTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;

  theme.set(newTheme);
}

function onChange(theme) {
  document.body.classList.remove(
    `theme-${theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK}`
  );
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem(LOCAL_STORAGE_KEY, theme);
}

document.addEventListener("DOMContentLoaded", function listener() {
  onChange(DEFAULT_THEME);
  document.removeEventListener("DOMContentLoaded", listener);
});

if (typeof window !== "undefined") {
  window.matchMedia &&
    window.matchMedia(MATCH_DARK_THEME).addListener(onSystemThemeChange);

  theme.subscribe((theme) => {
    const ready =
      document.readyState == "complete" ||
      document.readyState === "interactive";

    if (ready) {
      onChange(theme);
    }
  });
}
