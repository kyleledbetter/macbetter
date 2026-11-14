import { Toggle, ToggleIcon } from "macbetter/toggle"
import { BellOffIcon, EyeIcon, MapPinIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Toggle variant="bezeled" defaultPressed>
        <ToggleIcon>
          <MapPinIcon />
        </ToggleIcon>
        Share Location
      </Toggle>
      <Toggle variant="bezeled">
        <ToggleIcon>
          <BellOffIcon />
        </ToggleIcon>
        Mute
      </Toggle>
      <Toggle variant="bezeled" tone="accent" defaultPressed>
        <ToggleIcon>
          <EyeIcon />
        </ToggleIcon>
        Watching
      </Toggle>
    </>
  )
}
