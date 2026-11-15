"use client"

import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle } from "macbetter/home-section"
import { LampPendantIcon } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { OvenIcon } from "@phosphor-icons/react/dist/ssr/Oven"
import { PlugIcon } from "@phosphor-icons/react/dist/ssr/Plug"
import { useState } from "react"

export default function Example() {
  const [shown, setShown] = useState(false)

  return (
    <HomeSection aria-labelledby="kitchen-title" style={{ width: "min(100%, 380px)" }}>
      <HomeSectionHeader>
        <HomeSectionTitle id="kitchen-title" onClick={() => setShown(true)}>
          Kitchen
        </HomeSectionTitle>
        <HomeSectionSummary>{shown ? "Showing Kitchen" : "71° · 1 light on · Humidity 41%"}</HomeSectionSummary>
      </HomeSectionHeader>
      <AccessoryGrid>
        <AccessoryTile tint="yellow" icon={<LampPendantIcon weight="fill" />} name="Pendant lights" status="80%" defaultPressed />
        <AccessoryTile tint="green" icon={<PlugIcon weight="fill" />} name="Coffee maker" status="Off" />
        <AccessoryTile tint="orange" icon={<OvenIcon weight="fill" />} name="Oven" status="Off" />
      </AccessoryGrid>
    </HomeSection>
  )
}
