import { Checkbox } from "macbetter/checkbox"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--mb-checkbox-group-gap)" }}>
      <Checkbox disabled defaultChecked>
        Use iCloud Keychain
      </Checkbox>
      <Checkbox disabled>Share across devices</Checkbox>
    </div>
  )
}
