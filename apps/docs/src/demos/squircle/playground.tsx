"use client"

import { Field, FieldLabel } from "macbetter/field"
import { Slider, SliderControl, SliderValue } from "macbetter/slider"
import { Squircle } from "macbetter/squircle"
import { Switch } from "macbetter/switch"
import { useState } from "react"

export default function Example() {
  const [radius, setRadius] = useState(40)
  const [smoothing, setSmoothing] = useState(0.77)
  const [exact, setExact] = useState(false)

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <Squircle
        size={180}
        radius={radius}
        smoothing={smoothing}
        exact={exact}
        style={{ background: "linear-gradient(160deg, var(--mb-accent), var(--mb-pink))" }}
      />
      <div style={{ display: "grid", gap: 16, width: 240 }}>
        <Field>
          <Slider value={radius} onValueChange={(value) => setRadius(value as number)} min={0} max={90} step={1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <FieldLabel>Radius</FieldLabel>
              <SliderValue />
            </div>
            <SliderControl />
          </Slider>
        </Field>
        <Field>
          <Slider
            value={smoothing}
            onValueChange={(value) => setSmoothing(value as number)}
            min={0}
            max={1}
            step={0.01}
            format={{ style: "percent" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <FieldLabel>Smoothing</FieldLabel>
              <SliderValue />
            </div>
            <SliderControl />
          </Slider>
        </Field>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span id="squircle-exact">Exact outline</span>
          <Switch aria-labelledby="squircle-exact" checked={exact} onCheckedChange={(next) => setExact(next)} />
        </div>
      </div>
    </div>
  )
}
