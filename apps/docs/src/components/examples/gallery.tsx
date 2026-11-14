"use client"

import { ArrowUpRightIcon, CodeXmlIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { AnalyticsApp } from "./analytics/analytics"
import { MailApp } from "./mail/mail"
import { MusicApp } from "./music/music"
import { SettingsApp } from "./settings/settings"
import { StagePreview } from "./shell"

const examples = [
  {
    slug: "settings",
    title: "Settings",
    description:
      "System Settings on the Mac and the Settings app on iPhone and iPad: searchable panes, switches, pop-up buttons, sliders, and an accent color that re-tints the app.",
    platforms: ["macOS", "iPadOS", "iOS"],
    App: SettingsApp,
    mac: { width: 860, height: 640 },
  },
  {
    slug: "mail",
    title: "Mail",
    description:
      "Three columns on the Mac and iPad with unread badges, context menus, a reply sheet and a ⌘K command palette. On iPhone, a push-navigation inbox with a floating toolbar.",
    platforms: ["macOS", "iPadOS", "iOS"],
    App: MailApp,
    mac: { width: 1200, height: 760 },
  },
  {
    slug: "analytics",
    title: "Analytics",
    description:
      "A Macbetter dashboard for Supabase data: KPI cards, charts with accessible tables, a sortable dataset table, plan usage gauges and a confirm-before-delete alert.",
    platforms: ["macOS", "iOS"],
    App: AnalyticsApp,
    mac: { width: 1240, height: 780 },
  },
  {
    slug: "music",
    title: "Music",
    description:
      "An album grid with a glass transport bar on the Mac, and on iPhone a library with a mini player above the floating tab bar that opens a full-screen Now Playing sheet.",
    platforms: ["macOS", "iOS"],
    App: MusicApp,
    mac: { width: 1160, height: 740 },
  },
]

function useWidth() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

function Preview({ example }: { example: (typeof examples)[number] }) {
  const [ref, width] = useWidth()
  const { App, mac } = example
  const macScale = width ? Math.min((width - 64) / mac.width, 300 / mac.height) : 0
  const phoneScale = macScale * 1.25
  return (
    <div ref={ref} className="ex-card-preview ex-wallpaper">
      {width ? (
        <>
          <StagePreview
            platform="macos"
            width={mac.width}
            height={mac.height}
            scale={macScale}
            className="ex-card-mac"
          >
            <App />
          </StagePreview>
          <StagePreview platform="ios" width={397} height={842} scale={phoneScale} className="ex-card-phone">
            <App />
          </StagePreview>
        </>
      ) : null}
    </div>
  )
}

function ExamplesGallery() {
  return (
    <div className="ex-index">
      <div className="ex-index-inner">
        <h1 className="ex-index-title">Examples</h1>
        <p className="ex-index-lead">
          Full app screens built only from Macbetter components. Each one runs live, keeps its own state, and switches
          between the Mac, iPad and iPhone idioms.
        </p>
        <div className="ex-index-grid">
          {examples.map((example) => (
            <article key={example.slug} className="ex-card">
              <Preview example={example} />
              <div className="ex-card-body">
                <h2 className="ex-card-title">
                  <Link href={`/examples/${example.slug}`} className="ex-card-link">
                    {example.title}
                  </Link>
                  <span className="ex-card-platforms" aria-label={`Runs on ${example.platforms.join(", ")}`}>
                    {example.platforms.map((platform) => (
                      <span key={platform} aria-hidden="true">
                        {platform}
                      </span>
                    ))}
                  </span>
                </h2>
                <p className="ex-card-description">{example.description}</p>
                <div className="ex-card-actions" data-platform="macos">
                  <Link
                    href={`/examples/${example.slug}`}
                    className="mb-button"
                    data-variant="filled"
                    data-tone="accent"
                    data-size="md"
                    data-shape="auto"
                    aria-label={`Open the ${example.title} example`}
                  >
                    Open
                    <ArrowUpRightIcon aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/examples/${example.slug}?view=code`}
                    className="mb-button"
                    data-variant="bezeled"
                    data-tone="neutral"
                    data-size="md"
                    data-shape="auto"
                    aria-label={`View the ${example.title} example’s code`}
                  >
                    <CodeXmlIcon aria-hidden="true" />
                    View code
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ExamplesGallery }
