import { ActivityIndicator } from "macbetter/activity-indicator"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 32, color: "var(--mb-label-secondary)" }}>
      <ActivityIndicator size="sm" />
      <ActivityIndicator />
      <ActivityIndicator size="lg" />
    </div>
  )
}
