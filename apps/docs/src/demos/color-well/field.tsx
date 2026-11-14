import { ColorWell } from "@dreambase/stardust/color-well"

const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
      <div style={row}>
        <span>Fill</span>
        <ColorWell aria-label="Fill" defaultValue="#028f71" />
      </div>
      <div style={row}>
        <span>Stroke</span>
        <ColorWell aria-label="Stroke" defaultValue="#0a1c13" />
      </div>
      <div style={row}>
        <span>Shadow</span>
        <ColorWell aria-label="Shadow" defaultValue="#00000066" />
      </div>
    </div>
  )
}
