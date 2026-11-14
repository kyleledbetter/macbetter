"use client"

import { Dock, DockItem, DockSeparator } from "macbetter/dock"
import { Menu, MenuCheckboxItem, MenuItem, MenuSeparator } from "macbetter/menu"
import { MenuBar, MenuBarContent, MenuBarTrigger } from "macbetter/menu-bar"
import {
  CalendarDaysIcon,
  CompassIcon,
  FolderKanbanIcon,
  ImageIcon,
  MailIcon,
  MusicIcon,
  NotebookPenIcon,
  SettingsIcon,
  Trash2Icon,
  WifiIcon,
} from "lucide-react"
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
  { name: "Projects", icon: FolderKanbanIcon, from: "var(--mb-accent)", to: "color-mix(in oklch, var(--mb-accent), black 30%)" },
  { name: "Browser", icon: CompassIcon, from: "var(--mb-teal)", to: "var(--mb-blue)" },
  { name: "Mail", icon: MailIcon, from: "var(--mb-cyan)", to: "var(--mb-indigo)" },
  { name: "Calendar", icon: CalendarDaysIcon, from: "var(--mb-red)", to: "var(--mb-orange)" },
  { name: "Notes", icon: NotebookPenIcon, from: "var(--mb-yellow)", to: "var(--mb-orange)" },
  { name: "Photos", icon: ImageIcon, from: "var(--mb-yellow)", to: "var(--mb-pink)" },
  { name: "Music", icon: MusicIcon, from: "var(--mb-pink)", to: "var(--mb-red)" },
  {
    name: "Settings",
    icon: SettingsIcon,
    from: "var(--mb-tint)",
    to: "color-mix(in oklch, var(--mb-tint), black 45%)",
  },
]

function AppIcon({ icon: Icon, from, to }: { icon: typeof MailIcon; from: string; to: string }) {
  return (
    <span className="lp-app-icon" style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}>
      <Icon aria-hidden="true" strokeWidth={1.75} />
    </span>
  )
}

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
            {apps.map((app) => (
              <DockItem
                key={app.name}
                label={app.name}
                running={running.includes(app.name)}
                onClick={() => setRunning((open) => (open.includes(app.name) ? open : [...open, app.name]))}
              >
                <AppIcon {...app} />
              </DockItem>
            ))}
            <DockSeparator />
            <DockItem label="Trash">
              <AppIcon icon={Trash2Icon} from="color-mix(in oklch, var(--mb-tint) 45%, white)" to="var(--mb-tint)" />
            </DockItem>
          </Dock>
        </div>
      </section>
    </div>
  )
}

export { HeroScene }
export type { SceneState }
