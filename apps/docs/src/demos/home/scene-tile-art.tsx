"use client"

import { Artwork } from "macbetter/artwork"
import { SceneRow, SceneTile } from "macbetter/scene-tile"
import { CookingPotIcon } from "@phosphor-icons/react/dist/ssr/CookingPot"
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr/ForkKnife"
import { MoonStarsIcon } from "@phosphor-icons/react/dist/ssr/MoonStars"
import { SunHorizonIcon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { useState } from "react"

const scenes = [
  { name: "Good Morning", icon: <SunHorizonIcon weight="fill" />, palette: "dawn", time: "dawn" },
  { name: "Cooking", icon: <CookingPotIcon weight="fill" />, palette: "amber", time: "day" },
  { name: "Dinner", icon: <ForkKnifeIcon weight="fill" />, palette: "dusk", time: "dusk" },
  { name: "Good Night", icon: <MoonStarsIcon weight="fill" />, palette: "night", time: "night" },
] as const

export default function Example() {
  const [active, setActive] = useState("Cooking")

  return (
    <SceneRow aria-label="Scenes" style={{ width: "min(100%, 380px)" }}>
      {scenes.map((scene) => (
        <SceneTile
          key={scene.name}
          icon={scene.icon}
          name={scene.name}
          active={active === scene.name}
          background={<Artwork seed={scene.name} variant="wash" palette={scene.palette} time={scene.time} aspect={3} />}
          onClick={() => setActive(scene.name)}
        />
      ))}
    </SceneRow>
  )
}
