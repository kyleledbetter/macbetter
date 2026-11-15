"use client"

import { Avatar, AvatarFallback } from "macbetter/avatar"
import { Card } from "macbetter/card"
import {
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
import { Progress } from "macbetter/progress"
import { Toolbar, ToolbarButton, ToolbarSearchField } from "macbetter/toolbar"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowTitle,
  WindowTitlebar,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
} from "macbetter/window"
import { AnchorIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

const sections = [
  { id: "dashboard", label: "Dashboard", detail: "This week" },
  { id: "projects", label: "Projects", detail: "4 active" },
  { id: "reports", label: "Reports", detail: "Updated hourly" },
]

const projects = [
  { name: "Riverside clinic website", client: "Ortiz Dental", done: 72 },
  { name: "Spring catalog", client: "Fern & Field", done: 40 },
  { name: "Booking app, phase 2", client: "Lakeview Gym", done: 15 },
  { name: "Brand refresh", client: "Copperline Coffee", done: 90 },
]

export default function Example() {
  const [section, setSection] = useState("projects")
  const current =
    section === "settings"
      ? { label: "Settings", detail: "Harbor Studio" }
      : (sections.find((s) => s.id === section) ?? sections[1])

  return (
    <Window aria-label={`Harbor, ${current.label}`} style={{ maxWidth: 820, height: 420 }}>
      <WindowTitlebar>
        <WindowTitlebarLeading>
          <Menu>
            <MenuTrigger variant="plain" tone="neutral" aria-label={`Harbor sections, ${current.label}`}>
              <WindowAppName
                icon={
                  <Avatar shape="app" size="xs" color="teal">
                    <AvatarFallback>
                      <AnchorIcon />
                    </AvatarFallback>
                  </Avatar>
                }
              >
                Harbor
              </WindowAppName>
            </MenuTrigger>
            <MenuContent align="start">
              <MenuRadioGroup value={section} onValueChange={(value) => setSection(value as string)}>
                {sections.map(({ id, label }) => (
                  <MenuRadioItem key={id} value={id} closeOnSelect>
                    {label}
                  </MenuRadioItem>
                ))}
                <MenuSeparator />
                <MenuRadioItem value="settings" closeOnSelect>
                  Settings
                </MenuRadioItem>
              </MenuRadioGroup>
            </MenuContent>
          </Menu>
        </WindowTitlebarLeading>
        <WindowTitle align="center" subtitle={current.detail}>
          {current.label}
        </WindowTitle>
        <WindowTitlebarTrailing>
          <Toolbar aria-label={current.label}>
            <ToolbarSearchField aria-label="Search projects and clients" />
            <ToolbarButton aria-label="New project">
              <PlusIcon aria-hidden="true" />
            </ToolbarButton>
          </Toolbar>
        </WindowTitlebarTrailing>
      </WindowTitlebar>
      <WindowBody
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          alignContent: "start",
          gap: 12,
          padding: 20,
        }}
      >
        {projects.map((project) => (
          <Card key={project.name} style={{ display: "grid", gap: 10, padding: 14 }}>
            <div>
              <div className="mb-text-headline">{project.name}</div>
              <div className="mb-text-subheadline mb-label-secondary">{project.client}</div>
            </div>
            <Progress value={project.done} aria-label={`${project.name}, ${project.done}% done`} />
          </Card>
        ))}
      </WindowBody>
    </Window>
  )
}
