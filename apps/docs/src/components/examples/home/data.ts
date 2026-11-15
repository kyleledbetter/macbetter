/*
 * A house on Maple Street whose kitchen has one of everything, down to a
 * leak sensor under the sink. Names follow the HomeKit naming rules: letters,
 * numbers, spaces and apostrophes, and no room in the name.
 *
 * Values are stored the way HomeKit stores them: percentages for levels,
 * degrees Celsius for temperatures, mireds for color temperature.
 */

type RoomId = "kitchen" | "living" | "bedroom" | "entry" | "garage" | "backyard"

type Room = { id: RoomId; name: string; zone: "Downstairs" | "Upstairs" | "Outside" }

type Tint = "yellow" | "orange" | "red" | "green" | "teal" | "blue" | "indigo" | "purple" | "accent" | "neutral"

type LightColor = { kind: "temperature"; mireds: number } | { kind: "color"; hue: number; saturation: number }

type AccessoryBase = {
  id: string
  name: string
  room: RoomId
  icon: IconName
  favorite?: boolean
  reachable?: boolean
}

type Light = AccessoryBase & { kind: "light"; on: boolean; brightness: number; color?: LightColor; colorId?: string }
type Outlet = AccessoryBase & { kind: "outlet"; on: boolean }
type Faucet = AccessoryBase & { kind: "faucet"; on: boolean }
type Fan = AccessoryBase & { kind: "fan"; on: boolean; speed: number }
type Shade = AccessoryBase & { kind: "shade"; position: number }
type Speaker = AccessoryBase & { kind: "speaker"; playing: boolean; volume: number; nowPlaying: string }
type Tv = AccessoryBase & { kind: "tv"; on: boolean; input: string }
type Thermostat = AccessoryBase & {
  kind: "thermostat"
  mode: "off" | "heat" | "cool" | "auto"
  target: number
  range: [number, number]
  current: number
  humidity: number
}
type LockAccessory = AccessoryBase & {
  kind: "lock"
  state: "secured" | "unsecured" | "jammed" | "unknown"
  target: "secured" | "unsecured"
  battery: number
}
type Door = AccessoryBase & {
  kind: "door"
  state: "open" | "closed" | "opening" | "closing" | "stopped"
  obstructed: boolean
}
type Sensor = AccessoryBase & {
  kind: "sensor"
  sensor: "leak" | "smoke" | "air" | "contact" | "motion" | "temperature"
  detected: boolean
  reading?: string
  battery: number
}
type Camera = AccessoryBase & {
  kind: "camera"
  scene: "porch" | "driveway" | "kitchen" | "backyard"
  online: boolean
  microphone: boolean
}

type Accessory = Light | Outlet | Faucet | Fan | Shade | Speaker | Tv | Thermostat | LockAccessory | Door | Sensor | Camera

type IconName =
  | "pendant"
  | "bulb"
  | "lamp"
  | "strip"
  | "coffee"
  | "faucet"
  | "fan"
  | "shade"
  | "speaker"
  | "tv"
  | "thermostat"
  | "lock"
  | "garage"
  | "leak"
  | "smoke"
  | "air"
  | "door"
  | "motion"
  | "camera"
  | "oven"
  | "plug"

type Scene = { id: string; name: string; icon: "sunrise" | "cooking" | "dinner" | "leave" | "night"; set: Record<string, Partial<Accessory>> }

type Automation = {
  id: string
  trigger: "arrive" | "leave" | "time" | "sensor" | "accessory"
  title: string
  detail: string
  enabled: boolean
  time?: string
  turnOffAfter?: string
  sceneIds: string[]
  accessoryIds: string[]
}

type Home = { id: string; name: string }

const homes: Home[] = [
  { id: "maple", name: "Maple Street" },
  { id: "lake", name: "Lake House" },
]

const rooms: Room[] = [
  { id: "kitchen", name: "Kitchen", zone: "Downstairs" },
  { id: "living", name: "Living Room", zone: "Downstairs" },
  { id: "entry", name: "Entry", zone: "Downstairs" },
  { id: "bedroom", name: "Bedroom", zone: "Upstairs" },
  { id: "garage", name: "Garage", zone: "Downstairs" },
  { id: "backyard", name: "Backyard", zone: "Outside" },
]

const accessories: Accessory[] = [
  // Kitchen: the kitchen sink of accessories.
  { id: "pendants", kind: "light", name: "Pendant lights", room: "kitchen", icon: "pendant", on: true, brightness: 80, color: { kind: "temperature", mireds: 370 }, colorId: "2700", favorite: true },
  { id: "cabinet", kind: "light", name: "Cabinet lights", room: "kitchen", icon: "strip", on: true, brightness: 45, color: { kind: "color", hue: 32, saturation: 70 }, colorId: "amber" },
  { id: "faucet", kind: "faucet", name: "Faucet", room: "kitchen", icon: "faucet", on: false, favorite: true },
  { id: "sink-sensor", kind: "sensor", sensor: "leak", name: "Leak sensor", room: "kitchen", icon: "leak", detected: false, battery: 82 },
  { id: "coffee", kind: "outlet", name: "Coffee maker", room: "kitchen", icon: "coffee", on: false, favorite: true },
  { id: "oven-fan", kind: "fan", name: "Range hood", room: "kitchen", icon: "fan", on: false, speed: 0 },
  { id: "kitchen-shades", kind: "shade", name: "Window shades", room: "kitchen", icon: "shade", position: 60 },
  { id: "kitchen-speaker", kind: "speaker", name: "HomePod", room: "kitchen", icon: "speaker", playing: true, volume: 35, nowPlaying: "Morning Jazz" },
  { id: "thermostat", kind: "thermostat", name: "Thermostat", room: "kitchen", icon: "thermostat", mode: "heat", target: 21, range: [20, 24], current: 20.5, humidity: 41, favorite: true },
  { id: "back-door", kind: "lock", name: "Back door", room: "kitchen", icon: "lock", state: "secured", target: "secured", battery: 64, favorite: true },
  { id: "smoke", kind: "sensor", sensor: "smoke", name: "Smoke alarm", room: "kitchen", icon: "smoke", detected: false, battery: 91 },
  { id: "air", kind: "sensor", sensor: "air", name: "Air quality monitor", room: "kitchen", icon: "air", detected: false, reading: "Good", battery: 100 },
  { id: "pantry-cam", kind: "camera", name: "Indoor camera", room: "kitchen", icon: "camera", scene: "kitchen", online: true, microphone: false },

  // Living Room
  { id: "floor-lamp", kind: "light", name: "Floor lamp", room: "living", icon: "lamp", on: true, brightness: 60, color: { kind: "temperature", mireds: 333 }, colorId: "3000", favorite: true },
  { id: "tv", kind: "tv", name: "TV", room: "living", icon: "tv", on: false, input: "Apple TV" },
  { id: "living-shades", kind: "shade", name: "Shades", room: "living", icon: "shade", position: 100 },
  { id: "ceiling-fan", kind: "fan", name: "Ceiling fan", room: "living", icon: "fan", on: true, speed: 50 },

  // Entry
  { id: "front-door", kind: "lock", name: "Front door", room: "entry", icon: "lock", state: "secured", target: "secured", battery: 18, favorite: true },
  { id: "porch-light", kind: "light", name: "Porch light", room: "entry", icon: "bulb", on: false, brightness: 100 },
  { id: "doorbell", kind: "camera", name: "Doorbell", room: "entry", icon: "camera", scene: "porch", online: true, microphone: true },

  // Bedroom
  { id: "bedside", kind: "light", name: "Bedside lamps", room: "bedroom", icon: "lamp", on: false, brightness: 30, color: { kind: "temperature", mireds: 454 }, colorId: "2200" },
  { id: "window", kind: "sensor", sensor: "contact", name: "Window", room: "bedroom", icon: "door", detected: true, battery: 73 },
  { id: "bedroom-temp", kind: "sensor", sensor: "temperature", name: "Temperature sensor", room: "bedroom", icon: "thermostat", detected: false, reading: "19.5", battery: 55 },

  // Garage
  { id: "garage-door", kind: "door", name: "Garage door", room: "garage", icon: "garage", state: "closed", obstructed: false, favorite: true },
  { id: "workbench", kind: "outlet", name: "Workbench lights", room: "garage", icon: "plug", on: false, reachable: false },
  { id: "driveway", kind: "camera", name: "Driveway", room: "garage", icon: "camera", scene: "driveway", online: true, microphone: false },

  // Backyard
  { id: "patio-motion", kind: "sensor", sensor: "motion", name: "Patio motion sensor", room: "backyard", icon: "motion", detected: false, battery: 40 },
  { id: "backyard-cam", kind: "camera", name: "Backyard", room: "backyard", icon: "camera", scene: "backyard", online: false, microphone: false },
]

const scenes: Scene[] = [
  {
    id: "morning",
    name: "Good Morning",
    icon: "sunrise",
    set: {
      pendants: { on: true, brightness: 100 },
      "kitchen-shades": { position: 100 },
      coffee: { on: true },
      thermostat: { target: 21.5 },
    },
  },
  {
    id: "cooking",
    name: "Cooking",
    icon: "cooking",
    set: { pendants: { on: true, brightness: 100 }, cabinet: { on: true, brightness: 80 }, "oven-fan": { on: true, speed: 50 } },
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: "dinner",
    set: { pendants: { on: true, brightness: 40 }, cabinet: { on: true, brightness: 25 }, "oven-fan": { on: false, speed: 0 } },
  },
  {
    id: "leave",
    name: "Leave Home",
    icon: "leave",
    set: {
      pendants: { on: false },
      cabinet: { on: false },
      "floor-lamp": { on: false },
      "back-door": { target: "secured", state: "secured" },
      "front-door": { target: "secured", state: "secured" },
      thermostat: { target: 17 },
    },
  },
  {
    id: "night",
    name: "Good Night",
    icon: "night",
    set: {
      pendants: { on: false },
      cabinet: { on: true, brightness: 10 },
      "floor-lamp": { on: false },
      bedside: { on: true, brightness: 20 },
      "back-door": { target: "secured", state: "secured" },
      "front-door": { target: "secured", state: "secured" },
      "garage-door": { state: "closed" },
    },
  },
]

const automations: Automation[] = [
  {
    id: "arrive",
    trigger: "arrive",
    title: "When I arrive home",
    detail: "Turn on Porch light and Floor lamp",
    enabled: true,
    sceneIds: [],
    accessoryIds: ["porch-light", "floor-lamp"],
  },
  {
    id: "sunset",
    trigger: "time",
    title: "Sunset",
    detail: "Turn on Porch light, set Pendant lights to 40%",
    enabled: true,
    time: "Sunset",
    turnOffAfter: "Never",
    sceneIds: [],
    accessoryIds: ["porch-light", "pendants"],
  },
  {
    id: "leak",
    trigger: "sensor",
    title: "When Leak sensor detects a leak",
    detail: "Turn off Faucet",
    enabled: true,
    sceneIds: [],
    accessoryIds: ["faucet"],
  },
  {
    id: "weekday",
    trigger: "time",
    title: "6:30 AM, weekdays",
    detail: "Good Morning",
    enabled: true,
    time: "6:30 AM",
    turnOffAfter: "Never",
    sceneIds: ["morning"],
    accessoryIds: [],
  },
  {
    id: "leave",
    trigger: "leave",
    title: "When the last person leaves",
    detail: "Leave Home",
    enabled: false,
    sceneIds: ["leave"],
    accessoryIds: [],
  },
]

/** Hourly Grid Forecast for today. Cleaner energy from 4 to 10 PM. */
const forecast = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"].map(
  (label, index) => ({ label, cleaner: index >= 4 && index <= 9 })
)

export { accessories, automations, forecast, homes, rooms, scenes }
export type {
  Accessory,
  Automation,
  Camera,
  Door,
  Fan,
  Faucet,
  Home,
  IconName,
  Light,
  LightColor,
  LockAccessory,
  Outlet,
  Room,
  RoomId,
  Scene,
  Sensor,
  Shade,
  Speaker,
  Thermostat,
  Tint,
  Tv,
}
