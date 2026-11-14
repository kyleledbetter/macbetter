import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <SegmentedControl aria-label="Map style" defaultValue="explore" block>
        <SegmentedControlItem value="explore">Explore</SegmentedControlItem>
        <SegmentedControlItem value="driving">Driving</SegmentedControlItem>
        <SegmentedControlItem value="transit">Transit</SegmentedControlItem>
        <SegmentedControlItem value="satellite">Satellite</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}
