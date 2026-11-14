import { SplitView, SplitViewDivider, SplitViewPane } from "macbetter/split-view"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "macbetter/window"

const fields = [
  ["Width", "1280 px"],
  ["Height", "720 px"],
  ["Corner radius", "24 px"],
  ["Opacity", "100%"],
]

export default function Example() {
  return (
    <Window aria-label="Keynote" style={{ height: 360 }}>
      <WindowTitlebar>
        <WindowTrafficLights />
        <WindowTitle>Quarterly Review</WindowTitle>
      </WindowTitlebar>
      <WindowBody>
        <SplitView>
          <SplitViewPane minSize={40} style={{ display: "grid", placeItems: "center", padding: 24 }}>
            <div
              style={{
                width: "100%",
                maxWidth: 360,
                aspectRatio: "16 / 9",
                borderRadius: 10,
                background: "linear-gradient(140deg, var(--mb-accent), var(--mb-accent-secondary))",
                boxShadow: "var(--mb-shadow-3)",
              }}
            />
          </SplitViewPane>
          <SplitViewDivider aria-label="Resize inspector" />
          <SplitViewPane variant="inspector" defaultSize="230px" minSize="200px" maxSize="320px" collapsible>
            <dl style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px 12px", margin: 0, padding: 16 }}>
              <dt className="mb-text-headline" style={{ gridColumn: "1 / -1" }}>Arrange</dt>
              {fields.map(([label, value]) => (
                <div key={label} style={{ display: "contents" }}>
                  <dt className="mb-label-secondary">{label}</dt>
                  <dd style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>{value}</dd>
                </div>
              ))}
            </dl>
          </SplitViewPane>
        </SplitView>
      </WindowBody>
    </Window>
  )
}
