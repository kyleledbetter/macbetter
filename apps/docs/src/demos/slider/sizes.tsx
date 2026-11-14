import { Slider } from "macbetter/slider"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 360 }}>
      <Slider size="sm" defaultValue={30} thumbLabel="Icon size" />
      <Slider size="md" defaultValue={70} thumbLabel="Text size" />
    </div>
  )
}
