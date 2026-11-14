import { Field, FieldGroup, FieldLabel } from "@dreambase/stardust/field"
import { NumberField } from "@dreambase/stardust/stepper"

export default function Example() {
  return (
    <FieldGroup layout="horizontal">
      <Field>
        <FieldLabel>Font size</FieldLabel>
        <NumberField defaultValue={13} min={8} max={72} step={1} />
      </Field>
      <Field>
        <FieldLabel>Line spacing</FieldLabel>
        <NumberField defaultValue={1.2} min={0.8} max={3} step={0.1} format={{ minimumFractionDigits: 1 }} />
      </Field>
      <Field>
        <FieldLabel>Opacity</FieldLabel>
        <NumberField defaultValue={0.75} min={0} max={1} step={0.05} format={{ style: "percent" }} />
      </Field>
    </FieldGroup>
  )
}
