"use client"

import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSearchField,
  ToolbarSpacer,
  ToolbarTitle,
  ToolbarToggle,
  ToolbarToggleGroup,
} from "macbetter/toolbar"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import {
  AppWindowIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  ClockIcon,
  CloudIcon,
  Columns3Icon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  HardDriveIcon,
  ImageIcon,
  LayoutGridIcon,
  ListIcon,
  MonitorIcon,
  PresentationIcon,
  ShareIcon,
  UsersIcon,
} from "lucide-react"
import { useState } from "react"

const favorites = [
  { name: "Recents", icon: ClockIcon },
  { name: "Applications", icon: AppWindowIcon },
  { name: "Desktop", icon: MonitorIcon },
  { name: "Documents", icon: FileTextIcon },
  { name: "Downloads", icon: DownloadIcon, badge: 3 },
]

const tags = [
  { name: "Launch", color: "var(--mb-orange)" },
  { name: "Research", color: "var(--mb-green)" },
  { name: "Finance", color: "var(--mb-blue)" },
]

const files = [
  { name: "Brand", kind: "folder" },
  { name: "Q3 Planning", kind: "folder" },
  { name: "Receipts", kind: "folder" },
  { name: "Launch Deck.key", kind: "deck" },
  { name: "Onboarding.pdf", kind: "doc" },
  { name: "Roadmap.pages", kind: "doc" },
  { name: "Team Offsite.jpg", kind: "image" },
  { name: "Metrics.numbers", kind: "doc" },
]

const fileIcons = { folder: FolderIcon, deck: PresentationIcon, doc: FileTextIcon, image: ImageIcon }

export default function Example() {
  const [place, setPlace] = useState("Documents")
  const [view, setView] = useState<string[]>(["icons"])

  return (
    <Window aria-label="Finder" style={{ maxWidth: 860, height: 480 }}>
      <WindowSidebar>
        <WindowTrafficLights />
        <Sidebar aria-label="Locations">
          <SidebarSection title="Favorites">
            {favorites.map(({ name, icon: Icon, badge }) => (
              <SidebarItem
                key={name}
                icon={<Icon />}
                badge={badge}
                current={place === name}
                onClick={() => setPlace(name)}
              >
                {name}
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection title="iCloud" collapsible>
            <SidebarItem icon={<CloudIcon />} current={place === "iCloud Drive"} onClick={() => setPlace("iCloud Drive")}>
              iCloud Drive
            </SidebarItem>
            <SidebarItem icon={<UsersIcon />} current={place === "Shared"} onClick={() => setPlace("Shared")}>
              Shared
            </SidebarItem>
          </SidebarSection>
          <SidebarSection title="Locations" collapsible>
            <SidebarItem icon={<HardDriveIcon />} current={place === "Macintosh HD"} onClick={() => setPlace("Macintosh HD")}>
              Macintosh HD
            </SidebarItem>
          </SidebarSection>
          <SidebarSection title="Tags" collapsible>
            {tags.map((tag) => (
              <SidebarItem
                key={tag.name}
                tint={tag.color}
                icon={<CircleIcon fill="currentColor" strokeWidth={0} />}
                current={place === tag.name}
                onClick={() => setPlace(tag.name)}
              >
                {tag.name}
              </SidebarItem>
            ))}
          </SidebarSection>
        </Sidebar>
      </WindowSidebar>
      <WindowTitlebar>
        <Toolbar aria-label="Finder">
          <ToolbarGroup aria-label="History">
            <ToolbarButton aria-label="Back">
              <ChevronLeftIcon aria-hidden="true" data-mirror="" />
            </ToolbarButton>
            <ToolbarButton aria-label="Forward" disabled>
              <ChevronRightIcon aria-hidden="true" data-mirror="" />
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarTitle>{place}</ToolbarTitle>
          <ToolbarSpacer />
          <ToolbarToggleGroup aria-label="View" value={view} onValueChange={(next) => next.length && setView(next)}>
            <ToolbarToggle value="icons" aria-label="Icons">
              <LayoutGridIcon aria-hidden="true" />
            </ToolbarToggle>
            <ToolbarToggle value="list" aria-label="List">
              <ListIcon aria-hidden="true" />
            </ToolbarToggle>
            <ToolbarToggle value="columns" aria-label="Columns">
              <Columns3Icon aria-hidden="true" />
            </ToolbarToggle>
          </ToolbarToggleGroup>
          <ToolbarButton aria-label="Share">
            <ShareIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search" />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
            gap: "18px 8px",
            padding: 20,
          }}
        >
          {files.map((file) => {
            const Icon = fileIcons[file.kind as keyof typeof fileIcons]
            const folder = file.kind === "folder"
            return (
              <div key={file.name} style={{ display: "grid", justifyItems: "center", gap: 6, textAlign: "center" }}>
                <Icon
                  aria-hidden="true"
                  width={56}
                  height={56}
                  strokeWidth={1.1}
                  fill={folder ? "color-mix(in oklch, var(--mb-cyan) 55%, transparent)" : "var(--mb-bg-elevated)"}
                  color={folder ? "var(--mb-cyan)" : "var(--mb-label-secondary)"}
                />
                <span className="mb-text-callout">{file.name}</span>
              </div>
            )
          })}
        </div>
      </WindowBody>
    </Window>
  )
}
