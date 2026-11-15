"use client"

import type { Platform } from "macbetter"
import { Avatar } from "macbetter/avatar"
import { Badge } from "macbetter/badge"
import { Button } from "macbetter/button"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "macbetter/list"
import { Progress } from "macbetter/progress"
import { Radio, RadioGroup } from "macbetter/radio"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import {
  AppWindowIcon,
  ArchiveRestoreIcon,
  BellIcon,
  BriefcaseIcon,
  CalendarClockIcon,
  CarIcon,
  CloudIcon,
  CreditCardIcon,
  DownloadIcon,
  HardDriveIcon,
  InfoIcon,
  KeyRoundIcon,
  LanguagesIcon,
  LockIcon,
  MoonIcon,
  PowerIcon,
  RefreshCwIcon,
  ShareIcon,
  ShieldCheckIcon,
  SunDimIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
  Volume1Icon,
  Volume2Icon,
  WifiIcon,
} from "lucide-react"
import type * as React from "react"
import { SelectRow, SliderRow, ToggleRow, ValueRow } from "../rows"
import {
  accents,
  alertSounds,
  apps,
  devices,
  networks,
  outputs,
  type PaneId,
  type SettingsState,
} from "./data"

type Set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void

type PaneProps = { s: SettingsState; set: Set; platform: Platform }

function Signal({ secure = true }: { secure?: boolean }) {
  return (
    <span className="ex-net-glyphs">
      {secure ? <LockIcon aria-label="Secured" /> : null}
      <WifiIcon aria-label="Strong signal" />
    </span>
  )
}

function WifiPane({ s, set, platform }: PaneProps) {
  const mac = platform === "macos"
  return (
    <>
      <ListSection
        footer={s.wifi ? undefined : "Wi-Fi is off. Turn it on to see networks nearby and join one."}
      >
        <ToggleRow title="Wi-Fi" icon={WifiIcon} color="blue" checked={s.wifi} onCheckedChange={(v) => set("wifi", v)} />
        {s.wifi ? (
          <ListRow>
            <ListRowTitle>{s.network}</ListRowTitle>
            <ListRowSubtitle>Connected</ListRowSubtitle>
            <ListRowValue>
              <Signal />
            </ListRowValue>
            {mac ? (
              <ListRowAccessory>
                <Button size="sm">Details…</Button>
              </ListRowAccessory>
            ) : (
              <ListRowAccessory type="checkmark" />
            )}
          </ListRow>
        ) : null}
      </ListSection>
      {s.wifi ? (
        <>
          <ListSection header="Known networks">
            {networks.known
              .filter((name) => name !== s.network)
              .concat(s.network === networks.current ? [] : [networks.current])
              .map((name) => (
                <ListRow key={name} onClick={() => set("network", name)}>
                  <ListRowTitle>{name}</ListRowTitle>
                  <ListRowValue>
                    <Signal secure={!name.includes("Guest")} />
                  </ListRowValue>
                </ListRow>
              ))}
          </ListSection>
          <ListSection header="Other networks">
            {networks.other.map((name) => (
              <ListRow key={name} onClick={() => set("network", name)}>
                <ListRowTitle>{name}</ListRowTitle>
                <ListRowValue>
                  <Signal secure={!name.includes("Public")} />
                </ListRowValue>
              </ListRow>
            ))}
          </ListSection>
          <ListSection footer="Known networks join automatically. If none are available, you’ll be notified of networks nearby.">
            <SelectRow
              title="Ask to join networks"
              value={s.askToJoin}
              onValueChange={(v) => set("askToJoin", v)}
              options={[
                { value: "off", label: "Off" },
                { value: "notify", label: "Notify" },
                { value: "ask", label: "Ask" },
              ]}
            />
            <SelectRow
              title="Ask to join hotspots"
              value={s.askHotspots}
              onValueChange={(v) => set("askHotspots", v)}
              options={[
                { value: "never", label: "Never" },
                { value: "ask", label: "Ask to join" },
                { value: "auto", label: "Automatic" },
              ]}
            />
          </ListSection>
        </>
      ) : null}
    </>
  )
}

function BluetoothPane({ s, set, platform }: PaneProps) {
  const mac = platform === "macos"
  return (
    <>
      <ListSection
        footer={
          s.bluetooth
            ? `This ${mac ? "Mac" : "iPhone"} is discoverable as “Avery’s ${mac ? "MacBook Pro" : "iPhone"}” while Bluetooth settings are open.`
            : "Turn Bluetooth on to use AirPods, keyboards and other accessories."
        }
      >
        <ToggleRow
          title="Bluetooth"
          icon={BluetoothGlyph}
          color="blue"
          checked={s.bluetooth}
          onCheckedChange={(v) => set("bluetooth", v)}
        />
      </ListSection>
      {s.bluetooth ? (
        <ListSection header="My devices">
          {devices.map((device) => {
            const on = s.connected[device.id]
            const toggle = () => set("connected", { ...s.connected, [device.id]: !on })
            return mac ? (
              <ListRow key={device.id}>
                <ListRowTitle>{device.name}</ListRowTitle>
                <ListRowSubtitle>
                  {on ? `Connected${device.battery ? ` · ${device.battery}% battery` : ""}` : "Not connected"}
                </ListRowSubtitle>
                <ListRowAccessory>
                  <Button size="sm" onClick={toggle} aria-label={`${on ? "Disconnect" : "Connect"} ${device.name}`}>
                    {on ? "Disconnect" : "Connect"}
                  </Button>
                </ListRowAccessory>
              </ListRow>
            ) : (
              <ValueRow
                key={device.id}
                title={device.name}
                value={on ? "Connected" : "Not Connected"}
                onClick={toggle}
              />
            )
          })}
        </ListSection>
      ) : null}
    </>
  )
}

function BluetoothGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m7 7 10 10-5 5V2l5 5L7 17" />
    </svg>
  )
}

function NetworkPane({ s, set }: PaneProps) {
  const services = [
    { name: "Wi-Fi", status: s.wifi ? "Connected" : "Off", on: s.wifi },
    { name: "Thunderbolt Bridge", status: "Not connected", on: false },
    { name: "USB 10/100/1000 LAN", status: "Cable unplugged", on: false },
  ]
  return (
    <>
      <ListSection>
        {services.map((service) => (
          <ListRow key={service.name} onClick={() => {}}>
            <span aria-hidden="true" className="ex-status-dot" data-on={service.on ? "" : undefined} />
            <ListRowTitle>{service.name}</ListRowTitle>
            <ListRowSubtitle>{service.status}</ListRowSubtitle>
            <ListRowAccessory type="disclosure" />
          </ListRow>
        ))}
      </ListSection>
      <ListSection header="VPN" footer="macbetter VPN routes traffic for internal dashboards through the office network.">
        <ToggleRow title="macbetter VPN" subtitle={s.vpn ? "Connected · 00:12:48" : "Not connected"} checked={s.vpn} onCheckedChange={(v) => set("vpn", v)} />
      </ListSection>
      <ListSection>
        <ToggleRow
          title="Firewall"
          icon={ShieldCheckIcon}
          color="blue"
          subtitle="Blocks incoming connections to apps you haven’t allowed"
          checked={s.firewall}
          onCheckedChange={(v) => set("firewall", v)}
        />
      </ListSection>
    </>
  )
}

function NotificationsPane({ s, set }: PaneProps) {
  return (
    <>
      <ListSection header="Notification Center">
        <SelectRow
          title="Show previews"
          value={s.previews}
          onValueChange={(v) => set("previews", v)}
          options={[
            { value: "always", label: "Always" },
            { value: "unlocked", label: "When Unlocked" },
            { value: "never", label: "Never" },
          ]}
        />
        <ToggleRow title="Allow notifications when the display is sleeping" checked={s.notifySleeping} onCheckedChange={(v) => set("notifySleeping", v)} />
        <ToggleRow title="Allow notifications when the screen is locked" checked={s.notifyLocked} onCheckedChange={(v) => set("notifyLocked", v)} />
        <ToggleRow title="Allow notifications when mirroring or sharing" checked={s.notifyMirroring} onCheckedChange={(v) => set("notifyMirroring", v)} />
      </ListSection>
      <ListSection header="Application notifications">
        {apps.map((app) => (
          <ToggleRow
            key={app.id}
            title={app.name}
            subtitle={s.appNotifications[app.id] ? "Banners, Sounds, Badges" : "Off"}
            icon={BellIcon}
            color={app.color}
            checked={s.appNotifications[app.id]}
            onCheckedChange={(v) => set("appNotifications", { ...s.appNotifications, [app.id]: v })}
          />
        ))}
      </ListSection>
    </>
  )
}

function SoundPane({ s, set, platform }: PaneProps) {
  const mac = platform === "macos"
  return (
    <>
      <ListSection header="Sound effects">
        <SelectRow
          title="Alert sound"
          value={s.alertSound}
          onValueChange={(v) => set("alertSound", v)}
          options={alertSounds.map((name) => ({ value: name, label: name }))}
        />
        <SliderRow label="Alert volume" value={s.alertVolume} onValueChange={(v) => set("alertVolume", v)} min={Volume1Icon} max={Volume2Icon} showLabel={mac} />
        <ToggleRow title="Play sound on startup" checked={s.startupSound} onCheckedChange={(v) => set("startupSound", v)} />
        <ToggleRow title="Play user interface sound effects" checked={s.uiSounds} onCheckedChange={(v) => set("uiSounds", v)} />
        <ToggleRow title="Play feedback when volume is changed" checked={s.volumeFeedback} onCheckedChange={(v) => set("volumeFeedback", v)} />
      </ListSection>
      <ListSection header="Output">
        <SliderRow
          label="Output volume"
          value={s.muted ? 0 : s.outputVolume}
          onValueChange={(v) => {
            set("outputVolume", v)
            if (s.muted) set("muted", false)
          }}
          min={Volume1Icon}
          max={Volume2Icon}
          showLabel={mac}
        />
        <ToggleRow title="Mute" checked={s.muted} onCheckedChange={(v) => set("muted", v)} />
      </ListSection>
      <ListSection header="Output device">
        {outputs.map((output) => (
          <ValueRow
            key={output.id}
            title={output.name}
            subtitle={output.kind}
            checked={s.output === output.id}
            onClick={() => set("output", output.id)}
          />
        ))}
      </ListSection>
    </>
  )
}

function FocusPane({ s, set }: PaneProps) {
  return (
    <>
      <ListSection footer="Focus lets you silence notifications and calls, and tells people and apps you’re busy.">
        <ToggleRow title="Do Not Disturb" icon={MoonIcon} color="indigo" subtitle={s.doNotDisturb ? "On until 7:00 AM" : undefined} checked={s.doNotDisturb} onCheckedChange={(v) => set("doNotDisturb", v)} />
        <ValueRow title="Personal" icon={UserIcon} color="purple" value="Off" disclosure onClick={() => {}} />
        <ValueRow title="Work" icon={BriefcaseIcon} color="teal" value="9:00 AM – 5:30 PM" disclosure onClick={() => {}} />
        <ValueRow title="Sleep" icon={MoonIcon} color="mint" value="10:30 PM – 7:00 AM" disclosure onClick={() => {}} />
        <ValueRow title="Driving" icon={CarIcon} color="blue" value="While driving" disclosure onClick={() => {}} />
      </ListSection>
      <ListSection>
        <ToggleRow title="Share across devices" subtitle="Turning on a Focus here turns it on for your other devices" checked={s.shareFocus} onCheckedChange={(v) => set("shareFocus", v)} />
        <ToggleRow title="Focus status" subtitle="Lets apps say you have notifications silenced" checked={s.focusStatus} onCheckedChange={(v) => set("focusStatus", v)} />
      </ListSection>
    </>
  )
}

function GeneralPane({ platform }: PaneProps) {
  const mac = platform === "macos"
  return (
    <>
      <ListSection>
        <ValueRow title="About" icon={InfoIcon} color="gray" disclosure onClick={() => {}} />
        <ListRow onClick={() => {}}>
          <span className="mb-list-row-icon" data-color="gray" aria-hidden="true">
            <RefreshCwIcon />
          </span>
          <ListRowTitle>Software Update</ListRowTitle>
          <ListRowValue>
            <Badge color="red" variant="filled" size="sm">
              1
            </Badge>
          </ListRowValue>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ValueRow title="Storage" icon={HardDriveIcon} color="gray" value={mac ? "312 GB available" : "88 GB available"} disclosure onClick={() => {}} />
      </ListSection>
      <ListSection>
        <ValueRow title="AirDrop & Handoff" icon={ShareIcon} color="blue" disclosure onClick={() => {}} />
        <ValueRow title="Login Items & Extensions" icon={AppWindowIcon} color="gray" disclosure onClick={() => {}} />
        <ValueRow title="Language & Region" icon={LanguagesIcon} color="blue" value="English (US)" disclosure onClick={() => {}} />
        <ValueRow title="Date & Time" icon={CalendarClockIcon} color="blue" disclosure onClick={() => {}} />
      </ListSection>
      <ListSection>
        <ValueRow title="Time Machine" icon={ArchiveRestoreIcon} color="green" value="Last backup 8:12 AM" disclosure onClick={() => {}} />
        <ValueRow title="Transfer or Reset" icon={DownloadIcon} color="gray" disclosure onClick={() => {}} />
        <ValueRow title="Startup Disk" icon={PowerIcon} color="gray" value="Macintosh HD" disclosure onClick={() => {}} />
      </ListSection>
    </>
  )
}

function AppearancePane({ s, set }: PaneProps) {
  return (
    <>
      <ListSection header="Appearance" footer="Auto follows the time of day: light by day, dark at night.">
        <ListRow className="ex-appearance-row">
          <ListRowTitle className="mb-visually-hidden">Appearance</ListRowTitle>
          <SegmentedControl
            aria-label="Appearance"
            value={s.appearance}
            onValueChange={(v) => v && set("appearance", v as SettingsState["appearance"])}
            block
          >
            <SegmentedControlItem value="light">
              <SunIcon aria-hidden="true" className="ex-seg-icon" />
              Light
            </SegmentedControlItem>
            <SegmentedControlItem value="dark">
              <MoonIcon aria-hidden="true" className="ex-seg-icon" />
              Dark
            </SegmentedControlItem>
            <SegmentedControlItem value="auto">
              <SunDimIcon aria-hidden="true" className="ex-seg-icon" />
              Auto
            </SegmentedControlItem>
          </SegmentedControl>
        </ListRow>
      </ListSection>
      <ListSection>
        <ListRow>
          <ListRowTitle id="accent-label">Accent color</ListRowTitle>
          <ListRowSubtitle>{accents.find((a) => a.id === s.accent)?.label}</ListRowSubtitle>
          <ListRowAccessory>
            <RadioGroup
              aria-labelledby="accent-label"
              value={s.accent}
              onValueChange={(v) => v && set("accent", v as string)}
              className="ex-swatches"
            >
              {accents.map((accent) => (
                <Radio
                  key={accent.id}
                  value={accent.id}
                  aria-label={accent.label}
                  className="ex-swatch"
                  style={{ "--ex-swatch": accent.color || undefined } as React.CSSProperties}
                  data-multicolor={accent.id === "multicolor" ? "" : undefined}
                />
              ))}
            </RadioGroup>
          </ListRowAccessory>
        </ListRow>
        <SelectRow
          title="Sidebar icon size"
          value={s.sidebarIcons}
          onValueChange={(v) => set("sidebarIcons", v)}
          options={[
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ]}
        />
        <ToggleRow
          title="Allow wallpaper tinting in windows"
          checked={s.wallpaperTinting}
          onCheckedChange={(v) => set("wallpaperTinting", v)}
        />
      </ListSection>
      <ListSection>
        <SelectRow
          title="Show scroll bars"
          value={s.scrollBars}
          onValueChange={(v) => set("scrollBars", v)}
          options={[
            { value: "auto", label: "Automatically" },
            { value: "scrolling", label: "When scrolling" },
            { value: "always", label: "Always" },
          ]}
        />
      </ListSection>
    </>
  )
}

function DisplaysPane({ s, set, platform }: PaneProps) {
  const mac = platform === "macos"
  return (
    <>
      <ListSection header={mac ? "Built-in Liquid Retina XDR Display" : "Display"}>
        <ListRow className="ex-appearance-row">
          <ListRowTitle className="mb-visually-hidden">Resolution</ListRowTitle>
          <SegmentedControl
            aria-label="Resolution"
            value={s.resolution}
            onValueChange={(v) => v && set("resolution", v as string)}
            block
          >
            <SegmentedControlItem value="larger">Larger text</SegmentedControlItem>
            <SegmentedControlItem value="default">Default</SegmentedControlItem>
            <SegmentedControlItem value="space">More space</SegmentedControlItem>
          </SegmentedControl>
        </ListRow>
      </ListSection>
      <ListSection header="Brightness">
        <SliderRow label="Brightness" value={s.brightness} onValueChange={(v) => set("brightness", v)} min={SunDimIcon} max={SunIcon} showLabel={mac} />
        <ToggleRow title="Automatically adjust brightness" checked={s.autoBrightness} onCheckedChange={(v) => set("autoBrightness", v)} />
        <ToggleRow
          title="True Tone"
          subtitle="Adapts the display to the light around you"
          checked={s.trueTone}
          onCheckedChange={(v) => set("trueTone", v)}
        />
      </ListSection>
      <ListSection>
        <SelectRow
          title="Night Shift"
          value={s.nightShift}
          onValueChange={(v) => set("nightShift", v)}
          options={[
            { value: "off", label: "Off" },
            { value: "sunset", label: "Sunset to Sunrise" },
            { value: "custom", label: "Custom" },
          ]}
        />
        <ValueRow title="Refresh rate" value="ProMotion" />
      </ListSection>
    </>
  )
}

function BatteryPane({ s, set }: PaneProps) {
  return (
    <>
      <ListSection>
        <ListRow className="ex-battery-row">
          <ListRowTitle>Battery level</ListRowTitle>
          <ListRowValue className="ex-mono">82%</ListRowValue>
          <span className="ex-battery-bar">
            <Progress value={82} aria-label="Battery level" size="sm" />
          </span>
        </ListRow>
        <ValueRow title="Battery health" value="Normal" disclosure onClick={() => {}} />
      </ListSection>
      <ListSection footer="Low Power Mode reduces energy use by lowering screen brightness and pausing background tasks.">
        <SelectRow
          title="Low Power Mode"
          value={s.lowPower}
          onValueChange={(v) => set("lowPower", v)}
          options={[
            { value: "never", label: "Never" },
            { value: "always", label: "Always" },
            { value: "battery", label: "Only on Battery" },
            { value: "adapter", label: "Only on Power Adapter" },
          ]}
        />
        <ToggleRow
          title="Optimized battery charging"
          subtitle="Learns your routine and finishes charging when you need it"
          checked={s.optimizedCharging}
          onCheckedChange={(v) => set("optimizedCharging", v)}
        />
      </ListSection>
    </>
  )
}

function AccountPane({ platform }: PaneProps) {
  return (
    <>
      <div className="ex-account-hero">
        <Avatar name="Avery Chen" size="xl" color="orange" />
        <div className="mb-text-title-2">Avery Chen</div>
        <div className="mb-text-subheadline mb-label-secondary">avery.chen@icloud.com</div>
      </div>
      <ListSection>
        <ValueRow title="Personal Information" icon={UserIcon} color="gray" disclosure onClick={() => {}} />
        <ValueRow title="Sign-In & Security" icon={KeyRoundIcon} color="gray" disclosure onClick={() => {}} />
        <ValueRow title="Payment & Shipping" icon={CreditCardIcon} color="gray" value="Visa" disclosure onClick={() => {}} />
      </ListSection>
      <ListSection>
        <ValueRow title="iCloud" icon={CloudIcon} color="blue" value="200 GB" disclosure onClick={() => {}} />
        <ValueRow title="Family" icon={UsersIcon} color="blue" value="Jordan, Sam" disclosure onClick={() => {}} />
      </ListSection>
      <ListSection header="Devices">
        <ValueRow title={platform === "macos" ? "This MacBook Pro" : "This iPhone"} subtitle="Avery’s devices" disclosure onClick={() => {}} />
        <ValueRow title="Avery’s iPad" subtitle="iPad Air" disclosure onClick={() => {}} />
      </ListSection>
    </>
  )
}

const simpleRows: Partial<Record<PaneId, { header?: string; rows: { title: string; value?: string }[]; footer?: string }>> = {
  "screen-time": {
    header: "Today",
    rows: [
      { title: "App & Website Activity", value: "4h 12m" },
      { title: "Notifications", value: "86" },
      { title: "Pickups", value: "41" },
      { title: "Downtime", value: "Off" },
      { title: "App Limits", value: "2 limits" },
      { title: "Content & Privacy", value: "On" },
    ],
  },
  accessibility: {
    header: "Vision",
    rows: [
      { title: "VoiceOver", value: "Off" },
      { title: "Zoom", value: "Off" },
      { title: "Display" },
      { title: "Spoken Content" },
      { title: "Descriptions" },
    ],
  },
  "control-center": {
    header: "Control Center modules",
    rows: [
      { title: "Wi-Fi", value: "Show in Menu Bar" },
      { title: "Bluetooth", value: "Show in Menu Bar" },
      { title: "Focus", value: "Show When Active" },
      { title: "Display", value: "Show When Active" },
      { title: "Sound", value: "Always Show" },
    ],
  },
  wallpaper: {
    rows: [
      { title: "Current wallpaper", value: "Racing Green" },
      { title: "Show on all Spaces", value: "On" },
      { title: "Screen saver", value: "Drift" },
    ],
    footer: "Wallpapers follow your appearance setting.",
  },
  privacy: {
    header: "Privacy",
    rows: [
      { title: "Location Services", value: "On" },
      { title: "Contacts", value: "3 apps" },
      { title: "Calendars", value: "2 apps" },
      { title: "Camera", value: "1 app" },
      { title: "Microphone", value: "2 apps" },
      { title: "Analytics & Improvements" },
    ],
  },
  passwords: {
    rows: [
      { title: "All", value: "214" },
      { title: "Passkeys", value: "18" },
      { title: "Codes", value: "9" },
      { title: "Wi-Fi", value: "26" },
      { title: "Security", value: "No issues" },
    ],
  },
}

function SimplePane({ id }: { id: PaneId }) {
  const content = simpleRows[id]
  if (!content) return null
  return (
    <ListSection header={content.header} footer={content.footer}>
      {content.rows.map((row) => (
        <ValueRow key={row.title} title={row.title} value={row.value} disclosure onClick={() => {}} />
      ))}
    </ListSection>
  )
}

const paneComponents: Partial<Record<PaneId, (props: PaneProps) => React.ReactNode>> = {
  account: AccountPane,
  wifi: WifiPane,
  bluetooth: BluetoothPane,
  network: NetworkPane,
  notifications: NotificationsPane,
  sound: SoundPane,
  focus: FocusPane,
  general: GeneralPane,
  appearance: AppearancePane,
  displays: DisplaysPane,
  battery: BatteryPane,
}

/** One settings pane, drawn with macbetter lists so it takes each platform's idiom on its own. */
function PaneContent({ id, ...props }: PaneProps & { id: PaneId }) {
  const Component = paneComponents[id]
  return <List className="ex-pane-list">{Component ? <Component {...props} /> : <SimplePane id={id} />}</List>
}

/** What the iPhone's root list shows at the trailing edge of a row. */
function rowValue(id: PaneId, s: SettingsState) {
  if (id === "wifi") return s.wifi ? s.network : "Off"
  if (id === "bluetooth") return s.bluetooth ? "On" : "Off"
  if (id === "focus") return s.doNotDisturb ? "Do Not Disturb" : undefined
  if (id === "battery") return "82%"
  return undefined
}

export { PaneContent, rowValue }
export type { PaneProps, Set }
