import { DeviceFrame } from "macbetter/device-frame"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { CalendarIcon, InboxIcon, StarIcon, SunIcon } from "lucide-react"

export default function Example() {
  return (
    <DeviceFrame device="ipad" scale={0.56} role="group" aria-label="Reminders on iPad">
      <div style={{ display: "flex", minHeight: 0 }}>
        <Sidebar
          aria-label="Lists"
          style={{ width: 320, paddingTop: "calc(var(--mb-safe-top) + 16px)", paddingBottom: "var(--mb-safe-bottom)" }}
        >
          <SidebarSection title="Reminders">
            <SidebarItem href="#today" icon={<SunIcon />} badge={3} current>
              Today
            </SidebarItem>
            <SidebarItem href="#scheduled" icon={<CalendarIcon />} badge={7}>
              Scheduled
            </SidebarItem>
            <SidebarItem href="#flagged" icon={<StarIcon />} tint="var(--mb-orange)">
              Flagged
            </SidebarItem>
            <SidebarItem href="#all" icon={<InboxIcon />} badge={24}>
              All
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
        <div style={{ flex: 1, padding: "calc(var(--mb-safe-top) + 16px) 32px var(--mb-safe-bottom)" }}>
          <h2 className="mb-text-large-title" style={{ margin: 0 }}>
            Today
          </h2>
          <p className="mb-text-body mb-label-secondary">3 reminders</p>
        </div>
      </div>
    </DeviceFrame>
  )
}
