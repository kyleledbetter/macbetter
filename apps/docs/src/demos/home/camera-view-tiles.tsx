"use client"

import { CameraTile } from "macbetter/camera-view"
import { useState } from "react"

const cameras = ["Front door", "Driveway", "Kitchen", "Backyard"]

export default function Example() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: "grid", gap: 10, width: "min(100%, 560px)" }}>
      <div role="group" aria-label="Cameras" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBlock: 4 }}>
        {cameras.map((name) => (
          <CameraTile key={name} name={name} live timestamp="9:41 AM" onClick={() => setOpen(name)} />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {open ? `Opened ${open}.` : "Choose a camera to watch it."}
      </p>
    </div>
  )
}
