import { CodeField } from "macbetter/code-field"
import { Field, FieldDescription, FieldLabel } from "macbetter/field"

export default function Example() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <CodeField />
      <FieldDescription>Enter the code sent to your iPhone.</FieldDescription>
    </Field>
  )
}
