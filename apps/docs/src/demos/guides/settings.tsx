import { Button } from "@dreambase/stardust/button"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Switch } from "@dreambase/stardust/switch"

const group: React.CSSProperties = {
  borderRadius: "var(--sd-group-radius)",
  background: "var(--sd-bg-grouped-secondary)",
  boxShadow: "0 0 0 var(--sd-hairline) var(--sd-separator)",
  overflow: "hidden",
}

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--sd-space-5)",
  minHeight: "var(--sd-row-height)",
  paddingInline: "var(--sd-row-padding)",
  paddingBlock: "var(--sd-space-3)",
  font: "var(--sd-text-body)",
}

const divider: React.CSSProperties = {
  height: "var(--sd-hairline)",
  marginInlineStart: "var(--sd-row-padding)",
  background: "var(--sd-separator)",
}

export default function Example() {
  return (
    <div style={{ display: "grid", gap: "var(--sd-space-6)", width: "100%", maxWidth: 380 }}>
      <div className="sd-text-headline">Network</div>
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
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--sd-space-4)" }}>
        <Button>Cancel</Button>
        <Button variant="filled">Apply</Button>
      </div>
    </div>
  )
}
