"use client"

import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import {
  HoverCard as HoverCardPrimitive,
  HoverCardTrigger as HoverCardTriggerPrimitive,
} from "@ui-sdk/react/hover-card"
import * as React from "react"
import { DisclosureChevron } from "../lib/agent-glyphs"
import { cx, join } from "../lib/cx"
import { HoverCardContent } from "./hover-card"

const tints = ["blue", "green", "orange", "pink", "purple", "teal", "indigo", "red", "cyan", "brown"] as const

function tintFor(text: string) {
  let hash = 0
  for (let index = 0; index < text.length; index++) hash = (hash * 31 + text.charCodeAt(index)) >>> 0
  return tints[hash % tints.length]
}

const ListContext = React.createContext(false)

/** A collapsible "Used 4 sources" line that opens to the list of sources. */
function Sources({ className, ...props }: React.ComponentProps<typeof Collapsible>) {
  return <Collapsible className={cx("mb-sources", className)} {...props} />
}

type SourcesTriggerProps = Omit<React.ComponentProps<typeof CollapsibleTrigger>, "children"> & {
  /** How many sources, for the default label "Used 4 sources". */
  count?: number
  children?: React.ReactNode
}

function SourcesTrigger({ count, className, children, ...props }: SourcesTriggerProps) {
  const label = children ?? (count === undefined ? "Sources" : `Used ${count} ${count === 1 ? "source" : "sources"}`)
  return (
    <CollapsibleTrigger className={cx("mb-sources-trigger", className)} {...props}>
      <span className="mb-sources-label">{label}</span>
      <DisclosureChevron className="mb-sources-chevron" />
    </CollapsibleTrigger>
  )
}

function SourcesContent({
  className,
  children,
  "aria-label": label = "Sources",
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePanel>, "children"> & { children?: React.ReactNode }) {
  return (
    <CollapsiblePanel className={cx("mb-sources-panel", className)} {...props}>
      <ListContext.Provider value={true}>
        {/* Safari drops the list role from a list styled without markers unless it's restated. */}
        <ul role="list" aria-label={label} className="mb-sources-list">
          {children}
        </ul>
      </ListContext.Provider>
    </CollapsiblePanel>
  )
}

type SourceIconProps = React.ComponentProps<"span"> & {
  /** The site's name. Its first letter is drawn in a tinted squircle unless you pass children. */
  site?: string
}

/** A favicon-sized slot. Without children it draws the site's first letter on a tinted tile. */
function SourceIcon({ site = "", className, style, children, ...props }: SourceIconProps) {
  const letter = site.replace(/^(https?:\/\/)?(www\.)?/, "").charAt(0).toUpperCase()
  return (
    <span
      aria-hidden="true"
      data-letter={children ? undefined : ""}
      className={join("mb-source-icon", className)}
      style={children ? style : ({ "--mb-source-tint": `var(--mb-${tintFor(site)})`, ...style } as React.CSSProperties)}
      {...props}
    >
      {children ?? letter}
    </span>
  )
}

type SourceProps = Omit<React.ComponentProps<"a">, "title"> & {
  href: string
  /** The site's name, like "example.com". */
  site: string
  /** Your own favicon in place of the drawn letter. */
  icon?: React.ReactNode
}

/** One source: a link, opening in a new tab, with its favicon, title (children) and site. */
function Source({ href, site, icon, className, children, target = "_blank", rel = "noreferrer", ...props }: SourceProps) {
  const inList = React.useContext(ListContext)
  const link = (
    <a href={href} target={target} rel={rel} className={join("mb-source", className)} {...props}>
      <SourceIcon site={site}>{icon}</SourceIcon>
      <span className="mb-source-title">{children}</span>
      <span className="mb-source-site">{site}</span>
      {target === "_blank" ? <span className="mb-visually-hidden"> (opens in a new tab)</span> : null}
    </a>
  )
  return inList ? <li className="mb-sources-item">{link}</li> : link
}

type CitationProps = Omit<React.ComponentProps<typeof HoverCardTriggerPrimitive>, "title" | "children"> & {
  href: string
  /** The source's title, shown in the preview and read after the chip's label. */
  title: string
  /** The site's name, like "example.com". It's the chip's label unless you pass children. */
  site: string
  /** A line about the source, shown in the preview. */
  description?: React.ReactNode
  /** Your own favicon in place of the drawn letter. */
  icon?: React.ReactNode
  /** The chip's label: a number, or a short name. */
  children?: React.ReactNode
  /** Props for the ui-sdk Hover Card root, like `delay`. */
  hoverCardProps?: Omit<React.ComponentProps<typeof HoverCardPrimitive>, "children">
}

/**
 * An inline citation: a small capsule in the reply's text that's a link to the source. Pausing
 * on it, or focusing it, previews the source in a hover card.
 */
function Citation({
  href,
  title,
  site,
  description,
  icon,
  className,
  children,
  hoverCardProps,
  target = "_blank",
  rel = "noreferrer",
  ...props
}: CitationProps) {
  return (
    <HoverCardPrimitive {...hoverCardProps}>
      <HoverCardTriggerPrimitive
        href={href}
        target={target}
        rel={rel}
        className={cx("mb-citation", className)}
        {...props}
      >
        <span className="mb-citation-label">{children ?? site}</span>
        <span className="mb-visually-hidden">, {title}</span>
      </HoverCardTriggerPrimitive>
      {/* A span, so the card is valid inside the paragraph the citation sits in. */}
      <HoverCardContent render={<span />} className="mb-citation-card">
        <span className="mb-citation-card-site">
          <SourceIcon site={site}>{icon}</SourceIcon>
          <span>{site}</span>
        </span>
        <span className="mb-citation-card-title">{title}</span>
        {description != null ? <span className="mb-citation-card-description">{description}</span> : null}
      </HoverCardContent>
    </HoverCardPrimitive>
  )
}

export { Citation, Source, SourceIcon, Sources, SourcesContent, SourcesTrigger }
export type { CitationProps, SourceIconProps, SourceProps, SourcesTriggerProps }
