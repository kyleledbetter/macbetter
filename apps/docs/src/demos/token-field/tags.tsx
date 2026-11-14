import { Field, FieldDescription, FieldLabel } from "macbetter/field"
import { TokenField } from "macbetter/token-field"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 340 }}>
      <Field name="tags">
        <FieldLabel>Tags</FieldLabel>
        <TokenField
          removable
          placeholder="Add a tag"
          defaultValue={[
            { type: "token", value: "finance", label: "finance" },
            { type: "token", value: "weekly", label: "weekly" },
            { type: "token", value: "board-ready", label: "board-ready" },
          ]}
        />
        <FieldDescription>Type a tag and a comma or Return.</FieldDescription>
      </Field>
    </div>
  )
}
