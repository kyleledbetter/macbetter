import { SensorReadout } from "macbetter/sensor-readout"
import { DropHalfIcon } from "@phosphor-icons/react/dist/ssr/DropHalf"
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop"
import { ThermometerSimpleIcon } from "@phosphor-icons/react/dist/ssr/ThermometerSimple"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, width: "min(100%, 420px)" }}>
      <SensorReadout layout="tile" icon={<ThermometerSimpleIcon weight="fill" />} label="Temperature" value="71°" />
      <SensorReadout layout="tile" icon={<DropHalfIcon weight="fill" />} label="Humidity" value="41%" meter={{ value: 41 }} />
      <SensorReadout layout="tile" icon={<DropIcon weight="fill" />} label="Under the sink" value="Leak" level="alert" />
    </div>
  )
}
