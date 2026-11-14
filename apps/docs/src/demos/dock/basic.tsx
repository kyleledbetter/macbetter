"use client"

import { Dock, DockItem, DockSeparator } from "macbetter/dock"
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
  { name: "Finder", icon: FolderIcon, from: "var(--mb-cyan)", to: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, from: "var(--mb-teal)", to: "var(--mb-blue)" },
  { name: "Messages", icon: MessageCircleIcon, from: "var(--mb-mint)", to: "var(--mb-green)" },
  { name: "Mail", icon: MailIcon, from: "var(--mb-cyan)", to: "var(--mb-indigo)" },
  { name: "Photos", icon: ImageIcon, from: "var(--mb-yellow)", to: "var(--mb-pink)" },
  { name: "Music", icon: MusicIcon, from: "var(--mb-pink)", to: "var(--mb-red)" },
  { name: "Calendar", icon: CalendarDaysIcon, from: "var(--mb-red)", to: "var(--mb-orange)" },
  { name: "Notes", icon: NotebookPenIcon, from: "var(--mb-yellow)", to: "var(--mb-orange)" },
  { name: "System Settings", icon: SettingsIcon, from: "var(--mb-tint)", to: "color-mix(in oklch, var(--mb-tint), black 45%)" },
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
          <AppIcon icon={Trash2Icon} from="color-mix(in oklch, var(--mb-tint) 45%, white)" to="var(--mb-tint)" />
        </DockItem>
      </Dock>
    </div>
  )
}
