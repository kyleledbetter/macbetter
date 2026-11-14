import { Artwork } from "@dreambase/stardust/artwork"

const albums = [
  { title: "Golden Hour Tapes", artist: "The Saltmarsh", variant: "bloom", palette: "sunset" },
  { title: "Low Tide", artist: "Harbor Lights", variant: "strata", palette: "ocean" },
  { title: "Night Garden", artist: "Juniper & Ash", variant: "aurora", palette: "berry" },
] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 180px))", gap: 20 }}>
      {albums.map((album) => (
        <div key={album.title}>
          <Artwork seed={album.title} variant={album.variant} palette={album.palette} />
          <div className="sd-text-subheadline" style={{ marginTop: 8, fontWeight: 500 }}>{album.title}</div>
          <div className="sd-text-subheadline sd-label-secondary">{album.artist}</div>
        </div>
      ))}
    </div>
  )
}
