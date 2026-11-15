import * as React from "react"
import { join } from "../lib/cx"

const artworkVariants = [
  "aurora",
  "bloom",
  "orbit",
  "strata",
  "prism",
  "halftone",
  "rays",
  "glyph",
  "ribbon",
  "topo",
  "grain",
  "mosaic",
  "wash",
  "horizon",
  "window",
  "lens",
] as const

/** The variants made to sit behind an interface: soft, low in contrast, flat by default. */
const artworkBackgrounds = ["wash", "horizon", "window", "lens"] as const

const artworkTimes = ["dawn", "day", "dusk", "night"] as const

const artworkPalettes = [
  "accent",
  "sunset",
  "ocean",
  "forest",
  "berry",
  "citrus",
  "dusk",
  "ember",
  "glacier",
  "candy",
  "mono",
  "dawn",
  "sky",
  "night",
  "amber",
  "water",
  "slate",
] as const

type ArtworkVariant = (typeof artworkVariants)[number]
type ArtworkPalette = (typeof artworkPalettes)[number]
type ArtworkTime = (typeof artworkTimes)[number]
type ArtworkShape = "square" | "rounded" | "circle" | "app"
type ArtworkFinish = "flat" | "gloss" | "grain"

type ArtworkProps = Omit<React.ComponentProps<"span">, "title"> & {
  /** Same seed, same picture, on the server and in the browser. */
  seed: string | number
  /** `auto` picks one from the seed. */
  variant?: ArtworkVariant | "auto"
  /** System colors the art is painted with, so it follows the theme. `auto` picks one from the seed. */
  palette?: ArtworkPalette | "auto"
  /** Your own CSS colors in place of a palette: up to four hues, then an optional ground. */
  colors?: readonly string[]
  shape?: ArtworkShape
  /** Corner radius, in pixels or any CSS length. Overrides `shape`. */
  radius?: number | string
  /** Width over height. */
  aspect?: number
  /** Width, in pixels or any CSS length. Fills its container when left out. */
  size?: number | string
  /** `gloss` adds a soft top light and vignette; `grain` adds film grain on top. Covers default to `gloss`, backgrounds to `flat`. */
  finish?: ArtworkFinish
  /** A slow drift of the shapes. Pauses under Reduce Motion. */
  animated?: boolean
  /** Names the picture and makes it an image. Without it or `aria-label` the art is decorative. */
  title?: string
  /** The light in a background: where `horizon` puts its sun, and the palette when none is given. */
  time?: ArtworkTime
  /** How far the art recedes behind content, from 0 to 1: it's veiled with the page's background color. */
  dim?: number
}

/* ── Deterministic math ───────────────────────────────────────── */

// Only + − × ÷, % and sqrt are exactly specified in IEEE 754, so the art avoids
// Math.sin/cos/exp/pow: every engine draws the same path, and hydration matches.
const PI = 3.141592653589793
const TAU = PI * 2

function sin(value: number) {
  let x = value % TAU
  if (x > PI) x -= TAU
  else if (x < -PI) x += TAU
  if (x > PI / 2) x = PI - x
  else if (x < -PI / 2) x = -PI - x
  const x2 = x * x
  return x * (1 - (x2 / 6) * (1 - (x2 / 20) * (1 - (x2 / 42) * (1 - (x2 / 72) * (1 - (x2 / 110) * (1 - x2 / 156))))))
}

function cos(value: number) {
  return sin(value + PI / 2)
}

const rad = (degrees: number) => (degrees * PI) / 180
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const smoothstep = (t: number) => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

/** Rounds to a tenth of a unit, which is a tenth of a percent of the picture. */
function n(value: number) {
  return Math.round(value * 10) / 10
}

function hash(input: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return h >>> 0
}

type Rng = {
  next: () => number
  range: (min: number, max: number) => number
  int: (min: number, max: number) => number
  chance: (p: number) => boolean
  pick: <T>(list: readonly T[]) => T
  shuffle: <T>(list: readonly T[]) => T[]
}

function createRng(seed: number): Rng {
  let a = seed | 0
  const next = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const rng: Rng = {
    next,
    range: (min, max) => min + (max - min) * next(),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    chance: (p) => next() < p,
    pick: (list) => list[Math.floor(next() * list.length)] as (typeof list)[number],
    shuffle: (list) => {
      const out = [...list]
      for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        ;[out[i], out[j]] = [out[j] as (typeof out)[number], out[i] as (typeof out)[number]]
      }
      return out
    },
  }
  return rng
}

/* ── Paths ────────────────────────────────────────────────────── */

type Point = [number, number]

function polygon(points: Point[]) {
  return `M${points.map(([x, y]) => `${n(x)} ${n(y)}`).join("L")}Z`
}

/** A Catmull-Rom curve through the points, as cubic Béziers. */
function smooth(points: Point[], closed: boolean) {
  const count = points.length
  const at = (i: number): Point =>
    closed ? (points[(i + count) % count] as Point) : (points[clamp(i, 0, count - 1)] as Point)
  let d = `M${n(at(0)[0])} ${n(at(0)[1])}`
  const segments = closed ? count : count - 1
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)]
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`
  }
  return closed ? `${d}Z` : d
}

/* ── Color ────────────────────────────────────────────────────── */

const ground = "var(--mb-artwork-ground)"
const light = "var(--mb-artwork-light)"
const paper = "var(--mb-artwork-paper)"
const ink = "var(--mb-artwork-ink)"

function mix(a: string, b: string, percentOfA: number) {
  const p = Math.round(clamp(percentOfA, 0, 100))
  if (p >= 100) return a
  if (p <= 0) return b
  return `color-mix(in oklch, ${a} ${p}%, ${b})`
}

/** A color along a ramp of stops, `t` from 0 to 1. */
function ramp(stops: string[], t: number) {
  const u = clamp(t) * (stops.length - 1)
  const i = Math.min(Math.floor(u), stops.length - 2)
  return mix(stops[i + 1] as string, stops[i] as string, (u - i) * 100)
}

type Stop = [offset: number, color: string, opacity?: number]

function stops(list: Stop[]) {
  return list.map(([offset, color, opacity = 1], i) => (
    <stop key={i} offset={n(offset * 100) / 100} style={{ stopColor: color, stopOpacity: opacity }} />
  ))
}

/** A soft falloff, close to a Gaussian, so blobs have no visible edge. */
function soft(color: string, opacity: number): Stop[] {
  return [
    [0, color, opacity],
    [0.25, color, opacity * 0.82],
    [0.5, color, opacity * 0.48],
    [0.72, color, opacity * 0.18],
    [0.88, color, opacity * 0.05],
    [1, color, 0],
  ]
}

/* ── Drawing context ──────────────────────────────────────────── */

type Ctx = {
  r: Rng
  w: number
  h: number
  /** The shorter side. Sizes are fractions of it, so art keeps its proportions at any aspect. */
  s: number
  cx: number
  cy: number
  id: (name: string) => string
  url: (name: string) => string
  /** The palette's hues, in an order the seed shuffles. */
  c: (i: number) => string
  time?: ArtworkTime
}

function Linear({ x, name, to, list, user }: { x: Ctx; name: string; to: [number, number, number, number]; list: Stop[]; user?: boolean }) {
  const [x1, y1, x2, y2] = to
  return (
    <linearGradient
      id={x.id(name)}
      x1={n(x1 * (user ? 1 : 100)) + (user ? "" : "%")}
      y1={n(y1 * (user ? 1 : 100)) + (user ? "" : "%")}
      x2={n(x2 * (user ? 1 : 100)) + (user ? "" : "%")}
      y2={n(y2 * (user ? 1 : 100)) + (user ? "" : "%")}
      gradientUnits={user ? "userSpaceOnUse" : undefined}
    >
      {stops(list)}
    </linearGradient>
  )
}

function Radial({
  x,
  name,
  list,
  at,
}: {
  x: Ctx
  name: string
  list: Stop[]
  /** In user space: centre, radius and an optional focal point. */
  at?: { cx: number; cy: number; r: number; fx?: number; fy?: number }
}) {
  return (
    <radialGradient
      id={x.id(name)}
      gradientUnits={at ? "userSpaceOnUse" : undefined}
      cx={at ? n(at.cx) : undefined}
      cy={at ? n(at.cy) : undefined}
      r={at ? n(at.r) : undefined}
      fx={at?.fx !== undefined ? n(at.fx) : undefined}
      fy={at?.fy !== undefined ? n(at.fy) : undefined}
    >
      {stops(list)}
    </radialGradient>
  )
}

function Glow({ x, name, cx, cy, r, color, opacity }: { x: Ctx; name: string; cx: number; cy: number; r: number; color: string; opacity: number }) {
  return (
    <>
      <Radial x={x} name={name} list={soft(color, opacity)} />
      <circle cx={n(cx)} cy={n(cy)} r={n(r)} fill={x.url(name)} />
    </>
  )
}

function Ground({ x, color }: { x: Ctx; color: string }) {
  return <rect width={n(x.w)} height={n(x.h)} style={{ fill: color }} />
}

/* ── Variants ─────────────────────────────────────────────────── */

/** Soft blobs of color melting into each other, like a mesh gradient. */
function aurora(x: Ctx) {
  const { r, w, h, s } = x
  const count = r.int(4, 6)
  const start = r.range(0, TAU)
  const blobs = Array.from({ length: count }, (_, i) => {
    const angle = start + (i * TAU) / count + r.range(-0.45, 0.45)
    const distance = r.range(0.16, 0.42)
    const rx = r.range(0.48, 0.74) * s
    return {
      cx: x.cx + cos(angle) * distance * w,
      cy: x.cy + sin(angle) * distance * h,
      rx,
      ry: rx * r.range(0.55, 0.9),
      rotate: r.range(0, 180),
      color: x.c(i),
    }
  })
  const glow = { cx: x.cx + r.range(-0.28, 0.28) * w, cy: r.range(0.18, 0.45) * h, r: r.range(0.4, 0.55) * s }
  const half = Math.ceil(count / 2)
  const blob = (b: (typeof blobs)[number], i: number) => (
    <ellipse
      key={i}
      cx={n(b.cx)}
      cy={n(b.cy)}
      rx={n(b.rx)}
      ry={n(b.ry)}
      transform={`rotate(${n(b.rotate)} ${n(b.cx)} ${n(b.cy)})`}
      fill={x.url(`b${i}`)}
    />
  )
  return (
    <>
      <defs>
        <Linear x={x} name="base" to={[0, 0, 1, 1]} list={[[0, mix(x.c(0), ground, 55)], [1, mix(x.c(1), ground, 30)]]} />
        {blobs.map((b, i) => (
          <Radial key={i} x={x} name={`b${i}`} list={soft(b.color, 0.95)} />
        ))}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <g className="mb-artwork-drift" data-drift="1">
        {blobs.slice(0, half).map(blob)}
      </g>
      <g className="mb-artwork-drift" data-drift="2">
        {blobs.slice(half).map((b, i) => blob(b, i + half))}
      </g>
      <g className="mb-artwork-drift" data-drift="3">
        <Glow x={x} name="glow" cx={glow.cx} cy={glow.cy} r={glow.r} color={light} opacity={0.42} />
      </g>
    </>
  )
}

const bloomAnchors: { at: Point; from: number; to: number }[] = [
  { at: [-0.06, 1.06], from: -98, to: 8 },
  { at: [1.06, 1.06], from: -172, to: -82 },
  { at: [0.5, 1.18], from: -168, to: -12 },
  { at: [-0.14, 0.55], from: -72, to: 72 },
  { at: [1.14, 0.45], from: 108, to: 252 },
]

/** Petals fanned out from an edge, shaded like folded silk. */
function bloom(x: Ctx) {
  const { r, w, h, s } = x
  const anchor = r.pick(bloomAnchors)
  const [ax, ay] = [anchor.at[0] * w, anchor.at[1] * h]
  const far = Math.sqrt(w * w + h * h)

  const fan = (count: number, reach: [number, number], thickness: [number, number], tone: (t: number) => string, prefix: string) =>
    Array.from({ length: count }, (_, i) => {
      const t = count > 1 ? i / (count - 1) : 0.5
      const angle = lerp(anchor.from, anchor.to, (i + 0.5) / count) + r.range(-4, 4)
      const length = r.range(reach[0], reach[1]) * far
      const width = length * r.range(thickness[0], thickness[1])
      const color = tone(t)
      return { key: `${prefix}${i}`, angle, length, width, color }
    })

  const a = x.c(0)
  const b = x.c(1)
  const outer = fan(r.int(6, 8), [0.82, 1.04], [0.17, 0.23], (t) => mix(mix(b, a, t * 100), light, 100 - t * 22), "p")
  const inner = fan(r.int(3, 5), [0.42, 0.6], [0.2, 0.28], (t) => mix(mix(x.c(2), x.c(3), 100 - t * 100), light, 88 - t * 16), "q")
  const petals = [...outer, ...inner]

  return (
    <>
      <defs>
        <Linear x={x} name="base" to={[0, 0, 1, 1]} list={[[0, mix(b, ground, 30)], [1, ground]]} />
        {petals.map((p) => (
          <Linear
            key={p.key}
            x={x}
            name={p.key}
            to={[0, 0, 0, 1]}
            list={[
              [0, mix(p.color, light, 55)],
              [0.3, p.color],
              [0.72, mix(p.color, ground, 82)],
              [1, mix(p.color, ground, 45)],
            ]}
          />
        ))}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <Glow x={x} name="glow" cx={w - ax * 0.6} cy={h - ay * 0.7} r={s * 0.9} color={x.c(2)} opacity={0.45} />
      {[outer, inner].map((group, g) => (
        <g key={g} className="mb-artwork-drift" data-drift={g === 0 ? "1" : "2"}>
          {group.map((p) => (
            <ellipse
              key={p.key}
              cx={n(ax + p.length / 2)}
              cy={n(ay)}
              rx={n(p.length / 2)}
              ry={n(p.width / 2)}
              transform={`rotate(${n(p.angle)} ${n(ax)} ${n(ay)})`}
              fill={x.url(p.key)}
            />
          ))}
        </g>
      ))}
      <Glow x={x} name="core" cx={ax} cy={ay} r={s * 0.5} color={light} opacity={0.35} />
    </>
  )
}

/** Concentric rings with bright arcs and a few moons, around a glowing core. */
function orbit(x: Ctx) {
  const { r, w, h, s } = x
  const centered = r.chance(0.55)
  const cx = centered ? x.cx : r.range(0.22, 0.78) * w
  const cy = centered ? x.cy : r.pick([0.72, 0.8, 0.28]) * h
  const farthest = Math.sqrt(Math.max(cx, w - cx) ** 2 + Math.max(cy, h - cy) ** 2)
  const core = r.range(0.07, 0.1) * s
  const rings: { radius: number; arc?: { width: number; length: number; start: number; color: string; key: string } }[] = []
  let radius = core * r.range(1.8, 2.3)
  let i = 0
  while (radius < farthest && rings.length < 14) {
    const arc = r.chance(0.72)
      ? {
          width: r.range(0.012, 0.04) * s,
          length: r.range(14, 58),
          start: r.range(0, 360),
          color: x.c(i),
          key: `a${i}`,
        }
      : undefined
    rings.push({ radius, arc })
    radius += r.range(0.055, 0.105) * s
    i++
  }
  const moons = r.shuffle(rings.slice(1, -1)).slice(0, r.int(2, 3)).map((ring, m) => {
    const angle = r.range(0, TAU)
    return {
      key: `m${m}`,
      x: cx + cos(angle) * ring.radius,
      y: cy + sin(angle) * ring.radius,
      radius: r.range(0.012, 0.024) * s,
    }
  })

  return (
    <>
      <defs>
        <Radial x={x} name="base" at={{ cx, cy, r: farthest }} list={[[0, mix(x.c(0), ground, 40)], [0.55, mix(x.c(1), ground, 18)], [1, ground]]} />
        <Radial x={x} name="core" at={{ cx, cy, r: core, fx: cx - core * 0.35, fy: cy - core * 0.4 }} list={[[0, light], [0.45, x.c(0)], [1, mix(x.c(0), ground, 60)]]} />
        {rings.map((ring) =>
          ring.arc ? (
            <Linear key={ring.arc.key} x={x} name={ring.arc.key} to={[0, 0, 1, 1]} list={[[0, mix(ring.arc.color, light, 55)], [1, ring.arc.color]]} />
          ) : null
        )}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <Glow x={x} name="halo" cx={cx} cy={cy} r={core * 4.5} color={x.c(0)} opacity={0.55} />
      <g fill="none" style={{ stroke: light }} strokeOpacity={0.16} strokeWidth={n(0.0035 * s)}>
        {rings.map((ring, k) => (
          <circle key={k} cx={n(cx)} cy={n(cy)} r={n(ring.radius)} />
        ))}
      </g>
      <g
        className="mb-artwork-drift"
        data-drift="5"
        fill="none"
        strokeLinecap="round"
        style={{ transformOrigin: `${n(cx)}px ${n(cy)}px` }}
      >
        {rings.map((ring, k) =>
          ring.arc ? (
            <circle
              key={k}
              cx={n(cx)}
              cy={n(cy)}
              r={n(ring.radius)}
              pathLength={100}
              strokeDasharray={`${n(ring.arc.length)} ${n(100 - ring.arc.length)}`}
              strokeWidth={n(ring.arc.width)}
              stroke={x.url(ring.arc.key)}
              transform={`rotate(${n(ring.arc.start)} ${n(cx)} ${n(cy)})`}
            />
          ) : null
        )}
      </g>
      {moons.map((moon) => (
        <React.Fragment key={moon.key}>
          <Glow x={x} name={`${moon.key}g`} cx={moon.x} cy={moon.y} r={moon.radius * 5} color={light} opacity={0.5} />
          <circle cx={n(moon.x)} cy={n(moon.y)} r={n(moon.radius)} style={{ fill: light }} />
        </React.Fragment>
      ))}
      <circle cx={n(cx)} cy={n(cy)} r={n(core)} fill={x.url("core")} />
    </>
  )
}

/** Layered dunes or hills, hazier toward the horizon. */
function strata(x: Ctx) {
  const { r, w, h, s } = x
  const count = r.int(5, 7)
  const tilt = r.range(-0.14, 0.14)
  const sun = r.chance(0.8) ? { cx: r.range(0.22, 0.78) * w, cy: r.range(0.14, 0.3) * h, r: r.range(0.07, 0.12) * s } : null
  const tones = [mix(x.c(1), light, 50), x.c(1), x.c(2), mix(x.c(2), ground, 50)]
  const bands = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)
    const base = h * (0.4 + 0.5 * t) + r.range(-0.02, 0.02) * h
    const amplitude = r.range(0.035, 0.07) * h * (1 + t * 0.6)
    const frequency = (r.range(0.5, 1.25) * TAU) / w
    const phase = r.range(0, TAU)
    const phase2 = r.range(0, TAU)
    const slope = tilt * r.range(0.6, 1.3) * (i % 2 ? 1 : -0.7)
    const points: Point[] = Array.from({ length: 12 }, (_, k) => {
      const px = -0.06 * w + (k / 11) * 1.12 * w
      const y =
        base +
        amplitude * sin(frequency * px + phase) +
        amplitude * 0.3 * sin(frequency * 2.1 * px + phase2) +
        slope * (px - w / 2)
      return [px, y]
    })
    const color = ramp(tones, t)
    const crest = smooth(points, false)
    const last = points[points.length - 1] as Point
    const first = points[0] as Point
    return { key: `s${i}`, crest, fill: `${crest}L${n(last[0])} ${n(h + 2)}L${n(first[0])} ${n(h + 2)}Z`, color }
  })

  return (
    <>
      <defs>
        <Linear x={x} name="sky" to={[0, 0, 0, 1]} list={[[0, mix(x.c(3), light, 70)], [0.5, mix(x.c(0), light, 45)]]} />
        {bands.map((band) => (
          <Linear
            key={band.key}
            x={x}
            name={band.key}
            to={[0, 0, 0, 1]}
            list={[
              [0, mix(band.color, light, 82)],
              [0.3, band.color],
              [1, mix(band.color, ground, 60)],
            ]}
          />
        ))}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("sky")} />
      {sun ? (
        <g className="mb-artwork-drift" data-drift="3">
          <Glow x={x} name="sunglow" cx={sun.cx} cy={sun.cy} r={sun.r * 3.6} color={light} opacity={0.6} />
          <circle cx={n(sun.cx)} cy={n(sun.cy)} r={n(sun.r)} style={{ fill: mix(light, x.c(0), 80) }} />
        </g>
      ) : null}
      {bands.map((band) => (
        <React.Fragment key={band.key}>
          <path d={band.fill} fill={x.url(band.key)} />
          <path d={band.crest} fill="none" style={{ stroke: light }} strokeOpacity={0.24} strokeWidth={n(0.004 * s)} />
        </React.Fragment>
      ))}
    </>
  )
}

/** Translucent planes of light crossing each other, like glass in a beam. */
function prism(x: Ctx) {
  const { r, w, h, s } = x
  const base = r.range(0, 180)
  const count = r.int(4, 6)
  const planes = Array.from({ length: count }, (_, i) => {
    const angle = base + r.range(-26, 26)
    const width = r.range(0.2, 0.42) * s
    const offset = r.range(-0.42, 0.42) * s
    return { key: `p${i}`, angle, width, offset, from: x.c(i), to: x.c(i + 1 + r.int(0, 2)), opacity: r.range(0.6, 0.92) }
  })
  const length = Math.sqrt(w * w + h * h) * 1.6
  const shard = r.chance(0.75)
    ? ([
        [r.range(-0.1, 0.4) * w, r.range(-0.1, 0.3) * h],
        [r.range(0.6, 1.1) * w, r.range(0.2, 0.6) * h],
        [r.range(0.1, 0.7) * w, r.range(0.8, 1.1) * h],
      ] as Point[])
    : null

  return (
    <>
      <defs>
        <Linear x={x} name="base" to={[0, 0, 1, 1]} list={[[0, mix(x.c(0), ground, 28)], [1, ground]]} />
        {planes.map((p) => (
          <Linear key={p.key} x={x} name={p.key} to={[0, 0, 0, 1]} list={[[0, mix(p.from, light, 85), p.opacity], [0.5, p.from, p.opacity * 0.6], [1, p.to, 0.05]]} />
        ))}
        <Linear x={x} name="shard" to={[0, 0, 1, 1]} list={[[0, x.c(2), 0.85], [1, x.c(3), 0.08]]} />
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <Glow x={x} name="glare" cx={x.cx + r.range(-0.3, 0.3) * w} cy={x.cy + r.range(-0.3, 0.3) * h} r={0.7 * s} color={x.c(1)} opacity={0.45} />
      <g className="mb-artwork-blend mb-artwork-drift" data-drift="1">
        {shard ? <path d={polygon(shard)} fill={x.url("shard")} /> : null}
        {planes.map((p) => {
          const top = x.cy + p.offset - p.width / 2
          const left = x.cx - length / 2
          const rotate = `rotate(${n(p.angle)} ${n(x.cx)} ${n(x.cy)})`
          return (
            <g key={p.key} transform={rotate}>
              <rect x={n(left)} y={n(top)} width={n(length)} height={n(p.width)} fill={x.url(p.key)} />
              <line
                x1={n(left)}
                y1={n(top)}
                x2={n(left + length)}
                y2={n(top)}
                style={{ stroke: light }}
                strokeOpacity={0.55}
                strokeWidth={n(0.004 * s)}
              />
            </g>
          )
        })}
      </g>
    </>
  )
}

/** A field of dots that swell and shrink across the picture, like a print screen. */
function halftone(x: Ctx) {
  const { r, w, h, s } = x
  const onPaper = r.chance(0.4)
  const step = s / r.pick([14, 16, 18])
  const spots = Array.from({ length: r.int(1, 3) }, () => ({
    x: r.range(0.1, 0.9) * w,
    y: r.range(0.1, 0.9) * h,
    reach: r.range(0.6, 0.95) * s,
    weight: r.range(0.75, 1.05),
  }))
  const angle = r.range(0, TAU)
  const [dx, dy] = [cos(angle), sin(angle)]
  const lean = r.range(0.3, 0.55)
  let d = ""
  const rowHeight = step * 0.866
  const rows = Math.ceil(h / rowHeight) + 1
  const cols = Math.ceil(w / step) + 1
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      const px = col * step + (row % 2 ? step / 2 : 0) - step / 4
      const py = row * rowHeight
      let field = 0
      for (const spot of spots) {
        const dist = Math.sqrt((px - spot.x) ** 2 + (py - spot.y) ** 2)
        field = Math.max(field, smoothstep(1 - dist / spot.reach) * spot.weight)
      }
      const directional = (((px - x.cx) * dx + (py - x.cy) * dy) / s + 0.5) * lean
      const value = clamp(field + directional)
      const radius = step * 0.47 * value
      if (radius < step * 0.07) continue
      d += `M${n(px - radius)} ${n(py)}a${n(radius)} ${n(radius)} 0 1 0 ${n(radius * 2)} 0a${n(radius)} ${n(radius)} 0 1 0 ${n(-radius * 2)} 0`
    }
  }
  const span = 0.62 * s
  return (
    <>
      <defs>
        <Linear
          x={x}
          name="dots"
          user
          to={[x.cx - dx * span, x.cy - dy * span, x.cx + dx * span, x.cy + dy * span]}
          list={onPaper ? [[0, x.c(0)], [0.5, x.c(1)], [1, mix(x.c(2), ink, 70)]] : [[0, x.c(0)], [0.5, mix(x.c(1), light, 80)], [1, x.c(2)]]}
        />
      </defs>
      <Ground x={x} color={onPaper ? paper : ground} />
      {onPaper ? null : <Glow x={x} name="glow" cx={spots[0]?.x ?? x.cx} cy={spots[0]?.y ?? x.cy} r={0.9 * s} color={x.c(0)} opacity={0.38} />}
      <path className="mb-artwork-drift" data-drift="4" d={d} fill={x.url("dots")} />
    </>
  )
}

const rayOrigins: { at: Point; aim: number; burst: boolean }[] = [
  { at: [0.5, 1.1], aim: -90, burst: true },
  { at: [-0.06, -0.06], aim: 45, burst: true },
  { at: [0.5, 0.56], aim: -90, burst: true },
  { at: [-0.1, 0.82], aim: -25, burst: false },
  { at: [1.08, 0.12], aim: 150, burst: false },
  { at: [0.5, -0.12], aim: 90, burst: false },
]

/** A sunburst, or beams of light falling from one point. */
function rays(x: Ctx) {
  const { r, w, h, s } = x
  const origin = r.pick(rayOrigins)
  const [ox, oy] = [origin.at[0] * w, origin.at[1] * h]
  const reach = Math.sqrt(w * w + h * h) * 1.4
  const wedge = (from: number, to: number) =>
    polygon([
      [ox, oy],
      [ox + cos(rad(from)) * reach, oy + sin(rad(from)) * reach],
      [ox + cos(rad(to)) * reach, oy + sin(rad(to)) * reach],
    ])
  const burst = origin.burst && r.chance(0.7)

  if (burst) {
    const count = r.int(9, 14) * 2
    const weights = Array.from({ length: count }, () => r.range(0.6, 1.4))
    const total = weights.reduce((sum, value) => sum + value, 0)
    let angle = r.range(0, 360)
    const a = x.c(0)
    const b = mix(x.c(0), x.c(1), 45)
    const wedges = weights.map((weight, i) => {
      const from = angle
      angle += (weight / total) * 360
      return { key: i, d: wedge(from, angle + 0.3), color: i % 2 ? a : b }
    })
    return (
      <>
        <defs>
          <Radial
            x={x}
            name="light"
            at={{ cx: ox, cy: oy, r: reach * 0.7 }}
            list={[
              [0, light, 0.95],
              [0.12, light, 0.5],
              [0.4, x.c(2), 0.12],
              [1, ground, 0.6],
            ]}
          />
        </defs>
        <Ground x={x} color={a} />
        <g className="mb-artwork-drift" data-drift="5" style={{ transformOrigin: `${n(ox)}px ${n(oy)}px` }}>
          {wedges.map((item) => (
            <path key={item.key} d={item.d} style={{ fill: item.color }} />
          ))}
        </g>
        <rect width={n(w)} height={n(h)} fill={x.url("light")} />
        <Glow x={x} name="sun" cx={ox} cy={oy} r={0.32 * s} color={light} opacity={0.9} />
      </>
    )
  }

  const beams = Array.from({ length: r.int(7, 11) }, (_, i) => {
    const center = origin.aim + r.range(-62, 62)
    const spread = r.range(1.2, 5.5)
    return { key: `r${i}`, from: center - spread, to: center + spread, color: x.c(i) }
  })
  const washes = Array.from({ length: 3 }, (_, i) => {
    const center = origin.aim + r.range(-40, 40)
    const spread = r.range(9, 18)
    return { key: `w${i}`, from: center - spread, to: center + spread, color: x.c(i + 1) }
  })
  return (
    <>
      <defs>
        <Linear x={x} name="base" to={[0, 0, 1, 1]} list={[[0, mix(x.c(0), ground, 22)], [1, ground]]} />
        {[...beams, ...washes].map((beam) => (
          <Radial
            key={beam.key}
            x={x}
            name={beam.key}
            at={{ cx: ox, cy: oy, r: reach * 0.75 }}
            list={[
              [0, light, 0.95],
              [0.22, beam.color, 0.7],
              [0.6, beam.color, 0.2],
              [1, beam.color, 0],
            ]}
          />
        ))}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <g className="mb-artwork-blend">
        <g opacity={0.45}>
          {washes.map((beam) => (
            <path key={beam.key} d={wedge(beam.from, beam.to)} fill={x.url(beam.key)} />
          ))}
        </g>
        <g className="mb-artwork-drift" data-drift="5" style={{ transformOrigin: `${n(ox)}px ${n(oy)}px` }}>
          {beams.map((beam) => (
            <path key={beam.key} d={wedge(beam.from, beam.to)} fill={x.url(beam.key)} />
          ))}
        </g>
      </g>
      <Glow x={x} name="source" cx={ox} cy={oy} r={0.55 * s} color={light} opacity={0.75} />
    </>
  )
}

type GlyphShape = "quarter" | "half" | "circle" | "ring" | "dot" | "triangle" | "empty"

/** A Swiss grid of circles, half circles and quarter circles. */
function glyph(x: Ctx) {
  const { r, w, h } = x
  const rows = r.pick([2, 3, 3, 4])
  const cols = Math.max(1, Math.round((rows * w) / h))
  const cw = w / cols
  const ch = h / rows
  const size = Math.min(cw, ch)
  const scheme = r.pick(["paper", "paper", "ground", "color"] as const)
  const background = scheme === "paper" ? paper : scheme === "ground" ? ground : x.c(0)
  const inks =
    scheme === "paper"
      ? [x.c(0), x.c(1), x.c(2), mix(ink, x.c(3), 85)]
      : scheme === "ground"
        ? [x.c(0), x.c(1), x.c(2), light]
        : [x.c(1), mix(ink, x.c(0), 80), light, x.c(2)]
  const extra = r.pick(["circle", "ring", "dot", "triangle"] as const)
  const shapes: GlyphShape[] = ["quarter", "quarter", "half", "half", extra, rows > 2 ? "empty" : extra]
  const cells: React.ReactNode[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row}-${col}`
      const left = col * cw + (cw - size) / 2
      const top = row * ch + (ch - size) / 2
      const fillIndex = r.chance(0.5) ? r.int(0, inks.length - 1) : -1
      const cellFill = fillIndex >= 0 ? inks[fillIndex] : undefined
      const shape = r.pick(shapes)
      let inkIndex = r.int(0, inks.length - 1)
      if (inkIndex === fillIndex) inkIndex = (inkIndex + 1 + r.int(0, inks.length - 2)) % inks.length
      const color = inks[inkIndex] as string
      const turn = r.int(0, 3) * 90
      const z = n(size)
      const half = n(size / 2)
      const transform = `translate(${n(left)} ${n(top)}) rotate(${turn} ${half} ${half})`
      let mark: React.ReactNode = null
      if (shape === "quarter") mark = <path d={`M0 0H${z}A${z} ${z} 0 0 1 0 ${z}Z`} />
      else if (shape === "half") mark = <path d={`M0 0H${z}A${half} ${half} 0 0 1 0 0Z`} />
      else if (shape === "triangle") mark = <path d={`M0 0H${z}L0 ${z}Z`} />
      else if (shape === "circle") mark = <circle cx={half} cy={half} r={half} />
      else if (shape === "dot") mark = <circle cx={half} cy={half} r={n(size * 0.2)} />
      else if (shape === "ring")
        mark = <circle cx={half} cy={half} r={n(size * 0.33)} fill="none" style={{ stroke: color }} strokeWidth={n(size * 0.15)} />
      cells.push(
        <g key={key} transform={transform} style={{ fill: color }}>
          {cellFill ? <rect width={z} height={z} style={{ fill: cellFill }} /> : null}
          {mark}
        </g>
      )
    }
  }
  return (
    <>
      <Ground x={x} color={background} />
      {cells}
    </>
  )
}

/** Wide ribbons that twist through space, front and back in two colors. */
function ribbon(x: Ctx) {
  const { r, w, h, s } = x
  const count = r.int(2, 4)
  const vertical = r.chance(0.3)
  const ribbons = Array.from({ length: count }, (_, i) => {
    const map = ([a, b]: Point): Point => (vertical ? [b * w, a * h] : [a * w, b * h])
    const p0 = map([-0.18, r.range(0.1, 0.9)])
    const p1 = map([r.range(0.15, 0.45), r.range(-0.25, 1.25)])
    const p2 = map([r.range(0.55, 0.85), r.range(-0.25, 1.25)])
    const p3 = map([1.18, r.range(0.1, 0.9)])
    const width = r.range(0.12, 0.22) * s
    const twists = r.range(0.9, 2.1)
    const phase = r.range(0, 1)
    const front = x.c(i)
    const back = mix(x.c(i + 1), ground, 75)
    const ts: number[] = []
    for (let k = 0; k <= 44; k++) ts.push(k / 44)
    const nodes: number[] = []
    for (let m = -1; m < twists + 2; m++) {
      const t = (m + 0.5 - phase) / twists
      if (t > 0 && t < 1) nodes.push(t)
    }
    const all = [...new Set([...ts, ...nodes])].sort((a, b) => a - b)
    const sample = (t: number) => {
      const u = 1 - t
      const point: Point = [
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
      ]
      const tangent: Point = [
        3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]),
        3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]),
      ]
      const length = Math.sqrt(tangent[0] ** 2 + tangent[1] ** 2) || 1
      const half = (width / 2) * (0.1 + 0.9 * Math.abs(cos(PI * (t * twists + phase))))
      const normal: Point = [(-tangent[1] / length) * half, (tangent[0] / length) * half]
      return { point, left: [point[0] + normal[0], point[1] + normal[1]] as Point, right: [point[0] - normal[0], point[1] - normal[1]] as Point }
    }
    const samples = all.map((t) => ({ t, ...sample(t) }))
    const segments: (typeof samples)[] = [[]]
    for (const item of samples) {
      const current = segments[segments.length - 1] as typeof samples
      current.push(item)
      if (nodes.includes(item.t)) segments.push([item])
    }
    const outline = polygon([...samples.map((item) => item.left), ...samples.map((item) => item.right).reverse()])
    return {
      key: `r${i}`,
      outline,
      segments: segments
        .filter((segment) => segment.length > 1)
        .map((segment, k) => {
          const first = segment[0] as (typeof samples)[number]
          const last = segment[segment.length - 1] as (typeof samples)[number]
          const middle = (first.t + last.t) / 2
          const faceFront = Math.floor(middle * twists + phase + 0.5) % 2 === 0
          return {
            key: `r${i}s${k}`,
            d: polygon([...segment.map((item) => item.left), ...segment.map((item) => item.right).reverse()]),
            from: first.point,
            to: last.point,
            color: faceFront ? front : back,
          }
        }),
    }
  })

  return (
    <>
      <defs>
        <Linear x={x} name="base" to={[0, 0, 1, 1]} list={[[0, mix(x.c(0), ground, 30)], [1, ground]]} />
        <filter id={x.id("shadow")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={n(0.025 * s)} />
        </filter>
        {ribbons.flatMap((item) =>
          item.segments.map((segment) => (
            <Linear
              key={segment.key}
              x={x}
              name={segment.key}
              user
              to={[segment.from[0], segment.from[1], segment.to[0], segment.to[1]]}
              list={[
                [0, mix(segment.color, ground, 45)],
                [0.5, mix(segment.color, light, 78)],
                [1, mix(segment.color, ground, 45)],
              ]}
            />
          ))
        )}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <Glow x={x} name="glow" cx={x.cx} cy={x.cy} r={0.85 * s} color={x.c(1)} opacity={0.35} />
      {ribbons.map((item, i) => (
        <g key={item.key} className="mb-artwork-drift" data-drift={String((i % 3) + 1)}>
          <path
            d={item.outline}
            fill="black"
            fillOpacity={0.4}
            filter={x.url("shadow")}
            transform={`translate(${n(0.012 * s)} ${n(0.035 * s)})`}
          />
          {item.segments.map((segment) => (
            <path key={segment.key} d={segment.d} fill={x.url(segment.key)} />
          ))}
        </g>
      ))}
    </>
  )
}

/** Contour lines around a summit, filled like an elevation map. */
function topo(x: Ctx) {
  const { r, w, h, s } = x
  const px = r.range(0.25, 0.75) * w
  const py = r.range(0.25, 0.75) * h
  const farthest = Math.sqrt(Math.max(px, w - px) ** 2 + Math.max(py, h - py) ** 2)
  const count = r.int(9, 12)
  const step = (farthest * 1.08) / count
  const harmonics = [2, 3, 4, 5].map((m) => ({ m, amount: r.range(0.015, 0.045), phase: r.range(0, TAU), drift: r.range(-0.14, 0.14) }))
  const colors = [mix(x.c(2), light, 55), x.c(0), x.c(1), mix(x.c(1), ground, 40), ground]
  const rings = Array.from({ length: count }, (_, k) => {
    const level = count - 1 - k
    const radius = step * (level + 0.7)
    const points: Point[] = Array.from({ length: 24 }, (_, j) => {
      const theta = (j / 24) * TAU
      let wobble = 0
      for (const item of harmonics) wobble += item.amount * sin(item.m * theta + item.phase + level * item.drift)
      const rr = radius * (1 + wobble)
      return [px + cos(theta) * rr, py + sin(theta) * rr]
    })
    return { key: level, d: smooth(points, true), color: ramp(colors, level / (count - 1)), index: level % 4 === 3 }
  })

  return (
    <>
      <Ground x={x} color={ground} />
      <g className="mb-artwork-drift" data-drift="4" style={{ stroke: light }}>
        {rings.map((ring) => (
          <path
            key={ring.key}
            d={ring.d}
            style={{ fill: ring.color }}
            strokeOpacity={ring.index ? 0.55 : 0.26}
            strokeWidth={n((ring.index ? 0.006 : 0.0035) * s)}
          />
        ))}
      </g>
      <Glow x={x} name="peak" cx={px} cy={py} r={step * 2.4} color={light} opacity={0.4} />
    </>
  )
}

/** A printed sunset: a sun sinking into a still sea, under heavy film grain. */
function grainVariant(x: Ctx) {
  const { r, w, h, s } = x
  const horizon = r.range(0.58, 0.76) * h
  const radius = r.range(0.13, 0.22) * s
  const sun = { cx: r.range(0.28, 0.72) * w, cy: horizon - radius * r.range(-0.15, 0.9), r: radius }
  const bars = r.int(5, 8)
  const gapY = (h - horizon) / (bars + 1.5)
  return (
    <>
      <defs>
        <Linear
          x={x}
          name="sky"
          user
          to={[0, 0, 0, horizon]}
          list={[
            [0, mix(x.c(3), ground, 40)],
            [0.6, mix(x.c(0), x.c(3), 75)],
            [1, mix(x.c(1), light, 78)],
          ]}
        />
        <Linear x={x} name="sea" user to={[0, horizon, 0, h]} list={[[0, mix(x.c(1), ground, 60)], [1, ground]]} />
        <Linear x={x} name="sun" to={[0, 0, 0, 1]} list={[[0, mix(light, x.c(1), 85)], [1, mix(x.c(1), light, 70)]]} />
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("sky")} />
      <g className="mb-artwork-drift" data-drift="3">
        <Glow x={x} name="glow" cx={sun.cx} cy={sun.cy} r={sun.r * 3.4} color={light} opacity={0.55} />
        <circle cx={n(sun.cx)} cy={n(sun.cy)} r={n(sun.r)} fill={x.url("sun")} />
      </g>
      <rect y={n(horizon)} width={n(w)} height={n(h - horizon)} fill={x.url("sea")} />
      <g style={{ fill: mix(light, x.c(1), 65) }}>
        {Array.from({ length: bars }, (_, j) => {
          const t = j / bars
          const width = sun.r * 2 * (1 - t * 0.75) * r.range(0.75, 1)
          const height = gapY * r.range(0.28, 0.45)
          return (
            <rect
              key={j}
              x={n(sun.cx - width / 2 + r.range(-0.04, 0.04) * s)}
              y={n(horizon + gapY * (j + 0.7))}
              width={n(width)}
              height={n(height)}
              rx={n(height / 2)}
              opacity={n((0.85 - t * 0.65) * 100) / 100}
            />
          )
        })}
      </g>
    </>
  )
}

/** Soft rounded tiles, a few of them doubled up, shaded across the grid with one or two bright accents. */
function mosaic(x: Ctx) {
  const { r, w, h, s } = x
  const cols = Math.max(3, Math.round((r.pick([4, 4, 5, 6]) * w) / s))
  const rows = Math.max(3, Math.round((cols * h) / w))
  const cw = w / cols
  const ch = h / rows
  const gap = r.range(0.012, 0.02) * s
  const corner = Math.min(cw, ch) * r.range(0.16, 0.26)
  const angle = r.range(0, TAU)
  const [dx, dy] = [cos(angle), sin(angle)]
  const spot = { x: r.range(0.15, 0.85) * w, y: r.range(0.15, 0.85) * h }
  const taken = new Set<number>()
  const tiles: { col: number; row: number; span: [number, number] }[] = []
  const place = (col: number, row: number, span: [number, number]) => {
    for (let a = 0; a < span[0]; a++) for (let b = 0; b < span[1]; b++) if (col + a >= cols || row + b >= rows || taken.has((row + b) * cols + col + a)) return false
    for (let a = 0; a < span[0]; a++) for (let b = 0; b < span[1]; b++) taken.add((row + b) * cols + col + a)
    tiles.push({ col, row, span })
    return true
  }
  const big = r.int(1, 2)
  for (let k = 0, tries = 0; k < big && tries < 12; tries++) if (place(r.int(0, cols - 2), r.int(0, rows - 2), [2, 2])) k++
  const long = r.int(1, 3)
  for (let k = 0, tries = 0; k < long && tries < 12; tries++) {
    const across = r.chance(0.5)
    if (place(r.int(0, cols - (across ? 2 : 1)), r.int(0, rows - (across ? 1 : 2)), across ? [2, 1] : [1, 2])) k++
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) place(col, row, [1, 1])
  const accents = new Set(r.shuffle(tiles.map((_, i) => i).filter((i) => tiles[i]?.span[0] === 1 && tiles[i]?.span[1] === 1)).slice(0, r.int(1, 2)))
  const hues = [x.c(0), x.c(1), x.c(2)]

  return (
    <>
      <defs>
        <Linear x={x} name="sheen" to={[0, 0, 0, 1]} list={[[0, "white", 0.26], [0.45, "white", 0], [1, "black", 0.16]]} />
      </defs>
      <Ground x={x} color={mix(x.c(0), ground, 15)} />
      {tiles.map((tile, i) => {
        const left = tile.col * cw + gap / 2
        const top = tile.row * ch + gap / 2
        const width = tile.span[0] * cw - gap
        const height = tile.span[1] * ch - gap
        const tx = left + width / 2
        const ty = top + height / 2
        const along = clamp(((tx - x.cx) * dx + (ty - x.cy) * dy) / s + 0.5)
        const near = smoothstep(1 - Math.sqrt((tx - spot.x) ** 2 + (ty - spot.y) ** 2) / (0.9 * s))
        const base = accents.has(i) ? x.c(3) : ramp(hues, along)
        const color = near > 0.5 ? mix(light, base, (near - 0.5) * 70) : mix(ground, base, (0.5 - near) * 60)
        const props = { x: n(left), y: n(top), width: n(width), height: n(height), rx: n(corner) }
        return (
          <React.Fragment key={i}>
            <rect {...props} style={{ fill: color }} />
            <rect {...props} fill={x.url("sheen")} />
          </React.Fragment>
        )
      })}
    </>
  )
}

/* ── Backgrounds ──────────────────────────────────────────────────
 * Made to sit behind an interface. They paint with three scheme-aware colors from artwork.css
 * (pale in light mode, deep in dark mode), so text in the label color reads on them in both:
 *   base  the main field     deep  shade and distance     haze  soft light
 * Sizes follow the longer side, so a phone and a wide window both get large, calm shapes.
 */

const base = "var(--mb-artwork-base)"
const deep = "var(--mb-artwork-deep)"
const haze = "var(--mb-artwork-haze)"
const hues = ["var(--mb-artwork-1)", "var(--mb-artwork-2)", "var(--mb-artwork-3)", "var(--mb-artwork-4)"] as const

/** How much light a time of day lets in: brighter by day, deeper at night. */
const lift: Record<ArtworkTime, number> = { dawn: 0.2, day: 1, dusk: -0.4, night: -1 }

/** Large soft fields of color drifting between two or three hues, like a blurred wallpaper. */
function wash(x: Ctx) {
  const { r, w, h } = x
  const long = Math.max(w, h)
  const angle = r.range(0, TAU)
  const [dx, dy] = [cos(angle), sin(angle)]
  const span = Math.sqrt(w * w + h * h) / 2
  const count = r.int(3, 4)
  const fields = Array.from({ length: count }, (_, i) => {
    const rx = r.range(0.42, 0.7) * long
    return {
      key: `f${i}`,
      cx: r.range(-0.08, 1.08) * w,
      cy: r.range(-0.08, 1.08) * h,
      rx,
      ry: rx * r.range(0.55, 0.85),
      rotate: r.range(0, 180),
      color: mix(x.c(i + 1), base, r.range(46, 66)),
      opacity: r.range(0.7, 0.92),
    }
  })
  const side = r.range(0, TAU)
  const light = { cx: x.cx + cos(side) * w * 0.4, cy: x.cy + sin(side) * h * 0.4 }
  const shade = { cx: x.cx - cos(side) * w * 0.48, cy: x.cy - sin(side) * h * 0.48 }
  const amount = x.time ? lift[x.time] : 0
  const half = Math.ceil(count / 2)
  const field = (f: (typeof fields)[number]) => (
    <ellipse
      key={f.key}
      cx={n(f.cx)}
      cy={n(f.cy)}
      rx={n(f.rx)}
      ry={n(f.ry)}
      transform={`rotate(${n(f.rotate)} ${n(f.cx)} ${n(f.cy)})`}
      fill={x.url(f.key)}
    />
  )
  return (
    <>
      <defs>
        <Linear
          x={x}
          name="base"
          user
          to={[x.cx - dx * span, x.cy - dy * span, x.cx + dx * span, x.cy + dy * span]}
          list={[
            [0, mix(x.c(0), base, 40)],
            [0.5, mix(x.c(1), base, 26)],
            [1, mix(x.c(2), base, 38)],
          ]}
        />
        {fields.map((f) => (
          <Radial key={f.key} x={x} name={f.key} list={soft(f.color, f.opacity)} />
        ))}
        <Radial x={x} name="shade" at={{ cx: shade.cx, cy: shade.cy, r: long * 0.72 }} list={soft(deep, clamp(0.5 - amount * 0.18))} />
        <Radial x={x} name="light" at={{ cx: light.cx, cy: light.cy, r: long * 0.6 }} list={soft(haze, clamp(0.34 + amount * 0.12))} />
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("base")} />
      <g className="mb-artwork-drift" data-drift="1">
        {fields.slice(0, half).map(field)}
      </g>
      <g className="mb-artwork-drift" data-drift="2">
        {fields.slice(half).map(field)}
      </g>
      <rect width={n(w)} height={n(h)} fill={x.url("shade")} />
      <rect className="mb-artwork-drift" data-drift="3" width={n(w)} height={n(h)} fill={x.url("light")} />
    </>
  )
}

/** A sky at a time of day: bands of color down to a low glow on the horizon, and two hazy ridges. */
function horizon(x: Ctx) {
  const { r, w, h, s } = x
  const time = x.time ?? r.pick(artworkTimes)
  const line = r.range(0.58, 0.7) * h
  const sunX = r.range(0.2, 0.8) * w
  const [h1, h2, h3, h4] = hues
  const sky: Record<ArtworkTime, string[]> = {
    dawn: [mix(h4, deep, 42), mix(h1, base, 50), mix(h3, base, 52), mix(h2, haze, 60)],
    day: [mix(h1, deep, 50), mix(h1, base, 38), mix(h3, base, 28), mix(haze, h2, 80)],
    dusk: [mix(h4, deep, 60), mix(h1, deep, 52), mix(h3, base, 56), mix(h2, base, 76)],
    night: [deep, mix(h4, deep, 34), mix(h1, deep, 40), mix(h1, base, 42)],
  }
  const suns: Record<ArtworkTime, { y: number; r: number; glow: number; core: number }> = {
    dawn: { y: line - 0.015 * h, r: 0.09 * s, glow: 0.62, core: 0.75 },
    day: { y: r.range(0.16, 0.3) * h, r: 0.075 * s, glow: 0.45, core: 0.85 },
    dusk: { y: line + 0.025 * h, r: 0.11 * s, glow: 0.58, core: 0.65 },
    night: { y: r.range(0.16, 0.3) * h, r: 0.04 * s, glow: 0.24, core: 0.6 },
  }
  const ramp4 = sky[time] as [string, string, string, string]
  const sun = suns[time]
  const glow = time === "night" ? haze : mix(h2, haze, 55)
  const ridges = [0, 1].map((i) => {
    const top = line + (i === 0 ? 0.008 : 0.085) * h + r.range(-0.01, 0.01) * h
    const amplitude = r.range(0.012, 0.028) * h * (1 + i * 0.8)
    const frequency = (r.range(0.6, 1.3) * TAU) / w
    const phase = r.range(0, TAU)
    const points: Point[] = Array.from({ length: 10 }, (_, k) => {
      const px = -0.05 * w + (k / 9) * 1.1 * w
      return [px, top + amplitude * sin(frequency * px + phase) + amplitude * 0.35 * sin(frequency * 2.3 * px + phase * 1.7)]
    })
    const crest = smooth(points, false)
    return { key: `r${i}`, top, d: `${crest}L${n(1.05 * w)} ${n(h + 2)}L${n(-0.05 * w)} ${n(h + 2)}Z` }
  })
  const [far, near] = ridges as [(typeof ridges)[number], (typeof ridges)[number]]

  return (
    <>
      <defs>
        <Linear
          x={x}
          name="sky"
          user
          to={[0, 0, 0, line]}
          list={[
            [0, ramp4[0]],
            [0.42, ramp4[1]],
            [0.78, ramp4[2]],
            [1, ramp4[3]],
          ]}
        />
        <Radial x={x} name="band" list={soft(glow, sun.glow * 0.55)} />
        <Radial x={x} name="glow" list={soft(glow, sun.glow)} />
        <Radial
          x={x}
          name="sun"
          list={[
            [0, mix(haze, h2, 82), sun.core],
            [0.72, mix(haze, h2, 70), sun.core],
            [1, mix(haze, h2, 70), 0],
          ]}
        />
        <Linear x={x} name={far.key} user to={[0, far.top - 0.03 * h, 0, h]} list={[[0, mix(ramp4[2], deep, 48), 0.55], [0.12, mix(ramp4[2], deep, 44)], [1, mix(h4, deep, 40)]]} />
        <Linear x={x} name={near.key} user to={[0, near.top - 0.03 * h, 0, h]} list={[[0, mix(h4, deep, 42), 0.7], [0.1, mix(h4, deep, 40)], [1, deep]]} />
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("sky")} />
      <ellipse cx={n(sunX)} cy={n(line)} rx={n(0.85 * w)} ry={n(0.16 * h)} fill={x.url("band")} />
      <g className="mb-artwork-drift" data-drift="3">
        <circle cx={n(sunX)} cy={n(sun.y)} r={n(sun.r * 4.6)} fill={x.url("glow")} />
        <circle cx={n(sunX)} cy={n(sun.y)} r={n(sun.r)} fill={x.url("sun")} />
      </g>
      <path d={far.d} fill={x.url(far.key)} opacity={0.88} />
      <path d={near.d} fill={x.url(near.key)} />
    </>
  )
}

/** Light from a window falling across a wall: a few panes, stretched and slanted, and a faint beam. */
function windowLight(x: Ctx) {
  const { r, w, h, s } = x
  const long = Math.max(w, h)
  const fromLeft = r.chance(0.5)
  const slope = r.range(0.3, 0.62) * (fromLeft ? 1 : -1)
  // A paned window, a pair of tall doors, or light through blinds.
  const layout = r.pick(["panes", "panes", "doors", "blinds"] as const)
  const cols = layout === "blinds" ? 1 : layout === "doors" ? 2 : r.int(2, 3)
  const rows = layout === "blinds" ? r.int(6, 9) : layout === "doors" ? r.int(1, 3) : r.int(2, 3)
  const bw = Math.min(r.range(0.32, 0.46) * Math.sqrt(w * h) * (layout === "blinds" ? 1.2 : 1), 0.66 * w)
  const bh = Math.min(bw * r.range(1.1, 1.6) * (layout === "doors" ? 1.25 : 1), 0.66 * h)
  const bx = r.range(-0.06, 1.06 - bw / w) * w
  const by = r.range(0.1, 0.26) * h - (slope < 0 ? slope * bw : 0)
  const gap = layout === "blinds" ? (bh / rows) * r.range(0.3, 0.45) : 0.02 * s
  const at = (px: number, py: number): Point => [px, py + (px - bx) * slope]
  let panes = ""
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x0 = bx + (j * bw) / cols + gap / 2
      const x1 = bx + ((j + 1) * bw) / cols - gap / 2
      const y0 = by + (i * bh) / rows + gap / 2
      const y1 = by + ((i + 1) * bh) / rows - gap / 2
      panes += polygon([at(x0, y0), at(x1, y0), at(x1, y1), at(x0, y1)])
    }
  }
  const near = at(fromLeft ? bx : bx + bw, by)
  const far = at(fromLeft ? bx + bw : bx, by + bh)
  const source: Point = [fromLeft ? -0.25 * w : 1.25 * w, -0.3 * h]
  const beam = polygon([
    [source[0] - 0.12 * w, source[1]],
    [source[0] + 0.12 * w, source[1]],
    at(fromLeft ? bx + bw : bx, by + bh),
    at(fromLeft ? bx : bx + bw, by),
  ])
  const time = x.time ?? "day"
  const sunlit = time === "day" ? mix(haze, x.c(1), 82) : mix(x.c(1), haze, time === "night" ? 70 : 48)
  const strength = time === "night" ? 0.55 : time === "dusk" ? 0.8 : 1
  const floor = r.chance(0.6) ? r.range(0.8, 0.88) * h : null
  const [cx, cy] = [bx + bw / 2, by + bh / 2 + (bw / 2) * slope]
  const wall = lift[time] * 8

  return (
    <>
      <defs>
        <Linear
          x={x}
          name="wall"
          to={[fromLeft ? 0 : 1, 0, fromLeft ? 1 : 0, 1]}
          list={[
            [0, mix(x.c(0), base, 36 - wall)],
            [0.6, mix(x.c(2), base, 28)],
            [1, mix(x.c(3), deep, 44)],
          ]}
        />
        <Linear
          x={x}
          name="panes"
          user
          to={[near[0], near[1], far[0], far[1]]}
          list={[
            [0, sunlit, 0.5 * strength],
            [0.55, sunlit, 0.26 * strength],
            [1, sunlit, 0.06 * strength],
          ]}
        />
        <Linear
          x={x}
          name="beam"
          user
          to={[source[0], source[1], cx, cy]}
          list={[
            [0, sunlit, 0],
            [0.7, sunlit, 0.12 * strength],
            [1, sunlit, 0.05 * strength],
          ]}
        />
        <Radial x={x} name="shade" at={{ cx: fromLeft ? w * 1.05 : -0.05 * w, cy: h, r: long * 0.85 }} list={soft(deep, 0.55)} />
        {floor ? <Linear x={x} name="floor" user to={[0, floor, 0, h]} list={[[0, deep, 0], [0.3, deep, 0.24], [1, deep, 0.5]]} /> : null}
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("wall")} />
      <rect width={n(w)} height={n(h)} fill={x.url("shade")} />
      {floor ? <rect y={n(floor)} width={n(w)} height={n(h - floor)} fill={x.url("floor")} /> : null}
      <Glow x={x} name="spill" cx={cx} cy={cy} r={long * 0.5} color={sunlit} opacity={0.3 * strength} />
      <g className="mb-artwork-drift" data-drift="3">
        <path d={beam} fill={x.url("beam")} />
        <path d={panes} fill={x.url("panes")} stroke={x.url("panes")} strokeOpacity={0.32} strokeWidth={n(0.03 * s)} strokeLinejoin="round" />
      </g>
    </>
  )
}

/** A camera's view without the place: a dim field, out-of-focus lights, a faint sensor scan and a vignette. */
function lens(x: Ctx) {
  const { r, w, h, s } = x
  const night = x.time === "night"
  // Infrared at night: the same picture with the color drained out.
  const tint = (i: number) => (night ? `oklch(from ${x.c(i)} l 0.012 h)` : x.c(i))
  const dark = night ? "oklch(from var(--mb-artwork-ground) 0.17 0.006 h)" : ground
  const glare = night ? "oklch(0.92 0 0)" : light
  const split = r.range(0.42, 0.62)
  const lamp = { cx: r.range(0.15, 0.85) * w, cy: r.range(0.14, 0.42) * h }
  const count = r.int(5, 8)
  const discs = Array.from({ length: count }, (_, i) => {
    const angle = r.range(0, TAU)
    const distance = r.range(0.04, 0.62) * s
    return {
      key: i,
      cx: lamp.cx + cos(angle) * distance * (w / s > 1 ? 1.4 : 1),
      cy: lamp.cy + sin(angle) * distance * 0.7,
      r: r.range(0.03, 0.09) * s,
      tone: i % 3,
      opacity: n(r.range(0.45, 0.95) * 100) / 100,
    }
  })
  return (
    <>
      <defs>
        <Linear
          x={x}
          name="field"
          user
          to={[0, 0, 0, h]}
          list={[
            [0, mix(tint(0), dark, 30)],
            [split - 0.08, mix(tint(1), dark, 26)],
            [split + 0.06, mix(tint(2), dark, 16)],
            [1, mix(tint(2), dark, 8)],
          ]}
        />
        {[0, 1, 2].map((i) => {
          const color = mix(tint(i + 1), glare, 42)
          return (
            <Radial
              key={i}
              x={x}
              name={`d${i}`}
              list={[
                [0, color, 0.1],
                [0.72, color, 0.16],
                [0.9, color, 0.34],
                [1, color, 0],
              ]}
            />
          )
        })}
        <pattern id={x.id("scan")} width={n(w)} height={0.8} patternUnits="userSpaceOnUse">
          <rect width={n(w)} height={0.3} fill="black" fillOpacity={0.1} />
        </pattern>
        <radialGradient id={x.id("vignette")} cx="50%" cy="50%" r="75%">
          {stops([
            [0.42, "black", 0],
            [0.78, "black", 0.32],
            [1, "black", 0.66],
          ])}
        </radialGradient>
      </defs>
      <rect width={n(w)} height={n(h)} fill={x.url("field")} />
      <Glow x={x} name="lamp" cx={lamp.cx} cy={lamp.cy} r={0.6 * s} color={mix(glare, tint(3), 55)} opacity={0.3} />
      <g className="mb-artwork-drift" data-drift="2">
        {discs.map((d) => (
          <circle key={d.key} cx={n(d.cx)} cy={n(d.cy)} r={n(d.r)} fill={x.url(`d${d.tone}`)} opacity={d.opacity} />
        ))}
      </g>
      <rect width={n(w)} height={n(h)} fill={x.url("scan")} />
      <rect width={n(w)} height={n(h)} fill={x.url("vignette")} />
    </>
  )
}

const painters: Record<ArtworkVariant, (x: Ctx) => React.ReactNode> = {
  aurora,
  bloom,
  orbit,
  strata,
  prism,
  halftone,
  rays,
  glyph,
  ribbon,
  topo,
  grain: grainVariant,
  mosaic,
  wash,
  horizon,
  window: windowLight,
  lens,
}

function Finish({ x, finish, grain, noiseSeed }: { x: Ctx; finish: ArtworkFinish; grain: number; noiseSeed: number }) {
  if (finish === "flat" && grain === 0) return null
  const { w, h } = x
  return (
    <g className="mb-artwork-finish" aria-hidden="true">
      {finish !== "flat" ? (
        <>
          <defs>
            <Linear x={x} name="sheen-top" to={[0, 0, 0, 1]} list={[[0, "white", 0.22], [0.1, "white", 0.08], [0.42, "white", 0]]} />
            <radialGradient id={x.id("vignette")} cx="50%" cy="42%" r="78%">
              {stops([
                [0.5, "black", 0],
                [0.8, "black", 0.12],
                [1, "black", 0.3],
              ])}
            </radialGradient>
          </defs>
          <rect width={n(w)} height={n(h)} fill={x.url("vignette")} />
          <rect width={n(w)} height={n(h)} fill={x.url("sheen-top")} />
        </>
      ) : null}
      {grain > 0 ? (
        <>
          <filter id={x.id("grain")} x="0" y="0" width={n(w)} height={n(h)} filterUnits="userSpaceOnUse">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves={2} seed={noiseSeed % 997} stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1" />
          </filter>
          <rect className="mb-artwork-grain" width={n(w)} height={n(h)} filter={x.url("grain")} opacity={grain} />
        </>
      ) : null}
    </g>
  )
}

// `auto` picks among the cover variants and palettes only, so adding backgrounds didn't change any seed's picture.
const coverVariants = artworkVariants.filter((name) => !(artworkBackgrounds as readonly string[]).includes(name))
const autoPalettes: ArtworkPalette[] = ["sunset", "ocean", "forest", "berry", "citrus", "dusk", "ember", "glacier", "candy"]
const timePalettes: Record<ArtworkTime, ArtworkPalette> = { dawn: "dawn", day: "sky", dusk: "dusk", night: "night" }

function resolveVariant(seed: string, variant: ArtworkVariant | "auto"): ArtworkVariant {
  return variant === "auto" ? (coverVariants[hash(`${seed}#variant`) % coverVariants.length] as ArtworkVariant) : variant
}

function resolvePalette(seed: string, palette: ArtworkPalette | "auto", time?: ArtworkTime): ArtworkPalette {
  if (palette !== "auto") return palette
  if (time) return timePalettes[time]
  return autoPalettes[hash(`${seed}#palette`) % autoPalettes.length] as ArtworkPalette
}

function length(value: number | string) {
  return typeof value === "number" ? `${value}px` : value
}

/** An abstract picture drawn from a seed: album and playlist covers, card headers, placeholders. */
function Artwork(props: ArtworkProps) {
  return renderArtwork(props, React.useId())
}

/** Artwork without hooks, for renderers that can't run them, like social images drawn at build time. */
function renderArtwork({
  seed,
  variant = "auto",
  palette = "auto",
  colors,
  shape = "rounded",
  radius,
  aspect = 1,
  size,
  finish: finishProp,
  animated = false,
  title,
  time,
  dim,
  id,
  className,
  style,
  children,
  "aria-label": ariaLabel,
  ...props
}: ArtworkProps, reactId: string) {
  const prefix = `mb-art-${(id ?? reactId).replace(/[^A-Za-z0-9_-]/g, "")}`
  const key = String(seed)
  const kind = resolveVariant(key, variant)
  const custom = colors && colors.length > 0 ? colors : undefined
  const paletteName = custom ? "custom" : resolvePalette(key, palette, time)
  const background = (artworkBackgrounds as readonly string[]).includes(kind)
  const finish = finishProp ?? (background ? "flat" : "gloss")
  const veil = dim !== undefined && Number.isFinite(dim) ? clamp(dim) : 0
  const ratio = Number.isFinite(aspect) && aspect > 0 ? aspect : 1
  const w = ratio >= 1 ? 100 * ratio : 100
  const h = ratio >= 1 ? 100 : 100 / ratio
  const seedNumber = hash(`${key}:${kind}`)
  const r = createRng(seedNumber)
  const first = r.chance(0.5) ? [1, 2] : [2, 1]
  const order = [...first, ...r.shuffle([3, 4])]
  const x: Ctx = {
    r,
    w,
    h,
    s: Math.min(w, h),
    cx: w / 2,
    cy: h / 2,
    id: (name) => `${prefix}-${name}`,
    url: (name) => `url(#${prefix}-${name})`,
    c: (i) => `var(--mb-artwork-${order[((i % 4) + 4) % 4]})`,
    time,
  }

  const vars: Record<string, string> = { "--mb-artwork-aspect": String(Math.round(ratio * 10000) / 10000) }
  if (size !== undefined) vars["--mb-artwork-size"] = length(size)
  if (radius !== undefined) vars["--mb-artwork-radius"] = length(radius)
  if (veil > 0) vars["--mb-artwork-dim"] = String(Math.round(veil * 1000) / 1000)
  if (custom) {
    for (let i = 0; i < 4; i++) vars[`--mb-artwork-${i + 1}`] = custom[i % Math.min(custom.length, 4)] as string
    if (custom[4]) vars["--mb-artwork-ground"] = custom[4]
  }

  const name = ariaLabel ?? title
  const grain = kind === "grain" ? 0.5 : finish === "grain" ? 0.32 : 0

  return (
    <span
      {...props}
      id={id}
      data-variant={kind}
      data-palette={paletteName}
      data-shape={radius === undefined ? shape : undefined}
      data-finish={finish}
      data-time={time}
      data-dim={veil > 0 ? "" : undefined}
      data-animated={animated ? "" : undefined}
      className={join("mb-artwork", className)}
      style={{ ...(vars as React.CSSProperties), ...style }}
    >
      <svg
        className="mb-artwork-svg"
        viewBox={`0 0 ${n(w)} ${n(h)}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        {...(name ? { role: "img", "aria-label": name } : { "aria-hidden": true })}
      >
        {title ? <title>{title}</title> : null}
        {painters[kind](x)}
        <Finish x={x} finish={finish} grain={grain} noiseSeed={seedNumber} />
      </svg>
      {children ? <span className="mb-artwork-content">{children}</span> : null}
    </span>
  )
}

export { Artwork, artworkBackgrounds, artworkPalettes, artworkTimes, artworkVariants, renderArtwork }
export type { ArtworkFinish, ArtworkPalette, ArtworkProps, ArtworkShape, ArtworkTime, ArtworkVariant }
