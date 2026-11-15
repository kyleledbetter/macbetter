import { Artwork, artworkPalettes } from "macbetter/artwork"

// The room and time-of-day palettes are shown with the backgrounds.
const backgroundPalettes = ["dawn", "sky", "night", "amber", "water", "slate"]
const covers = artworkPalettes.filter((palette) => !backgroundPalettes.includes(palette))

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 16, width: "100%" }}>
      {covers.map((palette) => (
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
