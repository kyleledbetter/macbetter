import {
  Meter as MeterPrimitive,
  MeterIndicator as MeterIndicatorPrimitive,
  MeterTrack as MeterTrackPrimitive,
} from "@ui-sdk/react/meter"
import type * as React from "react"
import { join } from "../lib/cx"

type SensorLevel = "normal" | "warning" | "alert"

type SensorMeter = {
  value: number
  min?: number
  max?: number
  /** Names the meter for assistive tech. Defaults to the readout's label. */
  label?: string
}

type SensorReadoutProps = Omit<React.ComponentProps<"div">, "children"> & {
  icon?: React.ReactNode
  /** What's measured: "Humidity", "Air quality", "Battery". */
  label: React.ReactNode
  /** The reading in words and units: "41%", "Good", "Leak Detected". */
  value: React.ReactNode
  /** Where or when: "Kitchen", "Updated 2 min ago". */
  detail?: React.ReactNode
  /** `warning` and `alert` color the icon and value. Put what's wrong in `value`, in words. */
  level?: SensorLevel
  layout?: "row" | "tile"
  /** A bar under the reading, for a level like battery charge or air quality. */
  meter?: SensorMeter
}

/** A sensor's reading: temperature, humidity, air quality, battery, contact, motion, leak or smoke. */
function SensorReadout({
  icon,
  label,
  value,
  detail,
  level = "normal",
  layout = "row",
  meter,
  className,
  ...props
}: SensorReadoutProps) {
  return (
    <div data-level={level} data-layout={layout} className={join("mb-sensor-readout", className)} {...props}>
      {icon ? (
        <span className="mb-sensor-readout-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div className="mb-sensor-readout-text">
        <span className="mb-sensor-readout-label">{label}</span>
        {detail ? <span className="mb-sensor-readout-detail">{detail}</span> : null}
      </div>
      <span className="mb-sensor-readout-value">{value}</span>
      {meter ? (
        <MeterPrimitive
          value={meter.value}
          min={meter.min ?? 0}
          max={meter.max ?? 100}
          aria-label={meter.label ?? (typeof label === "string" ? label : undefined)}
          className="mb-sensor-readout-meter"
        >
          <MeterTrackPrimitive className="mb-sensor-readout-meter-track">
            <MeterIndicatorPrimitive className="mb-sensor-readout-meter-indicator" />
          </MeterTrackPrimitive>
        </MeterPrimitive>
      ) : null}
    </div>
  )
}

/** Sensor rows grouped on one rounded surface, like an accessory's details. */
function SensorGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-sensor-group", className)} {...props} />
}

export { SensorGroup, SensorReadout }
export type { SensorLevel, SensorMeter, SensorReadoutProps }
