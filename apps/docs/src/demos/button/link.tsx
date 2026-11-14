import { Button } from "macbetter/button"
import { ArrowUpRightIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Button variant="filled" render={<a href="/docs/installation" />}>
        Get Started
      </Button>
      <Button variant="plain" render={<a href="https://ui-sdk.dev" target="_blank" rel="noreferrer" />}>
        ui-sdk docs
        <ArrowUpRightIcon aria-hidden="true" />
      </Button>
    </>
  )
}
