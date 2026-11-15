import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { LampIcon } from "@phosphor-icons/react/dist/ssr/Lamp"
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { TelevisionIcon } from "@phosphor-icons/react/dist/ssr/Television"

export default function Example() {
  return (
    <AccessoryGrid style={{ width: "min(100%, 380px)" }}>
      <AccessoryTile size="lg" tint="indigo" icon={<TelevisionIcon weight="fill" />} name="TV" room="Living room" status="Apple TV" defaultPressed />
      <AccessoryTile size="sm" tint="yellow" icon={<LampIcon weight="fill" />} name="Floor lamp" defaultPressed />
      <AccessoryTile size="sm" tint="yellow" icon={<LampIcon weight="fill" />} name="Reading lamp" />
      <AccessoryTile size="md" tint="yellow" icon={<LightbulbIcon weight="fill" />} name="Ceiling lights" status="Off" />
    </AccessoryGrid>
  )
}
