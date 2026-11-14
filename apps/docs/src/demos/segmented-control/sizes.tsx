import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"

const sizes = ["sm", "md", "lg"] as const

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {sizes.map((size) => (
        <SegmentedControl key={size} size={size} aria-label={`Sort order, ${size}`} defaultValue="date">
          <SegmentedControlItem value="name">Name</SegmentedControlItem>
          <SegmentedControlItem value="date">Date</SegmentedControlItem>
          <SegmentedControlItem value="size">Size</SegmentedControlItem>
        </SegmentedControl>
      ))}
    </div>
  )
}
