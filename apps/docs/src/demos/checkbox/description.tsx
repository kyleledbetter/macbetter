import { Checkbox } from "macbetter/checkbox"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 360 }}>
      <Checkbox defaultChecked description="Downloads apps you buy on your other devices.">
        Automatic downloads
      </Checkbox>
      <Checkbox description="Installs updates overnight while your Mac is charging.">
        Install app updates
      </Checkbox>
    </div>
  )
}
