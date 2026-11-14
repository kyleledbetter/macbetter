import { Button } from "macbetter/button"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Switch } from "macbetter/switch"

const group: React.CSSProperties = {
  borderRadius: "var(--mb-group-radius)",
  background: "var(--mb-bg-grouped-secondary)",
  boxShadow: "0 0 0 var(--mb-hairline) var(--mb-separator)",
  overflow: "hidden",
}

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--mb-space-5)",
  minHeight: "var(--mb-row-height)",
  paddingInline: "var(--mb-row-padding)",
  paddingBlock: "var(--mb-space-3)",
  font: "var(--mb-text-body)",
}

const divider: React.CSSProperties = {
  height: "var(--mb-hairline)",
  marginInlineStart: "var(--mb-row-padding)",
  background: "var(--mb-separator)",
}

export default function Example() {
  return (
    <div style={{ display: "grid", gap: "var(--mb-space-6)", width: "100%", maxWidth: 380 }}>
      <div className="mb-text-headline">Network</div>
      <div style={group}>
        <label style={row}>
          Wi-Fi
          <Switch defaultChecked />
        </label>
        <div style={divider} />
        <label style={row}>
          Ask to join networks
          <Switch />
        </label>
        <div style={divider} />
        <div style={row}>
          <span aria-hidden="true">Appearance</span>
          <SegmentedControl aria-label="Appearance" defaultValue="auto" size="sm">
            <SegmentedControlItem value="light">Light</SegmentedControlItem>
            <SegmentedControlItem value="dark">Dark</SegmentedControlItem>
            <SegmentedControlItem value="auto">Auto</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--mb-space-4)" }}>
        <Button>Cancel</Button>
        <Button variant="filled">Apply</Button>
      </div>
    </div>
  )
}
