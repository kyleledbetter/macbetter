import { Field, FieldDescription, FieldLabel } from "macbetter/field"
import { TextArea } from "macbetter/text-area"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 340 }}>
      <Field name="notes">
        <FieldLabel>Notes</FieldLabel>
        <TextArea placeholder="What changed in this release?" maxRows={6} />
        <FieldDescription>Grows as you type, up to six lines.</FieldDescription>
      </Field>
    </div>
  )
}
