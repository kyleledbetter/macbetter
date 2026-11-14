import type * as React from "react"

type GlyphProps = React.ComponentProps<"svg">

const base = {
  "aria-hidden": true,
  focusable: false,
  viewBox: "0 0 16 16",
  fill: "none",
} as const

/** SF Symbols' magnifyingglass. */
function MagnifierGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6.75" cy="6.75" r="4.75" stroke="currentColor" strokeWidth="1.6" />
      <path d="m10.3 10.3 3.7 3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/** xmark.circle.fill, with the cross cut out so the field shows through. */
function ClearGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM9.59 5.35l1.06 1.06L9.06 8l1.59 1.59-1.06 1.06L8 9.06l-1.59 1.59-1.06-1.06L6.94 8 5.35 6.41l1.06-1.06L8 6.94Z"
      />
    </svg>
  )
}

function EyeGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M1.5 8S4 3.25 8 3.25 14.5 8 14.5 8 12 12.75 8 12.75 1.5 8 1.5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="2.25" fill="currentColor" />
    </svg>
  )
}

function EyeSlashGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M4.1 4.6C2.4 5.8 1.5 8 1.5 8S4 12.75 8 12.75c1.2 0 2.3-.4 3.2-1M6.4 3.45c.5-.13 1.05-.2 1.6-.2 4 0 6.5 4.75 6.5 4.75s-.55 1.05-1.6 2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.45 6.5a2.25 2.25 0 0 0 3.05 3.05" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m2.5 1.75 11 12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function CalendarGlyph(props: GlyphProps) {
  return (
    <svg {...base} {...props}>
      <rect x="1.75" y="2.75" width="12.5" height="11.5" rx="2.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.75 6h12.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1.25v2.5M11 1.25v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="5" cy="8.75" r=".85" fill="currentColor" />
      <circle cx="8" cy="8.75" r=".85" fill="currentColor" />
      <circle cx="11" cy="8.75" r=".85" fill="currentColor" />
      <circle cx="5" cy="11.5" r=".85" fill="currentColor" />
      <circle cx="8" cy="11.5" r=".85" fill="currentColor" />
    </svg>
  )
}

function ChevronGlyph({ direction, ...props }: GlyphProps & { direction: "left" | "right" }) {
  return (
    <svg {...base} {...props}>
      <path
        d={direction === "left" ? "M10 2.75 4.75 8 10 13.25" : "M6 2.75 11.25 8 6 13.25"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { CalendarGlyph, ChevronGlyph, ClearGlyph, EyeGlyph, EyeSlashGlyph, MagnifierGlyph }
