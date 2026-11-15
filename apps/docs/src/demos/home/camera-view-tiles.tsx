"use client"

import { CameraScene, CameraTile } from "macbetter/camera-view"
import { useState } from "react"

const cameras = [
  { name: "Front door", variant: "porch" as const },
  { name: "Driveway", variant: "driveway" as const },
  { name: "Kitchen", variant: "kitchen" as const },
  { name: "Backyard", variant: "backyard" as const },
]

export default function Example() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div style={{ display: "grid", gap: 10, width: "min(100%, 560px)" }}>
      <div role="group" aria-label="Cameras" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBlock: 4 }}>
        {cameras.map((camera) => (
          <CameraTile key={camera.name} name={camera.name} live onClick={() => setOpen(camera.name)}>
            <CameraScene variant={camera.variant} />
          </CameraTile>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {open ? `Opened ${open}.` : "Choose a camera to watch it."}
      </p>
    </div>
  )
}
