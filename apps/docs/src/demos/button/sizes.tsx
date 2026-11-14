import { Button } from "macbetter/button"

export default function Example() {
  return (
    <>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button variant="filled" size="sm">
        Small
      </Button>
      <Button variant="filled" size="md">
        Medium
      </Button>
      <Button variant="filled" size="lg">
        Large
      </Button>
    </>
  )
}
