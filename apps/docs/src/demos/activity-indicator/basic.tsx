import { ActivityIndicator } from "@dreambase/stardust/activity-indicator"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, color: "var(--sd-label-secondary)" }}>
      <ActivityIndicator size="sm" />
      <ActivityIndicator />
      <ActivityIndicator size="lg" />
    </div>
  )
}
