import { Separator } from "macbetter/separator"

const stats = [
  { value: "24", label: "Projects" },
  { value: "1,280", label: "Followers" },
  { value: "312", label: "Following" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      {stats.map((stat, index) => (
        <div key={stat.label} style={{ display: "contents" }}>
          {index > 0 ? <Separator orientation="vertical" /> : null}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{stat.value}</span>
            <span style={{ color: "var(--mb-label-secondary)" }}>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
