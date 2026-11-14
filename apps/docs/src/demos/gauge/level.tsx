import { Gauge, GaugeLabel, GaugeValue } from "@dreambase/stardust/gauge"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <Gauge variant="level" value={30} low={60} high={85} optimum={0} segments={12}>
        <GaugeLabel>Memory Pressure</GaugeLabel>
        <GaugeValue />
      </Gauge>
      <Gauge variant="level" value={72} low={60} high={85} optimum={0} segments={12}>
        <GaugeLabel>CPU Load</GaugeLabel>
        <GaugeValue />
      </Gauge>
      <Gauge variant="level" value={94} low={60} high={85} optimum={0} segments={12}>
        <GaugeLabel>Disk Usage</GaugeLabel>
        <GaugeValue />
      </Gauge>
    </div>
  )
}
