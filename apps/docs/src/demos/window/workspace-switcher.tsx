"use client"

import { Avatar } from "macbetter/avatar"
import { Badge } from "macbetter/badge"
import { Button } from "macbetter/button"
import { List, ListRow, ListRowSubtitle, ListRowTitle, ListRowValue, ListSection } from "macbetter/list"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
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
import {
  FilterIcon,
  InboxIcon,
  LayersIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  SquarePenIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"

const workspaces = [
  { id: "northwind", name: "Northwind", color: "indigo" },
  { id: "acme", name: "Acme Studio", color: "orange" },
  { id: "personal", name: "Personal", color: "green" },
] as const

const issues = [
  { id: "NW-412", title: "Invoice PDF cuts off long company names", team: "Web", status: "In progress" },
  { id: "NW-409", title: "Push notifications arrive twice on iPad", team: "Mobile", status: "Todo" },
  { id: "NW-398", title: "Rotate the staging database password", team: "Platform", status: "In review" },
  { id: "NW-385", title: "Empty state for the new reports page", team: "Web", status: "Todo" },
]

const statusColors = { Todo: "gray", "In progress": "blue", "In review": "purple" } as const

export default function Example() {
  const [workspace, setWorkspace] = useState<string>("northwind")
  const [place, setPlace] = useState("My issues")
  const current = workspaces.find((w) => w.id === workspace) ?? workspaces[0]

  return (
    <Window aria-label={`Tracker, ${current.name}`} style={{ maxWidth: 860, height: 460 }}>
      <WindowSidebar>
        <WindowSidebarHeader>
          <Menu>
            <MenuTrigger variant="plain" tone="neutral" aria-label={`Workspace: ${current.name}`}>
              <WindowAppName icon={<Avatar shape="app" size="xs" name={current.name} color={current.color} />}>
                {current.name}
              </WindowAppName>
            </MenuTrigger>
            <MenuContent align="start">
              <MenuRadioGroup value={workspace} onValueChange={(value) => setWorkspace(value as string)}>
                <MenuGroupLabel>Workspaces</MenuGroupLabel>
                {workspaces.map((w) => (
                  <MenuRadioItem key={w.id} value={w.id} closeOnSelect>
                    {w.name}
                  </MenuRadioItem>
                ))}
              </MenuRadioGroup>
              <MenuSeparator />
              <MenuItem value="create">
                <MenuItemIcon>
                  <PlusIcon />
                </MenuItemIcon>
                Create Workspace…
              </MenuItem>
              <MenuItem value="settings" shortcut="mod+,">
                <MenuItemIcon>
                  <SettingsIcon />
                </MenuItemIcon>
                Workspace Settings
              </MenuItem>
              <MenuSeparator />
              <MenuItem value="sign-out">
                <MenuItemIcon>
                  <LogOutIcon />
                </MenuItemIcon>
                Sign Out
              </MenuItem>
            </MenuContent>
          </Menu>
          <Button variant="plain" tone="neutral" size="sm" aria-label="New issue">
            <SquarePenIcon aria-hidden="true" />
          </Button>
        </WindowSidebarHeader>
        <Sidebar aria-label={current.name}>
          <SidebarSection>
            <SidebarItem icon={<InboxIcon />} badge={3} current={place === "Inbox"} onClick={() => setPlace("Inbox")}>
              Inbox
            </SidebarItem>
            <SidebarItem icon={<UserIcon />} current={place === "My issues"} onClick={() => setPlace("My issues")}>
              My issues
            </SidebarItem>
          </SidebarSection>
          <SidebarSection title="Teams" collapsible>
            {["Web", "Mobile", "Platform"].map((team) => (
              <SidebarItem key={team} icon={<LayersIcon />} current={place === team} onClick={() => setPlace(team)}>
                {team}
              </SidebarItem>
            ))}
          </SidebarSection>
        </Sidebar>
      </WindowSidebar>
      <WindowTitlebar>
        <Toolbar aria-label="Issues">
          <ToolbarTitle subtitle={`${issues.length} open`}>{place}</ToolbarTitle>
          <ToolbarSpacer />
          <ToolbarButton aria-label="Filter">
            <FilterIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search issues" />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody>
        <List variant="plain">
          <ListSection>
            {issues.map((issue) => (
              <ListRow key={issue.id} onClick={() => {}}>
                <ListRowTitle>{issue.title}</ListRowTitle>
                <ListRowSubtitle>
                  {issue.id} · {issue.team}
                </ListRowSubtitle>
                <ListRowValue>
                  <Badge color={statusColors[issue.status as keyof typeof statusColors]}>{issue.status}</Badge>
                </ListRowValue>
              </ListRow>
            ))}
          </ListSection>
        </List>
      </WindowBody>
    </Window>
  )
}
