import { ActivityIndicator } from "@dreambase/stardust/activity-indicator"
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "@dreambase/stardust/alert"
import { Button } from "@dreambase/stardust/button"
import { Calendar } from "@dreambase/stardust/calendar"
import { Gauge, GaugeLabel, GaugeValue } from "@dreambase/stardust/gauge"
import { GlassGroup, Glass } from "@dreambase/stardust/glass"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Separator } from "@dreambase/stardust/separator"
import { Slider } from "@dreambase/stardust/slider"
import { Switch } from "@dreambase/stardust/switch"
import {
  ArchiveIcon,
  BluetoothIcon,
  CopyIcon,
  FolderIcon,
  LocateFixedIcon,
  PencilIcon,
  PinIcon,
  RadioTowerIcon,
  ShareIcon,
  StarIcon,
  SunDimIcon,
  SunIcon,
  Trash2Icon,
  Volume1Icon,
  Volume2Icon,
  WifiIcon,
} from "lucide-react"
import Link from "next/link"
import { SearchTile } from "./search-tile"
import { SectionHeading } from "./section-heading"
import { Wallpaper } from "./wallpaper"

function Tile({
  area,
  name,
  slug,
  children,
  className,
}: {
  area: string
  name: string
  slug: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`lp-tile ${className ?? ""}`} style={{ gridArea: area }}>
      <div className="lp-tile-stage">{children}</div>
      <Link href={`/docs/components/${slug}`} className="lp-tile-name">
        {name}
        <span aria-hidden="true" className="lp-tile-arrow">
          →
        </span>
      </Link>
    </div>
  )
}

const menuItems = [
  { label: "Rename", icon: PencilIcon, shortcut: "⌘R" },
  { label: "Duplicate", icon: CopyIcon, shortcut: "⌘D", highlighted: true },
  { label: "Pin Note", icon: PinIcon, shortcut: "⇧⌘P" },
  { label: "Move To", icon: FolderIcon, submenu: true },
]

/** A menu drawn open, with the real menu's classes. A picture, so it's hidden from assistive technology. */
function StaticMenu() {
  return (
    <div className="lp-static-menu" aria-hidden="true">
      <span className="sd-button lp-static-menu-trigger" data-variant="bezeled" data-tone="accent" data-size="md" data-shape="auto">
        Note
      </span>
      <div className="sd-menu-content lp-static-menu-content" data-has-icons="">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`sd-menu-item${item.submenu ? " sd-menu-sub-trigger" : ""}`}
            data-has-icon=""
            data-highlighted={item.highlighted ? "" : undefined}
          >
            <span className="sd-menu-item-icon">
              <item.icon />
            </span>
            {item.label}
            {item.shortcut ? <span className="sd-menu-shortcut">{item.shortcut}</span> : null}
            {item.submenu ? (
              <span className="sd-menu-sub-trigger-indicator">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </span>
            ) : null}
          </div>
        ))}
        <div className="sd-menu-separator" />
        <div className="sd-menu-item" data-has-icon="">
          <span className="sd-menu-item-icon">
            <ShareIcon />
          </span>
          Share…
        </div>
        <div className="sd-menu-item" data-has-icon="" data-disabled="">
          <span className="sd-menu-item-icon">
            <ArchiveIcon />
          </span>
          Archive
        </div>
        <div className="sd-menu-separator" />
        <div className="sd-menu-item" data-has-icon="" data-destructive="">
          <span className="sd-menu-item-icon">
            <Trash2Icon />
          </span>
          Delete
          <span className="sd-menu-shortcut">⌘⌫</span>
        </div>
      </div>
    </div>
  )
}

function Bento() {
  return (
    <section className="lp-section" aria-labelledby="lp-bento">
      <SectionHeading
        id="lp-bento"
        title="Over fifty components."
        muted="Each one the real thing."
        actions={
          <Button variant="tinted" render={<Link href="/docs/components/button" />}>
            See all components
          </Button>
        }
      >
        Menus, sliders, calendars, alerts and command palettes that look and behave like the native control, at a
        glance and under the hand. Everything below works.
      </SectionHeading>
      <div className="lp-bento lp-reveal" data-platform="macos">
        <Tile area="menu" name="Menu" slug="menu" className="lp-tile-menu">
          <StaticMenu />
        </Tile>

        <Tile area="slider" name="Slider" slug="slider">
          <div className="lp-tile-sliders">
            <span className="lp-tile-slider-row">
              <SunDimIcon aria-hidden="true" />
              <Slider defaultValue={70} thumbLabel="Display brightness" />
              <SunIcon aria-hidden="true" />
            </span>
            <span className="lp-tile-slider-row">
              <Volume1Icon aria-hidden="true" />
              <Slider defaultValue={40} thumbLabel="Output volume" ticks={11} />
              <Volume2Icon aria-hidden="true" />
            </span>
          </div>
        </Tile>

        <Tile area="cal" name="Calendar" slug="calendar">
          <Calendar size="sm" aria-label="Pick a date" defaultValue="2026-11-18" />
        </Tile>

        <Tile area="switch" name="Switch" slug="switch">
          <div className="lp-tile-switches">
            <label>
              <WifiIcon aria-hidden="true" />
              Wi-Fi
              <Switch defaultChecked />
            </label>
            <label>
              <BluetoothIcon aria-hidden="true" />
              Bluetooth
              <Switch defaultChecked />
            </label>
            <label>
              <RadioTowerIcon aria-hidden="true" />
              AirDrop
              <Switch />
            </label>
          </div>
        </Tile>

        <Tile area="seg" name="Segmented control" slug="segmented-control">
          <div className="lp-tile-stack">
            <SegmentedControl aria-label="Calendar view" defaultValue="week">
              <SegmentedControlItem value="day">Day</SegmentedControlItem>
              <SegmentedControlItem value="week">Week</SegmentedControlItem>
              <SegmentedControlItem value="month">Month</SegmentedControlItem>
            </SegmentedControl>
            <SegmentedControl aria-label="Text alignment" defaultValue="left" size="sm">
              <SegmentedControlItem value="left">Left</SegmentedControlItem>
              <SegmentedControlItem value="center">Center</SegmentedControlItem>
              <SegmentedControlItem value="right">Right</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </Tile>

        <Tile area="glass" name="Glass" slug="glass" className="lp-tile-glass">
          <Wallpaper id="bento" className="lp-tile-wallpaper" />
          <GlassGroup aria-label="Photo actions" className="lp-tile-glass-group">
            <Button variant="plain" tone="neutral" shape="circle" aria-label="Share">
              <ShareIcon aria-hidden="true" />
            </Button>
            <Button variant="plain" tone="neutral" shape="circle" aria-label="Favorite">
              <StarIcon aria-hidden="true" />
            </Button>
            <Separator orientation="vertical" />
            <Button variant="plain" tone="destructive" shape="circle" aria-label="Delete">
              <Trash2Icon aria-hidden="true" />
            </Button>
          </GlassGroup>
          <Glass
            shape="circle"
            interactive
            render={<button type="button" aria-label="Show my location" />}
            className="lp-tile-glass-locate"
          >
            <LocateFixedIcon aria-hidden="true" />
          </Glass>
        </Tile>

        <Tile area="gauge" name="Gauge" slug="gauge">
          <div className="lp-tile-row">
            <Gauge variant="circular" value={72} low={20} high={50} optimum={100}>
              <GaugeValue />
              <GaugeLabel>Battery</GaugeLabel>
            </Gauge>
            <Gauge variant="circular" value={88} low={70} high={85} optimum={0}>
              <GaugeValue />
              <GaugeLabel>Storage</GaugeLabel>
            </Gauge>
          </div>
        </Tile>

        <Tile area="spin" name="Activity indicator" slug="activity-indicator">
          <div className="lp-tile-spinner">
            <ActivityIndicator size="lg" aria-label="Syncing" />
            <span>Syncing 24 files…</span>
          </div>
        </Tile>

        <Tile area="search" name="Command palette" slug="command-palette">
          <SearchTile />
        </Tile>

        <Tile area="alert" name="Alert" slug="alert">
          <Alert>
            <AlertTrigger render={<Button tone="destructive" />}>Delete project…</AlertTrigger>
            <AlertContent>
              <AlertTitle>Delete “Website refresh”?</AlertTitle>
              <AlertDescription>Its 4 tasks are deleted too. You can’t undo this.</AlertDescription>
              <AlertActions>
                <AlertAction variant="cancel">Cancel</AlertAction>
                <AlertAction variant="primary" tone="destructive" value="delete">
                  Delete
                </AlertAction>
              </AlertActions>
            </AlertContent>
          </Alert>
        </Tile>
      </div>
    </section>
  )
}

export { Bento }
