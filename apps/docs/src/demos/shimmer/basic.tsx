import { Shimmer } from "macbetter/shimmer"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
      <Shimmer>Thinking…</Shimmer>
      <Shimmer>Searching the web for tide tables in Half Moon Bay…</Shimmer>
      <Shimmer duration={3}>Reading 4 files in the project…</Shimmer>
    </div>
  )
}
