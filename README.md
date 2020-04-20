# Svelte Theme Switcher

![Test](https://github.com/dev-warner/svelte-theme-switcher/workflows/Test/badge.svg)

A happy little svelte theme switcher to brighten or maybe darken your day 🌞.

- [demo](https://dev-warner.github.io/svelte-theme-switcher/)

## Basic example

App.svelte

```html
<script>
  import ThemeSwitcher from "svelte-theme-switcher";
</script>

<style>
  :global(body) {
    background: var(--background);
    color: var(--text);
    transition: 0.6s;
  }

  :global(.theme-light) {
    --background: rgb(250, 252, 240);
    --text: #222;
  }
  :global(.theme-dark) {
    --background: #222;
    --text: #fff;
  }
</style>

<ThemeSwitcher />
```

## Installation

```bash
npm i svelte-theme-switcher
```

```
yarn add svelte-theme-switcher
```

### Component props

| Property   | default                          | type   | notes              |
| ---------- | -------------------------------- | ------ | ------------------ |
| height:    | 30px                             | string | must be a px value |
| width:     | 60px                             | string |
| transition | 0.6s                             | string |
| background | `{ light: #ecf0f1, dark: #333 }` | object |

### Example

```js
<ThemeSwitcher
  options={{
    height: "30px",
    width: "60px",
    transition: "0.6s",
    background: {
      light: "#ecf0f1",
      dark: "#333",
    },
  }}
/>
```

### Accessing state

```javascript
<script>
import { theme } from "svelte-theme-switcher";
</script>

<h1>{$theme}</h1>
```

## Web Components

In the head of your document add:

```html
<script src="https://unpkg.com/svelte-theme-switcher@0.0.10/dist/wc/index.js" />
<style>
  body {
    background: var(--background);
    color: var(--text);
    transition: 0.6s;
  }

  .theme-light {
    --background: rgb(250, 252, 240);
    --text: #222;
  }
  .theme-dark {
    --background: #222;
    --text: #fff;
  }
</style>
```

this ensure's there is no inital flicker

You can now add the web component to switch between themes.

```html
<theme-switcher></theme-switcher>
```
