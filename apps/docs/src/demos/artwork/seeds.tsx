import { Artwork } from "@dreambase/stardust/artwork"

const playlists = ["Morning Coffee", "Deep Focus", "Late Night Jazz", "Road Trip", "Rainy Day", "Sunday Soul"]

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16, width: "100%" }}>
      {playlists.map((name) => (
        <figure key={name} style={{ margin: 0 }}>
          <Artwork seed={name} variant="ribbon" palette="dusk" />
          <figcaption className="sd-text-subheadline" style={{ marginTop: 6 }}>
            {name}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
