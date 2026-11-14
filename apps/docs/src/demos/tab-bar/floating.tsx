import { DeviceFrame } from "@dreambase/stardust/device-frame"
import { List, ListRow, ListRowAccessory, ListRowSubtitle, ListRowTitle, ListSection } from "@dreambase/stardust/list"
import { NavigationBar, NavigationStack } from "@dreambase/stardust/navigation-bar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "@dreambase/stardust/tab-bar"
import { HouseIcon, LayoutGridIcon, LibraryIcon, RadioIcon, SearchIcon } from "lucide-react"

const albums = [
  { title: "Golden Hour Tapes", artist: "The Saltmarsh", from: "var(--sd-orange)", to: "var(--sd-yellow)" },
  { title: "Evergreen", artist: "Mara Quill", from: "var(--sd-green)", to: "var(--sd-teal)" },
  { title: "Low Tide", artist: "Harbor Lights", from: "var(--sd-blue)", to: "var(--sd-indigo)" },
  { title: "Kiln", artist: "Oda Brenner", from: "var(--sd-red)", to: "var(--sd-orange)" },
  { title: "Night Garden", artist: "Juniper & Ash", from: "var(--sd-purple)", to: "var(--sd-pink)" },
  { title: "Fieldwork", artist: "Calloway", from: "var(--sd-brown)", to: "var(--sd-yellow)" },
  { title: "Paper Moons", artist: "Lio Hart", from: "var(--sd-mint)", to: "var(--sd-blue)" },
  { title: "Overland", artist: "Tamsin Vale", from: "var(--sd-cyan)", to: "var(--sd-indigo)" },
  { title: "Bright Static", artist: "Neon Orchard", from: "var(--sd-pink)", to: "var(--sd-orange)" },
  { title: "Quiet Hours", artist: "Elm Street Trio", from: "var(--sd-teal)", to: "var(--sd-green)" },
]

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
                      <span
                        aria-hidden="true"
                        style={{
                          gridColumn: 1,
                          gridRow: "1 / -1",
                          width: 52,
                          height: 52,
                          marginInlineEnd: 14,
                          borderRadius: 8,
                          background: `linear-gradient(140deg, ${album.from}, ${album.to})`,
                        }}
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
