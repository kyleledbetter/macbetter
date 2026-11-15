"use client"

import { type ThermostatMode, ThermostatControl } from "macbetter/thermostat-control"
import { useState } from "react"

export default function Example() {
  const [mode, setMode] = useState<ThermostatMode>("heat")
  const [target, setTarget] = useState(21)
  const current = 19.5
  const state = mode === "heat" && current < target ? "heating" : mode === "cool" && current > target ? "cooling" : "idle"

  return (
    <ThermostatControl
      name="Hallway thermostat"
      mode={mode}
      onModeChange={setMode}
      target={target}
      onTargetChange={setTarget}
      current={current}
      state={state}
    />
  )
}
