import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { ClockIcon, HeartIcon, ListMusicIcon, Music2Icon } from "lucide-react"

function Library({ selection }: { selection: "accent" | "gray" }) {
  return (
    <Sidebar
      aria-label={selection === "accent" ? "Library, accent selection" : "Library, gray selection"}
      selection={selection}
      style={{ width: 220, borderRadius: 14, boxShadow: "var(--sd-glass-rim), var(--sd-shadow-menu)" }}
    >
      <SidebarSection title="Library">
        <SidebarItem href="#recent" icon={<ClockIcon />}>
          Recently Added
        </SidebarItem>
        <SidebarItem href="#songs" icon={<Music2Icon />} current>
          Songs
        </SidebarItem>
        <SidebarItem href="#favorites" icon={<HeartIcon />} tint="var(--sd-pink)">
          Favorites
        </SidebarItem>
        <SidebarItem href="#playlists" icon={<ListMusicIcon />} badge={8}>
          Playlists
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  )
}

export default function Example() {
  return (
    <>
      <Library selection="accent" />
      <Library selection="gray" />
    </>
  )
}
