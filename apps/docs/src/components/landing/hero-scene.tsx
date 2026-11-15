"use client"

import { Dock, DockItem, DockSeparator } from "macbetter/dock"
import { Menu, MenuCheckboxItem, MenuItem, MenuSeparator } from "macbetter/menu"
import { MenuBar, MenuBarContent, MenuBarTrigger } from "macbetter/menu-bar"
import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank"
import { CompassIcon } from "@phosphor-icons/react/dist/ssr/Compass"
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { FlowerIcon } from "@phosphor-icons/react/dist/ssr/Flower"
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix"
import { KanbanIcon } from "@phosphor-icons/react/dist/ssr/Kanban"
import { MusicNoteIcon } from "@phosphor-icons/react/dist/ssr/MusicNote"
import { NotePencilIcon } from "@phosphor-icons/react/dist/ssr/NotePencil"
import { TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash"
import { WifiIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { MacbetterMark } from "@/components/logo"
import type { Status, Task } from "./data"
import { MacApp } from "./mac-app"
import { PhoneApp } from "./phone-app"
import { ThemeSwitcher } from "./theme-switcher"
import { Wallpaper } from "./wallpaper"

type SceneState = {
  projectId: string
  setProjectId: (id: string) => void
  showCompleted: boolean
  setShowCompleted: (show: boolean) => void
  statusOf: (task: Task) => Status
  toggleDone: (task: Task) => void
}

function useSceneState(): SceneState {
  const [projectId, setProjectId] = useState("launch")
  const [showCompleted, setShowCompleted] = useState(true)
  const [overrides, setOverrides] = useState<Record<string, Status>>({})
  const statusOf = useCallback((task: Task) => overrides[task.id] ?? task.status, [overrides])
  const toggleDone = useCallback(
    (task: Task) =>
      setOverrides((current) => {
        const status = current[task.id] ?? task.status
        const next = status === "done" ? (task.status === "done" ? "doing" : task.status) : "done"
        return { ...current, [task.id]: next }
      }),
    []
  )
  return { projectId, setProjectId, showCompleted, setShowCompleted, statusOf, toggleDone }
}

const apps = [
  { name: "Projects", icon: KanbanIcon, tint: "var(--mb-accent)" },
  { name: "Browser", icon: CompassIcon, tint: "var(--mb-cyan)" },
  { name: "Mail", icon: EnvelopeSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Calendar", icon: CalendarBlankIcon, tint: "var(--mb-red)" },
  { name: "Notes", icon: NotePencilIcon, tint: "var(--mb-yellow)" },
  { name: "Photos", icon: FlowerIcon, tint: "var(--mb-pink)" },
  { name: "Music", icon: MusicNoteIcon, tint: "var(--mb-red)" },
  { name: "Settings", icon: GearSixIcon, tint: "var(--mb-tint)" },
]

function SceneMenuBar() {
  return (
    <div className="lp-menubar mb-material" data-material="ultrathin">
      <MacbetterMark size={14} className="lp-menubar-mark" />
      <MenuBar aria-label="Projects" className="lp-menubar-menus">
        <Menu>
          <MenuBarTrigger app>Projects</MenuBarTrigger>
          <MenuBarContent>
            <MenuItem value="about">About Projects</MenuItem>
            <MenuSeparator />
            <MenuItem value="settings">Settings…</MenuItem>
          </MenuBarContent>
        </Menu>
        <Menu>
          <MenuBarTrigger>File</MenuBarTrigger>
          <MenuBarContent>
            <MenuItem value="new-task">New Task</MenuItem>
            <MenuItem value="new-project">New Project</MenuItem>
            <MenuSeparator />
            <MenuItem value="share">Share…</MenuItem>
          </MenuBarContent>
        </Menu>
        <Menu>
          <MenuBarTrigger>View</MenuBarTrigger>
          <MenuBarContent>
            <MenuCheckboxItem value="sidebar" defaultChecked>
              Show Sidebar
            </MenuCheckboxItem>
            <MenuCheckboxItem value="toolbar" defaultChecked>
              Show Toolbar
            </MenuCheckboxItem>
            <MenuSeparator />
            <MenuItem value="full-screen">Enter Full Screen</MenuItem>
          </MenuBarContent>
        </Menu>
        <Menu>
          <MenuBarTrigger>Window</MenuBarTrigger>
          <MenuBarContent>
            <MenuItem value="minimize">Minimize</MenuItem>
            <MenuItem value="zoom">Zoom</MenuItem>
          </MenuBarContent>
        </Menu>
      </MenuBar>
      <span className="lp-menubar-status" aria-hidden="true">
        <WifiIcon />
        <span>Sat Nov 14</span>
        <span>9:41</span>
      </span>
    </div>
  )
}

function HeroScene() {
  const state = useSceneState()
  const [running, setRunning] = useState(["Projects", "Mail"])

  return (
    <div className="lp-scene-wrap">
      <ThemeSwitcher />
      <section aria-label="Interactive preview" className="lp-scene" data-platform="macos">
        <Wallpaper />
        <SceneMenuBar />
        <div className="lp-scene-mac">
          <MacApp state={state} />
        </div>
        <div className="lp-scene-phone">
          <PhoneApp state={state} />
        </div>
        <div className="lp-scene-dock">
          <Dock aria-label="Dock">
            {apps.map(({ name, icon: Icon, tint }) => (
              <DockItem
                key={name}
                label={name}
                tint={tint}
                running={running.includes(name)}
                onClick={() => setRunning((open) => (open.includes(name) ? open : [...open, name]))}
              >
                <Icon weight="fill" aria-hidden="true" />
              </DockItem>
            ))}
            <DockSeparator />
            <DockItem label="Trash" tint="var(--mb-tint)">
              <TrashIcon weight="fill" aria-hidden="true" />
            </DockItem>
          </Dock>
        </div>
      </section>
    </div>
  )
}

export { HeroScene }
export type { SceneState }
