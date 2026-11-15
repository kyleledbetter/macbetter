"use client"

import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle } from "macbetter/home-section"
import { SceneRow, SceneTile } from "macbetter/scene-tile"
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot"
import { Drop } from "@phosphor-icons/react/dist/ssr/Drop"
import { ForkKnife } from "@phosphor-icons/react/dist/ssr/ForkKnife"
import { LampPendant } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { Lock } from "@phosphor-icons/react/dist/ssr/Lock"
import { Thermometer } from "@phosphor-icons/react/dist/ssr/Thermometer"
import * as React from "react"

export default function KitchenRoom() {
  const [pendants, setPendants] = React.useState(true)
  const [faucet, setFaucet] = React.useState(false)
  const [scene, setScene] = React.useState<string | null>(null)

  return (
    <div style={{ display: "grid", gap: 18, width: "min(100%, 400px)" }}>
      <HomeSection>
        <HomeSectionHeader>
          <HomeSectionTitle>Kitchen</HomeSectionTitle>
          <HomeSectionSummary>69° · {pendants ? "1 light on" : "Lights off"} · Humidity 41%</HomeSectionSummary>
        </HomeSectionHeader>
        <SceneRow aria-label="Kitchen scenes">
          <SceneTile
            icon={<CookingPot weight="fill" aria-hidden="true" />}
            name="Cooking"
            active={scene === "cooking"}
            onClick={() => {
              setScene("cooking")
              setPendants(true)
            }}
          />
          <SceneTile
            icon={<ForkKnife weight="fill" aria-hidden="true" />}
            name="Dinner"
            active={scene === "dinner"}
            onClick={() => setScene("dinner")}
          />
        </SceneRow>
      </HomeSection>
      <AccessoryGrid>
        <AccessoryTile
          tint="yellow"
          icon={<LampPendant weight="fill" />}
          name="Pendant lights"
          status={pendants ? "80%" : "Off"}
          pressed={pendants}
          onPressedChange={setPendants}
        />
        <AccessoryTile
          tint="blue"
          icon={<Drop weight="fill" />}
          name="Faucet"
          status={faucet ? "On" : "Off"}
          pressed={faucet}
          onPressedChange={setFaucet}
        />
        <AccessoryTile tint="orange" icon={<Thermometer weight="fill" />} name="Thermostat" status="Heat to 70°" active toggleable={false} />
        <AccessoryTile tint="blue" icon={<Lock weight="fill" />} name="Back door" status="Locked" toggleable={false} />
      </AccessoryGrid>
    </div>
  )
}
