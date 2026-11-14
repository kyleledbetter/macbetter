import type { ArtworkFinish, ArtworkPalette, ArtworkVariant } from "@dreambase/stardust/artwork"

type Album = {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  /** The cover is drawn from the album's id in this style and palette. */
  art: { variant: ArtworkVariant; palette: ArtworkPalette; finish?: ArtworkFinish }
  /** Two colors from the cover's palette, for the Now Playing backdrop. */
  from: string
  to: string
  tracks: { title: string; length: number }[]
}

const titles = [
  ["Golden Hour", "Paper Lanterns", "Slow Tide", "Kiln Light", "Postcard From June", "Saltwater"],
  ["Evergreen", "Under the Canopy", "Fern", "Moss and Stone", "Long Way Home"],
  ["Low Tide", "Harbor Lights", "Night Ferry", "Lighthouse Keeper", "Anchor"],
  ["Firing", "Glaze", "Ash Road", "Ember Room", "Cooling"],
  ["Night Garden", "Moonflower", "Lanternfish", "Velvet Hours", "Dusk Bloom", "Afterglow"],
  ["Fieldwork", "Barley", "Hay Bale Waltz", "Tractor Song"],
  ["Paper Moons", "Origami Sky", "Folded Light", "Crane"],
  ["Overland", "Mile Marker", "Rest Stop", "Desert Radio", "Coast to Coast"],
  ["Bright Static", "Neon Rain", "Arcade", "Signal Loss", "Pixel Heart"],
  ["Quiet Hours", "Morning Tea", "Window Seat", "Rain on the Roof"],
]

const covers: Omit<Album, "tracks">[] = [
  { id: "golden-hour-tapes", title: "Golden Hour Tapes", artist: "The Saltmarsh", year: 2026, genre: "Indie", art: { variant: "grain", palette: "sunset" }, from: "var(--sd-orange)", to: "var(--sd-pink)" },
  { id: "evergreen", title: "Evergreen", artist: "Mara Quill", year: 2025, genre: "Folk", art: { variant: "strata", palette: "forest" }, from: "var(--sd-green)", to: "var(--sd-teal)" },
  { id: "low-tide", title: "Low Tide", artist: "Harbor Lights", year: 2026, genre: "Ambient", art: { variant: "ribbon", palette: "ocean" }, from: "var(--sd-blue)", to: "var(--sd-indigo)" },
  { id: "kiln", title: "Kiln", artist: "Oda Brenner", year: 2024, genre: "Electronic", art: { variant: "rays", palette: "ember" }, from: "var(--sd-red)", to: "var(--sd-orange)" },
  { id: "night-garden", title: "Night Garden", artist: "Juniper & Ash", year: 2026, genre: "Dream Pop", art: { variant: "bloom", palette: "berry" }, from: "var(--sd-purple)", to: "var(--sd-pink)" },
  { id: "fieldwork", title: "Fieldwork", artist: "Calloway", year: 2023, genre: "Country", art: { variant: "halftone", palette: "citrus" }, from: "var(--sd-yellow)", to: "var(--sd-green)" },
  { id: "paper-moons", title: "Paper Moons", artist: "Lio Hart", year: 2025, genre: "Singer-Songwriter", art: { variant: "orbit", palette: "glacier" }, from: "var(--sd-cyan)", to: "var(--sd-blue)" },
  { id: "overland", title: "Overland", artist: "Tamsin Vale", year: 2024, genre: "Rock", art: { variant: "topo", palette: "dusk" }, from: "var(--sd-indigo)", to: "var(--sd-orange)" },
  { id: "bright-static", title: "Bright Static", artist: "Neon Orchard", year: 2026, genre: "Synthpop", art: { variant: "prism", palette: "sunset" }, from: "var(--sd-pink)", to: "var(--sd-purple)" },
  { id: "quiet-hours", title: "Quiet Hours", artist: "Elm Street Trio", year: 2022, genre: "Jazz", art: { variant: "glyph", palette: "ocean" }, from: "var(--sd-blue)", to: "var(--sd-teal)" },
]

const albums: Album[] = covers.map((cover, i) => ({
  ...cover,
  tracks: titles[i].map((title, t) => ({ title, length: 168 + ((i * 37 + t * 53) % 110) })),
}))

type Playlist = { name: string; curator: string; art: { variant: ArtworkVariant; palette: ArtworkPalette } }

const playlists: Playlist[] = [
  { name: "Late Night Focus", curator: "Made for You", art: { variant: "aurora", palette: "dusk" } },
  { name: "Sunday Run", curator: "Made for You", art: { variant: "mosaic", palette: "sunset" } },
  { name: "Dinner Party", curator: "Maya Okafor", art: { variant: "bloom", palette: "ember" } },
  { name: "Road Trip 2026", curator: "Theo Brandt", art: { variant: "mosaic", palette: "ocean" } },
]

function time(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export { albums, playlists, time }
export type { Album, Playlist }
