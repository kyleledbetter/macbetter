import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "macbetter/window"

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center", width: "100%" }}>
      <Window aria-label="About This Mac" style={{ width: 300, height: 200 }}>
        <WindowTitlebar variant="compact" bordered={false}>
          <WindowTrafficLights />
          <WindowTitle align="center">About This Mac</WindowTitle>
        </WindowTitlebar>
        <WindowBody style={{ display: "grid", placeItems: "center", textAlign: "center", padding: 16 }}>
          <div>
            <div className="mb-text-title-2">MacBook Pro</div>
            <div className="mb-text-subheadline mb-label-secondary">14-inch, 2025 · Apple M5</div>
          </div>
        </WindowBody>
      </Window>
      <Window inactive aria-label="Notes" style={{ width: 300, height: 200 }}>
        <WindowTitlebar variant="compact" bordered={false}>
          <WindowTrafficLights />
          <WindowTitle align="center">Notes</WindowTitle>
        </WindowTitlebar>
        <WindowBody style={{ padding: 16 }}>
          <p className="mb-text-body mb-label-secondary" style={{ margin: 0 }}>
            Behind the key window, traffic lights turn gray and the title dims.
          </p>
        </WindowBody>
      </Window>
    </div>
  )
}
