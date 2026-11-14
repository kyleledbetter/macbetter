# Apple web typography and landing-page patterns

A reference for making the Macbetter docs and marketing site read and feel like an Apple-made page. Every number below was pulled from Apple's live, built CSS on 2026-11-14 unless it is marked **inferred**. Where a value is a recommendation for Macbetter rather than an Apple fact, it sits in the "How to apply" section and says so.

Short version:

- Apple's whole marketing site runs on one type scale of 14 sizes (12 to 96px). Each named style is a set of three steps, one per breakpoint.
- Headlines are 600 weight. Body and intro copy are 400. Uppercase never appears on product pages.
- SF Pro Display is used at 19px and above. SF Pro Text is used at 17px and below.
- Tight line-height is always the font size + 4px. Reading line-height is the font size + 8px, or + 6px at 14px.
- Tracking is a fixed value for each size. It is negative for small Text sizes, slightly positive from 19 to 32px, and negative again from 48px up.
- Paragraphs use two grays: copy in secondary gray, with key phrases in primary color through `<strong>`.
- Sections are 144 / 120 / 112px tall top and bottom. Content sits in a column that is 87.5% wide with a 1260px max. Cards have a 28px radius.

---

## 1. Sources

All fetched 2026-11-14 with `curl -sL -A "Mozilla/5.0 …"`. I went straight to raw HTML and CSS because exact values were needed, so WebFetch summaries were not used. Raw copies are in the scratchpad (`…/scratchpad/apple-type/html` and `…/css`), not in the repo.

### Pages (all HTTP 200)

| Page | URL | Stack / page stylesheet |
|---|---|---|
| iPhone Duo (named by user) | https://www.apple.com/iphone-duo/ | `/v/iphone-duo/f/built/styles/overview.built.css` (1.7 MB) |
| Apple HomeView (named by user) | https://www.apple.com/apple-homeview/ | `/v/apple-homeview/c/built/styles/overview.built.css` |
| Home | https://www.apple.com/ | `/v/homepage/a/styles/{homepage,main,inline-media}.built.css`, `/homepage/styles/index_4x6ailol.built.css`, `/autopush/us/fam-gallery/styles/home-gallery.built.css` |
| iPhone (category) | https://www.apple.com/iphone/ | `/v/iphone/home/cl/built/styles/overview.built.css` |
| Mac (category) | https://www.apple.com/mac/ | Next.js "artisan" app: 26 hashed files under `/_apps/artisan/_next/static/css/` (the `sasskit` layer is in `3e83321b8891f345.css`; type modules are in `2caa76f2fa3e0658.css`, `d156e6f3f5837fcd.css`, `cb070c6a2c42979c.css`, `1f0a71fbe937ca4a.css`, `4ae1daace98e8008.css`) |
| iPad (category) | https://www.apple.com/ipad/ | same artisan bundle as Mac |
| Watch (category) | https://www.apple.com/watch/ | same artisan bundle as Mac |
| Apple Vision Pro | https://www.apple.com/apple-vision-pro/ | `/v/apple-vision-pro/l/built/styles/overview.built.css` |
| AirPods | https://www.apple.com/airpods/ | `/v/airpods/ag/built/styles/overview.built.css`, `/v/airpods/shared/compare/i/built/styles/compare.built.css` |
| TV & Home | https://www.apple.com/tv-home/ → redirects to `/home/` | `/v/home/d/built/styles/overview.built.css` |
| Apple Intelligence (OS/feature page) | https://www.apple.com/apple-intelligence/ | `/v/apple-intelligence/k/built/styles/overview.built.css` |
| MacBook Pro (product overview) | https://www.apple.com/macbook-pro/ | `/v/macbook-pro/b/built/styles/overview.built.css` |
| Compare Mac | https://www.apple.com/mac/compare/ | `/v/mac/compare/aj/built/styles/overview.built.css` |
| Compare iPhone | https://www.apple.com/iphone/compare/ | `/v/iphone/compare/an/built/styles/overview.built.css` |
| Newsroom (editorial) | https://www.apple.com/newsroom/ | `/newsroom/styles/{site,global,pinned-hero-landing,…}.built.css` |
| Developer design | https://developer.apple.com/design/ | `/assets/styles/global.dist.css`, `dark-mode.css`, `/design/styles/design.css` |

### Shared stylesheets

| File | Used for |
|---|---|
| `/api-www/global-elements/global-header/v1/assets/globalheader.css` | Global nav |
| `/ac/localnav/9/styles/ac-localnav.built.css` (and `/4/` on Newsroom) | Classic local nav |
| `/ac/globalfooter/8/en_US/styles/ac-globalfooter.built.css`, `/api-www/global-elements/global-footer/v1/…` | Footer |
| `/ac/ac-films/7.5.1/styles/modal.css` | Film modal |
| `/v/ac/includes/campaigns-seasonal/upgrade-2026/a/built/styles/overview.built.css` | Upgrade campaign include |
| `https://www.apple.com/wss/fonts?families=SF+Pro,v3%7CSF+Pro+Icons,v3` | `@font-face` for SF Pro Display, SF Pro Text and SF Pro Icons |
| `https://d.rsms.me/inter-website/v3/dynmetrics/` | Inter "Dynamic Metrics" tracking formula (archived page) |

### What failed or was partial

- `/wss/fonts?families=SF+Pro,v3|SF+Pro+Icons,v3` with a literal `|` returned 404. It worked with the pipe encoded as `%7C`.
- `https://rsms.me/inter/dynmetrics/` returned a 404 stub that points to the archived copy at d.rsms.me, which loaded.
- Newsroom story tiles and the Mac/iPhone compare-table cells are rendered by JavaScript. Their copy was not in the HTML, so only their CSS was read.
- Mac, iPad and Watch are built by a new Next.js system ("artisan", CSS modules with hashed names). Their type values match the classic `typography-*` system exactly.
- No fetched page contained instructions addressed to an AI agent. I scanned for this; the only hits were false positives in tokens and in words like "Installments".

---

## 2. The type system

The core scale lives in Apple's "sasskit" layer (`@layer sasskit` in artisan `3e83321b8891f345.css`). The same values are duplicated verbatim in every classic page stylesheet (AirPods, iPhone Duo, HomeView, the developer site's `global.dist.css`).

**Breakpoints** (from `.large-hide`, `.medium-hide`, `.small-hide` and `.xlarge-hide` in `3e83…css`):

| Name | Range | Media query used |
|---|---|---|
| xlarge | ≥ 1441px | `@media (min-width:1441px)` |
| large (default) | 1069 to 1440px | no query; base rules |
| medium | 735 to 1068px | `@media (max-width:1068px)` |
| small | ≤ 734px | `@media (max-width:734px)` |
| xsmall | ≤ 480px | grid gutters only |

The type scale changes only at 1068 and 734. Nothing changes at xlarge. The global nav uses its own breakpoint at 833/834px.

### 2.1 Named styles (core sasskit set)

Values are listed as size / line-height ratio / weight / tracking. "D" means SF Pro Display and "T" means SF Pro Text. A dash means the value is inherited from the larger breakpoint.

| Style | Role | Large (≥1069) | Medium (≤1068) | Small (≤734) | Face |
|---|---|---|---|---|---|
| `typography-headline-standalone` | Rare, page-defining statement | 96 / 1.0417 / 600 / −0.015em | 80 / 1.05 / 600 / −0.015em | 48 / 1.0835 / 600 / −0.003em | D |
| `typography-headline-super` | Hero / chapter headline | 80 / 1.05 / 600 / −0.015em | 64 / 1.0625 / 600 / −0.009em | 48 / 1.0835 / 600 / −0.003em | D |
| `typography-headline-elevated` | Big section headline | 64 / 1.0625 / 600 / −0.009em | 48 / 1.0835 / 600 / −0.003em | 40 / 1.1 / 600 / 0 | D |
| `typography-headline` | Standard section headline | 48 / 1.0835 / 600 / −0.003em | 40 / 1.1 / 600 / 0 | 32 / 1.125 / 600 / 0.004em | D |
| `typography-headline-reduced` | Sub-section headline | 40 / 1.1 / 600 / 0 | 32 / 1.125 / 600 / 0.004em | 28 / 1.1429 / 600 / 0.007em | D |
| `typography-eyebrow-super` | Large eyebrow / lead-in | 32 / 1.125 / 600 / 0.004em | 28 / 1.1429 / 600 / 0.007em | 24 / 1.1667 / 600 / 0.009em | D |
| `typography-eyebrow-elevated` | Product-name eyebrow above hero | 28 / 1.1429 / 600 / 0.007em | 24 / 1.1667 / 600 / 0.009em | 21 / 1.1905 / 600 / 0.011em | D |
| `typography-eyebrow` | Eyebrow | 24 / 1.1667 / 600 / 0.009em | 21 / 1.1905 / 600 / 0.011em | – | D |
| `typography-eyebrow-reduced` | Small eyebrow | 21 / 1.1905 / 600 / 0.011em | – | 19 / 1.2105 / 600 / 0.012em | D |
| `typography-callout` | Callout headline | 32 / 1.125 / 600 / 0.004em | 28 / 1.1429 / 600 / 0.007em | 24 / 1.1667 / 600 / 0.009em | D |
| `typography-label` | Label, e.g. a color name | 24 / 1.1667 / 600 / 0.009em | 21 / 1.1905 / 600 / 0.011em | – | D |
| `typography-tout` | Tout | 19 / 1.2105 / 600 / 0.012em | – | – | D |
| `typography-intro-elevated` | Large intro paragraph | 24 / 1.3334 / 400 / 0.009em | 21 / 1.381 / 400 / 0.011em | – | D |
| `typography-intro` | Intro paragraph under a headline | 21 / 1.381 / 400 / 0.011em | – | 19 / 1.4211 / 400 / 0.012em | D |
| `typography-quote` | Pull quote | 40 / 1.2 / 400 / 0 | 32 / 1.25 / 400 / 0.004em | 28 / 1.2858 / 400 / 0.007em | D |
| `typography-quote-reduced` | Smaller quote | 32 / 1.25 / 400 / 0.004em | 28 / 1.2858 / 400 / 0.007em | 24 / 1.3334 / 400 / 0.009em | D |
| `typography-manifesto` | Semibold statement paragraph | 32 / 1.25 / 600 / 0.004em | 28 / 1.2858 / 600 / 0.007em | 24 / 1.3334 / 600 / 0.009em | D |
| `typography-body` | Body copy (also `body` default) | 17 / 1.4706 / 400 / −0.022em | – | – | T |
| `typography-body-tight` | Body in cards and lists | 17 / 1.2354 / 400 / −0.022em | – | – | T |
| `typography-body-reduced` | Secondary body | 14 / 1.4286 / 400 / −0.016em | – | – | T |
| `typography-body-reduced-tight` | Secondary body, tight | 14 / 1.2858 / 400 / −0.016em | – | – | T |
| `typography-caption` | Captions, nav, legal | 12 / 1.3334 / 400 / −0.01em | – | – | T |
| `typography-sosumi` | Legal / footnote copy | 12 / 1.3334 / 400 / −0.01em | – | – | T |

Source: `3e83321b8891f345.css` (artisan sasskit). Values were cross-checked against `_v_airpods_ag…overview.built.css`, `_v_iphone-duo_f…` and developer `global.dist.css`, which are identical. Line-heights are rounded here; the CSS carries 10 decimals, e.g. `1.0834933333`.

### 2.2 Component styles seen on the current pages

These are page-level names. Each is a mix of steps from the scale above, which shows how Apple assigns roles.

| Style (page) | Large | Medium | Small | Notes |
|---|---|---|---|---|
| `typography-page-header-title` (iPhone, TV & Home) | 80 D 600 | 64 | 48 | Category page `<h1>`, e.g. "iPhone" |
| `typography-ric-type-lockup-xxl-headline` (Duo) | 80 D 600 | 64 | 40 | Chapter headline |
| `typography-ric-type-lockup-xxl-eyebrow` (Duo) | 21 D 600, lh 1 | 19 | 17 T | Topic name above chapter headline |
| `typography-ric-type-lockup-xxl-copy` (Duo) | 21 D 400 / 1.381 | 19 / 1.4211 | – | Chapter paragraph, gray with `<strong>` |
| `typography-ric-type-lockup-super-headline` (Duo, HomeView) | 48 D 600 | 40 | 32 | Sub-chapter headline |
| `typography-media-hero-headline-base` (Duo, HomeView hero) | 64 D 600 | 56 | 32 | Hero line under the product eyebrow |
| `typography-media-hero-headline-reduced` | 56 | 48 | 28 | |
| `typography-tile-headline` (Home hero tiles) | 56 D 600 / −0.005em | 48 / −0.002em | 32 / 0.002em | Home tracking differs slightly |
| `typography-tile-subhead` (Home) | 28 D **400** | 24 | 19 | Subhead is regular weight |
| `.section-promo .tile-headline` / `.tile-subhead` (Home) | 40 / 21 D 400 | 32 / 19 | – | Half-width promo tiles |
| `typography-priority-router-card-headline` (iPhone) | 56 D 600 | 48 | 32 | |
| `typography-section-header-headline` (all) | 48 D 600 | 40 | 32 | Every "Get the highlights." style header |
| `typography-section-header-link` | 17 T 400 / 1.2354 | – | 14 T | Link to the right of a section header |
| `typography-feature-card-label` | 17 T 600 | – | 14 T | Topic label at top of card |
| `typography-feature-card-headline` | 28 D 600 | 24 | 21 | Card headline |
| `typography-feature-card-body` | 17 T 400 / 1.2354 | 14 T | – | |
| `typography-product-tile-headline` | 28 D 600 | 24 | 21 | Lineup tile product name |
| `typography-product-tile-positioning` | 17 T 600 | – | 14 | One-line positioning statement |
| `typography-product-tile-price` | 14 T 400 | – | 12 | "From $…" |
| `typography-product-tile-ctas` / `button-elevated` | 17 T 400 / 1.1765 | – | 14 | |
| `typography-media-card-gallery-headline` | 28 D 600 | 24 | **17 T 600** | Highlight gallery captions |
| `typography-callout-elevated` (HomeView) | 21 D 600 | – | 19 | |
| `typography-callout-base` (HomeView, Duo) | 17 T **600** / 1.2354 | – | 14 T 600 | Whole paragraph is semibold, two-tone (§5.6) |
| `typography-callout-cta` | 17 T 400 | – | 14 / 1.4286 | |
| `typography-banner-card-headline` | 28 D 600 | 24 | 21 | `-elevated` is 32 / 28 / 24 |
| `typography-banner-card-copy` | 17 T 400 / 1.2354 | – | 14 | |
| `typography-tout-stat-value` (MacBook Pro) | 28 D 600 | 24 | 21 | |
| `typography-localnav-product-name` (Duo floating nav) | 19 D 600 | – | – | |
| `typography-localnav-tabs` (Duo) | 17 T **500** / 1.4706 | – | – | Only place 500 appears |
| `typography-localnav-links` (Duo) | 19 D **500** | – | – | |
| artisan `typography_headline` (Mac/iPad/Watch cards) | 28 D 600 | 24 | 21 | |
| artisan `typography_bodyCopy` | 17 T 400 / 1.2354 | – | 14 | |
| artisan `typography_bodyCopySemibold` | 17 T 600 | – | 14 | Card topic label |
| artisan `SectionHeader_headline` | 48 D 600 | 40 | 32 | |
| artisan `CopyLockup_header` (banner cards) | 32 D 600 | 24 | 21 | Copy: 17 T / 12px top margin |
| Vision Pro `typography-section-headline` | 80 D **700** | 64 | 40 | Older/special page uses 700 |
| Vision Pro `typography-section-eyebrow` | 24 D **700** | 19 | – | |
| Vision Pro `typography-foundation-headline` | 48 D 600 | 40 | 28 D **700** | Word-sequenced statement (§7) |
| Newsroom `.tile-pinned-hero .tile__headline` | 48 D **700** | 40 | 24 | Editorial uses 700 |
| Newsroom `.tile__category` | 14 T 700 | 12 | – | Article category eyebrows are UPPERCASE |

### 2.3 The patterns behind the numbers

These rules reproduce every value above.

**Leading.** Tight leading is the font size + 4px at every size: 96→100, 80→84, 64→68, 56→60, 48→52, 40→44, 32→36, 28→32, 24→28, 21→25, 19→23, 17→21, 14→18, 12→16. Reading leading is the font size + 8px (17→25, 19→27, 21→29, 24→32, 28→36, 32→40, 40→48), except 14px body, which is + 6px (14→20). Buttons are 17→20, which is + 3px.

**Tracking.** Each size has one fixed value:

| px | 12 | 14 | 17 | 19 | 21 | 24 | 28 | 32 | 40 | 48 | 56 | 64 | 80 | 96 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| em | −0.01 | −0.016 | −0.022 | +0.012 | +0.011 | +0.009 | +0.007 | +0.004 | 0 | −0.003 | −0.005 | −0.009 | −0.015 | −0.015 |
| face | T | T | T | D | D | D | D | D | D | D | D | D | D | D |

The jump from −0.022em to +0.012em between 17 and 19px is the Text-to-Display switch. Display is drawn with tighter default spacing, so it needs slightly positive tracking at mid sizes.

**Weights.**
- 600 for every headline, eyebrow, label and card title.
- 400 for intro, body, subheads (the home tile subhead is 400) and buttons.
- 500 appears only in the new floating local nav.
- 700 appears only on Vision Pro and Newsroom.
- No light weights are used, even though `@font-face` ships 100 to 900.

**Steps.** A style drops one or two steps on the 14-size ladder at each breakpoint. Big headlines drop two at small (80→64→48). Text sizes rarely change, and when they do it is 17→14.

**Case.** Product and marketing pages never use `text-transform: uppercase` (zero occurrences in any `/v/…` page sheet). Uppercase appears only in Newsroom (category eyebrows, datelines, pills) and in video-player chrome.

---

## 3. Font stacks and optical sizing

### 3.1 What Apple ships

From the `@font-face` sheet `wss/fonts?families=SF+Pro,v3|SF+Pro+Icons,v3`:
- SF Pro Display: 9 weights (100 to 900), each with an italic.
- SF Pro Text: 9 weights, each with an italic.
- SF Pro Icons: 9 weights.
- Files are woff2, woff and ttf under `/wss/fonts/SF-Pro-Display/v3/…`, marked "(C) 2019 Apple Inc."
- No `font-display` and no `unicode-range` are set.

Stacks used verbatim in every page stylesheet:

```
Display: "SF Pro Display", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif
Text:    "SF Pro Text",    "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif
Footer:  "SF Pro Text", "Myriad Set Pro", "SF Pro Icons", "Apple Legacy Chevron", "Helvetica Neue", Helvetica, Arial, sans-serif
```

Localized stacks switch to SF Pro JP / KR / SC / TC / HK / TH / AR and set tracking to 0 (e.g. `.button:lang(ja){letter-spacing:0em}`).

Root and body defaults (`3e83…css`, sasskit):

```css
html { font-family: SF Pro Text, …; font-size: 106.25%; quotes: "“" "”"; }   /* 17px root */
body { font-size: 17px; line-height: 1.4705882353; font-weight: 400; letter-spacing: -.022em;
       font-synthesis: none; -moz-font-feature-settings: "kern";
       -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; min-width: 320px; }
h1, h2, h3 { font-weight: 600; }   b, strong { font-weight: 600; }
```

### 3.2 Optical size rule

- **19px and above uses SF Pro Display; 17px and below uses SF Pro Text.** No style uses 18 or 20px, so the switch sits between them. Examples: `typography-media-card-gallery-headline` changes from 24 D to 17 T at small, and `ric-type-lockup-xxl-eyebrow` changes from 19 D to 17 T.
- Apple does not use `font-optical-sizing` or `font-variation-settings` on the web (zero occurrences). It switches families by hand.

### 3.3 Feature settings in use

| Setting | Where | Purpose |
|---|---|---|
| `"kern"` | `body, button, input, select, textarea` | Always on |
| `font-synthesis: none` | body | No faux bold or italic |
| `"case"` | `.stat .stat-glyph-cap-height`, `.badge-glyph-cap-height`, color-indicator labels | Case-sensitive forms, e.g. centring "+" and "−" next to caps and numerals |
| `"numr"` | `.footnote-number`, `.footnote-diamond` | Footnote digits drawn as numerator glyphs at 1em instead of a shrunken `<sup>` |
| `"tnum"` + `font-variant-numeric: tabular-nums` | video timecodes only (artisan) | Tabular figures only where digits tick |

`text-wrap: balance` and `text-wrap: pretty` appear **zero times** across the roughly 20 sheets. Apple controls line breaks by hand (§6.4).

### 3.4 Using this on the web when SF can't be embedded

SF Pro may not be self-hosted on a non-Apple site; the Apple font license limits it to mockups and Apple platforms. Use the system font instead.

| Approach | Behaviour |
|---|---|
| `-apple-system, BlinkMacSystemFont` | Resolves to SF Pro on macOS, iOS and iPadOS in Safari, Chrome and Firefox. The system font is a variable SF with an optical-size axis, so the browser picks Text or Display cuts by size automatically (**inferred** from platform behaviour; not visible in Apple's CSS). These two keywords match nothing on Windows or Android, so the stack falls through to the next family. |
| `system-ui` | Resolves to SF on Apple platforms, Segoe UI on Windows and Roboto on Android. Put it **after** your open-source fallback; otherwise Windows and Android never reach Inter. |
| Named `"SF Pro Display"` / `"SF Pro Text"` | Only match when the user has installed Apple's fonts, which is common on designers' Macs. Harmless to list first. |

Recommended stack (generic):

```css
--font-sans: "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont,
             "Inter Variable", "Inter", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-display: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont,
             "Inter Display", "Inter Variable", "Inter", system-ui, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

The developer site loads SF Mono through `wss/fonts?family=SF+Mono&v=2`; `ui-monospace` gives SF Mono on Apple platforms.

**Inter as the stand-in.** Inter is the closest open face. Its letterforms are wider, and its spacing at display sizes is looser. Rasmus Andersson's published Dynamic Metrics formula for Inter (v3) is `tracking(em) = −0.0223 + 0.185 × e^(−0.1745 × size)`. It gives:

| px | 12 | 14 | 17 | 19 | 21 | 24 | 28 | 32 | 40+ |
|---|---|---|---|---|---|---|---|---|---|
| Inter v3 tracking (em) | 0 | −0.006 | −0.013 | −0.016 | −0.018 | −0.020 | −0.021 | −0.022 | −0.022 |
| SF tracking (em), for comparison | −0.01 | −0.016 | −0.022 | +0.012 | +0.011 | +0.009 | +0.007 | +0.004 | 0 to −0.015 |

How to use the two rows:
- With **Inter v4** (which has `opsz` and a built-in "Display" cut at large sizes), set `font-optical-sizing: auto`. Then use the SF tracking values minus about 0.01em at 19 to 40px, and the SF values as they are at 48px and up (**inferred**, to be checked by eye).
- With **Inter v3** (no `opsz`), use the Inter row above.
- Keep Apple's weights (400 and 600). Inter 600 is close to SF Semibold.
- CSS can't detect which family actually rendered. If exact Inter tracking matters, set a class such as `html.font-inter` on non-Apple platforms with a one-line platform check, and override the tracking tokens under it (**inferred** technique).

---

## 4. Color for type and surfaces

All values below are verbatim from `:root` / `.theme-light` / `.theme-dark` in `_v_iphone-duo_f…overview.built.css`. They are identical in the other page sheets.

### 4.1 Text ("glyph") tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--sk-glyph` | `#000` | `#fff` | Pure black or white; rarely used for text |
| `--sk-glyph-gray` (= body, headline text) | `#1d1d1f` | `#f5f5f7` | **Primary text and headlines** |
| `--sk-glyph-gray-alpha` | `rgba(0,0,0,.88)` | `rgba(255,255,255,.92)` | Primary text on tinted cards (artisan cards use `.88`) |
| `--sk-glyph-gray-secondary` | `#6e6e73` | `#86868b` | **Secondary copy**, gray paragraphs |
| `--sk-glyph-gray-secondary-alpha` | `rgba(0,0,0,.56)` | `rgba(255,255,255,.56)` | Sosumi/legal, footer text, card captions |
| `--sk-glyph-gray-secondary-alt` | `#424245` | `#d2d2d7` | Darker secondary |
| `--sk-glyph-gray-tertiary` | `#86868b` | `#6e6e73` | Tertiary text |
| `--sk-body-link-color` / `--sk-glyph-blue` | `#0066cc` | `#2997ff` | Links |
| `--sk-glyph-orange` | `#b64400` | `#ff791b` | "New" badges and similar |
| `--sk-glyph-green` / `red` | `#008009` / `#e30000` | `#03a10e` / `#ff3037` | Status |

Two hex values swap between themes: `#6e6e73` is secondary in light and tertiary in dark, and `#86868b` is the reverse.

### 4.2 Surface ("fill") tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--sk-fill` / body background | `#fff` | `#000` | Default section |
| `--sk-fill-secondary` | `#fafafc` | `#161617` | Open nav and menus (`--r-globalnav-background-opened` = `#fafafc` / `#161617`) |
| `--sk-fill-tertiary` / `--global-section-background-color-alt` | `#f5f5f7` | `#1d1d1f` | **Alternate section and card background** |
| `--sk-fill-gray-tertiary` | `#d2d2d7` | `#424245` | Strong separators |
| `--sk-fill-gray-quaternary` | `#e8e8ed` | `#333336` | Hairlines (compare rule: `1px solid #e8e8ed`) |
| `--sk-fill-gray-quaternary-alpha` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.2)` | Translucent hairlines |
| `--sk-fill-blue` (button fill) | `#0071e3` | `#0071e3` | Primary buttons, same in both themes |
| Focus ring `--sk-focus-color` | `#0071e3` | `#0071e3` | `outline: 2px solid; offset 1px` (links) or `3px` (containers) |

Developer site dark tokens (`dark-mode.css`) match: text `#f5f5f7`, secondary `#86868b`, tertiary `#6e6e73`, blue `#2997ff`, fill `#000`, secondary fill `#161617`, tertiary fill `#1d1d1f`, quaternary `#333336`.

### 4.3 How sections alternate

- **Light pages** alternate `#fff` and `#f5f5f7` sections. Cards sit on the opposite surface: white cards on `#f5f5f7` sections (artisan `MarcomSection_backgroundTertiary` plus `card-bg-fill`), and `#f5f5f7` cards on white (`.card` default `--sk-tile-background: rgb(245,245,247)`).
- **Dark sections** (`.theme-dark`) use `#000` for the section, `#1d1d1f` or `#161617` for alternates and cards, `#f5f5f7` for text and `#86868b` for secondary text.
- **Home page tiles** are full-bleed `#f5f5f7` (light) or `#000` (dark), with a 12px gap between tiles. Text on dark tiles is `#f5f5f7`.
- **Footer**: `#f5f5f7` with text `rgba(0,0,0,.56)`, links `.72`, titles `.88` and borders `.16`. The dark footer is `#1d1d1f` with white alphas `.56`, `.8`, `.92` and `.24`.
- **Gradient text** appears only for Apple Intelligence or a feature accent (`.gradient-text` on AirPods; `.gradient-text-apple-intelligence` on iPhone Duo). It is built from `background-clip:text; -webkit-text-fill-color:transparent; box-decoration-break:clone`. The Apple Intelligence gradient is `linear-gradient(90deg, rgb(153 76 59) 0%, rgb(146 91 50) 21%, rgb(138 107 50) 41%, rgb(93 116 65) 54%, rgb(50 108 148) 78%, rgb(58 70 129) 97%)`. The dark variant is `rgb(203 156 145) → rgb(194 141 109) → rgb(182 151 90) → rgb(138 161 105) → rgb(111 160 197) → rgb(148 158 195)`.

---

## 5. Layout

### 5.1 Containers

| Container | Value | Source |
|---|---|---|
| Main content column `.viewport-content` | `width: 87.5%; max-width: var(--global-content-max-width)` | Duo, MacBook Pro |
| `--global-content-max-width` | `1260px`; **`420px` at ≤734** | Duo, MacBook Pro, iPhone, Home, Apple Intelligence |
| Hero or media max width | `1680px` (`--global-content-max-width-hero`), used at ≥1441 | same |
| Legacy text column | `980px` large / `692px` medium | HomeView `.section-facetime`; Vision Pro copy is 970 / 692 |
| Global nav and local nav content | `max-width: 1024px; padding-inline: 22px` | globalheader.css, Duo `--localnav-max-width` |
| Footer content | `max-width: 980px; padding: 0 22px` | ac-globalfooter.css |
| Ribbon content | `83.333%` wide, min 320px | Duo / iPhone `.ribbon` |

The 87.5% column leaves a 6.25% gutter on each side. A 12-column helper grid is built on it: `--ric-column-width-N = min(N × 7.29157vw, 1260px / 12 × N)`.

### 5.2 Grid and gaps

| Item | Value |
|---|---|
| `.grid` columns / inner gutter | 12 columns, 24px column and row gutter (`--sk-cssgrid-column-gutter-inner` default) |
| Bento / nested grid gap | `20px` (`.ric-nested-grid.ric-bento-gap{gap:20px}`, `--ric-gap:20px`, `--tile-card-gutter:20px`) |
| Card set gutter | `20px` (`.card-set`) |
| Home tiles gap | `12px` between tiles and sections, 2 columns for promos, 1 column at small |
| Callout grid row gap | base 40px; elevated and super 80px (HomeView `.callout-group`) |

### 5.3 Section rhythm

| Token | Large | Medium | Small | Source |
|---|---|---|---|---|
| `--global-section-padding` (top and bottom) | **144px** | **120px** | **112px** | every page; artisan `MarcomSection` |
| `--global-section-padding-top-reduced` | 120 | 80 | 56 | used for lineup sections ("reducedPadding": top reduced, bottom normal) |
| `--global-section-aap-padding` (bottom with floating control bar) | 224 | 176 | 144 | Duo |
| Product-story chapters | 128 | 96 | – | Duo `.section-product-stories` |
| Section header → content | **48px** | 40px | 32px | `.section-header --padding-bottom`, artisan `SectionHeader margin-block-end` |
| Home tile padding (top / bottom) | 48 / 56 (56 / 63 when viewport ≥776 tall) | 54 / 61 | 39 / 43 | homepage.built.css |

Text-flow spacing inside a lockup (`:root` in sasskit):

| Pair | Margin |
|---|---|
| headline + first element (`h1+*`) | `0.8em` of the following element |
| headline + headline | `0.4em` |
| paragraph + headline | `1.6em` |
| paragraph + element | `0.8em` |
| `.typography-headline-super + .typography-intro-elevated` | `1.6em` (Duo override) |

### 5.4 Cards and tiles

| Property | Value | Source |
|---|---|---|
| Corner radius | **28px** (`--corner-radius`, `--sk-tile-border-radius`) | artisan `:root`, Duo `.card` |
| Other radii in use | 18px (compare chips, Vision Pro), 22px (Duo, HomeView media), 12px (small controls, `button-super.button-block`), 8px (`button-block`), 980px or 999px (pills) | radius tally across sheets |
| Feature card size | 372 × 680 (large), 344 × 628 (medium), 260 × 480 (small) on artisan; Duo uses 372 × 612 / 344 × 576 / 260 × 480 | `FeatureCardPro`, Duo `.feature-card` |
| Card inner padding | 32 / 28 / 24px | `FeatureCardPro --card-padding` |
| Card stack order | topic label (17 T 600) → 8px → headline (28 D 600) → 12px → body (17 T 400), all with the same side padding; caption is 12px at `rgba(0,0,0,.56)` | `FeatureCardPro_*` |
| Banner card | min-height 580 (480 small); content padding 56 (48 small); copy 12px below headline; CTAs 12px below copy; content width 400 large / 480 medium | Duo `.banner-card` |
| Hover | `transform: scale(1.0161)` at 372px wide (about +6px), `transition: transform .3s cubic-bezier(0,0,.5,1)`, only under `@media (hover:hover) and (pointer:fine)` | artisan `BaseCard`, Duo `.card-hover` |
| Card outline | `outline: 1px solid var(--section-background-color)`, which hides anti-aliasing fringes | `BaseCard` |

---

## 6. Components of a landing page

### 6.1 Global nav

| Property | Value |
|---|---|
| Height | 44px (48px at ≤833) |
| Link type | **12px SF Pro Text 400, line-height 1, −0.01em**; padding `0 8px`; color `rgba(0,0,0,.8)`, hover `#000`; dark `rgba(255,255,255,.8)` / `#fff`; transition `color .32s cubic-bezier(.4,0,.6,1)` |
| Content width | max 1024px, side padding 22px |
| Background | transparent at top; when scrimmed, `rgba(22,22,23,.8)` dark with backdrop blur; flyouts `#fafafc` / `#161617` |
| Flyout | group header 12px T in `#6e6e73` (light) / `#86868b` (dark); at ≤833 the flyout links become **28px Display 600** |

### 6.2 Local nav (product sub-nav)

**Classic** (`ac-localnav/9`, used by HomeView, Vision Pro, AirPods and others):
- Product title is **21px Display 600, 0.011em**, color black at `.88` opacity (`#fff` at `.92` in dark). It drops to 19px at ≤833.
- Menu links are 12px Text 400 (14px when collapsed).
- Subhead is 12px at `.56` opacity.
- The Buy pill is `button-reduced`: 12px, padding 4 × 11, radius 980px, fill `#0071e3`.
- 1px keyline `rgba(0,0,0,.16)` (dark `rgba(255,255,255,.24)`). Opened menu background is `#fafafc` / `#161617`.

**New floating nav** (iPhone Duo, 2026):
- A centred pill container, max 1024px, 10px from the top.
- `border-radius: 32px` easing to 18px as it collapses (`calc(32px - 14px*(1 - var(--progress)))`).
- `backdrop-filter: blur(20px)`, background `rgba(255,255,255,.8)` / `rgba(18,18,18,.8)`, 1px ring `#e6e6e8` / `#282828`.
- Product name 19 D 600; tabs 17 T **500**; secondary links 19 D 500.
- "Explore" and "Buy" are 12px pills (`border-radius: 10em`).
- Minimum height 52px plus 10px padding.

### 6.3 Hero

- **Product overview hero** (Duo, HomeView): the product name is the `<h1>` as an eyebrow (`typography-eyebrow-elevated`, 28 / 24 / 21 D 600). The hero line under it is `media-hero-headline-base` (64 / 56 / 32 D 600). Small legal or availability notes follow at 14px with footnote marks.
- **Category hero** (iPhone, TV & Home): one word as `typography-page-header-title` (80 / 64 / 48). A chapter nav of product icons with 12px labels and "New" badges follows.
- **Home tile**: headline 56 / 48 / 32 D 600, 6px gap (4px at medium), subhead 28 / 24 / 19 D **400**, then a 17px gap to a row of two pills. At ≥735 the pills are `button-elevated` size: 17px, padding 12 × 22. The pills are "Learn more" (filled blue) and "Buy" (`button-secondary`, outlined), with a 17px gap (14px at small).

### 6.4 Headline stacks (type lockups)

The `ric-type-lockup` pattern opens every chapter of an overview page:

```
[eyebrow]   topic name, 21 / 19 / 17, 600, primary color        e.g. "Foldable design"
   ↓ 20 / 18 / 12px
[headline]  80 / 64 / 40 D 600, primary, hand-broken lines      e.g. "A new iPhone enters the fold."
   ↓ 26 / 24 / 18px
[copy]      21 / 21 / 19 D 400, line-height +8px, SECONDARY gray, <strong> phrases in PRIMARY
   ↓ CTA row gap 33px (12px small)
[links]     17px text links with chevron
```

- The lockup is centred at large (`large-centered`) and left-aligned at small (`small-uncentered`).
- Column widths are set per breakpoint: headline 6 / 7 / 8 / 12 of 12 columns (xlarge / large / medium / small), copy 8 / 9 / 12.
- The eyebrow is the real `<h2>`. The big headline is a `<p>`, so heading semantics stay with the topic name.
- **Hand-set line breaks**: `<br class="large|medium|small">` shows a break at only one breakpoint (`br.large{display:block}` hidden at ≤1068, and so on). Vision Pro adds combined classes (`br.ms`, `br.lm`, `br.ls`).
- **Widow control** uses `&nbsp;` between the last two words and inside product names ("Apple&nbsp;Card"). Non-breaking hyphens U+2011 keep words like "all‑new" and "trade‑in" together; Duo has 92 of them and iPhone 303. The artisan pages insert U+2060 word joiners between the letters of a final phrase (Mac has 142).
- **Section header** (`.section-header`): a 48 / 40 / 32 headline on the left (max-width 75%, min-width 50%) and a 17px link list on the right, aligned `last baseline`, column gap 80px (120px in the base rule) and row gap 20px. At small it stacks vertically with a 16px gap. Multiple links are spaced 34px apart (28px at small).

### 6.5 Feature tiles and bento

- **Highlights gallery** ("Get the highlights."): a horizontal media-card gallery. Captions are 28 / 24 / 17 semibold, often written as two sentences with a hand break. Each card can carry a 12px sosumi line below.
- **Feature cards** ("Why Apple is the best place to shop X."): a horizontally scrolling row of 372px cards with a 28px radius. Each card has a topic label, a headline sentence, an optional body line, and a "+" button that opens a back-of-card modal.
- **Callout grids** (HomeView, Duo): icon, then 12px (or 22px), then a paragraph.
  - The whole paragraph is **17px Text 600**. The lead sentence is the `<h3>` set inline in `--sk-glyph-gray` (primary); the rest is a `<p>` set inline in `--sk-glyph-gray-secondary`.
  - This bold two-tone paragraph is the most recognisable 2025–26 Apple pattern.
  - Optional keyline: `border-top: 1px solid #6e6e73` (`#fff` in dark), with 24px of space (32px elevated).
- **Bento**: a 12-column nested grid with a 20px gap. Tiles use the 28px radius and the fill colors from §4.2.

### 6.6 Spec and number callouts

`.stat` component (MacBook Pro, AirPods, HomeView, Duo):

| Variant | Value | Unit / currency | Caption |
|---|---|---|---|
| `.stat-super` | 80 D 600, line-height 1 | 56 D 600 | 17 T 400 |
| `.stat-elevated` | 64 D 600 | 40 | 14 T |
| `.stat` (default) | 48 D 600 | 32 | 14 T |
| `.stat-reduced` | 40 D 600 | 28 | 14 T |
| `.stat-tiny` | 28 D 600 | 19 | – |
| `.tout .stat` (spec strip) | 28 / 24 / 21 D 600 | – | 12 T |

Rules:
- Units and currency signs are set at about 2/3 of the numeral size, in the same weight, on the same baseline. The currency offset is `--sk-stat-currency-offset: -0.375em`.
- Stats sit inline with `margin-inline-end: 2em; min-width: 5em`. The caption sits one line above or below.
- Cap-height glyphs such as "+" get `font-feature-settings:"case"`.
- Compare pages show summary badges at **68px** (44px small) with tracking `-0.0001em`.
- Vision Pro spec stats are `<strong>` numerals at 48 / 40 / 32 D 600 over 21px semibold labels.

### 6.7 Comparison rows

Mac and iPhone compare pages:
- The page headline is `typography-headline-elevated` (64 / 48 / 40), e.g. "Compare Mac models".
- Helper links ("Help me choose") are set in `typography-intro` (21px).
- Each spec group starts with a row header at **32 / 28 / 24 D 600**, color `#1d1d1f`, `padding-bottom: 22px` (26px at small), `border-bottom: 1px solid #e8e8ed`, `margin-bottom: 48px` (30px at small).
- Model selectors are pill dropdowns (`typography-dropdown-select` 17 / 14 T, labels 17 T 600).
- Cell values are rendered by JS (not captured). Absent features show an em dash (`.icon-mdash`).
- Prices use 17px Text, with 12px monthly lines below.

### 6.8 CTAs, links and buttons

**Text link with chevron** (the "Learn more ›" link):
- Color `#0066cc` (light) or `#2997ff` (dark), no underline.
- On hover, only the text gets underlined, not the chevron (`:hover .copy{text-decoration:underline}`).
- The chevron is `::after` with SF Pro Icons glyph `"\f301"`, `padding-inline-start: .24em`, `font-size: inherit` and `line-height: 1`.
- Size follows context: 17px in section headers and callouts, 14px at small.
- Use an inline SVG chevron or "›" on the web, because SF Pro Icons isn't available.

**Buttons** (`.button` and variants, identical across all sheets):

| Variant | Font | Padding (v × h) | Min width | Radius |
|---|---|---|---|---|
| `.button` (default) | 14 T 400 / 1.2858 / −0.016em | 9 × 16 (includes 1px border) | 60 | 980px |
| `.button-reduced` | 12 T 400 | 4 × 11 | 45 | 980px (`block`: 5px) |
| `.button-elevated` | 17 T 400 / 1.1765 / −0.022em | 12 × 22 | 70 | 980px (`block`: 10px) |
| `.button-super` | 17 T 400 / 1.1765 | 18 × 31 | 90 | 980px (`block`: 12px) |
| `.button-block` | full width | – | – | 8px |

| Color variant | Light | Dark (`.theme-dark`) |
|---|---|---|
| primary (default) | bg `#0071e3`, hover `#0076df`, active `#006edb`, text `#fff` | same |
| `-secondary` (outline) | transparent, 1px `#0066cc` border and text; hover fills `#0076df` with white text | border and text `#2997ff` |
| `-neutral` | bg `#1d1d1f` (hover `#272729`, active `#18181a`), white text | bg `#f5f5f7` (hover `#fff`, active `#ededf2`), black text |
| `-secondary-neutral` | transparent, `#1d1d1f` border and text | `#f5f5f7` border and text |
| `-blur` | `backdrop-filter: blur(20px)` | – |

Other button rules: disabled opacity `.42` (`.36` dark); focus ring `2px solid #0071e3`, offset 3px; `white-space: nowrap`; button margins 14px (reduced 10, elevated 18, super 22).

CTA wording and pairing:
- Buttons say "Learn more" with "Buy", or "Shop gifts".
- Text links say "Watch the film", "View in your space", "Learn more about the Home app", "Shop the Apple Home Collection", "Compare all models".
- `aria-label` always adds the object, e.g. `aria-label="Learn more, iPhone Duo"`.

### 6.9 Footnotes and legal ("sosumi")

- Superscripts are `font-size: .6em; top: -.5em; position: relative; vertical-align: initial`.
- Numbered footnotes (`.footnote-number`) instead use `font-feature-settings:"numr"` at `1em`, linked with `aria-label="Footnote 2"`.
- Symbols are `◊` (`.footnote-diamond`), `*` and `§` ("Footnote § symbol"). On the Duo page, 100 numbered footnotes outnumber the 9 diamond ones.
- Footnote links inherit the text color.
- The legal block at the page bottom (`.ac-gf-sosumi`) is 12px Text, line-height 16px, color `rgba(0,0,0,.56)` with links at `.72` (`rgba(255,255,255,.56/.8)` in dark). It has 1px borders and padding `17px 0 11px`.
- Card-level sosumi is 12px at the same alpha, 8px (16px at small) below the content.

### 6.10 Footer

- Background `#f5f5f7` (dark `#1d1d1f`), max-width 980px with 22px padding.
- All type is 12px Text 400 / 1.3334 / −0.01em.
- Directory column titles are `.88` black, links `.72`, text `.56`, separators `.16`.
- Breadcrumbs are 12px. The legal line (copyright, links separated by `|` pipes) is 12px.
- The buy strip above the footer is 14px (19 D in the elevated version), with column titles at 19 / 21 D 600.

### 6.11 Ribbon (promo strip under the nav)

- 14px Text 400 / 1.4286.
- Background `#f5f5f7`, text `#1d1d1f`, link `#0066cc` with `white-space: nowrap`.
- 16px top and bottom padding, centred, 83.3% wide.
- Drops in with `ribbon-drop .8s ease-in-out`.

---

## 7. Motion that CSS reveals

| Pattern | Values | Source |
|---|---|---|
| **Staggered fade-in** of lockup elements (eyebrow → headline → copy → CTA) | `--staggered-delay: .15` (s per item), opacity 0→1 over `.9s`, `translateY(30px)`→0 over `.7s`; triggered when the element crosses mid-viewport (`data-focus-expression "t - 50vh + 50h"`); disabled under reduced motion and when JS is off | Duo `[data-component-list*=StaggeredFadeIn]`; artisan `animationDefaults_buildIn {opacity:0; transform:translateY(30px)}` |
| **Statement sequence** | Three short statements in a `<ul>`, each `min-height:100vh` and sticky; blurred backdrop (`20px`→`30px`) and `#fbfbfd` scrim at 80%; 50px between statements | Vision Pro `.section-foundation` |
| **Split subhead** | Home "Hello, hello." subhead: two halves start offset by `translateX(33px)` and `16px` (30/14 medium, 23/12 small) and slide together while the second half fades in | `index_4x6ailol.built.css` |
| **Card hover** | Scale about 1.6% over `.3s cubic-bezier(0,0,.5,1)` on fine pointers only | `BaseCard`, `.card-hover` |
| **Nav color** | `.32s cubic-bezier(.4,0,.6,1)` | globalheader.css |
| **Floating nav** | `.4s ease-out`; radius and size interpolate with scroll `--progress` | Duo `#localnav` |

No word-by-word letter animation or scroll-linked text opacity was found in CSS. That would be JS-driven if it exists.

---

## 8. Copy patterns

Quoted examples are short and few; the patterns matter more.

1. **Short declarative headline, ending in a period.** Every headline and section header ends with a period, including two-word ones. Section headers repeat across pages as fixed phrases: "Get the highlights.", "Take a closer look.", "Explore the lineup.". The only headlines without a period are product names and the category title.
2. **Two-beat structure.** Statement, then twist, often on two hand-broken lines: "Reimagined iOS. / Anything's posable." Or three parallel verbs: "Love it. Lease it. Upgrade it."
3. **Wordplay on the product's defining trait**, kept short: "A new iPhone enters the fold." (foldable), "Think vast." (big display), "Power on full display.", "Your data is private property."
4. **Sentence case everywhere.** Capitals appear only on proper nouns and feature names (Center Stage, Smart Take, Spatial Audio). No title case in headlines, no uppercase eyebrows, no exclamation marks (none found on any marketing page).
5. **Product-name eyebrows.** The `<h1>` is the product name. Chapter eyebrows are plain topic nouns: "Foldable design", "Versatility", "Advanced camera system", "Performance and battery life". The headline then makes the claim.
6. **Bold lead-in paragraphs.** A feature name or verb phrase is set as a sentence with a period, and the explanation continues in gray in the same paragraph. Examples: "Digital picture frame." … ; "Cooking." … ; "Stay caught up." … Leads are verbs or nouns of two to four words, parallel within a group.
7. **Paragraph copy.** It opens by naming the product ("Apple HomeView is designed to…", "iPhone Duo offers…") and makes one key claim bold, for example the largest-display claim. It uses plain verbs (get, see, keep, help) and second person ("you", "your").
8. **Feature-card headlines** are full sentences with a verb up front: "Pay over time, interest‑free.", "Save on a new iPhone with a trade‑in.", "Shop live with a Specialist."
9. **Recurring section headlines on category pages**, in this order: "Explore the lineup.", "Why Apple is the best place to shop X.", "X essentials.", then a pun on pairing ("Made for each other.", "Significant others.", "Unlock the world of Apple.").
10. **Numbers** are written as numerals with units ("50 percent larger", "Up to 2000 nits", "3% Daily Cash"), each with a footnote mark right after the claim.
11. **CTAs** are two words or fewer for buttons ("Learn more", "Buy"). Text links are verb-first and name the object ("Watch the film", "View in your space", "Learn more about the Home app").
12. **Footnote markers** attach to every quantified or availability claim, inline right after the claim.

---

## 9. How to apply this to a docs and marketing site

This section is recommendation, not Apple fact. It is written generically so it can be mapped onto existing tokens, including Tailwind v4 `@theme`.

### 9.1 Token set: exact steps (preferred)

```css
:root {
  /* families */
  --font-text: "SF Pro Text", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter Variable", Inter, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-display: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter Display", "Inter Variable", Inter, system-ui, "Helvetica Neue", Arial, sans-serif;

  /* leading rule: tight = size + 4px, reading = size + 8px */
  --leading-tight: calc(1em + 4px);
  --leading-read: calc(1em + 8px);

  /* sizes at large; overridden below */
  --type-hero: 80px;       --type-hero-track: -0.015em;      /* headline-super */
  --type-display: 64px;    --type-display-track: -0.009em;   /* headline-elevated */
  --type-headline: 48px;   --type-headline-track: -0.003em;  /* headline / section header */
  --type-title: 40px;      --type-title-track: 0;            /* headline-reduced */
  --type-callout: 32px;    --type-callout-track: 0.004em;    /* callout / eyebrow-super */
  --type-card: 28px;       --type-card-track: 0.007em;       /* card + tile headline, eyebrow-elevated */
  --type-eyebrow: 24px;    --type-eyebrow-track: 0.009em;    /* eyebrow, label */
  --type-intro: 21px;      --type-intro-track: 0.011em;      /* intro (400) */
  --type-body: 17px;       --type-body-track: -0.022em;
  --type-small: 14px;      --type-small-track: -0.016em;
  --type-caption: 12px;    --type-caption-track: -0.01em;
}
@media (max-width: 1068px) {
  :root {
    --type-hero: 64px;     --type-hero-track: -0.009em;
    --type-display: 48px;  --type-display-track: -0.003em;
    --type-headline: 40px; --type-headline-track: 0;
    --type-title: 32px;    --type-title-track: 0.004em;
    --type-callout: 28px;  --type-callout-track: 0.007em;
    --type-card: 24px;     --type-card-track: 0.009em;
    --type-eyebrow: 21px;  --type-eyebrow-track: 0.011em;
  }
}
@media (max-width: 734px) {
  :root {
    --type-hero: 48px;     --type-hero-track: -0.003em;
    --type-display: 40px;  --type-display-track: 0;
    --type-headline: 32px; --type-headline-track: 0.004em;
    --type-title: 28px;    --type-title-track: 0.007em;
    --type-callout: 24px;  --type-callout-track: 0.009em;
    --type-card: 21px;     --type-card-track: 0.011em;
    --type-intro: 19px;    --type-intro-track: 0.012em;
  }
}
```

### 9.2 Token set: fluid clamp() alternative

Steps can't be reproduced exactly with `clamp()`. The formulas below interpolate linearly from the small value at 734px to the large value at 1069px, which lands within about 1px of the medium value at 900px for most styles. Pair them with `line-height: var(--leading-tight)`; `calc(1em + 4px)` stays correct at every fluid size. Tracking can stay at the large value, or switch at 1068 / 734 as above.

| Token | clamp() | ≈ at 900px (Apple medium) |
|---|---|---|
| `--type-hero` | `clamp(48px, 9.552vw - 22.11px, 80px)` | 63.9 (64) |
| `--type-display` | `clamp(40px, 7.164vw - 12.59px, 64px)` | 51.9 (48) |
| `--type-headline` | `clamp(32px, 4.776vw - 3.06px, 48px)` | 39.9 (40) |
| `--type-title` | `clamp(28px, 3.582vw + 1.71px, 40px)` | 33.9 (32) |
| `--type-callout` | `clamp(24px, 2.388vw + 6.47px, 32px)` | 28.0 (28) |
| `--type-card` | `clamp(21px, 2.090vw + 5.66px, 28px)` | 24.5 (24) |
| `--type-eyebrow` | `clamp(21px, 0.896vw + 14.43px, 24px)` | 22.5 (21, steps at 1068) |
| `--type-intro` | `clamp(19px, 0.597vw + 14.62px, 21px)` | 20.0 (21, steps at 734) |
| `--type-tile` (home tile 56/48/32) | `clamp(32px, 7.164vw - 20.59px, 56px)` | 43.9 (48) |

Tailwind v4 mapping example:

```css
@theme {
  --text-headline: var(--type-headline);
  --text-headline--line-height: calc(1em + 4px);
  --text-headline--letter-spacing: var(--type-headline-track);
  --text-headline--font-weight: 600;
}
```

### 9.3 Classes

| Class | Size token | Family | Weight | Leading | Color |
|---|---|---|---|---|---|
| `.t-hero` | `--type-hero` | display | 600 | tight | primary |
| `.t-display` | `--type-display` | display | 600 | tight | primary |
| `.t-headline` (section header, page H1 on marketing pages) | `--type-headline` | display | 600 | tight | primary |
| `.t-title` (docs H1) | `--type-title` | display | 600 | tight | primary |
| `.t-eyebrow` | `--type-eyebrow` (or `--type-intro` for the 21px topic eyebrow) | display | 600 | tight | primary; product-name eyebrow may use secondary |
| `.t-card` (card and tile headline, docs H2) | `--type-card` | display | 600 | tight | primary |
| `.t-intro` | `--type-intro` | display | 400 | read | secondary, with `strong` in primary at 600 |
| `.t-lead` (bold two-tone paragraph) | `--type-body` | text | 600 | tight (+4px) | secondary; first sentence `<b>` in primary |
| `.t-body` | `--type-body` | text | 400 | read (25px) | primary in docs prose; secondary in marketing |
| `.t-small` | `--type-small` | text | 400 | +6px (20px) | secondary |
| `.t-caption` / `.t-legal` | `--type-caption` | text | 400 | +4px (16px) | `rgba(255,255,255,.56)` dark / `rgba(0,0,0,.56)` light |
| `.t-stat` | 48 / 64 / 80 | display | 600 | 1 | primary; unit `<span>` at 0.67em |

For docs pages specifically (recommendation): H1 `.t-title` (40 / 32 / 28), H2 `.t-card` (28 / 24 / 21), H3 21px display 600 (19 at small), body 17px / 25px Text, inline code 0.88em `--font-mono`. Use the section-header pattern (48px headline with an inline link to the right) only on marketing and overview pages.

### 9.4 Links and buttons

```css
.link { color: var(--link); text-decoration: none; }                  /* #2997ff dark, #0066cc light */
.link:hover .link-text { text-decoration: underline; }
.link-chevron::after { content: ""; display: inline-block; width: .55em; height: .55em;
  margin-inline-start: .24em; /* inline SVG chevron via mask-image, currentColor */ }

.btn { font: 400 14px/18px var(--font-text); letter-spacing: -.016em; padding: 8px 15px;
  border: 1px solid transparent; border-radius: 980px; min-width: 28px; white-space: nowrap;
  background: #0071e3; color: #fff; }
.btn:hover { background: #0076df; } .btn:active { background: #006edb; }
.btn-lg { font-size: 17px; line-height: 20px; letter-spacing: -.022em; padding: 11px 21px; }  /* elevated */
.btn-secondary { background: transparent; color: var(--link); border-color: var(--link); }
.btn-secondary:hover { background: #0076df; color: #fff; border-color: transparent; }
.btn-neutral { background: #f5f5f7; color: #000; }                    /* dark theme */
:focus-visible { outline: 2px solid #0071e3; outline-offset: 1px; }   /* 3px on buttons and cards */
```

Pair a filled "Learn more" with an outlined secondary button, 17px apart (14px at small). Use at most two buttons in a row; anything more becomes a text link.

### 9.5 Section spacing scale

| Token | Large | Medium | Small |
|---|---|---|---|
| `--space-section` | 144px | 120px | 112px |
| `--space-section-reduced-top` | 120px | 80px | 56px |
| `--space-section-header` (header → content) | 48px | 40px | 32px |
| `--space-eyebrow-headline` | 20px | 18px | 12px |
| `--space-headline-copy` | 26px | 24px | 18px |
| `--space-card-pad` | 32px | 28px | 24px |
| `--gap-bento` | 20px | 20px | 20px |
| `--radius-card` | 28px | 28px | 28px |
| `--content-max` | 1260px (hero 1680px) | 87.5% | 87.5%, max 420px |

### 9.6 Dark-first color mapping

| Role | Dark (default) | Light |
|---|---|---|
| Page | `#000` | `#fff` |
| Alt section and card | `#161617` or `#1d1d1f` | `#f5f5f7` |
| Text primary | `#f5f5f7` | `#1d1d1f` |
| Text secondary | `#86868b` | `#6e6e73` |
| Text tertiary | `#6e6e73` | `#86868b` |
| Link | `#2997ff` | `#0066cc` |
| Hairline | `#333336` / `rgba(255,255,255,.2)` | `#e8e8ed` / `rgba(0,0,0,.08)` |
| Glass nav | `rgba(18,18,18,.8)` + `blur(20px)`, ring `#282828` | `rgba(255,255,255,.8)`, ring `#e6e6e8` |

### 9.7 Do and don't

**Do**
- Use exactly two weights, 400 and 600. Use 500 only for nav tabs.
- Use Display (or system-ui) at 19px and up and Text at 17px and down, with the tracking for that size.
- Use tight leading (size + 4px) for anything 600 weight, and reading leading (size + 8px) for paragraphs.
- End headlines with a period. Write in sentence case. Use two beats, keep it short, and make the eyebrow the product or topic name.
- Set paragraph copy in secondary gray and make one or two key phrases `<strong>` in primary.
- Hand-break hero lines per breakpoint. Use `&nbsp;` before the last word and inside product names, and U+2011 in hyphenated compounds. `text-wrap: balance` is an acceptable fallback (**inferred**; Apple doesn't use it).
- Keep each section to one idea: eyebrow, headline, copy, one or two CTAs, then the visual.
- Use footnote numerals right after the claim, with `font-feature-settings:"numr"` if the font supports it, and 12px legal text at 56% alpha.

**Don't**
- Don't use uppercase eyebrows, letter-spaced small caps, or exclamation marks.
- Don't use light weights (100 to 300) or 700/800 for headlines.
- Don't use fluid tracking. Don't use positive tracking on body text, and don't use negative tracking on 19 to 32px Display.
- Don't use more than one gradient-text treatment per page, and only for an AI or "intelligence" feature.
- Don't use colored headline text. Color belongs to links, buttons and the occasional gradient.
- Don't center long paragraphs at small sizes; Apple left-aligns lockups at small.
- Don't put more than two CTAs in a group, and don't write CTA labels longer than three words.

---

## 10. Open questions and things I could not verify

1. **Does Safari apply SF's built-in tracking under `-apple-system` / `system-ui`?** Apple's site uses named webfonts ("SF Pro Display/Text") with explicit `letter-spacing`, so its values assume no automatic tracking. If WebKit applies the system font's size-specific tracking (the `trak` table) to `system-ui`, adding Apple's `letter-spacing` on top could double it. Compare a 48px `system-ui` headline against the webfont rendering on apple.com before shipping the tracking tokens.
2. **Where exactly does the browser's optical-size switch happen** for `system-ui` (Text → Display)? Apple's CSS switches between 17 and 19px. Native macOS switches at 20pt. An 18 to 19px heading may render slightly differently.
3. **Inter v4 tracking values** in §3.4 are inferred. The verified formula is for Inter v3 (no `opsz`).
4. **Compare-table cell typography** and **Newsroom story-tile copy** are rendered client-side and were not captured.
5. The `--global-content-max-width: 420px` at ≤734 is verbatim. I didn't confirm whether every section uses it or whether full-bleed galleries override it, though galleries are capped at `calc(100vw - 40px)`.
6. Word-by-word or scroll-linked text reveals, if any, are JS-driven and invisible in CSS. Only the staggered fade, statement sequence and split subhead are documented.
7. Apple's CSS supports xlarge (≥1441px) for layout only. No type style changes there, so there is no reason to add an xlarge type step.
8. The floating local nav's exact collapsed height and the 18px end radius are derived from `calc(32px - 14px*(1 - var(--progress)))` and were not observed while scrolling.
