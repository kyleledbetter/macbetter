import { CodeField } from "macbetter/code-field"
import { Field, FieldError, FieldLabel } from "macbetter/field"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: "100%" }}>
      <Field name="recovery">
        <FieldLabel>Recovery key</FieldLabel>
        <CodeField length={8} groupSize={4} pattern="alphanumeric" defaultValue="7HQ2VX" />
      </Field>
      <Field name="expired" invalid>
        <FieldLabel>Sign-in code</FieldLabel>
        <CodeField length={6} groupSize={3} defaultValue="482913" />
        <FieldError match>That code has expired. Request a new one.</FieldError>
      </Field>
    </div>
  )
}
