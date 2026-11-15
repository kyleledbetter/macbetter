import { Artwork } from "macbetter/artwork"

function Screen({ dim }: { dim: number }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
      <Artwork seed="Living Room" variant="wash" palette="dusk" aspect={4 / 3} shape="square" dim={dim} />
      <div style={{ position: "absolute", inset: 0, padding: 18, display: "grid", alignContent: "start", gap: 2 }}>
        <span className="mb-text-title-2" style={{ fontWeight: 700, color: "var(--mb-label)" }}>
          Living Room
        </span>
        <span className="mb-text-subheadline" style={{ color: "var(--mb-label-secondary)" }}>
          {dim ? `dim={${dim}}` : "No dim"} · 1 light on · 70°
        </span>
      </div>
    </div>
  )
}

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, width: "min(100%, 560px)" }}>
      <Screen dim={0} />
      <Screen dim={0.35} />
    </div>
  )
}
