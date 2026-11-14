import { Artwork, type ArtworkVariant } from "macbetter/artwork"
import { DeviceFrame } from "macbetter/device-frame"
import { NavigationBar, NavigationStack } from "macbetter/navigation-bar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "macbetter/tab-bar"
import { HouseIcon, LayoutGridIcon, LibraryIcon, RadioIcon, SearchIcon } from "lucide-react"

const tabs = [
  { value: "home", label: "Home", icon: <HouseIcon /> },
  { value: "new", label: "New", icon: <LayoutGridIcon /> },
  { value: "radio", label: "Radio", icon: <RadioIcon /> },
  { value: "library", label: "Library", icon: <LibraryIcon /> },
  { value: "search", label: "Search", icon: <SearchIcon /> },
]

const palettes = ["sunset", "citrus", "forest", "glacier", "ocean", "dusk", "berry", "ember", "candy", "sunset"] as const

const shelfStyles: ArtworkVariant[] = ["aurora", "mosaic", "bloom"]

const shelves = ["Top Picks for You", "Recently Played", "Made for You"]

const stations = [
  "Morning Coffee",
  "Deep Focus",
  "Late Night Jazz",
  "Road Trip",
  "Rainy Day",
  "Indie Mix",
  "Workout Hits",
  "Sunday Soul",
  "Chill Electronic",
  "Acoustic Covers",
]

export default function Example() {
  return (
    <DeviceFrame device="ipad" scale={0.56}>
      <TabBar defaultValue="home">
        {tabs.map((tab) => (
          <TabBarPanel key={tab.value} value={tab.value}>
            <NavigationStack>
              <NavigationBar title={tab.label} largeTitle />
              {shelves.map((shelf, shelfIndex) => (
                <section key={shelf} style={{ padding: "4px 20px 24px" }}>
                  <h2 className="mb-text-title-3" style={{ margin: "0 0 12px" }}>{shelf}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
                    {palettes.map((palette, index) => {
                      const station = stations[(index + shelfIndex * 3) % stations.length]
                      return (
                        <div key={station}>
                          <Artwork seed={station} variant={shelfStyles[shelfIndex]} palette={palette} radius={12} />
                          <div className="mb-text-subheadline" style={{ marginTop: 8 }}>
                            {station}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              ))}
            </NavigationStack>
          </TabBarPanel>
        ))}
        <TabBarList aria-label="Music">
          {tabs.map((tab) => (
            <TabBarItem key={tab.value} value={tab.value} icon={tab.icon}>
              {tab.label}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </DeviceFrame>
  )
}
