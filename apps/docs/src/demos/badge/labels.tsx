import { Badge } from "@dreambase/stardust/badge"

const colors = ["accent", "red", "yellow", "green", "teal", "blue", "indigo", "purple", "gray"] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      {(["tinted", "filled", "outline"] as const).map((variant) => (
        <div key={variant} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {colors.map((color) => (
            <Badge key={color} variant={variant} color={color}>
              {color === "accent" ? "New" : color[0]?.toUpperCase() + color.slice(1)}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
}
