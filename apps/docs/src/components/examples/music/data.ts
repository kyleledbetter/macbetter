type Album = {
  id: string
  title: string
  artist: string
  year: number
  genre: string
  from: string
  to: string
  /** Where the light falls on the cover, so each one reads differently. */
  light: string
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

const covers = [
  { id: "golden-hour-tapes", title: "Golden Hour Tapes", artist: "The Saltmarsh", year: 2026, genre: "Indie", from: "var(--sd-orange)", to: "var(--sd-yellow)", light: "30% 25%" },
  { id: "evergreen", title: "Evergreen", artist: "Mara Quill", year: 2025, genre: "Folk", from: "var(--sd-green)", to: "var(--sd-teal)", light: "70% 30%" },
  { id: "low-tide", title: "Low Tide", artist: "Harbor Lights", year: 2026, genre: "Ambient", from: "var(--sd-blue)", to: "var(--sd-indigo)", light: "50% 80%" },
  { id: "kiln", title: "Kiln", artist: "Oda Brenner", year: 2024, genre: "Electronic", from: "var(--sd-red)", to: "var(--sd-orange)", light: "20% 70%" },
  { id: "night-garden", title: "Night Garden", artist: "Juniper & Ash", year: 2026, genre: "Dream Pop", from: "var(--sd-purple)", to: "var(--sd-pink)", light: "75% 20%" },
  { id: "fieldwork", title: "Fieldwork", artist: "Calloway", year: 2023, genre: "Country", from: "var(--sd-brown)", to: "var(--sd-yellow)", light: "40% 40%" },
  { id: "paper-moons", title: "Paper Moons", artist: "Lio Hart", year: 2025, genre: "Singer-Songwriter", from: "var(--sd-mint)", to: "var(--sd-blue)", light: "65% 65%" },
  { id: "overland", title: "Overland", artist: "Tamsin Vale", year: 2024, genre: "Rock", from: "var(--sd-cyan)", to: "var(--sd-indigo)", light: "25% 35%" },
  { id: "bright-static", title: "Bright Static", artist: "Neon Orchard", year: 2026, genre: "Synthpop", from: "var(--sd-pink)", to: "var(--sd-orange)", light: "80% 75%" },
  { id: "quiet-hours", title: "Quiet Hours", artist: "Elm Street Trio", year: 2022, genre: "Jazz", from: "var(--sd-teal)", to: "var(--sd-green)", light: "50% 30%" },
]

const albums: Album[] = covers.map((cover, i) => ({
  ...cover,
  tracks: titles[i].map((title, t) => ({ title, length: 168 + ((i * 37 + t * 53) % 110) })),
}))

const playlists = ["Late Night Focus", "Sunday Run", "Dinner Party", "Road Trip 2026"]

function time(seconds: number) {
  const s = Math.max(0, Math.round(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

export { albums, playlists, time }
export type { Album }
