import { Field, FieldDescription, FieldLabel } from "@dreambase/stardust/field"
import { TextField } from "@dreambase/stardust/text-field"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 320 }}>
      <Field name="display-name">
        <FieldLabel>Display name</FieldLabel>
        <TextField defaultValue="Hollis Grant" autoComplete="name" />
        <FieldDescription>Shown to people you share boards with.</FieldDescription>
      </Field>
    </div>
  )
}
