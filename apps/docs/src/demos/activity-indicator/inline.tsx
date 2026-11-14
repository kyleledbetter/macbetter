import { ActivityIndicator } from "@dreambase/stardust/activity-indicator"

export default function Example() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "var(--sd-label-secondary)",
      }}
    >
      <ActivityIndicator aria-label="Loading messages" />
      <span aria-hidden="true">Loading Messages…</span>
    </div>
  )
}
