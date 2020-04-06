import { onSystemThemeChange, theme, toggleTheme } from "../core/theme";

describe("theme", () => {
  it("onSystemThemeChange: dark", async () => {
    jest.spyOn(theme, "set").mockImplementation(() => true);

    onSystemThemeChange({ matches: true });

    expect(theme.set).toHaveBeenCalledWith("dark");
  });
  it("onSystemThemeChange: light", async () => {
    jest.spyOn(theme, "set").mockImplementation(() => true);

    onSystemThemeChange({ matches: false });

    expect(theme.set).toHaveBeenCalledWith("light");
  });

  it("toggleTheme: sets dark when current is light", async () => {
    jest
      .spyOn(theme, "update")
      .mockImplementation(cb => expect(cb("light")).toEqual("dark"));

    toggleTheme();
  });

  it("toggleTheme: sets light when current is dark", async () => {
    jest
      .spyOn(theme, "update")
      .mockImplementation(cb => expect(cb("dark")).toEqual("light"));

    toggleTheme();
  });
});
