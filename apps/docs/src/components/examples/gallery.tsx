"use client"

import Link from "next/link"
import * as React from "react"
import { SiteFooter } from "@/components/site-footer"
import { AnalyticsApp } from "./analytics/analytics"
import { AssistantApp } from "./assistant/assistant"
import { HomeApp } from "./home/home"
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
      "Four dashboards, one per chart family: a Stocks watchlist with price and candlestick charts, a Health summary, Fitness rings and workouts, and a business report with a sortable table.",
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
  {
    slug: "home",
    title: "Home",
    description:
      "A house whose kitchen has one of everything, down to a leak sensor under the sink: accessory tiles, scenes, cameras, a control sheet for each kind of accessory, automations and adding an accessory.",
    platforms: ["macOS", "iOS"],
    App: HomeApp,
    mac: { width: 1160, height: 760 },
  },
  {
    slug: "assistant",
    title: "AI Assistant",
    description:
      "A chat app with history, projects and a new chat screen, a conversation that streams a scripted reply with reasoning, tool calls, sources and generated images, an inspector, and plugin and skill directories.",
    platforms: ["macOS", "iOS"],
    App: AssistantApp,
    mac: { width: 1160, height: 760 },
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
  // Room on either side of the screens, which grows with the card.
  const pad = Math.round(Math.min(56, Math.max(32, width * 0.075)))
  const macScale = width ? Math.min((width - pad * 2) / mac.width, 300 / mac.height) : 0
  const phoneScale = macScale * 1.25
  return (
    <div ref={ref} className="ex-card-preview ex-wallpaper" style={{ "--ex-card-pad": `${pad}px` } as React.CSSProperties}>
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
        <header className="stack ex-index-header">
          <p className="stack-eyebrow docs-eyebrow">Examples</p>
          <h1 className="stack-headline type-headline">
            Better examples for better&nbsp;apps.
          </h1>
          <p className="stack-copy type-intro type-two-tone">
            Settings, Mail, Analytics, Music, Home and AI Assistant, built only from macbetter components.{" "}
            <strong>Each one runs live, keeps its own state, and changes idiom with the&nbsp;platform.</strong>
          </p>
        </header>
        <div className="ex-index-grid">
          {examples.map((example) => (
            <article key={example.slug} className="ex-card">
              <Preview example={example} />
              <div className="ex-card-body">
                <p className="ex-card-platforms">
                  {example.platforms.join(" · ")}
                </p>
                <h2 className="ex-gallery-title type-card">
                  <Link href={`/examples/${example.slug}`} className="ex-card-link">
                    {example.title}
                  </Link>
                </h2>
                <p className="ex-card-description">{example.description}</p>
                <div className="ex-card-actions" data-platform="macos">
                  <Link
                    href={`/examples/${example.slug}`}
                    className="mb-button pill"
                    data-variant="filled"
                    data-tone="accent"
                    data-size="md"
                    data-shape="capsule"
                    aria-label={`Open the ${example.title} example`}
                  >
                    Open
                  </Link>
                  <Link
                    href={`/examples/${example.slug}?view=code`}
                    className="mb-button pill"
                    data-variant="plain"
                    data-tone="accent"
                    data-size="md"
                    data-shape="capsule"
                    data-pill-style="outline"
                    aria-label={`View the ${example.title} example’s code`}
                  >
                    View code
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <SiteFooter path={["Examples"]} />
    </div>
  )
}

export { ExamplesGallery }
