/** What "Copy agent instructions" puts on the clipboard: a brief a coding agent can follow start to finish. */
const agentInstructions = `Set up macbetter in this project. macbetter is a React component library that follows Apple's Human Interface Guidelines for macOS, iPadOS and iOS, built on ui-sdk. Docs: https://macbetter.dev/docs

Before you write code, read these two pages. Every docs page is also served as plain Markdown at /docs/raw/<slug>:
- https://macbetter.dev/docs/raw/agents (how to build with macbetter as an agent)
- https://macbetter.dev/docs/raw/installation (setup, layer order, Next.js and Tailwind notes)

Then ask me these questions, one message, and wait for my answers:
1. Which platform should the app feel like: macOS, iPadOS, iOS, or follow the device automatically?
2. Do I have a brand color? If yes, ask for the hex value. If no, offer the built-in themes: ember (the default), system, nebula, graphite.
3. Light, dark, or follow the system?
4. What is the first screen or component I want built?

Once I answer, do this:
1. Check the project uses React 19 or newer. If it doesn't, stop and tell me.
2. Install the packages with the project's package manager: macbetter @ui-sdk/react @ui-sdk/core
3. In the global stylesheet, declare the cascade layers and import the styles:
   @layer ui-sdk, macbetter;
   @import "macbetter/styles.css";
   With Tailwind CSS v4 use: @layer ui-sdk, theme, base, macbetter, components, utilities; and import tailwindcss before macbetter.
4. In the root layout, render <MacbetterScript /> (from "macbetter") first in <body>, put data-macbetter="" on <body>, set data-theme on <html>, and add suppressHydrationWarning to <html>. Pass platform="macos" | "ipados" | "ios" to MacbetterScript if I chose a fixed platform.
5. If I gave a brand color, generate a theme from it with deriveFromAccent (from "macbetter/derive") and createTheme (from "macbetter/theme"), add the CSS after the macbetter import, and set data-theme to its name. Check text holds 4.5:1 against its background.
6. Build the first screen I asked for. Import each component from its own entry, like "macbetter/button". Read the component's page at https://macbetter.dev/docs/raw/components/<name> before using it.

Rules while you build:
- Give every control an accessible name: a visible label, or aria-label when there is none.
- Create render elements in a client component: a file that passes render={<Link />} or similar needs "use client".
- Use the --mb-* tokens for color, radius and spacing. Don't hard-code colors.
- Don't restyle components to look less like the platform. Change the theme instead.

When you're done, run the project's typecheck and tell me what you installed, which files you changed, and anything you couldn't verify.`

export { agentInstructions }
