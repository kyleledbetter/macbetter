import { DeviceFrame } from "macbetter/device-frame"
import { List, ListRow, ListRowAccessory, ListRowTitle, ListRowValue, ListSection } from "macbetter/list"
import { NavigationBar, NavigationBarBackButton, NavigationStack } from "macbetter/navigation-bar"
import { Switch } from "macbetter/switch"

const networks = ["Larkspur 5G", "Harbor Guest", "Cedar & Pine", "Studio 4"]

export default function Example() {
  return (
    <DeviceFrame scale={0.78}>
      <NavigationStack style={{ background: "var(--mb-bg-grouped)" }}>
        <NavigationBar title="Wi-Fi">
          <NavigationBarBackButton>Settings</NavigationBarBackButton>
        </NavigationBar>
        <List>
          <ListSection>
            <ListRow>
              <ListRowTitle>Wi-Fi</ListRowTitle>
              <ListRowAccessory>
                <Switch aria-label="Wi-Fi" defaultChecked />
              </ListRowAccessory>
            </ListRow>
            <ListRow href="#home-network">
              <ListRowTitle>Driftwood Home</ListRowTitle>
              <ListRowAccessory type="checkmark" />
            </ListRow>
          </ListSection>
          <ListSection header="Other networks">
            {networks.map((network) => (
              <ListRow key={network} href={`#${network}`}>
                <ListRowTitle>{network}</ListRowTitle>
                <ListRowAccessory type="info" />
              </ListRow>
            ))}
          </ListSection>
          <ListSection footer="Known networks join automatically. If none are available, you'll be asked before joining a new one.">
            <ListRow href="#ask">
              <ListRowTitle>Ask to Join Networks</ListRowTitle>
              <ListRowValue>Notify</ListRowValue>
              <ListRowAccessory type="disclosure" />
            </ListRow>
            <ListRow href="#hotspot">
              <ListRowTitle>Auto-Join Hotspot</ListRowTitle>
              <ListRowValue>Ask to Join</ListRowValue>
              <ListRowAccessory type="disclosure" />
            </ListRow>
          </ListSection>
        </List>
      </NavigationStack>
    </DeviceFrame>
  )
}
