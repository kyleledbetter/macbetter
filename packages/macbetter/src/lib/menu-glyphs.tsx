function CheckGlyph() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.25 6.4 4.9 9.1 9.9 2.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronGlyph({ direction }: { direction: "down" | "right" | "up-down" }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d={
          direction === "down"
            ? "M3 4.6 6 7.6 9 4.6"
            : direction === "right"
              ? "M4.6 3 7.6 6 4.6 9"
              : "M3.6 4.7 6 2.4 8.4 4.7M3.6 7.3 6 9.6 8.4 7.3"
        }
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.6" cy="8.6" r="5.6" stroke="currentColor" strokeWidth="1.9" />
      <path d="m12.9 12.9 4.1 4.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

export { CheckGlyph, ChevronGlyph, SearchGlyph }
