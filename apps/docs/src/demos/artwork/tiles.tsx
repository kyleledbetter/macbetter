import { Artwork } from "macbetter/artwork"
import { List, ListRow, ListRowAccessory, ListRowSubtitle, ListRowTitle, ListSection } from "macbetter/list"

const shows = [
  { title: "Field Notes", host: "Inès Moreau", variant: "topo", palette: "forest" },
  { title: "Night Shift", host: "Kofi Mensah", variant: "rays", palette: "dusk" },
  { title: "Small Batch", host: "Wren Takahashi", variant: "halftone", palette: "citrus" },
  { title: "Open Water", host: "Amara Okafor", variant: "mosaic", palette: "glacier" },
] as const

export default function Example() {
  return (
    <List aria-label="Podcasts" style={{ width: 360 }}>
      <ListSection>
        {shows.map((show) => (
          <ListRow key={show.title} href={`#${show.title}`}>
            <Artwork
              seed={show.title}
              variant={show.variant}
              palette={show.palette}
              shape="app"
              size={40}
              style={{ gridColumn: 1, gridRow: "1 / -1", marginInlineEnd: 12 }}
            />
            <ListRowTitle>{show.title}</ListRowTitle>
            <ListRowSubtitle>{show.host}</ListRowSubtitle>
            <ListRowAccessory type="disclosure" />
          </ListRow>
        ))}
      </ListSection>
    </List>
  )
}
