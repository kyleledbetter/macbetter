"use client"

import { Button } from "macbetter/button"
import { CameraScene, CameraView } from "macbetter/camera-view"
import { DoorControl } from "macbetter/door-control"
import { LevelControl } from "macbetter/level-control"
import { defaultLightSwatches, LightColorPicker, type LightSwatch } from "macbetter/light-color-picker"
import { LockControl } from "macbetter/lock-control"
import { SensorGroup, SensorReadout } from "macbetter/sensor-readout"
import { Switch } from "macbetter/switch"
import { ThermostatControl } from "macbetter/thermostat-control"
import { BatteryHigh } from "@phosphor-icons/react/dist/ssr/BatteryHigh"
import { BatteryLow } from "@phosphor-icons/react/dist/ssr/BatteryLow"
import { DropHalf } from "@phosphor-icons/react/dist/ssr/DropHalf"
import { Microphone } from "@phosphor-icons/react/dist/ssr/Microphone"
import { SpeakerHigh } from "@phosphor-icons/react/dist/ssr/SpeakerHigh"
import { SpeakerSlash } from "@phosphor-icons/react/dist/ssr/SpeakerSlash"
import { Thermometer } from "@phosphor-icons/react/dist/ssr/Thermometer"
import * as React from "react"
import type { Accessory, Camera, Door, Fan, Faucet, Light, LockAccessory, Sensor, Shade, Speaker, Thermostat } from "./data"
import { AccessoryGlyph } from "./icons"
import { find, roomName, setDoor, setLock, statusOf, update, useHome } from "./store"

/** Asks before a security-sensitive action. On a framed phone the example draws it in the screen. */
type Confirm = (options: { title: string; action: string; run: () => void }) => void

const ConfirmContext = React.createContext<Confirm | null>(null)

function swatchFor(light: Light): LightSwatch | undefined {
  return defaultLightSwatches.find((s) => s.id === light.colorId)
}

function LightControls({ light, compact }: { light: Light; compact?: boolean }) {
  return (
    <div className="ex-home-controls" data-compact={compact ? "" : undefined}>
      <LevelControl
        size={compact ? "md" : "lg"}
        tone="light"
        label={`${light.name} brightness`}
        value={light.on ? light.brightness : 0}
        format={{ style: "unit", unit: "percent" }}
        onValueChange={(value) => {
          const v = value as number
          update(light.id, { brightness: Math.max(v, 1), on: v > 0 })
        }}
        icon={<AccessoryGlyph accessory={light} />}
      />
      {light.color ? (
        <LightColorPicker
          label={`${light.name} color`}
          value={light.colorId}
          onValueChange={(id) => {
            const swatch = defaultLightSwatches.find((s) => s.id === id)
            if (!swatch) return
            update(light.id, {
              colorId: id,
              on: true,
              color: swatch.kind === "temperature" ? { kind: "temperature", mireds: swatch.mireds } : { kind: "color", hue: swatch.hue, saturation: swatch.saturation },
            })
          }}
        />
      ) : null}
      {light.color && swatchFor(light) ? <p className="ex-home-controls-caption">{swatchFor(light)?.label}</p> : null}
    </div>
  )
}

function ShadeControls({ shade, compact }: { shade: Shade; compact?: boolean }) {
  return (
    <div className="ex-home-controls" data-compact={compact ? "" : undefined}>
      <LevelControl
        size={compact ? "md" : "lg"}
        tone="neutral"
        label={`${shade.name} position`}
        value={shade.position}
        format={{ style: "unit", unit: "percent" }}
        onValueChange={(value) => update(shade.id, { position: value as number })}
        icon={<AccessoryGlyph accessory={shade} />}
      />
      <p className="ex-home-controls-caption">Drag up to open, down to close.</p>
    </div>
  )
}

const fanSpeeds = [
  { value: 0, label: "Off" },
  { value: 25, label: "Low" },
  { value: 50, label: "Medium" },
  { value: 75, label: "High" },
  { value: 100, label: "Max" },
]

function FanControls({ fan, compact }: { fan: Fan; compact?: boolean }) {
  const speed = fan.on ? fan.speed : 0
  return (
    <div className="ex-home-controls" data-compact={compact ? "" : undefined}>
      <LevelControl
        size={compact ? "md" : "lg"}
        tone="neutral"
        label={`${fan.name} speed`}
        value={speed}
        step={25}
        steps={4}
        format={(v: number) => fanSpeeds.find((s) => s.value === v)?.label ?? `${v}%`}
        onValueChange={(value) => update(fan.id, { speed: value as number, on: (value as number) > 0 })}
        icon={<AccessoryGlyph accessory={fan} />}
      />
      <p className="ex-home-controls-caption">{fanSpeeds.find((s) => s.value === speed)?.label}</p>
    </div>
  )
}

function SpeakerControls({ speaker, compact }: { speaker: Speaker; compact?: boolean }) {
  return (
    <div className="ex-home-controls" data-compact={compact ? "" : undefined}>
      <p className="ex-home-now-playing">
        <span>{speaker.nowPlaying}</span>
        <span className="ex-home-muted">{speaker.playing ? "Playing" : "Paused"}</span>
      </p>
      <LevelControl
        size={compact ? "md" : "lg"}
        tone="neutral"
        label={`${speaker.name} volume`}
        value={speaker.volume}
        format={{ style: "unit", unit: "percent" }}
        onValueChange={(value) => update(speaker.id, { volume: value as number })}
        icon={speaker.volume === 0 ? <SpeakerSlash weight="fill" aria-hidden="true" /> : <SpeakerHigh weight="fill" aria-hidden="true" />}
      />
      <Button variant="bezeled" onClick={() => update(speaker.id, { playing: !speaker.playing })}>
        {speaker.playing ? "Pause" : "Play"}
      </Button>
    </div>
  )
}

function ThermostatControls({ thermostat }: { thermostat: Thermostat }) {
  const state = thermostat.mode === "off" ? "idle" : thermostat.mode === "heat" && thermostat.current < thermostat.target ? "heating" : thermostat.mode === "cool" && thermostat.current > thermostat.target ? "cooling" : "idle"
  return (
    <div className="ex-home-controls">
      <ThermostatControl
        name={thermostat.name}
        unit="fahrenheit"
        mode={thermostat.mode}
        onModeChange={(mode) => update(thermostat.id, { mode })}
        target={thermostat.target}
        onTargetChange={(target) => update(thermostat.id, { target })}
        range={thermostat.range}
        onRangeChange={(range) => update(thermostat.id, { range })}
        current={thermostat.current}
        state={state}
      />
      <SensorGroup aria-label="Readings">
        <SensorReadout icon={<DropHalf weight="fill" aria-hidden="true" />} label="Humidity" value={`${thermostat.humidity}%`} />
      </SensorGroup>
    </div>
  )
}

function LockControls({ lock }: { lock: LockAccessory }) {
  const confirm = React.useContext(ConfirmContext)
  return (
    <div className="ex-home-controls">
      <LockControl
        name={lock.name}
        state={lock.state}
        target={lock.target}
        confirmUnlock={!confirm}
        onTargetChange={(target) => {
          if (confirm && target === "unsecured") {
            confirm({ title: `Unlock ${lock.name}?`, action: "Unlock", run: () => setLock(lock.id, target) })
          } else setLock(lock.id, target)
        }}
      />
      <SensorGroup aria-label="Lock details">
        <BatteryReadout level={lock.battery} />
      </SensorGroup>
    </div>
  )
}

function DoorControls({ door }: { door: Door }) {
  const confirm = React.useContext(ConfirmContext)
  return (
    <div className="ex-home-controls">
      <DoorControl
        kind="garage"
        name={door.name}
        state={door.state}
        obstructed={door.obstructed}
        confirmOpen={!confirm}
        onTargetChange={(target) => {
          if (confirm && target === "open") {
            confirm({ title: `Open ${door.name}?`, action: "Open", run: () => setDoor(door.id, target) })
          } else setDoor(door.id, target)
        }}
      />
    </div>
  )
}

function FaucetControls({ faucet }: { faucet: Faucet }) {
  const { accessories } = useHome()
  const leak = accessories.find((a): a is Sensor => a.kind === "sensor" && a.sensor === "leak" && a.room === faucet.room)
  return (
    <div className="ex-home-controls">
      <div className="ex-home-switch-row">
        <span>Water</span>
        <Switch aria-label={`${faucet.name} water`} checked={faucet.on} onCheckedChange={(on) => update(faucet.id, { on })} />
      </div>
      {leak ? (
        <SensorGroup aria-label="Under the sink">
          <SensorReadout
            icon={<AccessoryGlyph accessory={leak} />}
            label={leak.name}
            value={statusOf(leak)}
            level={leak.detected ? "alert" : "normal"}
            detail="Turns the faucet off when it detects a leak"
          />
          <BatteryReadout level={leak.battery} />
        </SensorGroup>
      ) : null}
      {leak ? (
        <Button
          variant="bezeled"
          tone={leak.detected ? "neutral" : "destructive"}
          onClick={() => {
            const detected = !leak.detected
            update(leak.id, { detected })
            if (detected) update(faucet.id, { on: false })
          }}
        >
          {leak.detected ? "Clear Leak Alert" : "Test Leak Sensor"}
        </Button>
      ) : null}
    </div>
  )
}

function BatteryReadout({ level }: { level: number }) {
  const low = level < 20
  return (
    <SensorReadout
      icon={low ? <BatteryLow weight="fill" aria-hidden="true" /> : <BatteryHigh weight="fill" aria-hidden="true" />}
      label="Battery"
      value={`${level}%`}
      level={low ? "warning" : "normal"}
      detail={low ? "Replace the battery soon" : undefined}
      meter={{ value: level, label: "Battery level" }}
    />
  )
}

function SensorControls({ sensor }: { sensor: Sensor }) {
  return (
    <div className="ex-home-controls">
      <SensorGroup aria-label={sensor.name}>
        <SensorReadout
          icon={sensor.sensor === "temperature" ? <Thermometer weight="fill" aria-hidden="true" /> : <AccessoryGlyph accessory={sensor} />}
          label={sensor.name}
          value={statusOf(sensor)}
          level={sensor.detected && (sensor.sensor === "leak" || sensor.sensor === "smoke") ? "alert" : "normal"}
          detail={roomName(sensor.room)}
        />
        <BatteryReadout level={sensor.battery} />
      </SensorGroup>
    </div>
  )
}

function CameraControls({ camera }: { camera: Camera }) {
  const [muted, setMuted] = React.useState(true)
  return (
    <div className="ex-home-controls ex-home-camera-controls">
      <CameraView
        name={camera.name}
        room={roomName(camera.room)}
        live={camera.online}
        state={camera.online ? "streaming" : "offline"}
        timestamp="9:41 AM"
        controls={
          camera.online ? (
            <>
              <Button
                variant="glass"
                shape="circle"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? <SpeakerSlash weight="fill" aria-hidden="true" /> : <SpeakerHigh weight="fill" aria-hidden="true" />}
              </Button>
              {camera.microphone ? (
                <Button variant="glass" shape="circle" aria-label="Talk">
                  <Microphone weight="fill" aria-hidden="true" />
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        <CameraScene variant={camera.scene} />
      </CameraView>
      <p className="ex-home-controls-caption">
        {camera.online ? "Streaming. Recording when motion is detected." : "Check that the camera is plugged in and on Wi-Fi."}
      </p>
    </div>
  )
}

function OutletControls({ accessory }: { accessory: Accessory & { on: boolean } }) {
  return (
    <div className="ex-home-controls">
      <div className="ex-home-switch-row">
        <span>Power</span>
        <Switch
          aria-label={`${accessory.name} power`}
          checked={accessory.on}
          disabled={accessory.reachable === false}
          onCheckedChange={(on) => update(accessory.id, { on })}
        />
      </div>
      {accessory.reachable === false ? (
        <p className="ex-home-controls-caption">This accessory isn’t responding. Check that it has power and is in range of your home hub.</p>
      ) : null}
    </div>
  )
}

/** The controls for one accessory, by type. `compact` is the Mac popover's size. */
function AccessoryControls({ id, compact }: { id: string; compact?: boolean }) {
  useHome()
  const accessory = find(id)
  if (!accessory) return null
  switch (accessory.kind) {
    case "light":
      return <LightControls light={accessory} compact={compact} />
    case "shade":
      return <ShadeControls shade={accessory} compact={compact} />
    case "fan":
      return <FanControls fan={accessory} compact={compact} />
    case "speaker":
      return <SpeakerControls speaker={accessory} compact={compact} />
    case "thermostat":
      return <ThermostatControls thermostat={accessory} />
    case "lock":
      return <LockControls lock={accessory} />
    case "door":
      return <DoorControls door={accessory} />
    case "faucet":
      return <FaucetControls faucet={accessory} />
    case "sensor":
      return <SensorControls sensor={accessory} />
    case "camera":
      return <CameraControls camera={accessory} />
    case "outlet":
    case "tv":
      return <OutletControls accessory={accessory} />
  }
}

/** The header of a control sheet or popover: icon, name, room and status. */
function ControlsHeader({ id, action }: { id: string; action?: React.ReactNode }) {
  useHome()
  const accessory = find(id)
  if (!accessory) return null
  return (
    <div className="ex-home-controls-header">
      <span className="ex-home-controls-icon" aria-hidden="true">
        <AccessoryGlyph accessory={accessory} />
      </span>
      <span className="ex-home-controls-title">
        <strong>{accessory.name}</strong>
        <span>
          {roomName(accessory.room)} · {statusOf(accessory)}
        </span>
      </span>
      {action}
    </div>
  )
}

export { AccessoryControls, ConfirmContext, ControlsHeader }
export type { Confirm }
