import { DeviceFrame } from "macbetter/device-frame"
import { List, ListRow, ListRowSubtitle, ListRowTitle, ListRowValue, ListSection } from "macbetter/list"
import { NavigationBar, NavigationStack } from "macbetter/navigation-bar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "macbetter/tab-bar"
import { AlarmClockIcon, GlobeIcon, HourglassIcon, TimerIcon } from "lucide-react"

const cities = [
  { city: "Cupertino", offset: "Today, +0HRS", time: "9:41" },
  { city: "New York", offset: "Today, +3HRS", time: "12:41" },
  { city: "Lisbon", offset: "Today, +8HRS", time: "17:41" },
  { city: "Nairobi", offset: "Today, +10HRS", time: "19:41" },
  { city: "Tokyo", offset: "Tomorrow, +16HRS", time: "1:41" },
  { city: "Auckland", offset: "Tomorrow, +20HRS", time: "5:41" },
]

const tabs = [
  { value: "world", label: "World Clock", icon: <GlobeIcon /> },
  { value: "alarms", label: "Alarms", icon: <AlarmClockIcon /> },
  { value: "stopwatch", label: "Stopwatch", icon: <TimerIcon /> },
  { value: "timers", label: "Timers", icon: <HourglassIcon /> },
]

export default function Example() {
  return (
    <DeviceFrame scale={0.78}>
      <TabBar defaultValue="world">
        {tabs.map((tab) => (
          <TabBarPanel key={tab.value} value={tab.value}>
            <NavigationStack>
              <NavigationBar title={tab.label} largeTitle />
              <List variant="plain">
                <ListSection>
                  {cities.map((item) => (
                    <ListRow key={item.city}>
                      <ListRowSubtitle style={{ gridRow: 2 }}>{item.offset}</ListRowSubtitle>
                      <ListRowTitle style={{ gridRow: 3, fontSize: 24, lineHeight: "30px" }}>{item.city}</ListRowTitle>
                      <ListRowValue style={{ fontSize: 44, lineHeight: "52px", fontWeight: 300, color: "var(--mb-label)" }}>
                        {item.time}
                      </ListRowValue>
                    </ListRow>
                  ))}
                </ListSection>
              </List>
            </NavigationStack>
          </TabBarPanel>
        ))}
        <TabBarList variant="classic" aria-label="Clock">
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
