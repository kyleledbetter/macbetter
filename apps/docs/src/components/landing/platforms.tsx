import { DeviceFrame } from "@dreambase/stardust/device-frame"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowTitle,
  ListSection,
} from "@dreambase/stardust/list"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Slider } from "@dreambase/stardust/slider"
import { Switch } from "@dreambase/stardust/switch"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "@dreambase/stardust/window"
import { BadgeIcon, BellIcon, Volume1Icon, Volume2Icon } from "lucide-react"
import { SectionHeading } from "./section-heading"

function SettingsForm({ id }: { id: string }) {
  return (
    <List className="lp-form">
      <ListSection>
        <ListRow>
          <ListRowIcon color="red">
            <BellIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle id={`${id}-allow`}>Allow notifications</ListRowTitle>
          <ListRowAccessory>
            <Switch aria-labelledby={`${id}-allow`} defaultChecked />
          </ListRowAccessory>
        </ListRow>
        <ListRow>
          <ListRowIcon color="orange">
            <BadgeIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle id={`${id}-badges`}>Badge app icon</ListRowTitle>
          <ListRowAccessory>
            <Switch aria-labelledby={`${id}-badges`} />
          </ListRowAccessory>
        </ListRow>
      </ListSection>
      <ListSection header="Show previews">
        <ListRow className="lp-form-block">
          <SegmentedControl aria-label="Show previews" defaultValue="unlocked" block size="sm">
            <SegmentedControlItem value="always">Always</SegmentedControlItem>
            <SegmentedControlItem value="unlocked">Unlocked</SegmentedControlItem>
            <SegmentedControlItem value="never">Never</SegmentedControlItem>
          </SegmentedControl>
        </ListRow>
      </ListSection>
      <ListSection header="Alert volume">
        <ListRow className="lp-form-block">
          <span className="lp-form-slider">
            <Volume1Icon aria-hidden="true" />
            <Slider defaultValue={60} thumbLabel="Alert volume" />
            <Volume2Icon aria-hidden="true" />
          </span>
        </ListRow>
      </ListSection>
    </List>
  )
}

const notes = {
  macos: "13pt text, 28px controls, hover states and compact rows.",
  ipados: "Touch-sized rows and capsule controls, with hover kept for the trackpad.",
  ios: "17pt text, 44pt targets, inset grouped lists, no hover.",
}

function Platforms() {
  return (
    <section className="lp-section" aria-labelledby="lp-platforms">
      <SectionHeading id="lp-platforms" title="Three platforms." muted="One codebase.">
        Put <code>data-platform</code> on any element and the components inside take that platform’s sizes and
        habits. The same settings form, three times, with no changes to its code:
      </SectionHeading>
      <div className="lp-platforms lp-reveal">
        <figure className="lp-platform" data-platform="macos">
          <div className="lp-platform-stage">
            <Window aria-label="Notifications settings on macOS" className="lp-platform-window">
              <WindowTitlebar variant="unified">
                <WindowTrafficLights />
                <WindowTitle>Notifications</WindowTitle>
              </WindowTitlebar>
              <WindowBody className="lp-platform-window-body">
                <SettingsForm id="lp-mac" />
              </WindowBody>
            </Window>
          </div>
          <figcaption>
            <strong>macOS</strong> {notes.macos}
          </figcaption>
        </figure>
        <figure className="lp-platform">
          <div className="lp-platform-stage">
            <DeviceFrame device="ipad" date="Sat Nov 14" className="lp-platform-ipad" role="group" aria-label="Notifications settings on iPadOS">
              <div className="lp-platform-screen">
                <div className="sd-text-title-2 lp-platform-screen-title" role="heading" aria-level={3}>
                  Notifications
                </div>
                <SettingsForm id="lp-ipad" />
              </div>
            </DeviceFrame>
          </div>
          <figcaption>
            <strong>iPadOS</strong> {notes.ipados}
          </figcaption>
        </figure>
        <figure className="lp-platform">
          <div className="lp-platform-stage">
            <DeviceFrame className="lp-platform-iphone" role="group" aria-label="Notifications settings on iOS">
              <div className="lp-platform-screen">
                <div className="sd-text-large-title lp-platform-screen-title" role="heading" aria-level={3}>
                  Notifications
                </div>
                <SettingsForm id="lp-ios" />
              </div>
            </DeviceFrame>
          </div>
          <figcaption>
            <strong>iOS</strong> {notes.ios}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export { Platforms }
