import { Toggle, ToggleGroup, ToggleIcon } from "macbetter/toggle"
import { TextAlignCenterIcon, TextAlignEndIcon, TextAlignJustifyIcon, TextAlignStartIcon } from "lucide-react"

export default function Example() {
  return (
    <ToggleGroup variant="bezeled" aria-label="Alignment" defaultValue={["start"]} deselectable={false}>
      <Toggle value="start" aria-label="Align Left">
        <ToggleIcon>
          <TextAlignStartIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="center" aria-label="Center">
        <ToggleIcon>
          <TextAlignCenterIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="end" aria-label="Align Right">
        <ToggleIcon>
          <TextAlignEndIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="justify" aria-label="Justify">
        <ToggleIcon>
          <TextAlignJustifyIcon />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
  )
}
