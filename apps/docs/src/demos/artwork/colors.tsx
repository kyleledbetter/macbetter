import { Artwork } from "macbetter/artwork"

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      <Artwork seed="Brand launch" variant="prism" colors={["#ff6b3d", "#ffc53d", "#ff3d8b", "#7a3dff", "#1a0b2e"]} size={160} />
      <Artwork seed="Brand launch" variant="bloom" colors={["var(--mb-accent)", "var(--mb-accent-secondary)"]} size={160} />
    </div>
  )
}
