import { Artwork, artworkTimes } from "macbetter/artwork"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16, width: "100%" }}>
      {artworkTimes.map((time) => (
        <figure key={time} style={{ margin: 0 }}>
          <Artwork seed="Front Garden" variant="horizon" time={time} aspect={4 / 3} />
          <figcaption className="mb-text-subheadline" style={{ marginTop: 6 }}>
            {time}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
