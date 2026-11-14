import { Artwork } from "@dreambase/stardust/artwork"
import { DeviceFrame } from "@dreambase/stardust/device-frame"
import { List, ListRow, ListRowAccessory, ListRowSubtitle, ListRowTitle, ListSection } from "@dreambase/stardust/list"
import { NavigationBar, NavigationStack } from "@dreambase/stardust/navigation-bar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "@dreambase/stardust/tab-bar"
import { HouseIcon, LayoutGridIcon, LibraryIcon, RadioIcon, SearchIcon } from "lucide-react"

const albums = [
  { title: "Golden Hour Tapes", artist: "The Saltmarsh", variant: "bloom", palette: "sunset" },
  { title: "Evergreen", artist: "Mara Quill", variant: "strata", palette: "forest" },
  { title: "Low Tide", artist: "Harbor Lights", variant: "ribbon", palette: "ocean" },
  { title: "Kiln", artist: "Oda Brenner", variant: "rays", palette: "ember" },
  { title: "Night Garden", artist: "Juniper & Ash", variant: "aurora", palette: "berry" },
  { title: "Fieldwork", artist: "Calloway", variant: "halftone", palette: "citrus" },
  { title: "Paper Moons", artist: "Lio Hart", variant: "orbit", palette: "glacier" },
  { title: "Overland", artist: "Tamsin Vale", variant: "topo", palette: "dusk" },
  { title: "Bright Static", artist: "Neon Orchard", variant: "prism", palette: "sunset" },
  { title: "Quiet Hours", artist: "Elm Street Trio", variant: "glyph", palette: "ocean" },
] as const

const tabs = [
  { value: "home", label: "Home", icon: <HouseIcon /> },
  { value: "new", label: "New", icon: <LayoutGridIcon /> },
  { value: "radio", label: "Radio", icon: <RadioIcon /> },
  { value: "library", label: "Library", icon: <LibraryIcon /> },
  { value: "search", label: "Search", icon: <SearchIcon /> },
]

export default function Example() {
  return (
    <DeviceFrame scale={0.78}>
      <TabBar defaultValue="library">
        {tabs.map((tab) => (
          <TabBarPanel key={tab.value} value={tab.value}>
            <NavigationStack>
              <NavigationBar title={tab.label} largeTitle />
              <List variant="plain">
                <ListSection>
                  {albums.map((album) => (
                    <ListRow key={album.title} href={`#${album.title}`}>
                      <Artwork
                        seed={album.title}
                        variant={album.variant}
                        palette={album.palette}
                        size={52}
                        radius={8}
                        style={{ gridColumn: 1, gridRow: "1 / -1", marginInlineEnd: 14 }}
                      />
                      <ListRowTitle>{album.title}</ListRowTitle>
                      <ListRowSubtitle>{album.artist}</ListRowSubtitle>
                      <ListRowAccessory type="disclosure" />
                    </ListRow>
                  ))}
                </ListSection>
              </List>
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
