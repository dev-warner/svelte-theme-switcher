export const DEFAULT_OPTIONS = {
  classList: [],
  height: "30px"
};

const ALLOWED_PROPERTIES = [
  "background",
  "light",
  "dark",
  "height",
  "width",
  "transition"
];

export function optionsToStyle(options, parent = "") {
  const BASE = "--theme-switcher-";

  return Object.keys(options)
    .map(key => {
      if (!ALLOWED_PROPERTIES.includes(key)) {
        return;
      }

      const value = options[key];

      if (typeof value === "object") {
        return optionsToStyle(value, parent ? `${parent}-${key}` : key);
      }

      return `${BASE}${parent ? `${parent}-` : ""}${key}: ${value};`;
    })
    .flat()
    .filter(Boolean)
    .join(" ");
}

export function setStyles(userOptions) {
  const { classList, ...opts } = userOptions;

  return optionsToStyle(opts);
}
