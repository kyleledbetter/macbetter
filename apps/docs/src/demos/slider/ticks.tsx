import { Slider } from "@dreambase/stardust/slider"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 360 }}>
      <Slider defaultValue={3} min={1} max={5} step={1} ticks thumbLabel="Key repeat rate" />
      <div
        aria-hidden="true"
        style={{ display: "flex", justifyContent: "space-between", color: "var(--sd-label-secondary)", font: "var(--sd-text-caption)" }}
      >
        <span>Slow</span>
        <span>Fast</span>
      </div>
    </div>
  )
}
