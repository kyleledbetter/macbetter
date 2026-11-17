import type * as React from "react"

type GlyphProps = React.ComponentProps<"svg">

/** A small chevron that points to the inline end; the stylesheet turns it down when open. */
function DisclosureChevron(props: GlyphProps) {
  return (
    <svg viewBox="0 0 8 14" aria-hidden="true" focusable="false" {...props}>
      <path d="M1.75 1.75 6.25 7l-4.5 5.25" />
    </svg>
  )
}

function CheckGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...props}>
      <path d="m4 8.4 2.7 2.7L12 5.4" />
    </svg>
  )
}

function CrossGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...props}>
      <path d="m5 5 6 6m0-6-6 6" />
    </svg>
  )
}

function DashGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...props}>
      <path d="M5 8h6" />
    </svg>
  )
}

/** An exclamation mark; the stylesheet draws the filled circle behind it. */
function AlertGlyph(props: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" {...props}>
      <circle cx="8" cy="8" r="7" data-fill="" />
      <path d="M8 4.6v4.1" />
      <circle cx="8" cy="11.3" r="0.55" data-dot="" />
    </svg>
  )
}

export { AlertGlyph, CheckGlyph, CrossGlyph, DashGlyph, DisclosureChevron }
