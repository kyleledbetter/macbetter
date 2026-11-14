import { Checkbox } from "@dreambase/stardust/checkbox"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sd-checkbox-group-gap)" }}>
      <Checkbox disabled defaultChecked>
        Use iCloud Keychain
      </Checkbox>
      <Checkbox disabled>Share across devices</Checkbox>
    </div>
  )
}
