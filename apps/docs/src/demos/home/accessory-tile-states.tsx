import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { DoorOpenIcon } from "@phosphor-icons/react/dist/ssr/DoorOpen"
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop"
import { GarageIcon } from "@phosphor-icons/react/dist/ssr/Garage"
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { PlugIcon } from "@phosphor-icons/react/dist/ssr/Plug"
import { SpeakerHifiIcon } from "@phosphor-icons/react/dist/ssr/SpeakerHifi"

export default function Example() {
  return (
    <AccessoryGrid style={{ width: "min(100%, 380px)" }}>
      <AccessoryTile tint="yellow" partial icon={<LightbulbIcon weight="fill" />} name="Downlights" status="2 of 4 on" />
      <AccessoryTile tint="red" state="alert" toggleable={false} icon={<DropIcon weight="fill" />} name="Leak sensor" status="Leak Detected" />
      <AccessoryTile tint="green" state="unreachable" icon={<PlugIcon weight="fill" />} name="Coffee maker" />
      <AccessoryTile tint="blue" state="updating" icon={<GarageIcon weight="fill" />} name="Garage door" status="Opening…" defaultPressed />
      <AccessoryTile tint="orange" active toggleable={false} icon={<DoorOpenIcon weight="fill" />} name="Patio door" status="Open" />
      <AccessoryTile tint="indigo" icon={<SpeakerHifiIcon weight="fill" />} name="HomePod" status="Paused" />
    </AccessoryGrid>
  )
}
