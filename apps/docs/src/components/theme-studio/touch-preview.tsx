"use client"

import { Badge } from "@dreambase/stardust/badge"
import { Button } from "@dreambase/stardust/button"
import { DeviceFrame } from "@dreambase/stardust/device-frame"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "@dreambase/stardust/list"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "@dreambase/stardust/navigation-bar"
import { Progress, ProgressLabel, ProgressValue } from "@dreambase/stardust/progress"
import { SegmentedControl, SegmentedControlItem } from "@dreambase/stardust/segmented-control"
import { Sidebar, SidebarItem, SidebarSection } from "@dreambase/stardust/sidebar"
import { Slider } from "@dreambase/stardust/slider"
import { Switch } from "@dreambase/stardust/switch"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "@dreambase/stardust/tab-bar"
import {
  ArchiveIcon,
  BellIcon,
  CalendarClockIcon,
  ChartColumnIcon,
  CreditCardIcon,
  EllipsisIcon,
  FilePenIcon,
  InboxIcon,
  MailIcon,
  MoonIcon,
  PlusIcon,
  ScanFaceIcon,
  SendIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"

const tabs = [
  { value: "inbox", label: "Campaigns", icon: <InboxIcon /> },
  { value: "stats", label: "Results", icon: <ChartColumnIcon /> },
  { value: "account", label: "Account", icon: <UserIcon /> },
]

function AccountScreen() {
  return (
    <NavigationStack>
      <NavigationBar title="Account" largeTitle>
        <NavigationBarTrailing>
          <Button variant="plain" shape="circle" aria-label="Add a teammate">
            <PlusIcon aria-hidden="true" />
          </Button>
        </NavigationBarTrailing>
      </NavigationBar>
      <List>
        <ListSection>
          <ListRow>
            <ListRowIcon color="red">
              <BellIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Notifications</ListRowTitle>
            <ListRowAccessory>
              <Switch aria-label="Notifications" defaultChecked />
            </ListRowAccessory>
          </ListRow>
          <ListRow>
            <ListRowIcon color="indigo">
              <MoonIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Quiet hours</ListRowTitle>
            <ListRowAccessory>
              <Switch aria-label="Quiet hours" />
            </ListRowAccessory>
          </ListRow>
          <ListRow>
            <ListRowIcon color="green">
              <ScanFaceIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Face ID</ListRowTitle>
            <ListRowAccessory>
              <Switch aria-label="Face ID" defaultChecked />
            </ListRowAccessory>
          </ListRow>
        </ListSection>
        <ListSection header="Plan" footer="Your plan renews on June 9. You can change it at any time.">
          <ListRow onClick={() => {}}>
            <ListRowIcon color="blue">
              <CreditCardIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Billing</ListRowTitle>
            <ListRowValue>Pro</ListRowValue>
            <ListRowAccessory type="disclosure" />
          </ListRow>
          <ListRow onClick={() => {}}>
            <ListRowIcon color="gray">
              <SettingsIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Preferences</ListRowTitle>
            <ListRowAccessory type="disclosure" />
          </ListRow>
        </ListSection>
        <ListSection>
          <ListRow onClick={() => {}}>
            <ListRowTitle style={{ color: "var(--sd-destructive-text)" }}>Sign out</ListRowTitle>
          </ListRow>
        </ListSection>
      </List>
    </NavigationStack>
  )
}

function CampaignScreen() {
  const [view, setView] = useState("summary")
  return (
    <NavigationStack>
      <NavigationBar title="Spring launch">
        <NavigationBarBackButton>Drafts</NavigationBarBackButton>
        <NavigationBarTrailing>
          <Button variant="plain" shape="circle" aria-label="More">
            <EllipsisIcon aria-hidden="true" />
          </Button>
        </NavigationBarTrailing>
      </NavigationBar>
      <div className="ts-phone-content">
        <div className="ts-phone-cover">
          <strong>New colors for spring</strong>
          <small>To 4,812 customers</small>
        </div>
        <SegmentedControl block aria-label="View" value={view} onValueChange={(value) => value && setView(value)}>
          <SegmentedControlItem value="summary">Summary</SegmentedControlItem>
          <SegmentedControlItem value="audience">Audience</SegmentedControlItem>
        </SegmentedControl>
        <div className="ts-inline">
          <Badge>Draft</Badge>
          <Badge color="green">Healthy list</Badge>
        </div>
        <Progress value={72}>
          <ProgressLabel>Delivered</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Slider defaultValue={40} thumbLabel="Daily limit" />
        <div className="ts-phone-buttons">
          <Button variant="filled" size="lg" block>
            <SendIcon aria-hidden="true" />
            Schedule
          </Button>
          <Button variant="tinted" size="lg" block>
            Save draft
          </Button>
          <Button variant="plain" tone="destructive" block>
            Delete draft
          </Button>
        </div>
      </div>
    </NavigationStack>
  )
}

function Phone({ scale, tab, children }: { scale: number; tab: string; children: React.ReactNode }) {
  return (
    <DeviceFrame scale={scale} role="group" aria-label="iPhone preview">
      <TabBar defaultValue={tab}>
        {tabs.map((tab) => (
          <TabBarPanel key={tab.value} value={tab.value}>
            {children}
          </TabBarPanel>
        ))}
        <TabBarList aria-label="App">
          {tabs.map((tab) => (
            <TabBarItem key={tab.value} value={tab.value} icon={tab.icon}>
              {tab.label}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </DeviceFrame>
  )
}

function PhonesPreview({ scale, count }: { scale: number; count: 1 | 2 }) {
  return (
    <div className="ts-stage-phones">
      <Phone scale={scale} tab="account">
        <AccountScreen />
      </Phone>
      {count === 2 ? (
        <Phone scale={scale} tab="inbox">
          <CampaignScreen />
        </Phone>
      ) : null}
    </div>
  )
}

function IpadPreview({ scale }: { scale: number }) {
  const [place, setPlace] = useState("Drafts")
  const places = [
    { name: "All campaigns", icon: InboxIcon },
    { name: "Drafts", icon: FilePenIcon, badge: 3 },
    { name: "Scheduled", icon: CalendarClockIcon },
    { name: "Sent", icon: MailIcon },
    { name: "Archive", icon: ArchiveIcon },
  ]
  return (
    <DeviceFrame device="ipad" scale={scale} role="group" aria-label="iPad preview">
      <div className="ts-ipad">
        <div className="ts-ipad-sidebar">
          <h2>Campaigns</h2>
          <Sidebar aria-label="Campaigns">
            <SidebarSection title="Library">
              {places.map(({ name, icon: Icon, badge }) => (
                <SidebarItem
                  key={name}
                  icon={<Icon />}
                  badge={badge}
                  current={place === name}
                  onClick={() => setPlace(name)}
                >
                  {name}
                </SidebarItem>
              ))}
            </SidebarSection>
          </Sidebar>
        </div>
        <div className="ts-ipad-main">
          <CampaignScreen />
        </div>
      </div>
    </DeviceFrame>
  )
}

export { IpadPreview, PhonesPreview }
