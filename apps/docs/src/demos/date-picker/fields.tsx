import { DateField, TimeField } from "@dreambase/stardust/date-picker"
import { Field, FieldGroup, FieldLabel } from "@dreambase/stardust/field"

export default function Example() {
  return (
    <FieldGroup>
      <Field name="birthday">
        <FieldLabel>Birthday</FieldLabel>
        <DateField defaultValue="1994-03-08" />
      </Field>
      <Field name="reminder">
        <FieldLabel>Remind me at</FieldLabel>
        <TimeField defaultValue="08:30" />
      </Field>
      <Field name="departure">
        <FieldLabel>Departure</FieldLabel>
        <DateField granularity="minute" defaultValue="2026-12-19T17:45" />
      </Field>
    </FieldGroup>
  )
}
