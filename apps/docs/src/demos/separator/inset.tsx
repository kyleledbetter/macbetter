import { Separator } from "@dreambase/stardust/separator"

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
        borderRadius: "var(--sd-group-radius)",
        background: "var(--sd-bg-grouped-secondary)",
        boxShadow: "0 0 0 0.5px var(--sd-separator)",
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
              minHeight: "var(--sd-row-height)",
              paddingInline: "var(--sd-row-padding)",
            }}
          >
            <span>{row.title}</span>
            <span style={{ color: "var(--sd-label-secondary)" }}>{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
