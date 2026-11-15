"use client"

import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { HomeBackdrop } from "macbetter/home-backdrop"
import { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle } from "macbetter/home-section"
import { LampIcon } from "@phosphor-icons/react/dist/ssr/Lamp"
import { TelevisionSimpleIcon } from "@phosphor-icons/react/dist/ssr/TelevisionSimple"
import { useState } from "react"

export default function Example() {
  const [lamp, setLamp] = useState(true)
  const [tv, setTv] = useState(false)

  return (
    <HomeBackdrop
      seed="Living Room"
      variant="wash"
      palette="dusk"
      aspect={1.2}
     
      style={{ width: "min(100%, 440px)", borderRadius: 20, overflow: "hidden" }}
    >
      <HomeSection aria-labelledby="living-title" style={{ padding: 20 }}>
        <HomeSectionHeader>
          <HomeSectionTitle id="living-title">Living Room</HomeSectionTitle>
          <HomeSectionSummary>70° · {lamp ? "1 light on" : "Lights off"}</HomeSectionSummary>
        </HomeSectionHeader>
        <AccessoryGrid>
          <AccessoryTile tint="yellow" icon={<LampIcon weight="fill" />} name="Floor lamp" status={lamp ? "60%" : "Off"} pressed={lamp} onPressedChange={setLamp} />
          <AccessoryTile tint="blue" icon={<TelevisionSimpleIcon weight="fill" />} name="TV" status={tv ? "On" : "Off"} pressed={tv} onPressedChange={setTv} />
        </AccessoryGrid>
      </HomeSection>
    </HomeBackdrop>
  )
}
