import { optionsToStyle } from "../core/utils";

describe("optionsToStyles", () => {
  it("should convert an object to css varible", () => {
    const style = optionsToStyle({ width: "30px" });

    expect(style).toEqual("--theme-switcher-width: 30px;");
  });

  it("should take nested objects", () => {
    const style = optionsToStyle({
      width: "30px",
      background: {
        height: "120px"
      }
    });

    expect(style).toEqual(
      "--theme-switcher-width: 30px; --theme-switcher-background-height: 120px;"
    );
  });

  it("should only allow certain properties", () => {
    const style = optionsToStyle({
      width: "30px",
      foo: "anything",
      background: {
        height: "120px"
      }
    });

    expect(style).toEqual(
      "--theme-switcher-width: 30px; --theme-switcher-background-height: 120px;"
    );
  });
});
