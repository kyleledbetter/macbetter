"use client"

import { type DoorState, type DoorTarget, DoorControl } from "macbetter/door-control"
import { useEffect, useState } from "react"

export default function Example() {
  const [state, setState] = useState<DoorState>("closed")

  // The opener takes a few seconds to travel, and reports opening or closing on the way.
  useEffect(() => {
    if (state !== "opening" && state !== "closing") return
    const timer = setTimeout(() => setState(state === "opening" ? "open" : "closed"), 2500)
    return () => clearTimeout(timer)
  }, [state])

  const move = (target: DoorTarget) => setState(target === "open" ? "opening" : "closing")

  return <DoorControl name="Garage door" kind="garage" state={state} onTargetChange={move} confirmOpen />
}
