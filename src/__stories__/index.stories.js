import ThemeSwitcher from "../ThemeSwitcher.svelte";

export default {
  title: "ThemeSwitcher",
  component: ThemeSwitcher
};

export const Default = () => ({
  Component: ThemeSwitcher
});

export const CustomCss = () => ({
  Component: ThemeSwitcher,
  props: {
    options: {
      height: "55px",
      width: "200px",
      background: { light: "blue", dark: "red" }
    }
  }
});
