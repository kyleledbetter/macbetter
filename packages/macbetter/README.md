# macbetter

A design system for the web: macOS, iPadOS and iOS from one set of React components, themeable to any brand, built on [ui-sdk](https://ui-sdk.dev).

## Install

```bash
pnpm add macbetter @ui-sdk/react @ui-sdk/core
```

Requires React 19 or newer. The package ships TypeScript source, so your bundler must compile it. In Next.js:

```ts
// next.config.ts
const nextConfig = { transpilePackages: ["macbetter"] }
export default nextConfig
```

## Set up

Import the stylesheet once. It sits in the `macbetter` cascade layer, so your own unlayered CSS wins without `!important`:

```css
@layer ui-sdk, macbetter;
@import "macbetter/styles.css";
```

With Tailwind CSS v4, declare `@layer ui-sdk, theme, base, macbetter, components, utilities;` and import `tailwindcss` before macbetter.

Render `<MacbetterScript />` at the top of `<body>`. It sets `data-platform` on `<html>` before first paint: `macos` for a fine pointer, `ipados` or `ios` for touch.

```tsx
import { MacbetterScript } from "macbetter"

<html lang="en" data-theme="ember" suppressHydrationWarning>
  <body data-macbetter="">
    <MacbetterScript />
    {children}
  </body>
</html>
```

## Use

Import each component from its own entry:

```tsx
import { Button } from "macbetter/button"
import { Switch } from "macbetter/switch"

<label>
  Wi-Fi
  <Switch defaultChecked />
</label>
<Button variant="filled">Join network</Button>
```

| Entry | Contents |
| --- | --- |
| `macbetter/<component>` | One component and its parts |
| `macbetter` | Everything, plus `MacbetterScript`, `resolvePlatform` and `cx` |
| `macbetter/styles.css` | Tokens, platforms, themes, base, materials and component CSS |
| `macbetter/themes/<name>.css` | One built-in theme |
| `macbetter/theme` | `createTheme`, `themeVariables`, `contrastRatio` |

## Platforms

`data-platform="macos" | "ipados" | "ios"` sets text styles, control and row heights, hit targets and radii. It inherits and can be nested, so a phone preview can sit inside a desktop page. Force one with `<MacbetterScript platform="ios" />`, or let people choose with `storageKey`.

## Theming

A theme sets seed tokens; labels, fills, separators, materials, shadows and states derive from them. Every color is written with `light-dark()`, and `data-scheme="light" | "dark"` pins a scheme for a subtree.

```css
[data-theme="harbor"] {
  --mb-accent: light-dark(#0b6e99, #3fb3e6);
  --mb-on-accent: light-dark(#ffffff, #04202e);
  --mb-accent-text: light-dark(#0a5f85, #6cc7ef);
  --mb-radius-scale: 1.1;
}
```

Or from TypeScript:

```ts
import { contrastRatio, createTheme, themeVariables } from "macbetter/theme"

const css = createTheme("harbor", { accent: { light: "#0b6e99", dark: "#3fb3e6" } })
const style = themeVariables({ accent: "#0b6e99" }) // for a style prop, alongside data-theme
contrastRatio("#0a5f85", "#ffffff") // 7.03
```

Seeds: `--mb-accent`, `--mb-on-accent`, `--mb-accent-text`, `--mb-accent-secondary`, `--mb-ink`, `--mb-bg`, `--mb-bg-secondary`, `--mb-bg-tertiary`, `--mb-bg-elevated`, `--mb-bg-sidebar`, `--mb-tint`, the twelve system colors (`--mb-red` … `--mb-brown`), `--mb-radius-scale`, `--mb-font`, `--mb-font-display`, `--mb-font-rounded` and `--mb-font-mono`.

Built-in themes: `ember` (the default), `system`, `nebula` and `graphite`. Check that text holds 4.5:1 and control edges 3:1 in light and dark.

## License

Apache 2.0 © Kyle Ledbetter
