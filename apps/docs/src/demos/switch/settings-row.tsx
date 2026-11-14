import { Field, FieldDescription, FieldLabel } from "@dreambase/stardust/field"
import { Switch } from "@dreambase/stardust/switch"

// The label and description on the leading side, the switch on the trailing edge.
const row = { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "2px 16px" }
const title = { gridColumn: 1, padding: 0, color: "var(--sd-label)", font: "var(--sd-text-body)" }

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%", maxWidth: 420 }}>
      <Field style={row}>
        <FieldLabel style={title}>Low Power Mode</FieldLabel>
        <Switch style={{ gridColumn: 2, gridRow: "1 / span 2" }} />
        <FieldDescription style={{ gridColumn: 1, padding: 0 }}>
          Reduces background activity until you charge your device.
        </FieldDescription>
      </Field>
      <Field style={row}>
        <FieldLabel style={title}>Show Battery Percentage</FieldLabel>
        <Switch style={{ gridColumn: 2 }} defaultChecked />
      </Field>
    </div>
  )
}
