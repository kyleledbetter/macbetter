import { Button } from "@dreambase/stardust/button"
import { PlusIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Button variant="filled">Follows the platform</Button>
      <Button variant="filled" shape="capsule">
        Capsule
      </Button>
      <Button variant="filled" shape="circle" aria-label="New Note">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button variant="tinted" shape="circle" aria-label="New Note">
        <PlusIcon aria-hidden="true" />
      </Button>
    </>
  )
}
