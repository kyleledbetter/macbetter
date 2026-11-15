"use client"

import {
  AccessoryTile,
  AccessoryTileDetail,
  AccessoryTileName,
  AccessoryTileStatus,
  AccessoryTileToggle,
} from "macbetter/accessory-tile"
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "macbetter/popover"
import { Slider } from "macbetter/slider"
import { LampPendantIcon } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { useState } from "react"

export default function Example() {
  const [on, setOn] = useState(true)
  const [brightness, setBrightness] = useState(80)

  return (
    <AccessoryTile tint="yellow" style={{ width: 200 }}>
      <AccessoryTileToggle aria-label="Pendant lights" pressed={on} onPressedChange={setOn}>
        <LampPendantIcon weight="fill" />
      </AccessoryTileToggle>
      <Popover presentation="auto">
        <PopoverTrigger render={<AccessoryTileDetail />}>
          <AccessoryTileName>Pendant lights</AccessoryTileName>
          <AccessoryTileStatus>{on ? `${brightness}%` : "Off"}</AccessoryTileStatus>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Pendant lights</PopoverTitle>
          <PopoverDescription>Kitchen</PopoverDescription>
          <div style={{ marginTop: 12, minWidth: 240 }}>
            <Slider
              aria-label="Brightness"
              value={on ? brightness : 0}
              onValueChange={(value) => {
                setBrightness(value as number)
                setOn((value as number) > 0)
              }}
              thumbLabel="Brightness"
            />
          </div>
        </PopoverContent>
      </Popover>
    </AccessoryTile>
  )
}
