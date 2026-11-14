import { ActivityIndicator } from "@dreambase/stardust/activity-indicator"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <span style={{ color: "var(--sd-label)" }}>
        <ActivityIndicator size="lg" aria-label="Preparing export" />
      </span>
      <span style={{ color: "var(--sd-accent-text)" }}>
        <ActivityIndicator size="lg" aria-label="Syncing" />
      </span>
      <span
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: 88,
          height: 88,
          borderRadius: 20,
          background: "rgb(0 0 0 / 0.72)",
          color: "#ffffff",
        }}
      >
        <ActivityIndicator size="lg" aria-label="Processing video" />
      </span>
    </div>
  )
}
