import { CodeField } from "@dreambase/stardust/code-field"
import { Field, FieldDescription, FieldLabel } from "@dreambase/stardust/field"

export default function Example() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <CodeField />
      <FieldDescription>Enter the code sent to your iPhone.</FieldDescription>
    </Field>
  )
}
