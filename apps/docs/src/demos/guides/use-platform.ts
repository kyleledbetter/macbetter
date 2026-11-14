"use client"

import type { Platform } from "@dreambase/stardust"
import { useEffect, useState } from "react"

/**
 * The platform an element inherits, kept in sync with its nearest [data-platform]
 * ancestor. A themed subtree that changes radius or fonts needs its own
 * data-platform so the platform tokens re-derive from its seeds.
 */
function useInheritedPlatform(ref: React.RefObject<HTMLElement | null>): Platform | undefined {
  const [platform, setPlatform] = useState<Platform>()

  useEffect(() => {
    const host = ref.current?.parentElement?.closest<HTMLElement>("[data-platform]")
    if (!host) return
    const read = () => setPlatform((host.dataset.platform as Platform) ?? "macos")
    read()
    const observer = new MutationObserver(read)
    observer.observe(host, { attributes: true, attributeFilter: ["data-platform"] })
    return () => observer.disconnect()
  }, [ref])

  return platform
}

export { useInheritedPlatform }
