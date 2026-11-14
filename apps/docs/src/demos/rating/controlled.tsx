"use client"

import { Rating } from "@dreambase/stardust/rating"
import { useState } from "react"

const labels = ["Tap a star to rate", "Hated it", "Didn't like it", "It was fine", "Liked it", "Loved it"]

export default function Example() {
  const [score, setScore] = useState<number | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <Rating aria-label="Rate this recipe" size="lg" deselectable value={score} onValueChange={setScore} />
      <span style={{ color: "var(--sd-label-secondary)" }}>{labels[score ?? 0]}</span>
    </div>
  )
}
