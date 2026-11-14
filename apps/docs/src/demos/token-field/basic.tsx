import { Field, FieldLabel } from "macbetter/field"
import { TokenField } from "macbetter/token-field"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Field layout="horizontal">
        <FieldLabel>To:</FieldLabel>
        <TokenField
          name="recipients"
          placeholder="Add people"
          defaultValue={[
            { type: "token", value: "hollis@example.com", label: "Hollis Grant" },
            { type: "token", value: "ines@example.com", label: "Inès Moreau" },
          ]}
        />
      </Field>
    </div>
  )
}
