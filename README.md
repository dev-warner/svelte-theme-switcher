# Svelte Theme Switcher

A happy little svelte theme switcher to brighten or maybe darken your day 🌞.

- [documentation]()

## Basic example

App.svelte

```javascript
<script>
import ThemeSwitcher from "svelte-theme-switcher";
</script>

<style>

</style>

<ThemeSwitcher/>
```

app.css

```css
body {
  background: var(--background);
  color: var(--text);
  transition: color background-color 0.6s;
}

.theme-light {
  --background: #fff;
  --text: #222;
}
.theme-dark {
  --background: #222;
  --text: #fff;
}
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
