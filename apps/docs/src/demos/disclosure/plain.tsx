import { Disclosure, DisclosureButton, DisclosureContent } from "macbetter/disclosure"
import { Switch } from "macbetter/switch"

export default function Example() {
  return (
    <Disclosure style={{ width: "100%", maxWidth: 420 }}>
      <DisclosureButton>Advanced</DisclosureButton>
      <DisclosureContent>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          Use hardware acceleration
          <Switch defaultChecked />
        </label>
      </DisclosureContent>
    </Disclosure>
  )
}
