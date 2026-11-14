import { Button } from "@dreambase/stardust/button"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 12, alignItems: "center" }}>
      <Button variant="filled">Continue</Button>
      <Button variant="filled" tone="neutral">
        Continue
      </Button>
      <Button variant="filled" tone="destructive">
        Delete
      </Button>
      <Button variant="tinted">Continue</Button>
      <Button variant="tinted" tone="neutral">
        Continue
      </Button>
      <Button variant="tinted" tone="destructive">
        Delete
      </Button>
      <Button variant="bezeled">Continue</Button>
      <Button variant="bezeled" tone="neutral">
        Continue
      </Button>
      <Button variant="bezeled" tone="destructive">
        Delete
      </Button>
    </div>
  )
}
