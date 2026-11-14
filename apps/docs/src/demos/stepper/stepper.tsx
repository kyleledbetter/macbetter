"use client"

import { Stepper } from "@dreambase/stardust/stepper"
import { useState } from "react"

export default function Example() {
  const [guests, setGuests] = useState<number | null>(2)

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, width: "100%", maxWidth: 320 }}>
      <span id="guests-label">
        Guests: <span style={{ fontVariantNumeric: "tabular-nums" }}>{guests}</span>
      </span>
      <Stepper aria-labelledby="guests-label" value={guests} onValueChange={setGuests} min={1} max={8} />
    </div>
  )
}
