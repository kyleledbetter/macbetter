import { Gauge, GaugeLabel, GaugeValue } from "macbetter/gauge"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
      <Gauge variant="circular" gradient value={42} max={300} low={50} high={150} optimum={0} format={{ style: "decimal" }}>
        <GaugeValue />
        <GaugeLabel>Air Quality</GaugeLabel>
      </Gauge>
      <Gauge variant="circular" gradient size="lg" value={7} max={11} low={3} high={6} optimum={0} format={{ style: "decimal" }}>
        <GaugeValue />
        <GaugeLabel>UV Index</GaugeLabel>
      </Gauge>
    </div>
  )
}
