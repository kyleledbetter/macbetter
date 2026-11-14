import { ColorWell } from "macbetter/color-well"

const brand = ["#ee5700", "#f67f01", "#028f71", "#52c6a0", "#0a1c13", "#f1f7f3"]

export default function Example() {
  return <ColorWell aria-label="Brand color" alpha={false} presets={brand} defaultValue="#028f71" />
}
