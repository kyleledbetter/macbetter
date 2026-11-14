import { Toggle, ToggleGroup, ToggleIcon } from "@dreambase/stardust/toggle"
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react"

export default function Example() {
  return (
    <ToggleGroup multiple variant="bezeled" aria-label="Text style" defaultValue={["bold"]}>
      <Toggle value="bold" aria-label="Bold">
        <ToggleIcon>
          <BoldIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="italic" aria-label="Italic">
        <ToggleIcon>
          <ItalicIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="underline" aria-label="Underline">
        <ToggleIcon>
          <UnderlineIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="strikethrough" aria-label="Strikethrough">
        <ToggleIcon>
          <StrikethroughIcon />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
  )
}
