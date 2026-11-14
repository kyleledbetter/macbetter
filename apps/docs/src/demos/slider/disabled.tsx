import { Slider } from "@dreambase/stardust/slider"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Slider disabled defaultValue={40} thumbLabel="Microphone volume" />
    </div>
  )
}
