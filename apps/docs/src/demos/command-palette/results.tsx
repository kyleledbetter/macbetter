import {
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandItem,
  CommandItemIcon,
  CommandList,
  CommandShortcut,
} from "macbetter/command-palette"
import {
  CalendarIcon,
  FileTextIcon,
  FolderIcon,
  MailIcon,
  MapIcon,
  MoonIcon,
  NotebookPenIcon,
  SettingsIcon,
} from "lucide-react"

const apps = [
  { value: "notes", label: "Notes", icon: NotebookPenIcon, color: "var(--mb-yellow)" },
  { value: "calendar", label: "Calendar", icon: CalendarIcon, color: "var(--mb-red)" },
  { value: "mail", label: "Mail", icon: MailIcon, color: "var(--mb-blue)" },
  { value: "maps", label: "Maps", icon: MapIcon, color: "var(--mb-green)" },
]

const actions = [
  { value: "new-note", label: "New Note", icon: FileTextIcon, shortcut: "mod+n" },
  { value: "open-folder", label: "Open Folder…", icon: FolderIcon, shortcut: "mod+o" },
  { value: "focus", label: "Turn On Do Not Disturb", icon: MoonIcon, shortcut: "mod+shift+d" },
  { value: "settings", label: "System Settings", icon: SettingsIcon, shortcut: "mod+," },
]

/** The results, shared by the palette and the inline example. */
export function Results() {
  return (
    <>
      <CommandEmpty>No results</CommandEmpty>
      <CommandList>
        <CommandGroup>
          <CommandGroupLabel>Applications</CommandGroupLabel>
          {apps.map((app) => (
            <CommandItem key={app.value} value={app.value} label={app.label}>
              <CommandItemIcon>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius: "28%",
                    background: app.color,
                    color: "#fff",
                  }}
                >
                  <app.icon aria-hidden="true" style={{ width: "62%", height: "62%" }} />
                </span>
              </CommandItemIcon>
              {app.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup>
          <CommandGroupLabel>Actions</CommandGroupLabel>
          {actions.map((action) => (
            <CommandItem key={action.value} value={action.value} label={action.label} shortcut={action.shortcut}>
              <CommandItemIcon>
                <action.icon />
              </CommandItemIcon>
              {action.label}
              <CommandShortcut />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </>
  )
}

export default Results
