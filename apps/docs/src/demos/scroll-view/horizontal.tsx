import { ScrollView } from "macbetter/scroll-view"

const albums = [
  { id: "dunes", title: "Dunes", color: "var(--mb-orange)" },
  { id: "forest", title: "Forest", color: "var(--mb-green)" },
  { id: "glacier", title: "Glacier", color: "var(--mb-cyan)" },
  { id: "canyon", title: "Canyon", color: "var(--mb-red)" },
  { id: "meadow", title: "Meadow", color: "var(--mb-mint)" },
  { id: "harbor", title: "Harbor", color: "var(--mb-blue)" },
  { id: "dusk", title: "Dusk", color: "var(--mb-indigo)" },
]

export default function Example() {
  return (
    <ScrollView aria-label="Albums" orientation="horizontal" style={{ width: "100%", maxWidth: 520 }}>
      <div style={{ display: "flex", gap: 12, padding: "4px 0 14px" }}>
        {albums.map((album) => (
          <figure key={album.id} style={{ margin: 0, width: 120 }}>
            <div style={{ height: 120, borderRadius: 12, background: `linear-gradient(160deg, ${album.color}, color-mix(in oklch, ${album.color} 55%, black))` }} />
            <figcaption style={{ marginTop: 6, font: "var(--mb-text-subheadline)" }}>{album.title}</figcaption>
          </figure>
        ))}
      </div>
    </ScrollView>
  )
}
