import { ActivityIndicator } from "@dreambase/stardust/activity-indicator"
import { Avatar, AvatarGroup } from "@dreambase/stardust/avatar"
import { Badge } from "@dreambase/stardust/badge"
import { Button } from "@dreambase/stardust/button"
import { Checkbox } from "@dreambase/stardust/checkbox"
import { Gauge, GaugeValue } from "@dreambase/stardust/gauge"
import { Progress } from "@dreambase/stardust/progress"
import { Rating } from "@dreambase/stardust/rating"
import { SearchField } from "@dreambase/stardust/search-field"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Slider } from "@dreambase/stardust/slider"
import { Switch } from "@dreambase/stardust/switch"
import { TextField } from "@dreambase/stardust/text-field"
import {
  AppWindowIcon,
  BellIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChevronsUpDownIcon,
  CommandIcon,
  CopyIcon,
  GalleryHorizontalIcon,
  GlassWaterIcon,
  KeyRoundIcon,
  LayersIcon,
  ListIcon,
  ListTreeIcon,
  type LucideIcon,
  MenuIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  PaletteIcon,
  PanelBottomIcon,
  PanelLeftIcon,
  PanelTopIcon,
  RadioIcon,
  RectangleEllipsisIcon,
  ScrollTextIcon,
  SeparatorHorizontalIcon,
  SquareSplitHorizontalIcon,
  TableIcon,
  TagsIcon,
  TextCursorInputIcon,
  ToggleLeftIcon,
  TypeIcon,
  WrenchIcon,
  ChevronDownSquareIcon,
  CircleDotIcon,
  DockIcon,
  EllipsisIcon,
  CreditCardIcon,
  MessageSquareWarningIcon,
  InfoIcon,
  ListCollapseIcon,
  FormInputIcon,
} from "lucide-react"

/** Small, still previews of the controls that read at a glance. Everything else gets a glyph. */
const previews: Record<string, () => React.ReactNode> = {
  button: () => (
    <div className="flex gap-2">
      <Button variant="bezeled" tone="neutral">Cancel</Button>
      <Button variant="filled">Save</Button>
    </div>
  ),
  switch: () => (
    <div className="flex gap-3">
      <Switch aria-label="Wi-Fi" defaultChecked />
      <Switch aria-label="Bluetooth" />
    </div>
  ),
  checkbox: () => (
    <div className="flex flex-col gap-1.5">
      <Checkbox defaultChecked>Show hidden files</Checkbox>
      <Checkbox>Show path bar</Checkbox>
    </div>
  ),
  "segmented-control": () => (
    <SegmentedControl aria-label="View" defaultValue="week" size="sm">
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  ),
  slider: () => (
    <div className="w-[180px]">
      <Slider defaultValue={62} thumbLabel="Volume" />
    </div>
  ),
  rating: () => <Rating aria-label="Rating" defaultValue={4} />,
  "text-field": () => (
    <div className="w-[190px]">
      <TextField aria-label="Name" defaultValue="Ada Lovelace" />
    </div>
  ),
  "search-field": () => (
    <div className="w-[190px]">
      <SearchField aria-label="Search" placeholder="Search" />
    </div>
  ),
  avatar: () => (
    <AvatarGroup>
      <Avatar name="Ada Lovelace" color="orange" />
      <Avatar name="Grace Hopper" color="indigo" />
      <Avatar name="Alan Kay" color="green" />
    </AvatarGroup>
  ),
  badge: () => (
    <div className="flex gap-2">
      <Badge>New</Badge>
      <Badge color="green" variant="dot">Online</Badge>
    </div>
  ),
  progress: () => (
    <div className="w-[180px]">
      <Progress value={64} aria-label="Export progress" />
    </div>
  ),
  "activity-indicator": () => <ActivityIndicator aria-label="Loading" />,
  gauge: () => (
    <Gauge variant="circular" size="sm" value={72} aria-label="Battery">
      <GaugeValue />
    </Gauge>
  ),
}

const glyphs: Record<string, LucideIcon> = {
  toggle: ToggleLeftIcon,
  radio: RadioIcon,
  stepper: ChevronsUpDownIcon,
  "color-well": PaletteIcon,
  field: FormInputIcon,
  "secure-field": KeyRoundIcon,
  "text-area": TypeIcon,
  "code-field": RectangleEllipsisIcon,
  "token-field": TagsIcon,
  "date-picker": CalendarDaysIcon,
  calendar: CalendarIcon,
  menu: ChevronDownSquareIcon,
  "context-menu": MousePointerClickIcon,
  "menu-bar": MenuIcon,
  select: ChevronsUpDownIcon,
  "combo-box": TextCursorInputIcon,
  "command-palette": CommandIcon,
  alert: MessageSquareWarningIcon,
  dialog: AppWindowIcon,
  sheet: PanelBottomIcon,
  popover: MessageSquareIcon,
  tooltip: InfoIcon,
  "hover-card": CreditCardIcon,
  toast: BellIcon,
  window: AppWindowIcon,
  sidebar: PanelLeftIcon,
  toolbar: WrenchIcon,
  "navigation-bar": PanelTopIcon,
  "tab-bar": PanelBottomIcon,
  tabs: CopyIcon,
  "split-view": SquareSplitHorizontalIcon,
  dock: DockIcon,
  "page-control": EllipsisIcon,
  list: ListIcon,
  table: TableIcon,
  outline: ListTreeIcon,
  disclosure: ListCollapseIcon,
  card: LayersIcon,
  separator: SeparatorHorizontalIcon,
  "scroll-view": ScrollTextIcon,
  carousel: GalleryHorizontalIcon,
  glass: GlassWaterIcon,
}

function ComponentPreview({ slug }: { slug: string }) {
  const Preview = previews[slug]
  if (Preview) {
    return (
      <div inert data-platform="macos" className="relative">
        <Preview />
      </div>
    )
  }
  const Icon = glyphs[slug] ?? CircleDotIcon
  return (
    <span className="docs-component-glyph relative">
      <Icon aria-hidden="true" className="size-6" strokeWidth={1.6} />
    </span>
  )
}

export { ComponentPreview }
