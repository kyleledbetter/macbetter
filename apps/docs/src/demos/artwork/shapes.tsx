import { Artwork } from "macbetter/artwork"

const shapes = ["square", "rounded", "circle", "app"] as const

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
      {shapes.map((shape) => (
        <figure key={shape} style={{ margin: 0, textAlign: "center" }}>
          <Artwork seed="Shapes" variant="orbit" palette="ocean" shape={shape} size={112} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 8 }}>
            {shape}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
