"use client"

import { Artwork } from "@dreambase/stardust/artwork"
import { Button } from "@dreambase/stardust/button"
import { DeviceFrame } from "@dreambase/stardust/device-frame"
import { List, ListRow, ListRowAccessory, ListRowSubtitle, ListRowTitle, ListSection } from "@dreambase/stardust/list"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "@dreambase/stardust/navigation-bar"
import { EllipsisIcon, PlayIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

const shows = [
  { id: "field-notes", title: "Field Notes", host: "Inès Moreau", episodes: 48, variant: "topo", palette: "forest" },
  { id: "night-shift", title: "Night Shift", host: "Kofi Mensah", episodes: 112, variant: "orbit", palette: "dusk" },
  { id: "small-batch", title: "Small Batch", host: "Wren Takahashi", episodes: 27, variant: "halftone", palette: "citrus" },
  { id: "the-long-way", title: "The Long Way", host: "Hollis Grant", episodes: 64, variant: "strata", palette: "sunset" },
  { id: "open-water", title: "Open Water", host: "Amara Okafor", episodes: 19, variant: "ribbon", palette: "ocean" },
  { id: "slow-radio", title: "Slow Radio", host: "Theo Lindqvist", episodes: 85, variant: "aurora", palette: "berry" },
  { id: "groundwork", title: "Groundwork", host: "Priya Raman", episodes: 33, variant: "glyph", palette: "ember" },
  { id: "second-draft", title: "Second Draft", host: "Jonah Weiss", episodes: 51, variant: "prism", palette: "glacier" },
  { id: "kitchen-table", title: "Kitchen Table", host: "Lucía Ferrer", episodes: 140, variant: "mosaic", palette: "sunset" },
  { id: "deep-field", title: "Deep Field", host: "Sefa Adjei", episodes: 22, variant: "rays", palette: "ocean" },
] as const

const episodes = [
  "Where the river bends",
  "Notes from the night ferry",
  "A field guide to rain",
  "The last lighthouse keeper",
  "Salt, smoke and cedar",
  "Two weeks above the tree line",
  "What the tide leaves behind",
  "Letters from a fire lookout",
  "The orchard in winter",
  "Following the old rail line",
]

type Show = (typeof shows)[number]

function Cover({ show, size }: { show: Show; size: number }) {
  return (
    <Artwork
      seed={show.id}
      variant={show.variant}
      palette={show.palette}
      shape="app"
      size={size}
      style={{ gridColumn: 1, gridRow: "1 / -1", marginInlineEnd: 14 }}
    />
  )
}

export default function Example() {
  const [open, setOpen] = useState<Show | null>(null)

  return (
    <DeviceFrame scale={0.78}>
      {open ? (
        <NavigationStack key={open.id}>
          <NavigationBar title={open.title}>
            <NavigationBarBackButton onClick={() => setOpen(null)}>Library</NavigationBarBackButton>
            <NavigationBarTrailing>
              <Button variant="plain" shape="circle" aria-label="More">
                <EllipsisIcon aria-hidden="true" />
              </Button>
            </NavigationBarTrailing>
          </NavigationBar>
          <div style={{ display: "grid", justifyItems: "center", gap: 6, padding: "12px 16px 20px", textAlign: "center" }}>
            <Artwork seed={open.id} variant={open.variant} palette={open.palette} size={200} radius={18} style={{ boxShadow: "var(--sd-shadow-3)" }} />
            <div className="sd-text-title-2" style={{ marginTop: 12 }}>{open.title}</div>
            <div className="sd-text-subheadline sd-label-secondary">{open.host} · {open.episodes} episodes</div>
            <Button variant="filled" style={{ marginTop: 10, minWidth: 180 }}>
              <PlayIcon aria-hidden="true" fill="currentColor" />
              Latest Episode
            </Button>
          </div>
          <List variant="plain">
            <ListSection header="Episodes">
              {episodes.map((episode, index) => (
                <ListRow key={episode} onClick={() => {}}>
                  <ListRowTitle>{episode}</ListRowTitle>
                  <ListRowSubtitle>{`${index + 2} days ago · ${32 + index * 7} min`}</ListRowSubtitle>
                </ListRow>
              ))}
            </ListSection>
          </List>
        </NavigationStack>
      ) : (
        <NavigationStack>
          <NavigationBar title="Library" largeTitle>
            <NavigationBarTrailing>
              <Button variant="plain" shape="circle" aria-label="Follow a Show">
                <PlusIcon aria-hidden="true" />
              </Button>
            </NavigationBarTrailing>
          </NavigationBar>
          <List variant="plain">
            <ListSection>
              {shows.map((show) => (
                <ListRow key={show.id} onClick={() => setOpen(show)}>
                  <Cover show={show} size={56} />
                  <ListRowTitle>{show.title}</ListRowTitle>
                  <ListRowSubtitle>{show.host}</ListRowSubtitle>
                  <ListRowAccessory type="disclosure" />
                </ListRow>
              ))}
            </ListSection>
          </List>
        </NavigationStack>
      )}
    </DeviceFrame>
  )
}
