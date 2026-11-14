import { Field, FieldLabel } from "macbetter/field"
import { SecureField } from "macbetter/secure-field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 300 }}>
      <Field name="wifi-password">
        <FieldLabel>Wi-Fi password</FieldLabel>
        <SecureField defaultVisible defaultValue="maple-orbit-42" autoComplete="new-password" />
      </Field>
      <Field name="pin">
        <FieldLabel>Device PIN</FieldLabel>
        <SecureField toggle={false} inputMode="numeric" placeholder="Required" autoComplete="off" />
      </Field>
    </div>
  )
}
