import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "macbetter/list"
import { Switch } from "macbetter/switch"
import {
  AntennaIcon,
  BellIcon,
  BluetoothIcon,
  HourglassIcon,
  LinkIcon,
  MoonIcon,
  PlaneIcon,
  SettingsIcon,
  Volume2Icon,
  WifiIcon,
} from "lucide-react"

export default function Example() {
  return (
    <List style={{ width: "100%", maxWidth: 560, marginInline: "auto" }}>
      <ListSection>
        <ListRow>
          <ListRowIcon color="orange">
            <PlaneIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Airplane Mode</ListRowTitle>
          <ListRowAccessory>
            <Switch aria-label="Airplane Mode" />
          </ListRowAccessory>
        </ListRow>
        <ListRow href="#wi-fi">
          <ListRowIcon color="blue">
            <WifiIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Wi-Fi</ListRowTitle>
          <ListRowValue>Macbetter HQ</ListRowValue>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#bluetooth">
          <ListRowIcon color="blue">
            <BluetoothIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Bluetooth</ListRowTitle>
          <ListRowValue>On</ListRowValue>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#cellular">
          <ListRowIcon color="green">
            <AntennaIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Cellular</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#hotspot">
          <ListRowIcon color="green">
            <LinkIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Personal Hotspot</ListRowTitle>
          <ListRowValue>Off</ListRowValue>
          <ListRowAccessory type="disclosure" />
        </ListRow>
      </ListSection>

      <ListSection>
        <ListRow href="#notifications">
          <ListRowIcon color="red">
            <BellIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Notifications</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#sounds">
          <ListRowIcon color="pink">
            <Volume2Icon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Sounds &amp; Haptics</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#focus">
          <ListRowIcon color="indigo">
            <MoonIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Focus</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#screen-time">
          <ListRowIcon color="indigo">
            <HourglassIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Screen Time</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
      </ListSection>

      <ListSection footer="Updates download overnight while your device is charging and connected to Wi-Fi.">
        <ListRow href="#general">
          <ListRowIcon color="gray">
            <SettingsIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>General</ListRowTitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
      </ListSection>
    </List>
  )
}
