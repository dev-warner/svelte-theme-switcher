import "@testing-library/jest-dom/extend-expect";

import { render, fireEvent, act } from "@testing-library/svelte";
import { theme, DEFAULT_THEME, THEMES } from "../core/theme";

import ThemeSwitcher from "../ThemeSwitcher.svelte";

describe("ThemeSwitcher", () => {
  const getButton = container => container.querySelector(".theme-switcher");

  beforeEach(() => {
    theme.set(DEFAULT_THEME);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render", async () => {
    render(ThemeSwitcher);
  });

  it("should be change body class on click", async () => {
    jest
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation(() => {});

    const { container } = render(ThemeSwitcher);

    expect(container.className).toEqual("theme-light");

    await fireEvent.click(getButton(container));

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "current:theme",
      "dark"
    );
    expect(container.className).toEqual("theme-dark");
  });

  it("should render the sun if in light mode", async () => {
    const { getByText } = render(ThemeSwitcher);

    const sun = getByText("Light theme on: Sun");

    expect(sun).toBeTruthy();
  });

  it("should render the moon if in dark mode", async () => {
    const { getByText } = render(ThemeSwitcher);

    await act(() => {
      theme.set(THEMES.DARK);
    });

    const moon = getByText("Dark theme on: Moon");

    expect(moon).toBeTruthy();
  });

  it("should add classname passed", async () => {
    const { container } = render(ThemeSwitcher, {
      props: {
        options: {
          classList: "my-theme",
          height: "60px"
        }
      }
    });

    const button = getButton(container);

    expect(button.classList.contains("my-theme")).toBeTruthy();
  });

  it("should add array of classnames passed", async () => {
    const { container } = render(ThemeSwitcher, {
      props: {
        options: {
          classList: ["my-theme"]
        }
      }
    });

    const button = getButton(container);

    expect(button.classList.contains("my-theme")).toBeTruthy();
  });
});
