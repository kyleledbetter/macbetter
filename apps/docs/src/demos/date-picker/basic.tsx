import { DatePicker } from "macbetter/date-picker"
import { Field, FieldLabel } from "macbetter/field"

export default function Example() {
  return (
    <Field name="start-date">
      <FieldLabel>Start date</FieldLabel>
      <DatePicker defaultValue="2026-11-14" />
    </Field>
  )
}
