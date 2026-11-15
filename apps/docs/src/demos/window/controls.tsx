"use client"

import { Button } from "macbetter/button"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import { useState } from "react"

const apps = [
  { id: "calculator", title: "Calculator", value: "1,280" },
  { id: "timer", title: "Focus Timer", value: "24:59" },
]

export default function Example() {
  const [key, setKey] = useState("calculator")
  const [closed, setClosed] = useState<string[]>([])
  const [zoomed, setZoomed] = useState<string[]>([])
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

  if (closed.length === apps.length) {
    return <Button onClick={() => setClosed([])}>Reopen windows</Button>
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", width: "100%" }}>
      {apps
        .filter((app) => !closed.includes(app.id))
        .map((app) => (
          <Window
            key={app.id}
            aria-label={app.title}
            inactive={key !== app.id}
            onPointerDown={() => setKey(app.id)}
            style={{ width: zoomed.includes(app.id) ? 380 : 260, maxWidth: "100%", height: 170 }}
          >
            <WindowTitlebar variant="compact" bordered={false}>
              <WindowTrafficLights
                onClose={() => setClosed((list) => [...list, app.id])}
                onMinimize={() => setClosed((list) => [...list, app.id])}
                onZoom={() => setZoomed((list) => toggle(list, app.id))}
              />
              <WindowTitle align="center">{app.title}</WindowTitle>
            </WindowTitlebar>
            <WindowBody style={{ display: "grid", placeItems: "end", padding: "16px 20px" }}>
              <output className="mb-text-large-title" style={{ fontVariantNumeric: "tabular-nums" }}>
                {app.value}
              </output>
            </WindowBody>
          </Window>
        ))}
    </div>
  )
}
