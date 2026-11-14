"use client"

import type { Platform } from "macbetter"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { themeVariables } from "macbetter/theme"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { colorKeys, type Scheme } from "./derive"
import { Inspector } from "./inspector"
import { MacPreview } from "./mac-preview"
import { decodeTheme, defaultTheme, encodeTheme, presets, slugify, toThemeSeeds, type StudioTheme } from "./seeds"
import { IpadPreview, PhonesPreview } from "./touch-preview"
import "./theme-studio.css"

const platformLabels: Record<Platform, string> = { macos: "macOS", ipados: "iPadOS", ios: "iOS" }

// Device sizes in points, with the bezel, for fitting them to the stage.
const iphone = { width: 397, height: 834 }
const ipad = { width: 1220, height: 860 }

function sameLook(a: StudioTheme, b: StudioTheme) {
  return (
    a.radiusScale === b.radiusScale &&
    a.font === b.font &&
    colorKeys.every((key) => a.colors[key].light === b.colors[key].light && a.colors[key].dark === b.colors[key].dark)
  )
}

function useStageSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      const box = entry!.contentRect
      setSize({ width: box.width, height: box.height })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, size] as const
}

function ThemeStudio() {
  const [theme, setTheme] = useState<StudioTheme>(defaultTheme)
  const [scheme, setScheme] = useState<Scheme>("dark")
  const [platform, setPlatform] = useState<Platform>("macos")
  const edited = useRef(false)
  const [stageRef, stage] = useStageSize()

  // Restore a shared theme, start on the device's own platform, and match the site's appearance.
  useEffect(() => {
    const restore = () => {
      const shared = decodeTheme(location.hash)
      if (shared) setTheme(shared)
    }
    restore()
    const root = document.documentElement
    const page = root.dataset.platform as Platform | undefined
    if (page === "ios" || page === "ipados") setPlatform(page)
    if (root.dataset.colorScheme === "light") setScheme("light")
    window.addEventListener("hashchange", restore)
    return () => window.removeEventListener("hashchange", restore)
  }, [])

  // Keep the address shareable once something has changed.
  useEffect(() => {
    if (!edited.current) return
    const timer = setTimeout(() => history.replaceState(null, "", `#${encodeTheme(theme)}`), 250)
    return () => clearTimeout(timer)
  }, [theme])

  const edit = (next: StudioTheme) => {
    edited.current = true
    setTheme(next)
  }

  const preset = presets.find((p) => sameLook(p, theme)) ?? null
  const style = useMemo(() => themeVariables(toThemeSeeds(theme)) as React.CSSProperties, [theme])

  // The stage's padding is already outside its content box; leave room for the device shadows.
  const pad = 8
  const fit = (count: number) =>
    Math.min(1, (stage.width - pad) / (iphone.width * count + (count - 1) * 48), (stage.height - pad) / iphone.height)
  const phoneCount: 1 | 2 = fit(2) >= 0.55 ? 2 : 1
  const phoneScale = fit(phoneCount)
  const ipadScale = Math.min(1, (stage.width - pad) / ipad.width, (stage.height - pad) / ipad.height)

  return (
    <div className="ts-studio" data-platform="macos">
      <aside className="ts-inspector" aria-label="Theme settings">
        <Inspector
          theme={theme}
          presetId={preset?.id ?? null}
          scheme={scheme}
          onSchemeChange={setScheme}
          onPreset={(next) => edit({ ...next, name: theme.name })}
          onEdit={edit}
          onReset={() => {
            edit({ ...defaultTheme })
            history.replaceState(null, "", location.pathname)
          }}
        />
      </aside>

      <section className="ts-preview" aria-label="Preview">
        <div className="ts-preview-bar">
          <div className="ts-preview-title">
            Preview
            <span>{preset ? preset.label : `${slugify(theme.name)}, edited`}</span>
          </div>
          <SegmentedControl
            size="sm"
            aria-label="Platform"
            value={platform}
            onValueChange={(value) => value && setPlatform(value as Platform)}
          >
            {(Object.keys(platformLabels) as Platform[]).map((name) => (
              <SegmentedControlItem key={name} value={name}>
                {platformLabels[name]}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <SegmentedControl
            size="sm"
            aria-label="Appearance"
            value={scheme}
            onValueChange={(value) => value && setScheme(value as Scheme)}
          >
            <SegmentedControlItem value="light">Light</SegmentedControlItem>
            <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
          </SegmentedControl>
        </div>

        <div
          ref={stageRef}
          className="ts-stage"
          data-theme="studio-preview"
          data-platform={platform}
          data-scheme={scheme}
          style={style}
        >
          {stage.width === 0 ? null : platform === "macos" ? (
            <MacPreview />
          ) : platform === "ios" ? (
            <PhonesPreview scale={Math.max(0.4, phoneScale)} count={phoneCount} />
          ) : (
            <IpadPreview scale={Math.max(0.3, ipadScale)} />
          )}
        </div>
      </section>
    </div>
  )
}

export { ThemeStudio }
