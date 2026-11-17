/**
 * Which source files make up each example's copyable block.
 *
 * Paths are relative to `src/components/examples/`. A `folder` entry lists
 * every file in that folder when the page is built, so new files show up
 * without touching this list. Local imports (`./x`, `../x`, `@/…`) found in
 * these files are followed and added too; `shell.tsx` is the gallery's own
 * stage and is never part of a block.
 */

type ExampleSourceManifest = {
  title: string
  /** The file the code view opens first. */
  entry: string
} & ({ files: string[]; folder?: never } | { folder: string; files?: never })

const exampleSources = {
  settings: {
    title: "Settings",
    entry: "settings/settings.tsx",
    files: ["settings/settings.tsx", "settings/panes.tsx", "settings/data.ts", "settings/settings.css"],
  },
  mail: {
    title: "Mail",
    entry: "mail/mail.tsx",
    files: ["mail/mail.tsx", "mail/parts.tsx", "mail/store.ts", "mail/data.ts", "mail/mail.css"],
  },
  analytics: { title: "Analytics", entry: "analytics/analytics.tsx", folder: "analytics" },
  music: { title: "Music", entry: "music/music.tsx", folder: "music" },
  home: { title: "Home", entry: "home/home.tsx", folder: "home" },
  assistant: { title: "Assistant", entry: "assistant/assistant.tsx", folder: "assistant" },
} satisfies Record<string, ExampleSourceManifest>

type ExampleSlug = keyof typeof exampleSources

/** Files that belong to the gallery, not to any example. */
const excludedSources = ["shell.tsx", "gallery.tsx"]

export { excludedSources, exampleSources }
export type { ExampleSlug, ExampleSourceManifest }
