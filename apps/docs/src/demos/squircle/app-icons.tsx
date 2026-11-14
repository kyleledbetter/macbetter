import { Squircle } from "macbetter/squircle"
import { CalendarDaysIcon, CompassIcon, ImageIcon, MailIcon, MusicIcon } from "lucide-react"

const apps = [
  { name: "Mail", icon: MailIcon, from: "var(--mb-cyan)", to: "var(--mb-blue)" },
  { name: "Safari", icon: CompassIcon, from: "var(--mb-teal)", to: "var(--mb-blue)" },
  { name: "Photos", icon: ImageIcon, from: "var(--mb-yellow)", to: "var(--mb-pink)" },
  { name: "Music", icon: MusicIcon, from: "var(--mb-pink)", to: "var(--mb-red)" },
  { name: "Calendar", icon: CalendarDaysIcon, from: "var(--mb-red)", to: "var(--mb-orange)" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
      {apps.map(({ name, icon: Icon, from, to }) => (
        <figure key={name} style={{ display: "grid", justifyItems: "center", gap: 6, margin: 0 }}>
          <Squircle
            size={64}
            exact
            shadow
            style={{ display: "grid", placeItems: "center", background: `linear-gradient(160deg, ${from}, ${to})`, color: "#fff" }}
          >
            <Icon aria-hidden="true" strokeWidth={1.75} style={{ width: "54%", height: "54%" }} />
          </Squircle>
          <figcaption className="mb-text-caption">{name}</figcaption>
        </figure>
      ))}
    </div>
  )
}
