import { TextField } from "macbetter/text-field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 280 }}>
      <TextField size="sm" aria-label="Tag" placeholder="Tag" />
      <TextField aria-label="Board name" defaultValue="Q4 Launch Plan" />
      <TextField size="lg" aria-label="Title" placeholder="Untitled" />
    </div>
  )
}
