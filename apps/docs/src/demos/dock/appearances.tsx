"use client"

import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle"
import { CompassIcon } from "@phosphor-icons/react/dist/ssr/Compass"
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { FolderSimpleIcon } from "@phosphor-icons/react/dist/ssr/FolderSimple"
import { MapTrifoldIcon } from "@phosphor-icons/react/dist/ssr/MapTrifold"
import { MusicNoteIcon } from "@phosphor-icons/react/dist/ssr/MusicNote"
import { TerminalWindowIcon } from "@phosphor-icons/react/dist/ssr/TerminalWindow"
import { Dock, DockItem, type DockAppearance } from "macbetter/dock"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { useState } from "react"

const apps = [
  { name: "Finder", icon: FolderSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, tint: "var(--mb-cyan)" },
  { name: "Messages", icon: ChatCircleIcon, tint: "var(--mb-green)" },
  { name: "Mail", icon: EnvelopeSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Maps", icon: MapTrifoldIcon, tint: "var(--mb-mint)" },
  { name: "Music", icon: MusicNoteIcon, tint: "var(--mb-red)" },
  { name: "Terminal", icon: TerminalWindowIcon, tint: "var(--mb-tint)" },
]

export default function Example() {
  const [appearance, setAppearance] = useState<DockAppearance>("default")

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 72 }}>
      <SegmentedControl
        aria-label="Icon style"
        value={appearance}
        onValueChange={(value) => value && setAppearance(value as DockAppearance)}
      >
        <SegmentedControlItem value="default">Default</SegmentedControlItem>
        <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
        <SegmentedControlItem value="clear">Clear</SegmentedControlItem>
        <SegmentedControlItem value="tinted">Tinted</SegmentedControlItem>
      </SegmentedControl>
      <Dock aria-label="Dock" appearance={appearance}>
        {apps.map(({ name, icon: Icon, tint }) => (
          <DockItem key={name} label={name} tint={tint} running={name === "Finder"}>
            <Icon weight="fill" aria-hidden="true" />
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
