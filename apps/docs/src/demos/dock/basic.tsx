"use client"

import { CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr/CalendarBlank"
import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle"
import { CompassIcon } from "@phosphor-icons/react/dist/ssr/Compass"
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { FlowerIcon } from "@phosphor-icons/react/dist/ssr/Flower"
import { FolderSimpleIcon } from "@phosphor-icons/react/dist/ssr/FolderSimple"
import { GearSixIcon } from "@phosphor-icons/react/dist/ssr/GearSix"
import { MusicNoteIcon } from "@phosphor-icons/react/dist/ssr/MusicNote"
import { NotePencilIcon } from "@phosphor-icons/react/dist/ssr/NotePencil"
import { TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash"
import { Dock, DockItem, DockSeparator } from "macbetter/dock"
import { useState } from "react"

const apps = [
  { name: "Finder", icon: FolderSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, tint: "var(--mb-cyan)" },
  { name: "Messages", icon: ChatCircleIcon, tint: "var(--mb-green)" },
  { name: "Mail", icon: EnvelopeSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Photos", icon: FlowerIcon, tint: "var(--mb-pink)" },
  { name: "Music", icon: MusicNoteIcon, tint: "var(--mb-red)" },
  { name: "Calendar", icon: CalendarBlankIcon, tint: "var(--mb-orange)" },
  { name: "Notes", icon: NotePencilIcon, tint: "var(--mb-yellow)" },
  { name: "System Settings", icon: GearSixIcon, tint: "var(--mb-tint)" },
]

export default function Example() {
  const [running, setRunning] = useState(["Finder", "Safari", "Messages"])

  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 200 }}>
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
  )
}
