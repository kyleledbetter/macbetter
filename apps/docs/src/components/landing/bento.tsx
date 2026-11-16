"use client"

import { ActivityIndicator } from "macbetter/activity-indicator"
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "macbetter/alert"
import { Button } from "macbetter/button"
import { Calendar } from "macbetter/calendar"
import { Gauge, GaugeLabel, GaugeValue } from "macbetter/gauge"
import { GlassGroup, Glass } from "macbetter/glass"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Separator } from "macbetter/separator"
import { Slider } from "macbetter/slider"
import { Switch } from "macbetter/switch"
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
import { MoreLink } from "@/components/more-link"
import { SearchTile } from "./search-tile"
import { SectionHeading } from "./section-heading"
import { Tile } from "./tile"
import { Wallpaper } from "./wallpaper"

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
      <span className="mb-button lp-static-menu-trigger" data-variant="bezeled" data-tone="accent" data-size="md" data-shape="auto">
        Note
      </span>
      <div className="mb-menu-content lp-static-menu-content" data-has-icons="">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`mb-menu-item${item.submenu ? " mb-menu-sub-trigger" : ""}`}
            data-has-icon=""
            data-highlighted={item.highlighted ? "" : undefined}
          >
            <span className="mb-menu-item-icon">
              <item.icon />
            </span>
            {item.label}
            {item.shortcut ? <span className="mb-menu-shortcut">{item.shortcut}</span> : null}
            {item.submenu ? (
              <span className="mb-menu-sub-trigger-indicator">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3.5 10.5 8 6 12.5" />
                </svg>
              </span>
            ) : null}
          </div>
        ))}
        <div className="mb-menu-separator" />
        <div className="mb-menu-item" data-has-icon="">
          <span className="mb-menu-item-icon">
            <ShareIcon />
          </span>
          Share…
        </div>
        <div className="mb-menu-item" data-has-icon="" data-disabled="">
          <span className="mb-menu-item-icon">
            <ArchiveIcon />
          </span>
          Archive
        </div>
        <div className="mb-menu-separator" />
        <div className="mb-menu-item" data-has-icon="" data-destructive="">
          <span className="mb-menu-item-icon">
            <Trash2Icon />
          </span>
          Delete
          <span className="mb-menu-shortcut">⌘⌫</span>
        </div>
      </div>
    </div>
  )
}

function Bento() {
  return (
    <section id="components" className="lp-section" data-surface="alt" aria-labelledby="lp-bento">
      <div className="lp-section-inner">
      <SectionHeading
        id="lp-bento"
        eyebrow="Components"
        headline={<>Every UI element from the Human Interface Guidelines (and&nbsp;more).</>}
        links={<MoreLink href="/docs/components">Explore all components</MoreLink>}
      >
        Menus, sliders, calendars, alerts and command palettes that look and behave like the native controls.{" "}
        <strong>Every tile below is a working&nbsp;component.</strong>
      </SectionHeading>
      <div className="lp-bento lp-reveal" data-platform="macos">
        <Tile area="menu" name="Menu" href="/docs/components/menu" className="lp-tile-menu">
          <StaticMenu />
        </Tile>

        <Tile area="slider" name="Slider" href="/docs/components/slider">
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

        <Tile area="cal" name="Calendar" href="/docs/components/calendar">
          <Calendar size="sm" aria-label="Pick a date" defaultValue="2026-11-18" />
        </Tile>

        <Tile area="switch" name="Switch" href="/docs/components/switch">
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

        <Tile area="seg" name="Segmented control" href="/docs/components/segmented-control">
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

        <Tile area="glass" name="Glass" href="/docs/components/glass" className="lp-tile-glass">
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

        <Tile area="gauge" name="Gauge" href="/docs/components/gauge">
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

        <Tile area="spin" name="Activity indicator" href="/docs/components/activity-indicator">
          <div className="lp-tile-spinner">
            <ActivityIndicator size="lg" aria-label="Syncing" />
            <span>Syncing 24 files…</span>
          </div>
        </Tile>

        <Tile area="search" name="Command palette" href="/docs/components/command-palette">
          <SearchTile />
        </Tile>

        <Tile area="alert" name="Alert" href="/docs/components/alert">
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
      </div>
    </section>
  )
}

export { Bento }
