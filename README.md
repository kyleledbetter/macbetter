# Stardust

Stardust is Dreambase's design system for the web. It renders macOS, iPadOS and iOS from one set of React components, follows Apple's Human Interface Guidelines, and takes on any brand through a short list of seed tokens. Behavior (keyboard, focus, ARIA, right to left, agent operability) comes from [ui-sdk](https://ui-sdk.dev).

- **One framework, three platforms.** `data-platform="macos" | "ipados" | "ios"` switches text sizes, control heights, hit targets and idioms. It can be nested.
- **Themeable.** A theme sets the accent, ink, backgrounds, a tint gray, a radius scale and fonts. Everything else derives from them, in light and dark.
- **Built on ui-sdk.** Each component wraps a ui-sdk part, so agents can read and operate the interface through ui-sdk's agent bridge.

The documentation site is in `apps/docs`. Run `pnpm dev` and open the URL it prints to browse it.

## Quick start

```bash
pnpm add @dreambase/stardust @ui-sdk/react @ui-sdk/core
```

```css
/* globals.css */
@layer ui-sdk, stardust;
@import "@dreambase/stardust/styles.css";
```

```tsx
// app/layout.tsx
import { StardustScript } from "@dreambase/stardust"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dreambase" suppressHydrationWarning>
      <body data-stardust="">
        <StardustScript />
        {children}
      </body>
    </html>
  )
}
```

```tsx
import { Button } from "@dreambase/stardust/button"

<Button variant="filled">Save</Button>
```

React 19 or newer is required. With Next.js, add `transpilePackages: ["@dreambase/stardust"]`; the package ships TypeScript source. See [packages/stardust/README.md](packages/stardust/README.md) for more.

## Repository layout

```
packages/stardust/         @dreambase/stardust: components, styles, themes, helpers
  src/components/          one file per component
  src/styles/              tokens, platforms, base, materials, themes, component CSS
  src/lib/                 cx, platform (StardustScript), theme helpers
  test/                    vitest + jsdom
apps/docs/                 the documentation site (Next.js 16, MDX, Tailwind v4)
  src/content/docs/        pages; the route is the file path
  src/demos/               live examples shown on the pages
scripts/shot.mjs           screenshot a docs page in a real browser
AGENTS.md                  the working agreement for people and coding agents
```

## Scripts

Run from the repository root with pnpm 10.

| Command | What it does |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the docs site in development |
| `pnpm build` | Build the docs site for production |
| `pnpm test` | Run every package's tests |
| `pnpm typecheck` | Type-check every package |

After adding a component or stylesheet, regenerate the package index with `node packages/stardust/scripts/gen-index.mjs`.

## Deploy the docs

The docs deploy to Vercel. Import the repository, set the project's **Root Directory** to `apps/docs`, and keep the Next.js framework preset. Vercel installs the pnpm workspace from the root, so the docs build against the local `@dreambase/stardust` source.

## Contributing

Read [AGENTS.md](AGENTS.md) before changing a component. It covers the component and CSS rules, the docs format and how to verify a change.

## License

[MIT](LICENSE) © Dreambase

## Checks

| Command | What it checks |
| --- | --- |
| `pnpm typecheck` | Types in the package and the docs site |
| `pnpm test` | Component tests (vitest, jsdom) |
| `pnpm lint` | ESLint on the docs site |
| `node scripts/sweep.mjs` | Every route in a real browser, on desktop and phone: console errors, failed requests, sideways scrolling. Needs `pnpm dev` running on port 4173 (`pnpm --filter docs exec next dev -p 4173`). |
| `node scripts/shot.mjs <path> <out.png>` | A screenshot of one page. Flags are listed at the top of the file. |

Browser scripts share a two-browser limit (`scripts/browser-lock.mjs`), so several can run without stalling the machine.

## Known issues

- The Outline docs page sometimes logs a React hydration warning in development: ui-sdk's Tree (0.1.0-beta.1) can compute a nested item's level one too low on the client. The server's value stays on screen, so nothing looks wrong.
- ui-sdk writes shortcut modifiers as ⌘⇧P where macOS writes ⇧⌘P.
- Changing `dir` after the page has loaded leaves sliding indicators (segmented control, tab bar) where they were until the next resize. Setting `dir` at load is correct.
