import { Checkbox } from "@dreambase/stardust/checkbox"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sd-checkbox-group-gap)" }}>
      <Checkbox defaultChecked>Show hidden files</Checkbox>
      <Checkbox>Show all filename extensions</Checkbox>
      <Checkbox defaultChecked="indeterminate">Keep folders on top</Checkbox>
    </div>
  )
}
