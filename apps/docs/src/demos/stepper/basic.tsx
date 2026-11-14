import { Field, FieldLabel } from "macbetter/field"
import { NumberField } from "macbetter/stepper"

export default function Example() {
  return (
    <Field layout="horizontal">
      <FieldLabel>Copies</FieldLabel>
      <NumberField defaultValue={1} min={1} max={99} />
    </Field>
  )
}
