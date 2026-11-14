# @dreambase/stardust

Dreambase's design system for the web: macOS, iPadOS and iOS from one set of React components, themeable to any brand, built on [ui-sdk](https://ui-sdk.dev).

## Install

```bash
pnpm add @dreambase/stardust @ui-sdk/react @ui-sdk/core
```

Requires React 19 or newer. The package ships TypeScript source, so your bundler must compile it. In Next.js:

```ts
// next.config.ts
const nextConfig = { transpilePackages: ["@dreambase/stardust"] }
export default nextConfig
```

## Set up

Import the stylesheet once. It sits in the `stardust` cascade layer, so your own unlayered CSS wins without `!important`:

```css
@layer ui-sdk, stardust;
@import "@dreambase/stardust/styles.css";
```

With Tailwind CSS v4, declare `@layer ui-sdk, theme, base, stardust, components, utilities;` and import `tailwindcss` before Stardust.

Render `<StardustScript />` at the top of `<body>`. It sets `data-platform` on `<html>` before first paint: `macos` for a fine pointer, `ipados` or `ios` for touch.

```tsx
import { StardustScript } from "@dreambase/stardust"

<html lang="en" data-theme="dreambase" suppressHydrationWarning>
  <body data-stardust="">
    <StardustScript />
    {children}
  </body>
</html>
```

## Use

Import each component from its own entry:

```tsx
import { Button } from "@dreambase/stardust/button"
import { Switch } from "@dreambase/stardust/switch"

<label>
  Wi-Fi
  <Switch defaultChecked />
</label>
<Button variant="filled">Join network</Button>
```

| Entry | Contents |
| --- | --- |
| `@dreambase/stardust/<component>` | One component and its parts |
| `@dreambase/stardust` | Everything, plus `StardustScript`, `resolvePlatform` and `cx` |
| `@dreambase/stardust/styles.css` | Tokens, platforms, themes, base, materials and component CSS |
| `@dreambase/stardust/themes/<name>.css` | One built-in theme |
| `@dreambase/stardust/theme` | `createTheme`, `themeVariables`, `contrastRatio` |

## Platforms

`data-platform="macos" | "ipados" | "ios"` sets text styles, control and row heights, hit targets and radii. It inherits and can be nested, so a phone preview can sit inside a desktop page. Force one with `<StardustScript platform="ios" />`, or let people choose with `storageKey`.

## Theming

A theme sets seed tokens; labels, fills, separators, materials, shadows and states derive from them. Every color is written with `light-dark()`, and `data-scheme="light" | "dark"` pins a scheme for a subtree.

```css
[data-theme="harbor"] {
  --sd-accent: light-dark(#0b6e99, #3fb3e6);
  --sd-on-accent: light-dark(#ffffff, #04202e);
  --sd-accent-text: light-dark(#0a5f85, #6cc7ef);
  --sd-radius-scale: 1.1;
}
```

Or from TypeScript:

```ts
import { contrastRatio, createTheme, themeVariables } from "@dreambase/stardust/theme"

const css = createTheme("harbor", { accent: { light: "#0b6e99", dark: "#3fb3e6" } })
const style = themeVariables({ accent: "#0b6e99" }) // for a style prop, alongside data-theme
contrastRatio("#0a5f85", "#ffffff") // 7.03
```

Seeds: `--sd-accent`, `--sd-on-accent`, `--sd-accent-text`, `--sd-accent-secondary`, `--sd-ink`, `--sd-bg`, `--sd-bg-secondary`, `--sd-bg-tertiary`, `--sd-bg-elevated`, `--sd-bg-sidebar`, `--sd-tint`, the twelve system colors (`--sd-red` … `--sd-brown`), `--sd-radius-scale`, `--sd-font`, `--sd-font-display`, `--sd-font-rounded` and `--sd-font-mono`.

Built-in themes: `dreambase` (the default), `system`, `nebula` and `graphite`. Check that text holds 4.5:1 and control edges 3:1 in light and dark.

## License

MIT © Dreambase
