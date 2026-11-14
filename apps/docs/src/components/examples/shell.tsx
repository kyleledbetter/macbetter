"use client"

import type { Platform } from "@dreambase/stardust"
import { Button } from "@dreambase/stardust/button"
import { DeviceFrame } from "@dreambase/stardust/device-frame"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "@dreambase/stardust/select"
import { usePreference } from "@ui-sdk/react/preferences"
import { ChevronLeftIcon, MoonIcon, SunIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { colorScheme, theme, themeLabels, themes, type ThemeName } from "@/lib/preferences"

const platformLabels: Record<Platform, string> = { macos: "macOS", ipados: "iPadOS", ios: "iOS" }

/* Natural sizes of what each platform shows, used to scale it into the stage. */
const IPHONE = { width: 397, height: 834 }
const IPAD = { width: 1220, height: 860 }
const MAC_MIN = { width: 1040, height: 680 }
const MAC_MAX = { width: 1320, height: 860 }

type StageInfo = {
  platform: Platform
  /** The phone screen fills the viewport instead of sitting in a device frame. */
  frameless: boolean
  width: number
  height: number
  /** A static thumbnail on the gallery index: no global shortcuts, nothing focusable. */
  preview?: boolean
}

const StageContext = React.createContext<StageInfo>({ platform: "macos", frameless: false, width: 1200, height: 800 })

function useStage() {
  return React.useContext(StageContext)
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

/** An iPhone screen: a device frame scaled to fit on a desktop, or the whole viewport on a phone. */
function Phone({ children, label }: { children: React.ReactNode; label: string }) {
  const { frameless, width, height } = useStage()
  if (frameless) {
    return (
      <div data-platform="ios" data-stardust="" className="ex-screen" role="region" aria-label={label}>
        {children}
      </div>
    )
  }
  const scale = Math.min(1, (height - 8) / IPHONE.height, (width - 8) / IPHONE.width)
  return (
    <DeviceFrame scale={Number(scale.toFixed(3))} role="region" aria-label={label}>
      <div className="ex-screen-root">{children}</div>
    </DeviceFrame>
  )
}

/** An iPad in landscape, scaled to fit. */
function Pad({ children, label }: { children: React.ReactNode; label: string }) {
  const { width, height } = useStage()
  const scale = Math.min(1, (height - 8) / IPAD.height, (width - 8) / IPAD.width)
  return (
    <DeviceFrame device="ipad" scale={Number(scale.toFixed(3))} role="region" aria-label={label}>
      <div className="ex-screen-root">{children}</div>
    </DeviceFrame>
  )
}

/** Sizes a Mac window to the stage, and zooms it out on screens too small to hold one. */
function MacFrame({
  children,
  maxWidth = MAC_MAX.width,
  maxHeight = MAC_MAX.height,
}: {
  children: React.ReactNode
  maxWidth?: number
  maxHeight?: number
}) {
  const { width, height } = useStage()
  const natural = { width: Math.min(MAC_MIN.width, maxWidth), height: Math.min(MAC_MIN.height, maxHeight) }
  const fits = width >= natural.width * 0.9 && height >= 520
  const w = fits ? Math.min(width, maxWidth) : natural.width
  const h = fits ? Math.min(height, maxHeight) : natural.height
  const zoom = fits ? 1 : Math.min(width / natural.width, height / natural.height)
  return (
    <div data-platform="macos" className="ex-mac" style={{ width: w, height: h, zoom }}>
      {children}
    </div>
  )
}

function SchemeButton() {
  const { resolved } = usePreference(colorScheme)
  const next = resolved === "dark" ? "light" : "dark"
  return (
    <Button
      variant="plain"
      tone="neutral"
      size="sm"
      shape="circle"
      aria-label={`Switch to ${next} mode`}
      onClick={(event) => colorScheme.set(next, { reason: "press", event: event.nativeEvent })}
    >
      {resolved === "dark" ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
    </Button>
  )
}

function ThemePicker() {
  const { value } = usePreference(theme)
  return (
    <Select
      value={value}
      onValueChange={(next) => next && theme.set(next as ThemeName, { reason: "press" })}
      items={themes.map((name) => ({ value: name, label: themeLabels[name] }))}
    >
      <SelectTrigger size="sm" aria-label="Theme" className="ex-strip-select" />
      <SelectContent>
        <SelectList>
          {themes.map((name) => (
            <SelectItem key={name} value={name}>
              {themeLabels[name]}
            </SelectItem>
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

const narrowQuery = "(max-width: 700px)"

function subscribeNarrow(callback: () => void) {
  const query = window.matchMedia(narrowQuery)
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}

type ExampleShellProps = {
  title: string
  platforms: Platform[]
  children: React.ReactNode
}

/** The stage an example runs on: a wallpaper, a glass strip of controls, and the app scaled to fit. */
function ExampleShell({ title, platforms, children }: ExampleShellProps) {
  const narrow = React.useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(narrowQuery).matches,
    () => null
  )
  const [chosen, setChosen] = React.useState<Platform | null>(null)
  React.useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("platform") as Platform | null
    if (requested && platforms.includes(requested)) setChosen(requested)
  }, [platforms])

  const fallback: Platform = narrow && platforms.includes("ios") ? "ios" : platforms[0]
  const platform = chosen ?? fallback
  const frameless = Boolean(narrow) && platform === "ios"

  const stageRef = React.useRef<HTMLDivElement>(null)
  const size = useSize(stageRef)

  return (
    <div className="ex-page ex-wallpaper" data-narrow={narrow ? "" : undefined}>
      <div className="ex-strip-row">
        <div data-platform="macos" className="ex-strip sd-glass" data-shape="capsule">
          <Link href="/examples" className="ex-strip-back" aria-label="All examples">
            <ChevronLeftIcon aria-hidden="true" />
          </Link>
          <h1 className="ex-strip-title">{title}</h1>
          {platforms.length > 1 ? (
            <SegmentedControl
              size="sm"
              aria-label="Platform"
              value={platform}
              onValueChange={(value) => value && setChosen(value as Platform)}
            >
              {platforms.map((name) => (
                <SegmentedControlItem key={name} value={name}>
                  {platformLabels[name]}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          ) : null}
          <ThemePicker />
          <SchemeButton />
        </div>
      </div>
      <div ref={stageRef} className="ex-stage" data-frameless={frameless ? "" : undefined}>
        {narrow === null || !size ? null : (
          <StageContext.Provider value={{ platform, frameless, width: size.width, height: size.height }}>
            {children}
          </StageContext.Provider>
        )}
      </div>
    </div>
  )
}

/** Renders an example at a fixed size, scaled into a thumbnail that can't be focused or clicked. */
function StagePreview({
  platform,
  width,
  height,
  scale,
  className,
  children,
}: {
  platform: Platform
  width: number
  height: number
  scale: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className} inert aria-hidden="true" style={{ width, height, zoom: scale }}>
      <StageContext.Provider value={{ platform, frameless: false, width, height, preview: true }}>
        {children}
      </StageContext.Provider>
    </div>
  )
}

export { ExampleShell, MacFrame, Pad, Phone, StagePreview, useStage }
export type { StageInfo }
