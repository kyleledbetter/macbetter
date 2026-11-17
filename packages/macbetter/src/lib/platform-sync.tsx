"use client"

import * as React from "react"

type PlatformSyncProps = { platform: "macos" | "ipados" | "ios" | "auto"; storageKey?: string }

/** Applies the platform when the page was rendered on the client, where the inline script never runs. */
function PlatformSync({ platform, storageKey }: PlatformSyncProps) {
  React.useLayoutEffect(() => {
    let choice: string = platform
    try {
      const saved = storageKey ? localStorage.getItem(storageKey) : null
      if (saved === "macos" || saved === "ipados" || saved === "ios" || saved === "auto") choice = saved
    } catch {}
    if (choice === "auto") {
      choice = matchMedia("(pointer: coarse)").matches
        ? matchMedia("(min-width: 744px)").matches
          ? "ipados"
          : "ios"
        : "macos"
    }
    // On a server-rendered page the inline script has already set the same value, so this does nothing.
    const root = document.documentElement
    if (root.getAttribute("data-platform") !== choice) root.setAttribute("data-platform", choice)
  }, [platform, storageKey])
  return null
}

export { PlatformSync }
