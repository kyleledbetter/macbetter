import { Artwork } from "macbetter/artwork"

const rooms = [
  { name: "Kitchen", summary: "2 lights on", variant: "window", palette: "amber", time: "day" },
  { name: "Living Room", summary: "70°", variant: "wash", palette: "dusk" },
  { name: "Bedroom", summary: "Window open", variant: "horizon", palette: "night", time: "night" },
  { name: "Garage", summary: "Closed", variant: "window", palette: "slate" },
] as const

export default function Example() {
  return (
    <ul role="list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, width: "min(100%, 560px)", margin: 0, padding: 0, listStyle: "none" }}>
      {rooms.map(({ name, summary, ...art }) => (
        <li key={name} style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
          {/* The room's wallpaper as its thumbnail: same seed and palette, dimmed so the label colors read on it. */}
          <Artwork seed={`Maple Street ${name}`} aspect={4 / 3} shape="square" dim={0.35} {...art} />
          <div style={{ position: "absolute", insetInline: 12, insetBlockEnd: 10, display: "grid" }}>
            <span className="mb-text-headline" style={{ color: "var(--mb-label)" }}>
              {name}
            </span>
            <span className="mb-text-footnote" style={{ color: "var(--mb-label-secondary)" }}>
              {summary}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
