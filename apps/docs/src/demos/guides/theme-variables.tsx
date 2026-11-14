import { Button } from "macbetter/button"
import { Switch } from "macbetter/switch"
import { themeVariables } from "macbetter/theme"

const harbor = themeVariables({
  accent: { light: "#0b6e99", dark: "#3fb3e6" },
  onAccent: { light: "#ffffff", dark: "#04202e" },
  accentText: { light: "#0a5f85", dark: "#6cc7ef" },
  ink: { light: "#0b1a22", dark: "#eaf4f8" },
  bg: { light: "#ffffff", dark: "#0b1a22" },
  bgElevated: { light: "#ffffff", dark: "#12262f" },
  tint: { light: "#5d6f78", dark: "#86a3b0" },
})

export default function Example() {
  return (
    <div
      data-theme="harbor"
      data-macbetter=""
      style={{
        ...harbor,
        display: "grid",
        gap: "var(--mb-space-5)",
        padding: "var(--mb-space-7)",
        borderRadius: "var(--mb-group-radius)",
        boxShadow: "0 0 0 var(--mb-hairline) var(--mb-separator)",
        minWidth: 260,
      }}
    >
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        Tide alerts
        <Switch defaultChecked />
      </label>
      <div style={{ display: "flex", gap: "var(--mb-space-4)" }}>
        <Button variant="filled">Book a slip</Button>
        <Button variant="tinted">Charts</Button>
      </div>
    </div>
  )
}
