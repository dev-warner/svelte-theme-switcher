<script>
  import { setStyles, DEFAULT_OPTIONS } from "./core/utils";
  import { theme, THEMES, toggleTheme } from "./core/theme";

  import Sun from "./icons/sun.svg";
  import Moon from "./icons/moon.svg";

  export let options = DEFAULT_OPTIONS;

  $: isDarkMode = $theme === THEMES.DARK;

  $: size = Number(
    String(OPTIONS.height)
      .split("px")
      .shift()
  );

  $: OPTIONS = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  $: classes = [
    ...[OPTIONS.classList].flat(),
    isDarkMode ? "theme-switcher__state--dark" : "theme-switcher__state--light"
  ];

  $: style = setStyles(OPTIONS);
</script>

<style>
  :root {
    --theme-switcher-background-light: #ecf0f1;
    --theme-switcher-background-dark: #333;
    --theme-switcher-transition: 0.6s;
    --theme-switcher-height: 30px;
    --theme-switcher-width: 60px;

    --theme-switcher-border-radius: calc(var(--theme-switcher-width) / 2);
    --theme-switcher-offset: calc(var(--theme-switcher-height) / 30);
  }

  .theme-switcher {
    --theme-switcher-background-light: #ecf0f1;
    --theme-switcher-background-dark: #333;
    --theme-switcher-transition: 0.6s;
    --theme-switcher-height: 30px;
    --theme-switcher-width: 60px;

    --theme-switcher-border-radius: calc(var(--theme-switcher-width) / 2);
    --theme-switcher-offset: calc(var(--theme-switcher-height) / 30);

    border: 0;
    overflow: hidden;
    position: relative;
    width: var(--theme-switcher-width);
    min-width: var(--theme-switcher-height);
    height: var(--theme-switcher-height);
    border-radius: var(--theme-switcher-border-radius);
  }

  .theme-switcher__state {
    top: 0;
    line-height: 1;
    position: absolute;
    height: var(--theme-switcher-height);
    transition: left var(--theme-switcher-transition);
    width: calc(
      var(--theme-switcher-height) - calc(var(--theme-switcher-offset) * 4)
    );
    font-size: calc(
      var(--theme-switcher-height) + var(--theme-switcher-offset)
    );
  }

  .theme-switcher__state--dark {
    background-color: var(--theme-switcher-background-dark);
  }

  .theme-switcher__state--light {
    background-color: var(--theme-switcher-background-light);
  }

  .theme-switcher__state--light > .theme-switcher__state {
    left: calc(
      100% - calc(var(--theme-switcher-height) - var(--theme-switcher-offset))
    );
  }

  .theme-switcher__state--dark > .theme-switcher__state {
    left: 0;
  }
</style>

<svelte:options tag="theme-switcher" />

<button
  class="theme-switcher {classes.join(' ')}"
  aria-label="Switch theme"
  on:click={toggleTheme}
  {style}>
  <span class="theme-switcher__state">
    {#if isDarkMode}
      <Moon width={size} height={size} />
    {:else}
      <Sun width={size} height={size} />
    {/if}
  </span>
</button>
