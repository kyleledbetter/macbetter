import { Field, FieldLabel } from "@dreambase/stardust/field"
import { NumberField } from "@dreambase/stardust/stepper"

export default function Example() {
  return (
    <Field layout="horizontal">
      <FieldLabel>Copies</FieldLabel>
      <NumberField defaultValue={1} min={1} max={99} />
    </Field>
  )
}
