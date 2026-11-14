import { Separator } from "macbetter/separator"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 360 }}>
      <div>
        <div style={{ fontWeight: 600 }}>Hollis Grant</div>
        <div style={{ color: "var(--mb-label-secondary)" }}>hollis@macbetter.dev</div>
      </div>
      <Separator />
      <p style={{ margin: 0 }}>Designs the billing and onboarding flows, and reviews every new pricing page.</p>
    </div>
  )
}
