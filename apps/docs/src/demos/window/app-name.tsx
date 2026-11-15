"use client"

import { Avatar, AvatarFallback } from "macbetter/avatar"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { Toolbar, ToolbarButton, ToolbarSearchField, ToolbarSpacer, ToolbarTitle } from "macbetter/toolbar"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitlebar,
} from "macbetter/window"
import { ClockIcon, FolderIcon, NotebookPenIcon, ShareIcon, SquarePenIcon, StarIcon, Trash2Icon } from "lucide-react"
import { useState } from "react"

const folders = [
  { name: "All Notes", icon: NotebookPenIcon, count: 48 },
  { name: "Recent", icon: ClockIcon },
  { name: "Starred", icon: StarIcon, count: 6 },
]

const notebooks = ["Product", "Interviews", "Reading list"]

export default function Example() {
  const [place, setPlace] = useState("Interviews")

  return (
    <Window aria-label="Jot" style={{ maxWidth: 820, height: 440 }}>
      <WindowSidebar>
        <WindowSidebarHeader>
          <WindowAppName
            icon={
              <Avatar shape="app" size="xs" color="yellow">
                <AvatarFallback>
                  <NotebookPenIcon />
                </AvatarFallback>
              </Avatar>
            }
          >
            Jot
          </WindowAppName>
        </WindowSidebarHeader>
        <Sidebar aria-label="Notebooks">
          <SidebarSection title="Library">
            {folders.map(({ name, icon: Icon, count }) => (
              <SidebarItem
                key={name}
                icon={<Icon />}
                badge={count}
                current={place === name}
                onClick={() => setPlace(name)}
              >
                {name}
              </SidebarItem>
            ))}
          </SidebarSection>
          <SidebarSection title="Notebooks" collapsible>
            {notebooks.map((name) => (
              <SidebarItem key={name} icon={<FolderIcon />} current={place === name} onClick={() => setPlace(name)}>
                {name}
              </SidebarItem>
            ))}
            <SidebarItem icon={<Trash2Icon />} current={place === "Trash"} onClick={() => setPlace("Trash")}>
              Trash
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
      </WindowSidebar>
      <WindowTitlebar>
        <Toolbar aria-label="Note">
          <ToolbarTitle subtitle={place}>Call with Ortiz Dental</ToolbarTitle>
          <ToolbarSpacer />
          <ToolbarButton aria-label="New note">
            <SquarePenIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton aria-label="Share">
            <ShareIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search notes" />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody style={{ padding: "20px 28px" }}>
        <p className="mb-text-subheadline mb-label-secondary" style={{ margin: "0 0 12px" }}>
          Tuesday, March 4 at 10:30
        </p>
        <ul className="mb-text-body" style={{ margin: 0, paddingInlineStart: 18, listStyle: "disc", display: "grid", gap: 8 }}>
          <li>Three front-desk staff, one shared iPad at check-in.</li>
          <li>Patients forget the intake form; they want a text reminder the day before.</li>
          <li>Insurance cards are photographed twice. Ask Sam whether the scan can be reused.</li>
          <li>Follow up Friday with pricing for two locations.</li>
        </ul>
      </WindowBody>
    </Window>
  )
}
