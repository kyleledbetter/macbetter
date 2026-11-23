"use client"

import type { Platform } from "macbetter"
import { Button } from "macbetter/button"
import { DeviceFrame } from "macbetter/device-frame"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuTrigger } from "macbetter/menu"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "macbetter/select"
import { usePreference } from "@ui-sdk/react/preferences"
import { CheckIcon, ChevronLeftIcon, CopyIcon, FilesIcon, MoonIcon, PackageIcon, SunIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import type { ExampleSourceSet, SourceFile } from "@/lib/example-sources"
import { colorScheme, theme, themeLabels, themes, type ThemeName } from "@/lib/preferences"
import { ExampleImageMenu } from "@/components/preview-image"
import { CodeView, copyAllFiles, copyFile, copyInstall, useCopied } from "./code-view"
import { useExampleSource } from "./source-context"

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
      <div data-platform="ios" data-macbetter="" className="ex-screen" role="region" aria-label={label}>
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

/** Copies the open file; its menu copies the whole block or the install command. */
function CopyCode({ source, file, compact }: { source: ExampleSourceSet; file: SourceFile; compact: boolean }) {
  const [copied, run] = useCopied()
  return (
    <div className="ex-copy" role="group" aria-label="Copy">
      <Button
        variant="plain"
        tone="neutral"
        size="sm"
        shape={compact ? "circle" : "auto"}
        className="ex-copy-main"
        aria-label={compact ? `Copy ${file.name}` : undefined}
        title={`Copy ${file.name}`}
        onClick={() => run(() => copyFile(file))}
      >
        {copied ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
        {compact ? null : <span>{copied ? "Copied" : "Copy code"}</span>}
      </Button>
      <Menu
        onAction={(value) => {
          if (value === "file") run(() => copyFile(file))
          else if (value === "all") run(() => copyAllFiles(source))
          else if (value === "install") run(() => copyInstall(source))
        }}
      >
        <MenuTrigger
          variant="plain"
          tone="neutral"
          size="sm"
          shape="circle"
          className="ex-copy-more"
          aria-label="More ways to copy"
        />
        <MenuContent align="end">
          <MenuItem value="file">
            <MenuItemIcon>
              <CopyIcon />
            </MenuItemIcon>
            Copy {file.name}
          </MenuItem>
          <MenuItem value="all">
            <MenuItemIcon>
              <FilesIcon />
            </MenuItemIcon>
            Copy All {source.files.length} Files
          </MenuItem>
          <MenuItem value="install">
            <MenuItemIcon>
              <PackageIcon />
            </MenuItemIcon>
            Copy Install Command
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  )
}

type View = "preview" | "code"

/** Finds a file from the URL: its whole path, or any trailing part of it, like `settings/panes.tsx`. */
function findFile(source: ExampleSourceSet, wanted: string | null) {
  if (!wanted) return undefined
  const clean = wanted.replace(/^\/+|^src\//g, "")
  return (
    source.files.find((file) => file.path === clean) ??
    source.files.find((file) => file.path.endsWith(`/${clean}`))
  )
}

function writeQuery(changes: Record<string, string | null>) {
  const url = new URL(window.location.href)
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) url.searchParams.delete(key)
    else url.searchParams.set(key, value)
  }
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
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
  const source = useExampleSource()
  const [chosen, setChosen] = React.useState<Platform | null>(null)
  const [view, setView] = React.useState<View>("preview")
  const [filePath, setFilePath] = React.useState<string | null>(null)
  React.useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const requested = query.get("platform") as Platform | null
    if (requested && platforms.includes(requested)) setChosen(requested)
    if (source) {
      if (query.get("view") === "code") setView("code")
      const requestedFile = findFile(source, query.get("file"))
      if (requestedFile) setFilePath(requestedFile.path)
    }
  }, [platforms, source])

  const file = source
    ? (source.files.find((candidate) => candidate.path === filePath) ??
      source.files.find((candidate) => candidate.path === source.entry) ??
      source.files[0])
    : undefined

  const changeView = (next: View) => {
    setView(next)
    writeQuery({ view: next === "code" ? "code" : null })
  }
  const changeFile = (path: string) => {
    setFilePath(path)
    writeQuery({ file: source && path !== source.entry ? path.replace(/^components\/examples\//, "") : null })
  }
  const changePlatform = (next: Platform) => {
    setChosen(next)
    writeQuery({ platform: next })
  }
  const showCode = Boolean(source && file && view === "code")

  const fallback: Platform = narrow && platforms.includes("ios") ? "ios" : platforms[0]
  const platform = chosen ?? fallback
  const frameless = Boolean(narrow) && platform === "ios"

  const stageRef = React.useRef<HTMLDivElement>(null)
  const size = useSize(stageRef)

  return (
    <div className="ex-page ex-wallpaper" data-narrow={narrow ? "" : undefined}>
      <div className="ex-strip-row">
        <div data-platform="macos" className="ex-strip mb-glass" data-shape="capsule">
          <Link href="/examples" className="ex-strip-back" aria-label="All examples">
            <ChevronLeftIcon aria-hidden="true" />
          </Link>
          <h1 className="ex-strip-title">{title}</h1>
          {source ? (
            <SegmentedControl
              size="sm"
              aria-label="View"
              value={view}
              onValueChange={(value) => value && changeView(value as View)}
            >
              <SegmentedControlItem value="preview">Preview</SegmentedControlItem>
              <SegmentedControlItem value="code">Code</SegmentedControlItem>
            </SegmentedControl>
          ) : null}
          {platforms.length > 1 && !showCode ? (
            <SegmentedControl
              size="sm"
              aria-label="Platform"
              value={platform}
              onValueChange={(value) => value && changePlatform(value as Platform)}
            >
              {platforms.map((name) => (
                <SegmentedControlItem key={name} value={name}>
                  {platformLabels[name]}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          ) : null}
          {/* On a phone the site header already holds the theme and scheme. */}
          {narrow ? null : (
            <>
              <ThemePicker />
              {showCode ? null : <ExampleImageMenu stage={stageRef} platform={platform} />}
              <SchemeButton />
            </>
          )}
          {source && file && (!narrow || showCode) ? (
            <>
              <span className="ex-strip-divider" aria-hidden="true" />
              <CopyCode source={source} file={file} compact={Boolean(narrow)} />
            </>
          ) : null}
        </div>
      </div>
      <div
        ref={stageRef}
        className="ex-stage"
        data-view={showCode ? "code" : undefined}
        data-frameless={frameless && !showCode ? "" : undefined}
      >
        {showCode && source && file ? (
          <CodeView source={source} file={file} onFileChange={changeFile} compact={Boolean(narrow)} />
        ) : narrow === null || !size ? null : (
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
