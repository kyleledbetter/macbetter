"use client"

import * as React from "react"
import {
  accessories as initialAccessories,
  automations as initialAutomations,
  homes,
  rooms as initialRooms,
  scenes,
  type Accessory,
  type Automation,
  type RoomId,
} from "./data"

/*
 * One store for the whole example, outside React, so the iPhone and the Mac
 * (and the gallery's thumbnails) show the same house: turn a light on in one
 * and the other's tile and status buttons follow.
 */

type State = {
  homeId: string
  accessories: Accessory[]
  automations: Automation[]
  /** The scene being run, for its spinner. */
  running: string | null
}

let state: State = {
  homeId: homes[0].id,
  accessories: initialAccessories,
  automations: initialAutomations,
  running: null,
}

const listeners = new Set<() => void>()

function set(next: (current: State) => State) {
  state = next(state)
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function useHome() {
  return React.useSyncExternalStore(subscribe, () => state, () => state)
}

function update(id: string, patch: Partial<Accessory>) {
  set((s) => ({
    ...s,
    accessories: s.accessories.map((a) => (a.id === id ? ({ ...a, ...patch } as Accessory) : a)),
  }))
}

function find(id: string) {
  return state.accessories.find((a) => a.id === id)
}

/** What the icon on a tile does: on or off, open or close, lock or unlock. */
function toggle(id: string) {
  const a = find(id)
  if (!a || a.reachable === false) return
  switch (a.kind) {
    case "light":
    case "outlet":
    case "faucet":
    case "tv":
      update(id, { on: !a.on })
      break
    case "fan":
      update(id, { on: !a.on, speed: !a.on && a.speed === 0 ? 50 : a.speed })
      break
    case "speaker":
      update(id, { playing: !a.playing })
      break
    case "shade":
      update(id, { position: a.position > 0 ? 0 : 100 })
      break
    case "lock":
      setLock(id, a.state === "secured" ? "unsecured" : "secured")
      break
    case "door":
      setDoor(id, a.state === "closed" ? "open" : "closed")
      break
    default:
      break
  }
}

const timers = new Map<string, number>()

function later(key: string, ms: number, run: () => void) {
  window.clearTimeout(timers.get(key))
  timers.set(key, window.setTimeout(run, ms))
}

/** Locks take a moment: the target changes first, the state when the bolt has moved. */
function setLock(id: string, target: "secured" | "unsecured") {
  update(id, { target })
  later(id, 1400, () => update(id, { state: target }))
}

/** Garage doors pass through opening and closing. */
function setDoor(id: string, target: "open" | "closed") {
  update(id, { state: target === "open" ? "opening" : "closing", obstructed: false })
  later(id, 3200, () => update(id, { state: target }))
}

function runScene(id: string) {
  const scene = scenes.find((s) => s.id === id)
  if (!scene) return
  set((s) => ({ ...s, running: id }))
  later(`scene-${id}`, 900, () => {
    for (const [accessoryId, patch] of Object.entries(scene.set)) update(accessoryId, patch)
    set((s) => ({ ...s, running: null }))
  })
}

/** A scene is on when every accessory in it matches what the scene sets. */
function sceneActive(id: string, all: Accessory[]) {
  const scene = scenes.find((s) => s.id === id)
  if (!scene) return false
  return Object.entries(scene.set).every(([accessoryId, patch]) => {
    const a = all.find((x) => x.id === accessoryId) as Record<string, unknown> | undefined
    return a ? Object.entries(patch).every(([key, value]) => a[key] === value) : false
  })
}

function setAutomation(id: string, patch: Partial<Automation>) {
  set((s) => ({ ...s, automations: s.automations.map((a) => (a.id === id ? { ...a, ...patch } : a)) }))
}

function addAutomation(automation: Automation) {
  set((s) => ({ ...s, automations: [...s.automations, automation] }))
}

function removeAutomation(id: string) {
  set((s) => ({ ...s, automations: s.automations.filter((a) => a.id !== id) }))
}

function addAccessory(accessory: Accessory) {
  set((s) => ({ ...s, accessories: [...s.accessories, accessory] }))
}

function setHome(homeId: string) {
  set((s) => ({ ...s, homeId }))
}

/* ── Derived ────────────────────────────────────────────────────── */

const rooms = initialRooms

function roomName(id: RoomId) {
  return rooms.find((r) => r.id === id)?.name ?? "Default Room"
}

function fahrenheit(celsius: number) {
  return Math.round((celsius * 9) / 5 + 32)
}

/** Whether a tile shows its on look. */
function isOn(a: Accessory) {
  switch (a.kind) {
    case "light":
    case "outlet":
    case "faucet":
    case "tv":
    case "fan":
      return a.on
    case "speaker":
      return a.playing
    case "shade":
      return a.position > 0
    case "thermostat":
      return a.mode !== "off"
    case "lock":
      return a.state === "unsecured"
    case "door":
      return a.state !== "closed"
    case "sensor":
      return a.detected
    case "camera":
      return a.online
  }
}

/** The status line under a tile's name, in the words the Home app uses. */
function statusOf(a: Accessory): string {
  if (a.reachable === false) return "No Response"
  switch (a.kind) {
    case "light":
      return a.on ? `${a.brightness}%` : "Off"
    case "outlet":
    case "faucet":
    case "tv":
      return a.on ? "On" : "Off"
    case "fan":
      return a.on ? `${a.speed}%` : "Off"
    case "speaker":
      return a.playing ? a.nowPlaying : "Paused"
    case "shade":
      return a.position === 0 ? "Closed" : a.position === 100 ? "Open" : `${a.position}% open`
    case "thermostat":
      if (a.mode === "off") return `Off · ${fahrenheit(a.current)}°`
      if (a.mode === "auto") return `Auto ${fahrenheit(a.range[0])}–${fahrenheit(a.range[1])}°`
      return `${a.mode === "heat" ? "Heat" : "Cool"} to ${fahrenheit(a.target)}°`
    case "lock":
      if (a.state === "jammed") return "Jammed"
      if (a.target !== a.state) return a.target === "secured" ? "Locking…" : "Unlocking…"
      return a.state === "secured" ? "Locked" : "Unlocked"
    case "door":
      if (a.obstructed) return "Obstructed"
      return { open: "Open", closed: "Closed", opening: "Opening…", closing: "Closing…", stopped: "Stopped" }[a.state]
    case "sensor":
      switch (a.sensor) {
        case "leak":
          return a.detected ? "Leak Detected" : "No Leak"
        case "smoke":
          return a.detected ? "Smoke Detected" : "No Smoke"
        case "contact":
          return a.detected ? "Closed" : "Open"
        case "motion":
          return a.detected ? "Motion Detected" : "No Motion"
        case "air":
          return a.reading ?? "Unknown"
        case "temperature":
          return `${fahrenheit(Number(a.reading))}°`
      }
      return ""
    case "camera":
      return a.online ? "Live" : "Not Available"
  }
}

type CategoryId = "climate" | "lights" | "security" | "speakers" | "water" | "energy"

/** The category buttons below the home name, with their summaries. */
function categories(all: Accessory[]) {
  const thermostats = all.filter((a) => a.kind === "thermostat")
  const temps = [
    ...thermostats.map((t) => fahrenheit(t.current)),
    ...all.flatMap((a) => (a.kind === "sensor" && a.sensor === "temperature" ? [fahrenheit(Number(a.reading))] : [])),
  ]
  const lightsOn = all.filter((a) => a.kind === "light" && a.on).length
  const locks = all.filter((a) => a.kind === "lock")
  const unlocked = locks.filter((l) => l.state !== "secured").length
  const doorsOpen = all.filter((a) => a.kind === "door" && a.state !== "closed").length
  const playing = all.filter((a) => (a.kind === "speaker" && a.playing) || (a.kind === "tv" && a.on)).length
  const leak = all.some((a) => a.kind === "sensor" && a.sensor === "leak" && a.detected)
  const faucetOn = all.some((a) => a.kind === "faucet" && a.on)

  const security =
    unlocked + doorsOpen > 0
      ? [unlocked ? `${unlocked} unlocked` : "", doorsOpen ? `${doorsOpen} open` : ""].filter(Boolean).join(", ")
      : "All locked"

  return [
    {
      id: "climate" as const,
      label: "Climate",
      summary: temps.length ? `${Math.min(...temps)}–${Math.max(...temps)}°` : "Off",
      tint: "teal" as const,
      alert: false,
    },
    { id: "lights" as const, label: "Lights", summary: lightsOn ? `${lightsOn} on` : "Off", tint: "yellow" as const, alert: false },
    { id: "security" as const, label: "Security", summary: security, tint: "blue" as const, alert: unlocked + doorsOpen > 0 },
    { id: "speakers" as const, label: "Speakers & TVs", summary: playing ? `${playing} playing` : "Off", tint: "purple" as const, alert: false },
    {
      id: "water" as const,
      label: "Water",
      summary: leak ? "Leak detected" : faucetOn ? "Faucet on" : "Off",
      tint: "blue" as const,
      alert: leak,
    },
    { id: "energy" as const, label: "Energy", summary: "Cleaner 4–10 PM", tint: "green" as const, alert: false },
  ]
}

function inCategory(a: Accessory, category: CategoryId) {
  switch (category) {
    case "climate":
      return a.kind === "thermostat" || a.kind === "fan" || (a.kind === "sensor" && (a.sensor === "air" || a.sensor === "temperature"))
    case "lights":
      return a.kind === "light"
    case "security":
      return a.kind === "lock" || a.kind === "door" || (a.kind === "sensor" && (a.sensor === "contact" || a.sensor === "motion" || a.sensor === "smoke"))
    case "speakers":
      return a.kind === "speaker" || a.kind === "tv"
    case "water":
      return a.kind === "faucet" || (a.kind === "sensor" && a.sensor === "leak")
    case "energy":
      return a.kind === "thermostat" || a.kind === "outlet"
  }
}

/** One line under a room's name, like the Home app's room summaries. */
function roomSummary(id: RoomId, all: Accessory[]) {
  const here = all.filter((a) => a.room === id)
  const parts: string[] = []
  const thermostat = here.find((a) => a.kind === "thermostat")
  const temp = here.find((a) => a.kind === "sensor" && a.sensor === "temperature")
  if (thermostat?.kind === "thermostat") parts.push(`${fahrenheit(thermostat.current)}°`)
  else if (temp?.kind === "sensor") parts.push(`${fahrenheit(Number(temp.reading))}°`)
  const lights = here.filter((a) => a.kind === "light" && a.on).length
  if (lights) parts.push(`${lights} ${lights === 1 ? "light" : "lights"} on`)
  if (thermostat?.kind === "thermostat") parts.push(`Humidity ${thermostat.humidity}%`)
  return parts.join(" · ")
}

export {
  addAccessory,
  addAutomation,
  categories,
  fahrenheit,
  find,
  inCategory,
  isOn,
  removeAutomation,
  roomName,
  roomSummary,
  rooms,
  runScene,
  sceneActive,
  setAutomation,
  setDoor,
  setHome,
  setLock,
  statusOf,
  toggle,
  update,
  useHome,
}
export type { CategoryId, State }
