import { Artwork } from "macbetter/artwork"

const backgrounds = [
  { variant: "wash", palette: "dawn", label: "wash", seed: "Maple Street" },
  { variant: "horizon", palette: "water", time: "dusk", label: "horizon", seed: "Lake House" },
  { variant: "window", palette: "amber", time: "day", label: "window", seed: "Kitchen" },
  { variant: "lens", palette: "slate", label: "lens", seed: "Driveway" },
] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 20, width: "100%" }}>
      {backgrounds.map(({ label, ...art }) => (
        <figure key={label} style={{ margin: 0 }}>
          <Artwork aspect={16 / 10} {...art} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 8 }}>
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
