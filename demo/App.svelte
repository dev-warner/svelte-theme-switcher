<script>
  import ThemeSwitcher, { theme } from "../src";
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

  .container {
    max-width: 600px;
    width: 100%;
    margin: 8px auto;
  }

  .header {
    display: flex;
  }

  .header__links {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .header__link {
    margin-left: 8px;
  }

  code {
    width: 100%;
    word-break: break-word;
  }

  p {
    margin: 2rem 0;
  }

  ul {
    padding-left: 16px;
  }

  li {
    margin-bottom: 16px;
  }
</style>

<section class="container">
  <header class="header">
    <ThemeSwitcher />
    <ul class="header__links">
      <li class="header__link">
        <a
          class="github-button"
          href="https://github.com/dev-warner"
          data-color-scheme="no-preference: light; light: light; dark: dark;"
          data-size="large"
          aria-label="Follow @dev-warner on GitHub">
          Follow @dev-warner
        </a>
      </li>
      <li class="header__link">
        <a
          class="github-button"
          href="https://github.com/dev-warner/svelte-theme-switcher"
          data-color-scheme="no-preference: dark;"
          data-icon="octicon-star"
          data-size="large"
          aria-label="Star dev-warner/svelte-theme-switcher on GitHub">
          Star
        </a>
      </li>
    </ul>
  </header>

  <h1>
    What a lovely
    <b>{$theme}</b>
    theme you have!
  </h1>

  <h2>Features</h2>

  <ul>
    <li>Selection gets persisted</li>
    <li>Theme reacts to user preferences</li>
    <li>You get a lovely happy switch button</li>
  </ul>

  <p>
    Fancy stuff, you should open up your OS settings and see this site react to
    your preferences.
  </p>

  <ul>
    <li>
      <span>Mac OS:</span>
      <pre>
        <code>Preferences > General > Appearance.</code>
      </pre>
      Then select your theme
    </li>
    <li>
      <span>Windows 10:</span>
      <pre>
        <code>Settings > Personalization > Colors.</code>
      </pre>
      Then scroll down under Choose your mode and select Dark.
    </li>
  </ul>

  <h2>Try it out</h2>

  <pre>
    <code>$ npm i svelte-theme-switcher</code>
  </pre>

  <pre>
    <code>$ yarn add svelte-theme-switcher</code>
  </pre>
</section>
