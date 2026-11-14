"use client"

import { Radio, RadioGroup } from "@dreambase/stardust/radio"
import { useState } from "react"

const prices = { monthly: "$4.99 a month", yearly: "$49.99 a year, two months free" }

type Plan = keyof typeof prices

export default function Example() {
  const [plan, setPlan] = useState<Plan>("yearly")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <RadioGroup aria-label="Plan" value={plan} onValueChange={(value) => value && setPlan(value as Plan)}>
        <Radio value="monthly">Monthly</Radio>
        <Radio value="yearly">Yearly</Radio>
      </RadioGroup>
      <span style={{ color: "var(--sd-label-secondary)" }}>{prices[plan]}</span>
    </div>
  )
}
