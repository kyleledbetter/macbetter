import { Rating } from "macbetter/rating"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Rating size="sm" aria-label="Rate this song" defaultValue={3} />
      <Rating size="md" aria-label="Rate this album" defaultValue={3} />
      <Rating size="lg" aria-label="Rate this app" defaultValue={3} />
    </div>
  )
}
