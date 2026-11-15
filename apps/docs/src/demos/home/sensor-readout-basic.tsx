import { SensorGroup, SensorReadout } from "macbetter/sensor-readout"
import { BatteryLowIcon } from "@phosphor-icons/react/dist/ssr/BatteryLow"
import { DoorIcon } from "@phosphor-icons/react/dist/ssr/Door"
import { DropHalfIcon } from "@phosphor-icons/react/dist/ssr/DropHalf"
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop"
import { PersonSimpleWalkIcon } from "@phosphor-icons/react/dist/ssr/PersonSimpleWalk"
import { ThermometerSimpleIcon } from "@phosphor-icons/react/dist/ssr/ThermometerSimple"
import { WindIcon } from "@phosphor-icons/react/dist/ssr/Wind"

export default function Example() {
  return (
    <SensorGroup style={{ width: "min(100%, 380px)" }}>
      <SensorReadout icon={<ThermometerSimpleIcon weight="fill" />} label="Temperature" value="71°" detail="Kitchen" />
      <SensorReadout icon={<DropHalfIcon weight="fill" />} label="Humidity" value="41%" detail="Kitchen" />
      <SensorReadout
        icon={<WindIcon weight="bold" />}
        label="Air quality"
        value="Good"
        detail="PM2.5 9 µg/m³"
        meter={{ value: 4, min: 1, max: 5, label: "Air quality, 4 of 5" }}
      />
      <SensorReadout icon={<DoorIcon weight="fill" />} label="Back door" value="Closed" detail="Contact sensor" />
      <SensorReadout icon={<PersonSimpleWalkIcon weight="fill" />} label="Motion" value="Detected" detail="Hallway, 2 min ago" />
      <SensorReadout
        icon={<BatteryLowIcon weight="fill" />}
        label="Battery"
        value="12%"
        detail="Back door sensor"
        level="warning"
        meter={{ value: 12 }}
      />
      <SensorReadout icon={<DropIcon weight="fill" />} label="Leak sensor" value="Leak Detected" detail="Under the sink" level="alert" />
    </SensorGroup>
  )
}
