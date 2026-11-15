import { ChatCircleIcon } from "@phosphor-icons/react/dist/ssr/ChatCircle"
import { CompassIcon } from "@phosphor-icons/react/dist/ssr/Compass"
import { EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple"
import { FolderSimpleIcon } from "@phosphor-icons/react/dist/ssr/FolderSimple"
import { Dock, DockItem } from "macbetter/dock"

const apps = [
  { name: "Finder", icon: FolderSimpleIcon, tint: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, tint: "var(--mb-cyan)" },
  { name: "Messages", icon: ChatCircleIcon, tint: "var(--mb-green)" },
  { name: "Mail", icon: EnvelopeSimpleIcon, tint: "var(--mb-blue)" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 160 }}>
      <Dock aria-label="Dock">
        {apps.map(({ name, icon: Icon, tint }) => (
          <DockItem key={name} label={name} tint={tint} running={name === "Finder"}>
            <Icon weight="fill" aria-hidden="true" />
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
