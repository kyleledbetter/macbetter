import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"

export default function Example() {
  return (
    <SegmentedControl aria-label="Calendar view" defaultValue="week">
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
      <SegmentedControlItem value="year">Year</SegmentedControlItem>
    </SegmentedControl>
  )
}
