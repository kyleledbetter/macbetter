import { Separator } from "macbetter/separator"

const rows = [
  { title: "Plan", value: "Pro" },
  { title: "Seats", value: "8 of 10" },
  { title: "Renews", value: "December 1, 2026" },
]

export default function Example() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        borderRadius: "var(--mb-group-radius)",
        background: "var(--mb-bg-grouped-secondary)",
        boxShadow: "0 0 0 0.5px var(--mb-separator)",
      }}
    >
      {rows.map((row, index) => (
        <div key={row.title}>
          {index > 0 ? <Separator inset="leading" /> : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "var(--mb-row-height)",
              paddingInline: "var(--mb-row-padding)",
            }}
          >
            <span>{row.title}</span>
            <span style={{ color: "var(--mb-label-secondary)" }}>{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
