import { Progress } from "macbetter/progress"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 360 }}>
      <Progress size="sm" value={30} aria-label="Syncing Photos" />
      <Progress size="md" value={55} aria-label="Downloading update" />
      <Progress size="lg" value={80} aria-label="Backing up" />
      <Progress size="md" tone="neutral" value={45} aria-label="Indexing" />
    </div>
  )
}
