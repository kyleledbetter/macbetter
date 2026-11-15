"use client"

import { type LockState, type LockTarget, LockControl } from "macbetter/lock-control"
import { useEffect, useState } from "react"

export default function Example() {
  const [state, setState] = useState<LockState>("secured")
  const [target, setTarget] = useState<LockTarget>("secured")

  // A real lock reports back when it's done; this one takes a second and a half.
  useEffect(() => {
    if (target === state) return
    const timer = setTimeout(() => setState(target), 1500)
    return () => clearTimeout(timer)
  }, [state, target])

  return <LockControl name="Front door" state={state} target={target} onTargetChange={setTarget} />
}
