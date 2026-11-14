import { Avatar } from "@dreambase/stardust/avatar"
import { BadgeAnchor, NotificationBadge } from "@dreambase/stardust/badge"
import { Button } from "@dreambase/stardust/button"
import { BellIcon, InboxIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <BadgeAnchor>
        <Avatar shape="app" size="xl" name="Mail" color="blue" />
        <NotificationBadge size="lg" count={12} label="unread messages" />
      </BadgeAnchor>
      <BadgeAnchor>
        <Avatar shape="app" size="xl" name="App Store" color="cyan" />
        <NotificationBadge size="lg" count={240} label="updates" />
      </BadgeAnchor>
      <BadgeAnchor>
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Inbox">
          <InboxIcon aria-hidden="true" />
        </Button>
        <NotificationBadge count={3} label="new" />
      </BadgeAnchor>
      <BadgeAnchor>
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Notifications">
          <BellIcon aria-hidden="true" />
        </Button>
        <NotificationBadge label="New notifications" />
      </BadgeAnchor>
    </div>
  )
}
