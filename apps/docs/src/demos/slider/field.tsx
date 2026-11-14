import { Field, FieldLabel } from "macbetter/field"
import { Slider, SliderControl, SliderValue } from "macbetter/slider"

export default function Example() {
  return (
    <Field style={{ width: "100%", maxWidth: 360 }}>
      <Slider defaultValue={0.8} min={0} max={1} step={0.01} format={{ style: "percent" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <FieldLabel>Brightness</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl />
      </Slider>
    </Field>
  )
}
