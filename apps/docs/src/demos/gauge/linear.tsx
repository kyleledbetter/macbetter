import { Gauge, GaugeLabel, GaugeValue } from "macbetter/gauge"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 320 }}>
      <Gauge value={182} max={256} format={{ style: "unit", unit: "gigabyte" }}>
        <GaugeLabel>Macintosh HD</GaugeLabel>
        <GaugeValue />
      </Gauge>
      <Gauge value={18} low={20} high={50} optimum={100}>
        <GaugeLabel>Battery</GaugeLabel>
        <GaugeValue />
      </Gauge>
    </div>
  )
}
