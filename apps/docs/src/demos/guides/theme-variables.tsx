import { Button } from "@dreambase/stardust/button"
import { Switch } from "@dreambase/stardust/switch"
import { themeVariables } from "@dreambase/stardust/theme"

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
      data-stardust=""
      style={{
        ...harbor,
        display: "grid",
        gap: "var(--sd-space-5)",
        padding: "var(--sd-space-7)",
        borderRadius: "var(--sd-group-radius)",
        boxShadow: "0 0 0 var(--sd-hairline) var(--sd-separator)",
        minWidth: 260,
      }}
    >
      <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        Tide alerts
        <Switch defaultChecked />
      </label>
      <div style={{ display: "flex", gap: "var(--sd-space-4)" }}>
        <Button variant="filled">Book a slip</Button>
        <Button variant="tinted">Charts</Button>
      </div>
    </div>
  )
}
