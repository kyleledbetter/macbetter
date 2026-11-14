import { Slider } from "macbetter/slider"

const bands = [
  { label: "60 Hz", value: 62 },
  { label: "250 Hz", value: 48 },
  { label: "1 kHz", value: 55 },
  { label: "4 kHz", value: 70 },
  { label: "16 kHz", value: 40 },
]

export default function Example() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {bands.map((band) => (
        <div key={band.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Slider orientation="vertical" defaultValue={band.value} thumbLabel={band.label} />
          <span aria-hidden="true" style={{ color: "var(--mb-label-secondary)", font: "var(--mb-text-caption)" }}>
            {band.label}
          </span>
        </div>
      ))}
    </div>
  )
}
