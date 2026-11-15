"use client"

import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { FanIcon } from "@phosphor-icons/react/dist/ssr/Fan"
import { LampPendantIcon } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LockIcon } from "@phosphor-icons/react/dist/ssr/Lock"
import { ThermometerIcon } from "@phosphor-icons/react/dist/ssr/Thermometer"
import { useState } from "react"

export default function Example() {
  const [pendants, setPendants] = useState(true)
  const [cabinet, setCabinet] = useState(false)
  const [fan, setFan] = useState(false)
  const [opened, setOpened] = useState<string | null>(null)

  return (
    <div style={{ display: "grid", gap: 12, width: "min(100%, 380px)" }}>
      <AccessoryGrid>
        <AccessoryTile
          tint="yellow"
          icon={<LampPendantIcon weight="fill" />}
          name="Pendant lights"
          status={pendants ? "80%" : "Off"}
          pressed={pendants}
          onPressedChange={setPendants}
          onOpen={() => setOpened("Pendant lights")}
        />
        <AccessoryTile
          tint="yellow"
          icon={<LightbulbIcon weight="fill" />}
          name="Under-cabinet lights"
          status={cabinet ? "100%" : "Off"}
          pressed={cabinet}
          onPressedChange={setCabinet}
          onOpen={() => setOpened("Under-cabinet lights")}
        />
        <AccessoryTile
          tint="teal"
          icon={<FanIcon weight="fill" />}
          name="Ceiling fan"
          status={fan ? "Speed 2" : "Off"}
          pressed={fan}
          onPressedChange={setFan}
          onOpen={() => setOpened("Ceiling fan")}
        />
        <AccessoryTile
          tint="orange"
          active
          toggleable={false}
          icon={<ThermometerIcon weight="fill" />}
          name="Thermostat"
          status="Heating to 70°"
          onOpen={() => setOpened("Thermostat")}
        />
        <AccessoryTile
          tint="blue"
          icon={<LockIcon weight="fill" />}
          name="Back door"
          room="Kitchen"
          status="Locked"
          defaultPressed
          onOpen={() => setOpened("Back door")}
        />
      </AccessoryGrid>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {opened ? `Opened the controls for ${opened}.` : "Tap an icon to switch it, or a name to open its controls."}
      </p>
    </div>
  )
}
