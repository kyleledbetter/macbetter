import { Button } from "macbetter/button"
import { SeparatorLabel } from "macbetter/separator"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 320 }}>
      <Button variant="filled" block>
        Sign In with Passkey
      </Button>
      <SeparatorLabel>or</SeparatorLabel>
      <Button block>Email Me a Link</Button>
    </div>
  )
}
