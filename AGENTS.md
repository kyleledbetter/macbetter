# Macbetter — working agreement

Macbetter is a design system: macOS, iPadOS and iOS in one web framework, themeable to any brand, built on [ui-sdk](https://ui-sdk.dev). The bar is Apple's own: if a control wouldn't pass for the native one at a glance and under the hand, it isn't done.

## Layout

```
packages/macbetter/            macbetter
  src/components/<name>.tsx   one file per component, exported by name
  src/styles/components/<name>.css
  src/styles/{tokens,platforms,base,materials}.css   shared foundation
  src/styles/themes/*.css     brand themes
  src/lib/                    cx, platform, theme
  test/<name>.test.tsx        vitest + jsdom
  scripts/gen-index.mjs       regenerates src/index.ts and styles/components/index.css
apps/docs/                    Next.js 16 docs site (Tailwind v4 for docs layout only)
  src/content/docs/**/*.mdx   pages; the route is the file path
  src/demos/<component>/<demo>.tsx   live examples, default-exported
  src/lib/nav.ts              sidebar
scripts/shot.mjs              screenshot a page in a real browser
```

Run `node packages/macbetter/scripts/gen-index.mjs` after adding a component or stylesheet. Never edit the generated index files by hand.

## Skills

The paths below under `.claude/skills` are agent skills from other projects. They aren't committed. `skills-lock.json` lists each one with its source repository; install them with the `skills` CLI, for example `npx skills add vercel-labs/ui --skill ui-sdk`.

## Before you write a component

1. Follow the `ui-sdk` skill (`.claude/skills/ui-sdk/SKILL.md` and its `references/`).
2. Read the component's page: `apps/docs/node_modules/@ui-sdk/react/docs/components/<name>.md`. Its Composition, data attributes and CSS variables are the API. `apps/docs/node_modules/@ui-sdk/core/dist/web.css` shows one way each part can be styled and which icons need drawing; read the relevant part of it, don't import it.
3. Read the HIG guidance for the control in `.claude/skills/macos-design-guidelines`, `.claude/skills/ios-hig-design` and `.claude/skills/apple-design`. Motion follows `.claude/skills/emil-design-eng` and `.claude/skills/animate`.
4. Read the exemplars end to end: `button`, `switch` and `segmented-control` (`.tsx`, `.css`, and `test/button.test.tsx`).

Next.js here is version 16 and differs from older versions: check `apps/docs/node_modules/next/dist/docs/` before using an API you're unsure of.

## Component rules

- **Wrap ui-sdk, don't reimplement it.** A Macbetter component is a ui-sdk part with a class and a few `data-*` props for variants. If ui-sdk ships the behavior (see the table in `references/build-interface.md`), use it. Only chrome that has no behavior of its own (Window, Card, Badge, List rows…) is plain elements. Never hand-write `role=` for something ui-sdk ships.
- **Pre-compose the boring parts, expose the rest.** `Switch` renders its own thumb; `SegmentedControl` renders its own indicator. Parts a caller needs to place (items, titles, triggers) are exported as their own components. Export the same part names ui-sdk uses, minus nothing: `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`…
- **Classes are `mb-<component>` and `mb-<component>-<part>`.** Merge the caller's `className` with `cx()` from `src/lib/cx` (ui-sdk lets `className` be a function of state). Variants are data attributes: `data-variant`, `data-size` (`sm | md | lg`), `data-tone` (`accent | neutral | destructive`).
- **Style from state attributes** (`data-checked`, `data-open`, `data-highlighted`, `data-disabled`, `data-side`…), never from generated ids, never with inline styles for state.
- **Types.** `React.ComponentProps<typeof Primitive> & { … }`. No `any`. Add a one-line JSDoc only on a prop whose meaning isn't obvious from its name.
- **Server components.** A file needs `"use client"` only if it uses hooks, handlers or context itself. Plain wrappers don't.
- **Render elements are created on the client.** A component or demo that passes an element as a prop (`render={<Link />}`, `render={<button />}`) or reads its children's types (Outline) must be a client module. An element created in a Server Component can arrive at a client component still unresolved; ui-sdk reads it straight away and throws "Element type is invalid", or React logs a hydration mismatch. It depends on timing, so it passes in a fast headless run and fails in a real browser.
- **Comments are rare**: a browser quirk, an APG rule or a trade-off, in one or two lines.

## CSS rules

- **Tokens only.** Every color, radius, shadow, duration and font comes from a `--mb-*` token in `tokens.css` or `platforms.css`. No hex colors in component CSS except pure white thumbs/knobs and black/white alpha for highlights. If a token is missing, define a component-level variable (`--mb-menu-…`) in your own file and say so in your report; don't edit the shared foundation files.
- **Colors are scheme-aware for free.** Tokens are written with `light-dark()`. Never write `@media (prefers-color-scheme)`. Use `color-mix(in oklch, …)` and `oklch(from …)` to derive shades.
- **Platforms.** `[data-platform="macos" | "ipados" | "ios"]` is set on `<html>` and can be nested (the docs put an iPhone preview inside a Mac page). Two tools, both nesting-safe:
  - Different **numbers**: inherited variables.
    ```css
    :where(:root, [data-platform="macos"]) { --mb-switch-width: 38px }
    :where([data-platform="ios"], [data-platform="ipados"]) { --mb-switch-width: 51px }
    ```
  - Different **rules**: `@scope` with a lower boundary.
    ```css
    @scope ([data-platform="ios"], [data-platform="ipados"]) to (:scope [data-platform]) {
      .mb-button:active { scale: 0.97 }
    }
    ```
  Never write `[data-platform="ios"] .mb-x { … }` as a plain descendant selector: it leaks into a nested macOS preview. Most of the difference should already come from the platform tokens (`--mb-control-height`, `--mb-row-height`, `--mb-menu-item-height`, `--mb-control-font`, `--mb-text-*`, `--mb-hit-target`…): use them and the component adapts on its own.
- **The idioms differ, not just the sizes.** macOS: 13px text, 22–28px controls, hover states, compact menus, rounded rectangles, popovers and sheets attached to windows. iOS: 17px text, 44pt touch targets, no hover, capsule controls, bottom sheets with a grabber, action sheets, large titles. iPadOS: iOS metrics with popovers and sidebars. Where ui-sdk offers `presentation="auto"` (Menu, Select, Combobox, Popover, Dialog), consider it for touch.
- **Hover only where there's a pointer**: wrap hover styles in `@media (hover: hover) and (pointer: fine)`.
- **Hit targets.** A control smaller than `--mb-hit-target` extends its hit area with a centered `::after` (see `button.css`).
- **Focus.** Keyboard focus shows the accent halo: `outline: var(--mb-focus-ring-width) solid var(--mb-focus-ring)` on `:focus-visible`. Text fields show it on `:focus` too, as macOS does.
- **Materials.** Menus, popovers, sheets, bars and sidebars are translucent: `background: var(--mb-material-regular)` (or `-thick`, `-thin`, `-chrome`, `-sidebar`) with `backdrop-filter: var(--mb-material-filter)`, `box-shadow: var(--mb-glass-rim), var(--mb-shadow-menu)`. Never one material on another. The token set already collapses to opaque under `prefers-reduced-transparency` and `prefers-contrast: more`.
- **Motion.** Springs are tokens: `transition: translate var(--mb-spring-snappy-duration) var(--mb-spring-snappy)`. `snappy` for controls, `smooth` for larger moves, `bouncy` and `sheet` only where a gesture carried momentum. Feedback happens on pointer-down (`:active`), instantly. Popups enter from `data-starting-style` and leave on `data-ending-style`, scaling from `var(--transform-origin)`; exits are faster than entrances. Animate only `transform`/`translate`/`scale`/`opacity` (and `filter` sparingly). `base.css` already shortens everything under `prefers-reduced-motion`; replace slides with fades there when a slide would otherwise jump.
- **Contrast.** Text 4.5:1, control edges, focus rings and state fills 3:1, in light and dark, in the Ember theme and the System theme. Check in a real browser. Selected and highlighted states must read on their own: a fill, not a faint tint.
- **Right to left.** Use logical properties (`padding-inline`, `inset-inline-start`, `margin-inline`). Mirror translations under `:where([dir="rtl"])`.
- **Layering.** Component CSS is imported into `@layer macbetter.components`, so keep specificity low: one class, plus state attributes. No `!important`. `base.css` shortens all motion under `prefers-reduced-motion` with `!important`, which a later layer can't beat; an element whose motion carries meaning (a spinner) sets `data-motion="essential"` to opt out and supplies its own calmer animation.
- **`light-dark()` takes colors only.** `color-mix(… light-dark(60%, 70%) …)` is invalid; write `light-dark(color-mix(… 60% …), color-mix(… 70% …))`.

## Docs rules

Each component gets `apps/docs/src/content/docs/components/<slug>.mdx` (slugs are in `src/lib/nav.ts`; don't edit that file — report slug changes instead) and demos in `apps/docs/src/demos/<slug>/`.

```mdx
export const metadata = { title: "Switch", description: "Turn a setting on or off." }

# Switch

<Lead>Turn a setting on or off.</Lead>

<Demo name="switch/basic" />

## When to use it        ← HIG guidance in two or three short paragraphs or a list

## Usage                 ← import line, then one section + <Demo> per feature

## Platform behavior     ← what changes on macOS, iPadOS and iOS, and why

## Accessibility         ← keyboard, naming, what the component does for you

## API                   ← <PropsTable rows={[{ name, type, default, description }]} /> per part,
                           plus a table of data attributes and CSS variables
```

- A demo is a default-exported component in its own file. Add `"use client"` only if it uses state or handlers. Its source is shown under the preview, so write it the way a user should copy it: imports from `macbetter/<name>`, real labels, realistic content (a Wi-Fi setting, not "Option 1"), every control named.
- `<Demo name="…" />` props: `platforms={["ios","ipados"]}` to limit the picker, `wallpaper` to float the demo over a colorful backdrop (use it for anything translucent), `fill` for edge-to-edge layouts, `height={420}`, `hideCode`.
- Demos are centered in a flex row with wrapping. Wrap in your own `<div>` to lay out a column, using Tailwind classes or inline `style`.
- Other MDX helpers: `<Callout type="note|tip|warning" title="…">`, `<Steps>`, fenced code blocks.
- Icons in demos come from `lucide-react`, always with `aria-hidden="true"` beside a text label, or inside a button that has `aria-label`.
- **Writing.** Plain, direct, second person. Sentence case headings. Say what the thing does and when to use it. No marketing words, no "seamless", no "powerful", no emoji.

## Verify before you report

Shared dev server: `http://localhost:4173` (already running — don't start another, don't restart it, don't run `next build`). If it's down, say so.

1. `pnpm --filter macbetter exec tsc --noEmit` and `pnpm --filter docs exec tsc --noEmit`. Other people are working in the repo at the same time: fix errors in your files, ignore errors in files you don't own.
2. `pnpm --filter macbetter exec vitest run test/<yours>.test.tsx`. Every component gets a test of what Macbetter adds (classes, variants, pre-composed parts, names) and one keyboard interaction; popups are opened and closed. Don't re-test ui-sdk.
3. Look at it. `node scripts/shot.mjs /docs/components/<slug> /tmp/…/out.png` and read the PNG. Do it for macOS dark (default), then light (`--scheme light`), then iOS (`--click '.docs-stage [role=radio]:has-text("iOS")'`), and with a popup open (`--click` its trigger). Flags: `--full`, `--selector '.docs-stage'`, `--theme system`, `--mobile` (real phone viewport), `--hover`, `--press`, `--wait`. Console errors print to stderr; a clean run prints nothing. Compare against the real control from memory of macOS and iOS and fix what's off: alignment, optical centering, radius, weight, spacing, contrast. Iterate until you'd ship it.
4. Report: what you built, every command with its exit code, what you couldn't verify, tokens you wished existed, and anything in the ui-sdk docs or types that was wrong.
