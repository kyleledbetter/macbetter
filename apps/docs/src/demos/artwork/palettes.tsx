import { Artwork, artworkPalettes } from "macbetter/artwork"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 16, width: "100%" }}>
      {artworkPalettes.map((palette) => (
        <figure key={palette} style={{ margin: 0 }}>
          <Artwork seed="Palettes" variant="aurora" palette={palette} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 6 }}>
            {palette}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
