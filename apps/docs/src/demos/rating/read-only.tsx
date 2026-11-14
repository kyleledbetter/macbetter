"use client"

import { Rating } from "@dreambase/stardust/rating"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ font: "var(--sd-text-title-2)", fontVariantNumeric: "tabular-nums" }}>4.6</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Rating readOnly size="sm" defaultValue={4.6} getValueLabel={(value, max) => `${value} out of ${max} stars`} />
        <span style={{ color: "var(--sd-label-secondary)", font: "var(--sd-text-caption)" }}>12,408 Ratings</span>
      </div>
    </div>
  )
}
