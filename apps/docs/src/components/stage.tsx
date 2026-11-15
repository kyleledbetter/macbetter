"use client"

import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Button } from "macbetter/button"
import { Toggle } from "macbetter/toggle"
import type { Platform } from "macbetter"
import { CodeIcon, ContrastIcon } from "lucide-react"
import { usePreference } from "@ui-sdk/react/preferences"
import { useEffect, useState } from "react"
import { theme } from "@/lib/preferences"

type StageProps = {
  children: React.ReactNode
  /** The platforms this demo makes sense on. The first is shown. */
  platforms?: Platform[]
  /** Floats the demo over a wallpaper, for materials and glass. */
  wallpaper?: boolean
  /** Lays the demo out edge to edge instead of centered. */
  fill?: boolean
  height?: number
  /** Hides the platform picker, for demos that look the same everywhere. */
  bare?: boolean
  /** The demo's source, shown under the preview when the reader turns it on. */
  code?: React.ReactNode
}

const labels: Record<Platform, string> = { macos: "macOS", ipados: "iPadOS", ios: "iOS" }
/** The widest the preview gets: an iPhone and an iPad in portrait. */
const widths: Record<Platform, number | undefined> = { macos: undefined, ipados: 820, ios: 390 }

function Stage({
  children,
  platforms = ["macos", "ipados", "ios"],
  wallpaper,
  fill,
  height,
  bare,
  code,
}: StageProps) {
  const [platform, setPlatform] = useState<Platform>(platforms[0] ?? "macos")
  useEffect(() => {
    const page = document.documentElement.dataset.platform as Platform | undefined
    // On a touch device, start on its own platform; a Mac keeps the demo's first choice.
    if (page && page !== "macos" && platforms.includes(page)) setPlatform(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [scheme, setScheme] = useState<"light" | "dark" | null>(null)
  const { value: themeName } = usePreference(theme)
  const [showCode, setShowCode] = useState(false)

  const width = widths[platform]
  const minHeight = height ?? 220

  return (
    <>
    <div className="docs-stage not-prose" data-wallpaper={wallpaper ? "" : undefined}>
      <div data-platform="macos" className="docs-stage-bar">
        {bare ? (
          <span />
        ) : platforms.length > 1 ? (
          <SegmentedControl
            size="sm"
            aria-label="Platform"
            value={platform}
            onValueChange={(value) => value && setPlatform(value as Platform)}
          >
            {platforms.map((name) => (
              <SegmentedControlItem key={name} value={name}>
                {labels[name]}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        ) : (
          <span className="docs-stage-only">{labels[platform]} only</span>
        )}
        <div className="flex items-center gap-0.5">
          {width ? (
            <span className="docs-stage-size" aria-hidden="true">
              {width} pt
            </span>
          ) : null}
          <Button
            variant="plain"
            tone="neutral"
            size="sm"
            shape="circle"
            aria-label="Flip the preview between light and dark"
            onClick={(event) => {
              const current =
                scheme ??
                (getComputedStyle(event.currentTarget).colorScheme.includes("dark") ? "dark" : "light")
              setScheme(current === "dark" ? "light" : "dark")
            }}
          >
            <ContrastIcon aria-hidden="true" />
          </Button>
          {code ? (
            <Toggle
              variant="plain"
              tone="accent"
              size="sm"
              aria-label="Show the code"
              pressed={showCode}
              onPressedChange={setShowCode}
            >
              <CodeIcon aria-hidden="true" />
            </Toggle>
          ) : null}
        </div>
      </div>
      <div
        data-scheme={scheme ?? undefined}
        // A forced scheme restates the theme, so every token is resolved again in that scheme.
        data-theme={scheme ? themeName : undefined}
        className={`docs-stage-canvas ${wallpaper ? "docs-wallpaper" : ""}`}
        style={{ minHeight }}
      >
        {wallpaper ? null : <div aria-hidden="true" className="docs-grid absolute inset-0" />}
        <div
          data-platform={platform}
          data-macbetter=""
          data-device={width ? "" : undefined}
          className={
            fill
              ? "docs-stage-screen relative mx-auto w-full"
              : "docs-stage-screen relative mx-auto flex w-full flex-wrap items-center justify-center gap-4 p-8"
          }
          style={{ maxWidth: width, minHeight, color: "var(--mb-label)" }}
        >
          {children}
        </div>
      </div>
    </div>
    {showCode ? code : null}
    </>
  )
}

export { Stage }
export type { StageProps }
