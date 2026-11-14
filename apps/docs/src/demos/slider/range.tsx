import { Field, FieldLabel } from "macbetter/field"
import { Slider, SliderControl, SliderValue } from "macbetter/slider"

export default function Example() {
  return (
    <Field style={{ width: "100%", maxWidth: 360 }}>
      <Slider
        defaultValue={[120, 340]}
        min={0}
        max={500}
        step={10}
        minStepsBetweenThumbs={2}
        format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <FieldLabel>Price per night</FieldLabel>
          <SliderValue />
        </div>
        <SliderControl thumbLabel={["Minimum price", "Maximum price"]} />
      </Slider>
    </Field>
  )
}
