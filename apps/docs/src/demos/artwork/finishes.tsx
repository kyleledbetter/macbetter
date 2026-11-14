import { Artwork } from "@dreambase/stardust/artwork"

const finishes = ["flat", "gloss", "grain"] as const

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {finishes.map((finish) => (
        <figure key={finish} style={{ margin: 0 }}>
          <Artwork seed="Finish" variant="glyph" palette="sunset" finish={finish} size={160} />
          <figcaption className="sd-text-subheadline" style={{ marginTop: 8 }}>
            {finish}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
