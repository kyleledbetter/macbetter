"use client"

import { type ThermostatMode, ThermostatControl } from "macbetter/thermostat-control"
import { useState } from "react"

export default function Example() {
  const [mode, setMode] = useState<ThermostatMode>("auto")
  // HomeKit stores degrees Celsius; the control reads in Fahrenheit.
  const [range, setRange] = useState<[number, number]>([20, 24])
  const [target, setTarget] = useState(22)

  return (
    <ThermostatControl
      name="Hallway thermostat"
      unit="fahrenheit"
      mode={mode}
      onModeChange={setMode}
      range={range}
      onRangeChange={setRange}
      target={target}
      onTargetChange={setTarget}
      current={25.5}
      state="cooling"
    />
  )
}
