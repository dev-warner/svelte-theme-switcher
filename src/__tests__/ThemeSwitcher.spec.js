import "@testing-library/jest-dom/extend-expect";

import { render, fireEvent, act } from "@testing-library/svelte";
import { theme, DEFAULT_THEME, THEMES } from "../core/theme";

// import ThemeSwitcher from "../ThemeSwitcher.svelte";

describe.skip("ThemeSwitcher", () => {
  const getButton = (container) => container.querySelector(".theme-switcher");

  beforeEach(() => {
    theme.set(DEFAULT_THEME);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip("should render", async () => {
    render(ThemeSwitcher);
  });

  it.skip("should be change body class on click", async () => {
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

  it.skip("should render the sun if in light mode", async () => {
    const { getByText } = render(ThemeSwitcher);

    const sun = getByText("Light theme on: Sun");

    expect(sun).toBeTruthy();
  });

  it.skip("should render the moon if in dark mode", async () => {
    const { getByText } = render(ThemeSwitcher);

    await act(() => {
      theme.set(THEMES.DARK);
    });

    const moon = getByText("Dark theme on: Moon");

    expect(moon).toBeTruthy();
  });

  it.skip("should add classname passed", async () => {
    const { container } = render(ThemeSwitcher, {
      props: {
        options: {
          classList: "my-theme",
          height: "60px",
        },
      },
    });

    const button = getButton(container);

    expect(button.classList.contains("my-theme")).toBeTruthy();
  });

  it.skip("should add array of classnames passed", async () => {
    const { container } = render(ThemeSwitcher, {
      props: {
        options: {
          classList: ["my-theme"],
        },
      },
    });

    const button = getButton(container);

    expect(button.classList.contains("my-theme")).toBeTruthy();
  });
});
