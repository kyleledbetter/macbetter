import { Button } from "@dreambase/stardust/button"
import { SeparatorLabel } from "@dreambase/stardust/separator"

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
