"use client"

import { ModelPicker } from "macbetter/model-picker"
import { useState } from "react"

const models = [
  { value: "atlas-4", label: "Atlas 4", description: "Best for complex, multi-step work" },
  { value: "atlas-4-mini", label: "Atlas 4 Mini", description: "Fastest for everyday questions" },
  { value: "atlas-3", label: "Atlas 3", description: "The previous generation" },
]

const efforts = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export default function Example() {
  const [model, setModel] = useState("atlas-4")
  const [effort, setEffort] = useState("high")
  return (
    <ModelPicker
      models={models}
      efforts={efforts}
      value={model}
      onValueChange={setModel}
      effort={effort}
      onEffortChange={setEffort}
    />
  )
}
