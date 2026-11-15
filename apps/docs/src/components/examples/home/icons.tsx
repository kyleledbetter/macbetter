import { Coffee } from "@phosphor-icons/react/dist/ssr/Coffee"
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot"
import { Door } from "@phosphor-icons/react/dist/ssr/Door"
import { Drop } from "@phosphor-icons/react/dist/ssr/Drop"
import { DropHalfBottom } from "@phosphor-icons/react/dist/ssr/DropHalfBottom"
import { Fan } from "@phosphor-icons/react/dist/ssr/Fan"
import { Fire } from "@phosphor-icons/react/dist/ssr/Fire"
import { ForkKnife } from "@phosphor-icons/react/dist/ssr/ForkKnife"
import { Garage } from "@phosphor-icons/react/dist/ssr/Garage"
import { Lamp } from "@phosphor-icons/react/dist/ssr/Lamp"
import { LampPendant } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { Leaf } from "@phosphor-icons/react/dist/ssr/Leaf"
import { Lightbulb } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LightbulbFilament } from "@phosphor-icons/react/dist/ssr/LightbulbFilament"
import { Lock } from "@phosphor-icons/react/dist/ssr/Lock"
import { LockOpen } from "@phosphor-icons/react/dist/ssr/LockOpen"
import { MoonStars } from "@phosphor-icons/react/dist/ssr/MoonStars"
import { Oven } from "@phosphor-icons/react/dist/ssr/Oven"
import { PersonSimpleWalk } from "@phosphor-icons/react/dist/ssr/PersonSimpleWalk"
import { Plug } from "@phosphor-icons/react/dist/ssr/Plug"
import { Rows } from "@phosphor-icons/react/dist/ssr/Rows"
import { SecurityCamera } from "@phosphor-icons/react/dist/ssr/SecurityCamera"
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr/ShieldCheck"
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut"
import { SpeakerHifi } from "@phosphor-icons/react/dist/ssr/SpeakerHifi"
import { SunHorizon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { Television } from "@phosphor-icons/react/dist/ssr/Television"
import { Thermometer } from "@phosphor-icons/react/dist/ssr/Thermometer"
import { Wind } from "@phosphor-icons/react/dist/ssr/Wind"
import type * as React from "react"
import type { Accessory, IconName, Scene, Tint } from "./data"

type Glyph = React.ComponentType<{ weight?: "fill" | "regular" | "bold"; "aria-hidden"?: boolean | "true" }>

const glyphs: Record<IconName, Glyph> = {
  pendant: LampPendant,
  bulb: Lightbulb,
  lamp: Lamp,
  strip: LightbulbFilament,
  coffee: Coffee,
  faucet: Drop,
  fan: Fan,
  shade: Rows,
  speaker: SpeakerHifi,
  tv: Television,
  thermostat: Thermometer,
  lock: Lock,
  garage: Garage,
  leak: DropHalfBottom,
  smoke: Fire,
  air: Wind,
  door: Door,
  motion: PersonSimpleWalk,
  camera: SecurityCamera,
  oven: Oven,
  plug: Plug,
}

/** A filled glyph for an accessory, with the lock's shackle following its state. */
function AccessoryGlyph({ accessory }: { accessory: Accessory }) {
  const Icon = accessory.kind === "lock" && accessory.state !== "secured" ? LockOpen : glyphs[accessory.icon]
  return <Icon weight="fill" aria-hidden="true" />
}

/** The color an accessory's icon takes when it's on, as the Home app colors them. */
function tintOf(accessory: Accessory): Tint {
  switch (accessory.kind) {
    case "light":
      return "yellow"
    case "thermostat":
      return accessory.mode === "cool" ? "blue" : "orange"
    case "fan":
    case "shade":
      return "teal"
    case "lock":
    case "door":
      return "blue"
    case "faucet":
      return "blue"
    case "sensor":
      return accessory.sensor === "leak" || accessory.sensor === "smoke" ? "red" : "teal"
    case "speaker":
    case "tv":
      return "purple"
    default:
      return "accent"
  }
}

const sceneGlyphs: Record<Scene["icon"], Glyph> = {
  sunrise: SunHorizon,
  cooking: CookingPot,
  dinner: ForkKnife,
  leave: SignOut,
  night: MoonStars,
}

function SceneGlyph({ scene }: { scene: Scene }) {
  const Icon = sceneGlyphs[scene.icon]
  return <Icon weight="fill" aria-hidden="true" />
}

const categoryGlyphs = {
  climate: Thermometer,
  lights: Lightbulb,
  security: ShieldCheck,
  speakers: Television,
  water: Drop,
  energy: Leaf,
} satisfies Record<string, Glyph>

function CategoryGlyph({ id }: { id: keyof typeof categoryGlyphs }) {
  const Icon = categoryGlyphs[id]
  return <Icon weight="fill" aria-hidden="true" />
}

export { AccessoryGlyph, CategoryGlyph, SceneGlyph, glyphs, tintOf }
