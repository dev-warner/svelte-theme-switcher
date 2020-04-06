# Svelte Theme Switcher

![CI](https://github.com/dev-warner/svelte-theme-switcher/workflows/Node.js%20CI/badge.svg)

A happy little svelte theme switcher to brighten or maybe darken your day 🌞.

- [demo]()

## Basic example

App.svelte

```javascript
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

<ThemeSwitcher/>
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
      dark: "#333"
    }
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
