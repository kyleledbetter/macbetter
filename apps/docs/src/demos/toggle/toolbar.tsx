import { Toggle, ToggleGroup, ToggleIcon } from "macbetter/toggle"
import { PanelLeftIcon, PanelRightIcon, SquareTerminalIcon } from "lucide-react"

export default function Example() {
  return (
    <ToggleGroup multiple aria-label="Panels" defaultValue={["navigator", "inspector"]}>
      <Toggle value="navigator" tone="accent" aria-label="Navigator">
        <ToggleIcon>
          <PanelLeftIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="console" tone="accent" aria-label="Console">
        <ToggleIcon>
          <SquareTerminalIcon />
        </ToggleIcon>
      </Toggle>
      <Toggle value="inspector" tone="accent" aria-label="Inspector">
        <ToggleIcon>
          <PanelRightIcon />
        </ToggleIcon>
      </Toggle>
    </ToggleGroup>
  )
}
