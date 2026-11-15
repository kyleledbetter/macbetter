import {
  AccessibilityIcon,
  BatteryFullIcon,
  BellIcon,
  BluetoothIcon,
  ContrastIcon,
  GlobeIcon,
  HandIcon,
  HourglassIcon,
  ImageIcon,
  KeyRoundIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  SlidersHorizontalIcon,
  Volume2Icon,
  WifiIcon,
} from "lucide-react"
import type { Icon, TileColor } from "../rows"

type PaneId =
  | "account"
  | "wifi"
  | "bluetooth"
  | "network"
  | "notifications"
  | "sound"
  | "focus"
  | "screen-time"
  | "general"
  | "appearance"
  | "accessibility"
  | "control-center"
  | "displays"
  | "wallpaper"
  | "battery"
  | "privacy"
  | "passwords"

type Pane = {
  id: PaneId
  label: string
  icon: Icon
  color: TileColor
  /** Extra words people search for. */
  keywords: string
}

const paneGroups: Pane[][] = [
  [
    { id: "wifi", label: "Wi-Fi", icon: WifiIcon, color: "blue", keywords: "wireless network internet" },
    { id: "bluetooth", label: "Bluetooth", icon: BluetoothIcon, color: "blue", keywords: "airpods keyboard mouse" },
    { id: "network", label: "Network", icon: GlobeIcon, color: "blue", keywords: "vpn firewall ethernet" },
  ],
  [
    { id: "notifications", label: "Notifications", icon: BellIcon, color: "red", keywords: "alerts banners badges" },
    { id: "sound", label: "Sound", icon: Volume2Icon, color: "pink", keywords: "volume output alert speakers" },
    { id: "focus", label: "Focus", icon: MoonIcon, color: "indigo", keywords: "do not disturb sleep work" },
    { id: "screen-time", label: "Screen Time", icon: HourglassIcon, color: "indigo", keywords: "limits usage" },
  ],
  [
    { id: "general", label: "General", icon: SettingsIcon, color: "gray", keywords: "about software update storage" },
    { id: "appearance", label: "Appearance", icon: ContrastIcon, color: "gray", keywords: "dark light accent color theme" },
    { id: "accessibility", label: "Accessibility", icon: AccessibilityIcon, color: "blue", keywords: "voiceover zoom" },
    { id: "control-center", label: "Control Center", icon: SlidersHorizontalIcon, color: "gray", keywords: "menu bar" },
    { id: "displays", label: "Displays", icon: MonitorIcon, color: "blue", keywords: "brightness night shift resolution" },
    { id: "wallpaper", label: "Wallpaper", icon: ImageIcon, color: "cyan", keywords: "background desktop" },
    { id: "battery", label: "Battery", icon: BatteryFullIcon, color: "green", keywords: "low power charging" },
  ],
  [
    { id: "privacy", label: "Privacy & Security", icon: HandIcon, color: "blue", keywords: "location camera permissions" },
    { id: "passwords", label: "Passwords", icon: KeyRoundIcon, color: "gray", keywords: "passkeys keychain" },
  ],
]

const panes = paneGroups.flat()

const accountPane: Pane = {
  id: "account",
  label: "Avery Chen",
  icon: SettingsIcon,
  color: "gray",
  keywords: "apple account icloud profile",
}

function paneById(id: PaneId) {
  return id === "account" ? accountPane : (panes.find((pane) => pane.id === id) ?? panes[0])
}

function searchPanes(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return panes
  return panes.filter((pane) => `${pane.label} ${pane.keywords}`.toLowerCase().includes(q))
}

const networks = {
  current: "macbetter HQ",
  known: ["Harbor Cafe Guest", "Pine Street Loft", "Avery’s iPhone"],
  other: ["Hollis Studio", "Northwind 5G", "Library Public", "Saltmarsh Guest"],
}

const devices = [
  { id: "airpods", name: "Avery’s AirPods Pro", kind: "Headphones", battery: 82 },
  { id: "keyboard", name: "Magic Keyboard", kind: "Keyboard", battery: 64 },
  { id: "trackpad", name: "Magic Trackpad", kind: "Trackpad", battery: 41 },
  { id: "speaker", name: "Living Room HomePod", kind: "Speaker", battery: null },
]

const apps = [
  { id: "calendar", name: "Calendar", color: "red" as const },
  { id: "macbetter", name: "macbetter", color: "orange" as const },
  { id: "mail", name: "Mail", color: "blue" as const },
  { id: "messages", name: "Messages", color: "green" as const },
  { id: "music", name: "Music", color: "pink" as const },
  { id: "reminders", name: "Reminders", color: "indigo" as const },
]

const alertSounds = ["Boop", "Breeze", "Bubble", "Crystal", "Funky", "Jump", "Mezzo", "Pebble", "Pluck", "Pong", "Sonar", "Submerge"]

const outputs = [
  { id: "speakers", name: "MacBook Pro Speakers", kind: "Built-in" },
  { id: "airpods", name: "Avery’s AirPods Pro", kind: "Bluetooth" },
  { id: "display", name: "Studio Display", kind: "Thunderbolt" },
]

const accents = [
  { id: "multicolor", label: "Multicolor", color: "" },
  { id: "blue", label: "Blue", color: "var(--mb-blue)" },
  { id: "purple", label: "Purple", color: "var(--mb-purple)" },
  { id: "pink", label: "Pink", color: "var(--mb-pink)" },
  { id: "red", label: "Red", color: "var(--mb-red)" },
  { id: "orange", label: "Orange", color: "var(--mb-orange)" },
  { id: "yellow", label: "Yellow", color: "var(--mb-yellow)" },
  { id: "green", label: "Green", color: "var(--mb-green)" },
  { id: "graphite", label: "Graphite", color: "light-dark(#8c8c91, #98989d)" },
]

type SettingsState = {
  wifi: boolean
  network: string
  askToJoin: string
  askHotspots: string
  bluetooth: boolean
  connected: Record<string, boolean>
  vpn: boolean
  firewall: boolean
  previews: string
  notifySleeping: boolean
  notifyLocked: boolean
  notifyMirroring: boolean
  appNotifications: Record<string, boolean>
  alertSound: string
  alertVolume: number
  outputVolume: number
  muted: boolean
  startupSound: boolean
  uiSounds: boolean
  volumeFeedback: boolean
  output: string
  doNotDisturb: boolean
  shareFocus: boolean
  focusStatus: boolean
  appearance: "light" | "dark" | "auto"
  accent: string
  sidebarIcons: string
  wallpaperTinting: boolean
  scrollBars: string
  brightness: number
  autoBrightness: boolean
  trueTone: boolean
  nightShift: string
  resolution: string
  lowPower: string
  optimizedCharging: boolean
}

const initialSettings: SettingsState = {
  wifi: true,
  network: networks.current,
  askToJoin: "notify",
  askHotspots: "ask",
  bluetooth: true,
  connected: { airpods: true, keyboard: true, trackpad: false, speaker: false },
  vpn: false,
  firewall: true,
  previews: "unlocked",
  notifySleeping: false,
  notifyLocked: true,
  notifyMirroring: false,
  appNotifications: { calendar: true, macbetter: true, mail: true, messages: true, music: false, reminders: true },
  alertSound: "Pebble",
  alertVolume: 62,
  outputVolume: 48,
  muted: false,
  startupSound: true,
  uiSounds: true,
  volumeFeedback: false,
  output: "speakers",
  doNotDisturb: false,
  shareFocus: true,
  focusStatus: true,
  appearance: "auto",
  accent: "multicolor",
  sidebarIcons: "medium",
  wallpaperTinting: true,
  scrollBars: "auto",
  brightness: 74,
  autoBrightness: true,
  trueTone: true,
  nightShift: "sunset",
  resolution: "default",
  lowPower: "battery",
  optimizedCharging: true,
}

export {
  accents,
  accountPane,
  alertSounds,
  apps,
  devices,
  initialSettings,
  networks,
  outputs,
  paneById,
  paneGroups,
  panes,
  searchPanes,
}
export type { Pane, PaneId, SettingsState }
