import { Checkbox } from "macbetter/checkbox"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--mb-checkbox-group-gap)" }}>
      <Checkbox defaultChecked>Show hidden files</Checkbox>
      <Checkbox>Show all filename extensions</Checkbox>
      <Checkbox defaultChecked="indeterminate">Keep folders on top</Checkbox>
    </div>
  )
}
