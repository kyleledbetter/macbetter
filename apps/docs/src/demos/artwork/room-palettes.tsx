import { Artwork } from "macbetter/artwork"

const rooms = [
  { room: "Entry", palette: "dawn" },
  { room: "Office", palette: "sky" },
  { room: "Bedroom", palette: "night" },
  { room: "Kitchen", palette: "amber" },
  { room: "Bathroom", palette: "water" },
  { room: "Garage", palette: "slate" },
  { room: "Living Room", palette: "dusk" },
  { room: "Backyard", palette: "forest" },
] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16, width: "100%" }}>
      {rooms.map(({ room, palette }) => (
        <figure key={room} style={{ margin: 0 }}>
          <Artwork seed={room} variant="wash" palette={palette} aspect={4 / 3} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 6 }}>
            {room} · <code>{palette}</code>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
