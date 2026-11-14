"use client"

import { Button } from "@dreambase/stardust/button"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "@dreambase/stardust/window"
import { useState } from "react"

export default function Example() {
  const [open, setOpen] = useState(true)
  const [zoomed, setZoomed] = useState(false)

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Reopen Calculator</Button>
  }

  return (
    <Window aria-label="Calculator" style={{ width: zoomed ? 420 : 300, height: 180 }}>
      <WindowTitlebar variant="compact" bordered={false}>
        <WindowTrafficLights
          onClose={() => setOpen(false)}
          onMinimize={() => setOpen(false)}
          onZoom={() => setZoomed((value) => !value)}
        />
        <WindowTitle align="center">Calculator</WindowTitle>
      </WindowTitlebar>
      <WindowBody style={{ display: "grid", placeItems: "end", padding: "16px 20px" }}>
        <output className="sd-text-large-title" style={{ fontVariantNumeric: "tabular-nums" }}>
          1,280
        </output>
      </WindowBody>
    </Window>
  )
}
