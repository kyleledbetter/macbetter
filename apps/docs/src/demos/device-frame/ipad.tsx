import { DeviceFrame } from "@dreambase/stardust/device-frame"
import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { CalendarIcon, InboxIcon, StarIcon, SunIcon } from "lucide-react"

export default function Example() {
  return (
    <DeviceFrame device="ipad" scale={0.56} role="group" aria-label="Reminders on iPad">
      <div style={{ display: "flex", minHeight: 0 }}>
        <Sidebar
          aria-label="Lists"
          style={{ width: 320, paddingTop: "calc(var(--sd-safe-top) + 16px)", paddingBottom: "var(--sd-safe-bottom)" }}
        >
          <SidebarSection title="Reminders">
            <SidebarItem href="#today" icon={<SunIcon />} badge={3} current>
              Today
            </SidebarItem>
            <SidebarItem href="#scheduled" icon={<CalendarIcon />} badge={7}>
              Scheduled
            </SidebarItem>
            <SidebarItem href="#flagged" icon={<StarIcon />} tint="var(--sd-orange)">
              Flagged
            </SidebarItem>
            <SidebarItem href="#all" icon={<InboxIcon />} badge={24}>
              All
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
        <div style={{ flex: 1, padding: "calc(var(--sd-safe-top) + 16px) 32px var(--sd-safe-bottom)" }}>
          <h2 className="sd-text-large-title" style={{ margin: 0 }}>
            Today
          </h2>
          <p className="sd-text-body sd-label-secondary">3 reminders</p>
        </div>
      </div>
    </DeviceFrame>
  )
}
