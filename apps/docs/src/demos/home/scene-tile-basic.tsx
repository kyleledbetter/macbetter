"use client"

import { SceneRow, SceneTile } from "macbetter/scene-tile"
import { FilmSlateIcon } from "@phosphor-icons/react/dist/ssr/FilmSlate"
import { HouseIcon } from "@phosphor-icons/react/dist/ssr/House"
import { MoonStarsIcon } from "@phosphor-icons/react/dist/ssr/MoonStars"
import { SunHorizonIcon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { useState } from "react"

const scenes = [
  { name: "Good Morning", icon: <SunHorizonIcon weight="fill" /> },
  { name: "Arrive Home", icon: <HouseIcon weight="fill" /> },
  { name: "Movie Time", icon: <FilmSlateIcon weight="fill" /> },
  { name: "Good Night", icon: <MoonStarsIcon weight="fill" /> },
]

export default function Example() {
  const [active, setActive] = useState("Good Morning")
  const [running, setRunning] = useState<string | null>(null)

  function run(name: string) {
    setRunning(name)
    setTimeout(() => {
      setRunning(null)
      setActive(name)
    }, 1200)
  }

  return (
    <SceneRow aria-label="Scenes" style={{ width: "min(100%, 380px)" }}>
      {scenes.map((scene) => (
        <SceneTile
          key={scene.name}
          icon={scene.icon}
          name={scene.name}
          active={active === scene.name}
          running={running === scene.name}
          onClick={() => run(scene.name)}
        />
      ))}
    </SceneRow>
  )
}
