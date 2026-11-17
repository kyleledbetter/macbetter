"use client"

import { Button } from "macbetter/button"
import { Shimmer } from "macbetter/shimmer"
import { useEffect, useState } from "react"

export default function Example() {
  const [working, setWorking] = useState(false)

  useEffect(() => {
    if (!working) return
    const timer = setTimeout(() => setWorking(false), 4000)
    return () => clearTimeout(timer)
  }, [working])

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
      <p role="status" className="mb-text-body" style={{ margin: 0, minHeight: "1lh" }}>
        <Shimmer active={working}>{working ? "Summarizing the meeting notes…" : "Summarized in 4 seconds"}</Shimmer>
      </p>
      <Button size="sm" disabled={working} onClick={() => setWorking(true)}>
        Summarize Again
      </Button>
    </div>
  )
}
