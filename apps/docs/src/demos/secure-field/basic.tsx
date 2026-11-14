import { Field, FieldDescription, FieldLabel } from "macbetter/field"
import { SecureField } from "macbetter/secure-field"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <SecureField defaultValue="correct-horse" autoComplete="current-password" />
        <FieldDescription>Use at least 8 characters.</FieldDescription>
      </Field>
    </div>
  )
}
