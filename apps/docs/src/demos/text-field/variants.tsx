import { TextField } from "@dreambase/stardust/text-field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
      <TextField variant="bordered" aria-label="Bordered" placeholder="Bordered" />
      <TextField variant="filled" aria-label="Filled" placeholder="Filled" />
      <TextField variant="plain" aria-label="Plain" placeholder="Plain, for a list row" />
      <TextField aria-label="Disabled" defaultValue="Managed by your organization" disabled />
    </div>
  )
}
