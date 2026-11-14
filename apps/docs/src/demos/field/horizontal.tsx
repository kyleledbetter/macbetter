import { Field, FieldDescription, FieldGroup, FieldLabel } from "macbetter/field"
import { SecureField } from "macbetter/secure-field"
import { TextField } from "macbetter/text-field"

export default function Example() {
  return (
    <FieldGroup layout="horizontal" style={{ width: "100%", maxWidth: 420 }}>
      <Field name="account-name">
        <FieldLabel>Name:</FieldLabel>
        <TextField defaultValue="Hollis Grant" autoComplete="name" />
      </Field>
      <Field name="email">
        <FieldLabel>Email Address:</FieldLabel>
        <TextField type="email" placeholder="name@example.com" autoComplete="email" />
      </Field>
      <Field name="password">
        <FieldLabel>Password:</FieldLabel>
        <SecureField placeholder="Required" autoComplete="current-password" />
        <FieldDescription>Stored in your keychain.</FieldDescription>
      </Field>
    </FieldGroup>
  )
}
