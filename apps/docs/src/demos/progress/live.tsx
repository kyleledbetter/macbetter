"use client"

import { Button } from "@dreambase/stardust/button"
import { Progress, ProgressLabel, ProgressValue } from "@dreambase/stardust/progress"
import { useEffect, useState } from "react"

export default function Example() {
  const [uploaded, setUploaded] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => {
      setUploaded((count) => {
        if (count >= 24) {
          setRunning(false)
          return count
        }
        return count + 1
      })
    }, 160)
    return () => clearInterval(timer)
  }, [running])

  return (
    <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 360, justifyItems: "start" }}>
      <Progress value={uploaded} max={24} format={(count) => `${count} of 24`}>
        <ProgressLabel>Uploading photos</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Button
        onClick={() => {
          if (uploaded >= 24) setUploaded(0)
          setRunning(!running)
        }}
      >
        {running ? "Pause" : uploaded >= 24 ? "Start Over" : "Upload"}
      </Button>
    </div>
  )
}
