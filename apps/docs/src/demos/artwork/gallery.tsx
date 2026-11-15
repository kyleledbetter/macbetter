import { Artwork, artworkBackgrounds, artworkVariants } from "macbetter/artwork"

const covers = artworkVariants.filter((variant) => !(artworkBackgrounds as readonly string[]).includes(variant))
const palettes = ["sunset", "ocean", "berry", "forest", "dusk", "citrus", "glacier", "ember", "candy", "sunset", "ocean", "berry"] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 20, width: "100%" }}>
      {covers.map((variant, index) => (
        <figure key={variant} style={{ margin: 0 }}>
          <Artwork seed="macbetter" variant={variant} palette={palettes[index]} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 8 }}>
            {variant}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
