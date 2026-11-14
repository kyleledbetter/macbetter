import { Squircle, squirclePath } from "macbetter/squircle"

const size = 220
const radius = size * 0.2237

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 32 }}>
      <figure style={{ display: "grid", justifyItems: "center", gap: 10, margin: 0 }}>
        <Squircle size={size} smoothing={0} style={{ background: "var(--mb-fill-secondary)" }} />
        <figcaption className="mb-text-footnote mb-label-secondary">Round</figcaption>
      </figure>
      <figure style={{ display: "grid", justifyItems: "center", gap: 10, margin: 0 }}>
        <Squircle size={size} style={{ background: "var(--mb-fill-secondary)" }} />
        <figcaption className="mb-text-footnote mb-label-secondary">Continuous</figcaption>
      </figure>
      <figure style={{ display: "grid", justifyItems: "center", gap: 10, margin: 0 }}>
        <svg width={size} height={size} viewBox={`-1 -1 ${size + 2} ${size + 2}`} role="img" aria-label="Both outlines, overlaid">
          <rect width={size} height={size} rx={radius} fill="none" stroke="var(--mb-label-secondary)" strokeWidth={1.5} strokeDasharray="4 3" />
          <path d={squirclePath(size, size, radius)} fill="none" stroke="var(--mb-accent)" strokeWidth={1.5} />
        </svg>
        <figcaption className="mb-text-footnote mb-label-secondary">Overlaid: round dashed, continuous solid</figcaption>
      </figure>
    </div>
  )
}
