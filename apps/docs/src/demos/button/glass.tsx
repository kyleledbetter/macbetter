import { Button } from "macbetter/button"
import { PauseIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Button variant="glass" shape="circle" size="lg" aria-label="Previous Track">
        <SkipBackIcon aria-hidden="true" />
      </Button>
      <Button variant="glass" shape="circle" size="lg" aria-label="Pause">
        <PauseIcon aria-hidden="true" />
      </Button>
      <Button variant="glass" shape="circle" size="lg" aria-label="Next Track">
        <SkipForwardIcon aria-hidden="true" />
      </Button>
      <Button variant="glass" shape="capsule">
        Open in Music
      </Button>
    </>
  )
}
