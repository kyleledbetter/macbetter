import { Gauge, GaugeLabel, GaugeValue } from "macbetter/gauge"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
      <Gauge variant="circular" size="sm" value={84} low={20} high={50} optimum={100}>
        <GaugeValue />
        <GaugeLabel>Battery</GaugeLabel>
      </Gauge>
      <Gauge variant="circular" value={7400} max={10000} format={{ notation: "compact" }}>
        <GaugeValue />
        <GaugeLabel>Steps</GaugeLabel>
      </Gauge>
      <Gauge variant="circular" size="lg" value={92} low={70} high={90} optimum={0}>
        <GaugeValue />
        <GaugeLabel>Storage</GaugeLabel>
      </Gauge>
    </div>
  )
}
