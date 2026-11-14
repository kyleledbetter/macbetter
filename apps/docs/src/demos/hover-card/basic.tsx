import { HoverCard, HoverCardContent, HoverCardTrigger } from "@dreambase/stardust/hover-card"

export default function Example() {
  return (
    <div style={{ maxWidth: 420, lineHeight: 1.5 }}>
      The release notes are on the{" "}
      <HoverCard>
        <HoverCardTrigger href="https://stardust.dreambase.ai/docs/introduction">Stardust site</HoverCardTrigger>
        <HoverCardContent>
          <div
            aria-hidden="true"
            style={{
              height: 132,
              borderRadius: "inherit",
              borderEndStartRadius: 0,
              borderEndEndRadius: 0,
              background:
                "radial-gradient(120% 120% at 0% 0%, var(--sd-accent), transparent 60%), radial-gradient(120% 120% at 100% 100%, var(--sd-accent-secondary), transparent 60%), var(--sd-bg-secondary)",
            }}
          />
          <div style={{ display: "grid", gap: 2, padding: "10px 14px 12px" }}>
            <strong style={{ font: "var(--sd-text-headline)" }}>Stardust — macOS, iPadOS and iOS for the web</strong>
            <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-callout)" }}>
              stardust.dreambase.ai
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
      , with a page for every component.
    </div>
  )
}
