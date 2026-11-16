"use client"

import { AccessoryGrid, AccessoryTile } from "macbetter/accessory-tile"
import type { ArtworkPalette, ArtworkTime } from "macbetter/artwork"
import { Artwork } from "macbetter/artwork"
import { Button } from "macbetter/button"
import { CameraView } from "macbetter/camera-view"
import { EnergyReadout } from "macbetter/energy-readout"
import { HomeBackdrop } from "macbetter/home-backdrop"
import { HomeStatus, HomeStatusItem } from "macbetter/home-status"
import { LevelControl, LevelControlValue } from "macbetter/level-control"
import { defaultLightSwatches, LightColorPicker, lightSwatchColor } from "macbetter/light-color-picker"
import { type LockState, type LockTarget, LockControl } from "macbetter/lock-control"
import { SceneRow, SceneTile } from "macbetter/scene-tile"
import { SensorReadout } from "macbetter/sensor-readout"
import { type ThermostatMode, ThermostatControl } from "macbetter/thermostat-control"
import { CookingPotIcon } from "@phosphor-icons/react/dist/ssr/CookingPot"
import { CornersOutIcon } from "@phosphor-icons/react/dist/ssr/CornersOut"
import { DropHalfIcon } from "@phosphor-icons/react/dist/ssr/DropHalf"
import { FanIcon } from "@phosphor-icons/react/dist/ssr/Fan"
import { ForkKnifeIcon } from "@phosphor-icons/react/dist/ssr/ForkKnife"
import { LampPendantIcon } from "@phosphor-icons/react/dist/ssr/LampPendant"
import { LightbulbIcon } from "@phosphor-icons/react/dist/ssr/Lightbulb"
import { LightningIcon } from "@phosphor-icons/react/dist/ssr/Lightning"
import { LockIcon } from "@phosphor-icons/react/dist/ssr/Lock"
import { MoonStarsIcon } from "@phosphor-icons/react/dist/ssr/MoonStars"
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/ssr/SpeakerHigh"
import { SpeakerSlashIcon } from "@phosphor-icons/react/dist/ssr/SpeakerSlash"
import { SunHorizonIcon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { ThermometerIcon } from "@phosphor-icons/react/dist/ssr/Thermometer"
import { ThermometerSimpleIcon } from "@phosphor-icons/react/dist/ssr/ThermometerSimple"
import { type CSSProperties, useEffect, useState } from "react"
import { MoreLink } from "@/components/more-link"
import { SectionHeading } from "./section-heading"
import { Tile } from "./tile"

/** A room's wallpaper behind a tile, the way the Home app paints one behind each room. */
function Wall({ room, palette, time }: { room: string; palette: ArtworkPalette; time?: ArtworkTime }) {
  return <HomeBackdrop seed={room} palette={palette} time={time} aspect={1.4} className="lp-home-wall" aria-hidden="true" />
}

const scenes = [
  { name: "Good Morning", icon: <SunHorizonIcon weight="fill" />, palette: "dawn", time: "dawn" },
  { name: "Cooking", icon: <CookingPotIcon weight="fill" />, palette: "amber", time: "day" },
  { name: "Dinner", icon: <ForkKnifeIcon weight="fill" />, palette: "dusk", time: "dusk" },
  { name: "Good Night", icon: <MoonStarsIcon weight="fill" />, palette: "night", time: "night" },
] as const

const hours = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"]
const forecast = hours.map((label, i) => ({ label, cleaner: i >= 4 && i <= 10 }))

function HomeBento() {
  const [pendants, setPendants] = useState(true)
  const [cabinet, setCabinet] = useState(false)
  const [fan, setFan] = useState(false)
  const [category, setCategory] = useState<string[]>([])
  const [scene, setScene] = useState("Cooking")
  const [mode, setMode] = useState<ThermostatMode>("heat")
  const [target, setTarget] = useState(21)
  const [brightness, setBrightness] = useState(80)
  const [color, setColor] = useState("warm")
  const [lock, setLock] = useState<LockState>("secured")
  const [lockTarget, setLockTarget] = useState<LockTarget>("secured")
  const [muted, setMuted] = useState(true)

  // A real lock reports back when it's done; this one takes a second and a half.
  useEffect(() => {
    if (lockTarget === lock) return
    const timer = setTimeout(() => setLock(lockTarget), 1500)
    return () => clearTimeout(timer)
  }, [lock, lockTarget])

  const current = 19.5
  const heating = mode === "heat" && current < target ? "heating" : mode === "cool" && current > target ? "cooling" : "idle"
  const swatch = defaultLightSwatches.find((item) => item.id === color)

  return (
    <section id="home" className="lp-section" aria-labelledby="lp-home">
      <div className="lp-section-inner">
        <SectionHeading
          id="lp-home"
          eyebrow="HomeKit Components"
          headline={<>Controls for lights, locks and thermostats, modeled from Apple&nbsp;HomeKit.</>}
          links={
            <>
              <MoreLink href="/examples/home">See the Home example</MoreLink>
              <MoreLink href="/docs/home/overview">Learn more about Home components</MoreLink>
            </>
          }
        >
          Accessory tiles, scenes, cameras and sensor readouts that sit on a room’s wallpaper. Your app supplies the
          values; the components draw them. <strong>Every tile below is a working&nbsp;component.</strong>
        </SectionHeading>

        <div className="lp-bento lp-home-bento lp-reveal" data-platform="macos">
          <Tile area="access" name="Accessory tile" href="/docs/home/accessory-tile" className="lp-tile-home" background={<Wall room="Kitchen" palette="amber" time="day" />}>
            <AccessoryGrid className="lp-home-grid">
              <AccessoryTile
                tint="yellow"
                icon={<LampPendantIcon weight="fill" />}
                name="Pendant lights"
                status={pendants ? `${brightness}%` : "Off"}
                pressed={pendants}
                onPressedChange={setPendants}
              />
              <AccessoryTile
                tint="yellow"
                icon={<LightbulbIcon weight="fill" />}
                name="Under-cabinet"
                status={cabinet ? "100%" : "Off"}
                pressed={cabinet}
                onPressedChange={setCabinet}
              />
              <AccessoryTile
                tint="teal"
                icon={<FanIcon weight="fill" />}
                name="Ceiling fan"
                status={fan ? "Speed 2" : "Off"}
                pressed={fan}
                onPressedChange={setFan}
              />
              <AccessoryTile tint="blue" icon={<LockIcon weight="fill" />} name="Back door" status="Locked" toggleable={false} />
            </AccessoryGrid>
          </Tile>

          <Tile area="thermo" name="Thermostat control" href="/docs/home/thermostat-control" className="lp-tile-home" background={<Wall room="Hallway" palette="dusk" time="dusk" />}>
            <ThermostatControl
              name="Hallway thermostat"
              mode={mode}
              onModeChange={setMode}
              target={target}
              onTargetChange={setTarget}
              current={current}
              state={heating}
            />
          </Tile>

          <Tile area="level" name="Level control" href="/docs/home/level-control" className="lp-tile-home" background={<Wall room="Living Room" palette="berry" />}>
            <div className="lp-home-level">
              <strong>Pendant lights</strong>
              <LevelControl
                label="Pendant lights brightness"
                tone="light"
                value={brightness}
                onValueChange={(value) => setBrightness(value as number)}
                format={{ style: "unit", unit: "percent" }}
                icon={<LightbulbIcon weight="fill" />}
                // The fill takes the light's color from the picker beside it.
                style={swatch ? ({ "--mb-level-control-fill": lightSwatchColor(swatch) } as CSSProperties) : undefined}
              >
                <LevelControlValue className="lp-home-level-value" />
              </LevelControl>
            </div>
          </Tile>

          <Tile area="status" name="Home status" href="/docs/home/home-status" className="lp-tile-home" background={<Wall room="Home" palette="water" />}>
            <HomeStatus aria-label="Categories" value={category} onValueChange={setCategory} className="lp-home-status">
              <HomeStatusItem value="climate" tint="teal" icon={<ThermometerIcon weight="fill" />} label="Climate" summary="68–72°" />
              <HomeStatusItem value="lights" tint="yellow" icon={<LightbulbIcon weight="fill" />} label="Lights" summary="3 on" />
              <HomeStatusItem value="security" tint="blue" icon={<LockIcon weight="fill" />} label="Security" summary="Locked" />
              <HomeStatusItem value="energy" tint="green" icon={<LightningIcon weight="fill" />} label="Energy" summary="Cleaner now" />
            </HomeStatus>
          </Tile>

          <Tile area="scenes" name="Scene tile" href="/docs/home/scene-tile" className="lp-tile-home" background={<Wall room="Bedroom" palette="night" time="night" />}>
            <SceneRow aria-label="Scenes" className="lp-home-scenes">
              {scenes.map((item) => (
                <SceneTile
                  key={item.name}
                  icon={item.icon}
                  name={item.name}
                  active={scene === item.name}
                  background={<Artwork seed={item.name} variant="wash" palette={item.palette} time={item.time} aspect={3} />}
                  onClick={() => setScene(item.name)}
                />
              ))}
            </SceneRow>
          </Tile>

          <Tile area="lock" name="Lock control" href="/docs/home/lock-control" className="lp-tile-home" background={<Wall room="Entry" palette="slate" />}>
            <LockControl name="Front door" state={lock} target={lockTarget} onTargetChange={setLockTarget} />
          </Tile>

          <Tile area="color" name="Light color picker" href="/docs/home/light-color-picker" className="lp-tile-home" background={<Wall room="Dining" palette="amber" time="dusk" />}>
            <LightColorPicker label="Pendant lights color" value={color} onValueChange={setColor} className="lp-home-colors" />
          </Tile>

          <Tile area="camera" name="Camera view" href="/docs/home/camera-view" className="lp-tile-home" background={<Wall room="Porch" palette="sky" time="day" />}>
            <CameraView
              name="Front door"
              room="Entry"
              live
              className="lp-home-camera"
              controls={
                <>
                  <Button variant="glass" shape="circle" size="sm" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>
                    {muted ? <SpeakerSlashIcon weight="fill" aria-hidden="true" /> : <SpeakerHighIcon weight="fill" aria-hidden="true" />}
                  </Button>
                  <Button variant="glass" shape="circle" size="sm" aria-label="Full Screen">
                    <CornersOutIcon weight="bold" aria-hidden="true" />
                  </Button>
                </>
              }
            />
          </Tile>

          <Tile area="energy" name="Energy readout" href="/docs/home/energy-readout" className="lp-tile-home" background={<Wall room="Garage" palette="forest" />}>
            <EnergyReadout className="lp-home-energy" forecast={forecast} now={1} summary="Cleaner energy 4–10 PM" usage={{ value: "18.4 kWh", label: "Used today" }} />
          </Tile>

          <Tile area="sensor" name="Sensor readout" href="/docs/home/sensor-readout" className="lp-tile-home" background={<Wall room="Nursery" palette="dawn" />}>
            <div className="lp-home-sensors">
              <SensorReadout layout="tile" icon={<ThermometerSimpleIcon weight="fill" />} label="Temperature" value="71°" />
              <SensorReadout layout="tile" icon={<DropHalfIcon weight="fill" />} label="Humidity" value="41%" meter={{ value: 41 }} />
            </div>
          </Tile>
        </div>
      </div>
    </section>
  )
}

export { HomeBento }
