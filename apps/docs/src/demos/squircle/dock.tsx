import { Dock, DockItem } from "macbetter/dock"
import { CompassIcon, FolderIcon, MailIcon, MessageCircleIcon } from "lucide-react"

const apps = [
  { name: "Finder", icon: FolderIcon, from: "var(--mb-cyan)", to: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, from: "var(--mb-teal)", to: "var(--mb-blue)" },
  { name: "Messages", icon: MessageCircleIcon, from: "var(--mb-mint)", to: "var(--mb-green)" },
  { name: "Mail", icon: MailIcon, from: "var(--mb-cyan)", to: "var(--mb-indigo)" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 160 }}>
      <Dock aria-label="Dock">
        {apps.map(({ name, icon: Icon, from, to }) => (
          <DockItem key={name} label={name} running={name === "Finder"}>
            <span style={{ display: "grid", placeItems: "center", background: `linear-gradient(160deg, ${from}, ${to})` }}>
              <Icon aria-hidden="true" strokeWidth={1.75} style={{ width: "54%", height: "54%" }} />
            </span>
          </DockItem>
        ))}
      </Dock>
    </div>
  )
}
