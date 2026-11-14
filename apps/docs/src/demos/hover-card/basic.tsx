import { HoverCard, HoverCardContent, HoverCardTrigger } from "macbetter/hover-card"

export default function Example() {
  return (
    <div style={{ maxWidth: 420, lineHeight: 1.5 }}>
      The release notes are on the{" "}
      <HoverCard>
        <HoverCardTrigger href="https://macbetter.dev/docs/introduction">Macbetter site</HoverCardTrigger>
        <HoverCardContent>
          <div
            aria-hidden="true"
            style={{
              height: 132,
              borderRadius: "inherit",
              borderEndStartRadius: 0,
              borderEndEndRadius: 0,
              background:
                "radial-gradient(120% 120% at 0% 0%, var(--mb-accent), transparent 60%), radial-gradient(120% 120% at 100% 100%, var(--mb-accent-secondary), transparent 60%), var(--mb-bg-secondary)",
            }}
          />
          <div style={{ display: "grid", gap: 2, padding: "10px 14px 12px" }}>
            <strong style={{ font: "var(--mb-text-headline)" }}>Macbetter — macOS, iPadOS and iOS for the web</strong>
            <span style={{ color: "var(--mb-label-secondary)", font: "var(--mb-text-callout)" }}>
              macbetter.dev
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
      , with a page for every component.
    </div>
  )
}
