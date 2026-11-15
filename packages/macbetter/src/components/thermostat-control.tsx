"use client"

// Client-only: it keeps the dial in step with the slider and maps pointer angles to values.
import {
  createSliderController,
  Slider as SliderPrimitive,
  SliderControl as SliderControlPrimitive,
  SliderThumb as SliderThumbPrimitive,
  SliderTrack as SliderTrackPrimitive,
} from "@ui-sdk/react/slider"
import * as React from "react"
import { join } from "../lib/cx"
import { SegmentedControl, SegmentedControlItem } from "./segmented-control"

type ThermostatMode = "off" | "heat" | "cool" | "auto"
type ThermostatState = "idle" | "heating" | "cooling"

type ThermostatControlProps = Omit<React.ComponentProps<"div">, "children"> & {
  mode: ThermostatMode
  onModeChange?: (mode: ThermostatMode) => void
  /** The target in degrees Celsius, as HomeKit stores it. Used in heat and cool. */
  target?: number
  onTargetChange?: (celsius: number) => void
  /** Heating and cooling thresholds in degrees Celsius, used in auto. */
  range?: [number, number]
  onRangeChange?: (celsius: [number, number]) => void
  /** The measured temperature, in degrees Celsius. */
  current: number
  /** What the system is doing now, from HomeKit's current heating cooling state. */
  state?: ThermostatState
  /** How temperatures read. Values in and out stay in Celsius. */
  unit?: "celsius" | "fahrenheit"
  min?: number
  max?: number
  /** One step, in the display unit. Defaults to 0.5 °C or 1 °F. */
  step?: number
  /** Names the control, like "Hallway thermostat". */
  name?: string
  modes?: ThermostatMode[]
  hideModes?: boolean
}

const MODE_LABELS: Record<ThermostatMode, string> = { off: "Off", heat: "Heat", cool: "Cool", auto: "Auto" }

// The dial runs 270°, clockwise from the lower left, leaving the gap at the bottom.
const START = 135
const SWEEP = 270
const SIZE = 240
const CENTER = SIZE / 2
const RADIUS = 100

function polar(angle: number, radius = RADIUS) {
  const rad = (angle * Math.PI) / 180
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

function arc(from: number, to: number) {
  const a = polar(START + SWEEP * from)
  const b = polar(START + SWEEP * Math.max(to, from + 0.0001))
  const large = SWEEP * (to - from) > 180 ? 1 : 0
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)}A${RADIUS} ${RADIUS} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
}

const toF = (c: number) => (c * 9) / 5 + 32
const toC = (f: number) => ((f - 32) * 5) / 9

function ThermostatControl({
  mode,
  onModeChange,
  target = 21,
  onTargetChange,
  range = [19, 24],
  onRangeChange,
  current,
  state = "idle",
  unit = "celsius",
  min = 10,
  max = 32,
  step,
  name = "Thermostat",
  modes = ["off", "heat", "cool", "auto"],
  hideModes,
  className,
  ...props
}: ThermostatControlProps) {
  const fahrenheit = unit === "fahrenheit"
  const unitStep = step ?? (fahrenheit ? 1 : 0.5)
  const snap = (value: number) => Math.round(value / unitStep) * unitStep
  const toDisplay = (c: number) => snap(fahrenheit ? toF(c) : c)
  const fromDisplay = (d: number) => Math.round((fahrenheit ? toC(d) : d) * 100) / 100
  const lo = toDisplay(min)
  const hi = toDisplay(max)
  const gap = unitStep * (fahrenheit ? 3 : 2)

  // Follows the props, and moves on its own when nobody controls it.
  const [inner, setInner] = React.useState({ mode, target, range })
  React.useEffect(() => setInner((s) => ({ ...s, mode })), [mode])
  React.useEffect(() => setInner((s) => ({ ...s, target })), [target])
  const [r0, r1] = range
  React.useEffect(() => setInner((s) => ({ ...s, range: [r0, r1] })), [r0, r1])

  const activeMode = inner.mode
  const auto = activeMode === "auto"
  const off = activeMode === "off"
  const value: number | number[] = auto
    ? [toDisplay(inner.range[0]), toDisplay(inner.range[1])]
    : toDisplay(inner.target)
  const values = Array.isArray(value) ? value : [value]
  const fraction = (d: number) => Math.min(1, Math.max(0, (d - lo) / (hi - lo)))

  const [controller] = React.useState(() => createSliderController())
  const drag = React.useRef<number | null>(null)

  const setDisplay = (next: number | number[]) => {
    if (Array.isArray(next)) {
      const celsius: [number, number] = [fromDisplay(next[0]), fromDisplay(next[1])]
      setInner((s) => ({ ...s, range: celsius }))
      onRangeChange?.(celsius)
    } else {
      const celsius = fromDisplay(next)
      setInner((s) => ({ ...s, target: celsius }))
      onTargetChange?.(celsius)
    }
  }

  const valueAt = (event: React.PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width) * SIZE - CENTER
    const y = ((event.clientY - box.top) / box.height) * SIZE - CENTER
    let angle = ((Math.atan2(y, x) * 180) / Math.PI - START + 720) % 360
    if (angle > SWEEP) angle = angle > SWEEP + (360 - SWEEP) / 2 ? 0 : SWEEP
    return snap(lo + (angle / SWEEP) * (hi - lo))
  }

  const moveTo = (event: React.PointerEvent<SVGSVGElement>, thumb: number) => {
    const d = valueAt(event)
    if (!auto) {
      controller.setValue(d, { reason: "drag", event: event.nativeEvent })
      return
    }
    const [heat, cool] = values
    const next = thumb === 0 ? [Math.min(d, cool - gap), cool] : [heat, Math.max(d, heat + gap)]
    controller.setValue(next, { reason: "drag", event: event.nativeEvent })
  }

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (off || event.button !== 0) return
    const d = valueAt(event)
    const thumb = auto ? (Math.abs(d - values[0]) <= Math.abs(d - values[1]) ? 0 : 1) : 0
    drag.current = thumb
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    controller.focus(thumb)
    moveTo(event, thumb)
  }

  const format = (d: number) =>
    `${d.toLocaleString(undefined, { maximumFractionDigits: fahrenheit ? 0 : 1 })}°`
  const now = toDisplay(current)
  const caption = off
    ? "Currently"
    : auto
      ? state === "heating"
        ? "Heating"
        : state === "cooling"
          ? "Cooling"
          : "Auto"
      : activeMode === "heat"
        ? state === "heating"
          ? "Heating to"
          : "Heat to"
        : state === "cooling"
          ? "Cooling to"
          : "Cool to"
  const big = off ? format(now) : auto ? `${format(values[0]).slice(0, -1)}–${format(values[1])}` : format(values[0])
  const footer = off ? "Off" : `Currently ${format(now)}`
  const status = state === "heating" ? "Heating" : state === "cooling" ? "Cooling" : "Idle"

  const nowAngle = START + SWEEP * fraction(now)
  const tickIn = polar(nowAngle, RADIUS - 15)
  const tickOut = polar(nowAngle, RADIUS + 15)
  const [f0, f1] = [fraction(values[0]), fraction(values[values.length - 1])]
  const middle = (f0 + f1) / 2

  return (
    <div
      data-mode={activeMode}
      data-state={off ? undefined : state}
      className={join("mb-thermostat-control", className)}
      {...props}
    >
      <div className="mb-thermostat-control-dial">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden="true"
          className="mb-thermostat-control-svg"
          onPointerDown={onPointerDown}
          onPointerMove={(event) => {
            if (drag.current !== null) moveTo(event, drag.current)
          }}
          onPointerUp={() => {
            drag.current = null
          }}
          onPointerCancel={() => {
            drag.current = null
          }}
        >
          <path d={arc(0, 1)} className="mb-thermostat-control-track" />
          {off ? null : auto ? (
            <>
              <path d={arc(f0, middle)} className="mb-thermostat-control-arc" data-tone="heat" />
              <path d={arc(middle, f1)} className="mb-thermostat-control-arc" data-tone="cool" />
            </>
          ) : activeMode === "heat" ? (
            <path d={arc(0, f0)} className="mb-thermostat-control-arc" data-tone="heat" />
          ) : (
            <path d={arc(f0, 1)} className="mb-thermostat-control-arc" data-tone="cool" />
          )}
          <line
            x1={tickIn.x}
            y1={tickIn.y}
            x2={tickOut.x}
            y2={tickOut.y}
            className="mb-thermostat-control-current"
          />
          {off
            ? null
            : values.map((d, index) => {
                const point = polar(START + SWEEP * fraction(d))
                return (
                  <circle
                    // Knobs are identified by their position in the value.
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={14}
                    data-thumb={index}
                    className="mb-thermostat-control-knob"
                  />
                )
              })}
        </svg>
        <div className="mb-thermostat-control-readout">
          <span className="mb-thermostat-control-caption">{caption}</span>
          <span className="mb-thermostat-control-target" data-range={auto ? "" : undefined}>
            {big}
          </span>
          <span className="mb-thermostat-control-now">{footer}</span>
        </div>
        <SliderPrimitive
          aria-label={name}
          controller={controller}
          value={value}
          onValueChange={(next) => setDisplay(next)}
          min={lo}
          max={hi}
          step={unitStep}
          minStepsBetweenThumbs={auto ? Math.round(gap / unitStep) : undefined}
          disabled={off}
          format={{ style: "unit", unit: fahrenheit ? "fahrenheit" : "celsius", maximumFractionDigits: 1 }}
          className="mb-thermostat-control-slider"
        >
          <SliderControlPrimitive className="mb-thermostat-control-slider-control">
            <SliderTrackPrimitive className="mb-thermostat-control-slider-track">
              {auto ? (
                <>
                  <SliderThumbPrimitive index={0} data-thumb={0} aria-label="Heat to" className="mb-thermostat-control-thumb" />
                  <SliderThumbPrimitive index={1} data-thumb={1} aria-label="Cool to" className="mb-thermostat-control-thumb" />
                </>
              ) : (
                <SliderThumbPrimitive
                  data-thumb={0}
                  aria-label={activeMode === "cool" ? "Cool to" : "Heat to"}
                  className="mb-thermostat-control-thumb"
                />
              )}
            </SliderTrackPrimitive>
          </SliderControlPrimitive>
        </SliderPrimitive>
      </div>
      {off ? null : (
        <span className="mb-thermostat-control-status" data-state={state}>
          <span aria-hidden="true" className="mb-thermostat-control-status-dot" />
          {status}
        </span>
      )}
      {hideModes ? null : (
        <SegmentedControl
          aria-label="Mode"
          block
          value={activeMode}
          onValueChange={(next) => {
            if (!next) return
            const nextMode = next as ThermostatMode
            setInner((s) => ({ ...s, mode: nextMode }))
            onModeChange?.(nextMode)
          }}
          className="mb-thermostat-control-modes"
        >
          {modes.map((item) => (
            <SegmentedControlItem key={item} value={item}>
              {MODE_LABELS[item]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      )}
    </div>
  )
}

export { ThermostatControl }
export type { ThermostatControlProps, ThermostatMode, ThermostatState }
