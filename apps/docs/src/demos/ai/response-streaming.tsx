"use client"

import { Button } from "macbetter/button"
import { useEffect, useRef, useState } from "react"
import { Markdown } from "@/components/ai/markdown"

const reply = `Here's a packing list for **three days in Porto** in March.

## Clothes

- A light rain jacket. It rains about one day in three.
- Comfortable shoes with grip: the streets are steep and the stone is slick when wet.
- A warm layer for the evenings by the river.

## Budget

| Item | Per day |
| --- | --- |
| Food | €50 |
| Transit | €10 |
| Sights | €25 |

Convert the total with a quick script if you need to:

\`\`\`ts
const perDay = 50 + 10 + 25
const total = perDay * 3 // €255
\`\`\`

Have a good trip.`

export default function Example() {
  const [length, setLength] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval>>(undefined)
  useEffect(() => () => clearInterval(timer.current), [])
  const streaming = length > 0 && length < reply.length

  // Reveals the reply a few characters at a time, the way tokens arrive from a model.
  function play() {
    clearInterval(timer.current)
    let next = 0
    setLength(1)
    timer.current = setInterval(() => {
      next += 5
      setLength(Math.min(next, reply.length))
      if (next >= reply.length) clearInterval(timer.current)
    }, 35)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 620, minHeight: 520 }}>
      <Button onClick={play} disabled={streaming} style={{ alignSelf: "flex-start" }}>
        {length === 0 ? "Stream the reply" : "Stream it again"}
      </Button>
      <Markdown streaming={streaming}>{length === 0 ? reply : reply.slice(0, length)}</Markdown>
    </div>
  )
}
