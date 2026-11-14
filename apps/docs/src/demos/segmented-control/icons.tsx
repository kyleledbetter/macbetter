import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Columns3Icon, GalleryVerticalIcon, LayoutGridIcon, ListIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <SegmentedControl aria-label="View as" defaultValue="icons">
        <SegmentedControlItem value="icons" aria-label="Icons">
          <LayoutGridIcon aria-hidden="true" />
        </SegmentedControlItem>
        <SegmentedControlItem value="list" aria-label="List">
          <ListIcon aria-hidden="true" />
        </SegmentedControlItem>
        <SegmentedControlItem value="columns" aria-label="Columns">
          <Columns3Icon aria-hidden="true" />
        </SegmentedControlItem>
        <SegmentedControlItem value="gallery" aria-label="Gallery">
          <GalleryVerticalIcon aria-hidden="true" />
        </SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl aria-label="Layout" defaultValue="grid">
        <SegmentedControlItem value="grid">
          <LayoutGridIcon aria-hidden="true" />
          Grid
        </SegmentedControlItem>
        <SegmentedControlItem value="list">
          <ListIcon aria-hidden="true" />
          List
        </SegmentedControlItem>
      </SegmentedControl>
    </>
  )
}
