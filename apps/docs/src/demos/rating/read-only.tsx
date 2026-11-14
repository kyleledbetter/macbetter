"use client"

import { Rating } from "macbetter/rating"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ font: "var(--mb-text-title-2)", fontVariantNumeric: "tabular-nums" }}>4.6</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Rating readOnly size="sm" defaultValue={4.6} getValueLabel={(value, max) => `${value} out of ${max} stars`} />
        <span style={{ color: "var(--mb-label-secondary)", font: "var(--mb-text-caption)" }}>12,408 Ratings</span>
      </div>
    </div>
  )
}
