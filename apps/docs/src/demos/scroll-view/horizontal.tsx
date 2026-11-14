import { ScrollView } from "@dreambase/stardust/scroll-view"

const albums = [
  { id: "dunes", title: "Dunes", color: "var(--sd-orange)" },
  { id: "forest", title: "Forest", color: "var(--sd-green)" },
  { id: "glacier", title: "Glacier", color: "var(--sd-cyan)" },
  { id: "canyon", title: "Canyon", color: "var(--sd-red)" },
  { id: "meadow", title: "Meadow", color: "var(--sd-mint)" },
  { id: "harbor", title: "Harbor", color: "var(--sd-blue)" },
  { id: "dusk", title: "Dusk", color: "var(--sd-indigo)" },
]

export default function Example() {
  return (
    <ScrollView aria-label="Albums" orientation="horizontal" style={{ width: "100%", maxWidth: 520 }}>
      <div style={{ display: "flex", gap: 12, padding: "4px 0 14px" }}>
        {albums.map((album) => (
          <figure key={album.id} style={{ margin: 0, width: 120 }}>
            <div style={{ height: 120, borderRadius: 12, background: `linear-gradient(160deg, ${album.color}, color-mix(in oklch, ${album.color} 55%, black))` }} />
            <figcaption style={{ marginTop: 6, font: "var(--sd-text-subheadline)" }}>{album.title}</figcaption>
          </figure>
        ))}
      </div>
    </ScrollView>
  )
}
