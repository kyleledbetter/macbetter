"use client"

import { Button } from "@dreambase/stardust/button"
import { usePreference } from "@ui-sdk/react/preferences"
import { XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, transparency } from "@/lib/preferences"

const dismissedKey = "stardust-effects-notice"

/**
 * Stardust follows the system's Reduce Motion and Reduce Transparency settings,
 * which hides the materials and springs this site exists to show. This says so,
 * and lets a visitor see them anyway.
 */
function EffectsNotice() {
  const [reduced, setReduced] = useState({ motion: false, transparency: false })
  const [dismissed, setDismissed] = useState(true)
  const motionChoice = usePreference(motion).value
  const transparencyChoice = usePreference(transparency).value

  useEffect(() => {
    const motionQuery = matchMedia("(prefers-reduced-motion: reduce)")
    const transparencyQuery = matchMedia("(prefers-reduced-transparency: reduce)")
    const sync = () => setReduced({ motion: motionQuery.matches, transparency: transparencyQuery.matches })
    sync()
    setDismissed(sessionStorage.getItem(dismissedKey) === "1")
    motionQuery.addEventListener("change", sync)
    transparencyQuery.addEventListener("change", sync)
    return () => {
      motionQuery.removeEventListener("change", sync)
      transparencyQuery.removeEventListener("change", sync)
    }
  }, [])

  if (!reduced.motion && !reduced.transparency) return null

  const full = motionChoice === "full" || transparencyChoice === "full"
  if (dismissed) return null

  const settings = [reduced.motion && "Reduce Motion", reduced.transparency && "Reduce Transparency"]
    .filter(Boolean)
    .join(" and ")
  const hidden = [reduced.transparency && "glass and materials", reduced.motion && "animation"]
    .filter(Boolean)
    .join(" and ")

  const choose = (value: "system" | "full", event: React.MouseEvent) => {
    const change = { reason: "press" as const, event: event.nativeEvent }
    motion.set(value, change)
    transparency.set(value, change)
  }

  return (
    <aside
      aria-label="Display effects"
      data-platform="macos"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-[560px] items-center gap-3 rounded-[16px] border border-separator bg-bg-elevated py-2.5 ps-4 pe-2.5 text-[13px] leading-[1.35] text-label shadow-(--sd-shadow-4)"
    >
      <p className="min-w-0 flex-1">
        {full ? (
          <>Showing full effects. Your device has {settings} turned on.</>
        ) : (
          <>
            Your device has {settings} turned on, so {hidden} are switched off here.
          </>
        )}
      </p>
      {full ? (
        <Button size="sm" onClick={(event) => choose("system", event)}>
          Follow my settings
        </Button>
      ) : (
        <Button size="sm" variant="filled" onClick={(event) => choose("full", event)}>
          Show full effects
        </Button>
      )}
      <Button
        size="sm"
        variant="plain"
        tone="neutral"
        shape="circle"
        aria-label="Dismiss"
        onClick={() => {
          sessionStorage.setItem(dismissedKey, "1")
          setDismissed(true)
        }}
      >
        <XIcon aria-hidden="true" />
      </Button>
    </aside>
  )
}

export { EffectsNotice }
