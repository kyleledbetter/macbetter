"use client"

import { Dock, DockItem, DockSeparator } from "@dreambase/stardust/dock"
import {
  CalendarDaysIcon,
  CompassIcon,
  FolderIcon,
  ImageIcon,
  MailIcon,
  MessageCircleIcon,
  MusicIcon,
  NotebookPenIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"

const apps = [
  { name: "Finder", icon: FolderIcon, from: "var(--sd-cyan)", to: "var(--sd-blue)" },
  { name: "Safari", icon: CompassIcon, from: "var(--sd-teal)", to: "var(--sd-blue)" },
  { name: "Messages", icon: MessageCircleIcon, from: "var(--sd-mint)", to: "var(--sd-green)" },
  { name: "Mail", icon: MailIcon, from: "var(--sd-cyan)", to: "var(--sd-indigo)" },
  { name: "Photos", icon: ImageIcon, from: "var(--sd-yellow)", to: "var(--sd-pink)" },
  { name: "Music", icon: MusicIcon, from: "var(--sd-pink)", to: "var(--sd-red)" },
  { name: "Calendar", icon: CalendarDaysIcon, from: "var(--sd-red)", to: "var(--sd-orange)" },
  { name: "Notes", icon: NotebookPenIcon, from: "var(--sd-yellow)", to: "var(--sd-orange)" },
  { name: "System Settings", icon: SettingsIcon, from: "var(--sd-tint)", to: "color-mix(in oklch, var(--sd-tint), black 45%)" },
]

function AppIcon({ icon: Icon, from, to }: { icon: typeof FolderIcon; from: string; to: string }) {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(160deg, ${from}, ${to})`,
      }}
    >
      <Icon aria-hidden="true" strokeWidth={1.75} style={{ width: "54%", height: "54%" }} />
    </span>
  )
}

export default function Example() {
  const [running, setRunning] = useState(["Finder", "Safari", "Messages"])

  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 200 }}>
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
          <AppIcon icon={Trash2Icon} from="color-mix(in oklch, var(--sd-tint) 45%, white)" to="var(--sd-tint)" />
        </DockItem>
      </Dock>
    </div>
  )
}
