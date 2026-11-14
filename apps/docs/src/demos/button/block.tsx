import { Button } from "macbetter/button"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
      <Button variant="filled" size="lg" block>
        Continue
      </Button>
      <Button variant="plain" size="lg" block>
        Not Now
      </Button>
    </div>
  )
}
