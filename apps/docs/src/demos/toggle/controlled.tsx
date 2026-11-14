"use client"

import { Toggle, ToggleIcon } from "macbetter/toggle"
import { BellIcon, BellOffIcon } from "lucide-react"
import { useState } from "react"

export default function Example() {
  const [muted, setMuted] = useState(false)

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Toggle variant="bezeled" aria-label="Mute" pressed={muted} onPressedChange={setMuted}>
        <ToggleIcon>{muted ? <BellOffIcon /> : <BellIcon />}</ToggleIcon>
      </Toggle>
      <span style={{ color: "var(--mb-label-secondary)" }}>
        {muted ? "Notifications are muted" : "Notifications are on"}
      </span>
    </div>
  )
}
