"use client"

import { usePreference } from "@ui-sdk/react/preferences"
import type * as React from "react"
import { theme } from "@/lib/preferences"

type AppThemeOptions = {
  /** A CSS color to use as the accent inside the app, or nothing for the theme's own. */
  accent?: string
  /** Forces the app's scheme, as a Mac's Appearance setting does. */
  scheme?: "light" | "dark"
  /** Restated with the scheme, so platform tokens re-resolve under it. */
  platform?: "macos" | "ipados" | "ios"
}

/**
 * Attributes that re-theme a subtree. Restating `data-theme` re-derives every
 * token from the seeds at that element, so an accent set here flows into
 * hovers, focus rings and selections too.
 */
function useAppTheme({ accent, scheme, platform }: AppThemeOptions) {
  const { value } = usePreference(theme)
  const style = accent
    ? ({
        "--mb-accent": accent,
        "--mb-accent-text": accent,
        "--mb-on-accent": "#ffffff",
      } as React.CSSProperties)
    : undefined
  return {
    "data-theme": accent || scheme ? value : undefined,
    "data-scheme": scheme,
    "data-platform": platform,
    style,
  }
}

export { useAppTheme }
