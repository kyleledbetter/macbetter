"use client"

import { Button } from "macbetter/button"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "macbetter/reasoning"
import { useEffect, useState } from "react"

export default function Example() {
  const [running, setRunning] = useState(true)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 560 }}>
      <Reasoning state={running ? "running" : "done"} duration={seconds} autoCollapse glow>
        <ReasoningTrigger />
        <ReasoningContent>
          <p>Reading the three supplier quotes and comparing delivery times against the April 2 launch.</p>
        </ReasoningContent>
      </Reasoning>
      <div>
        <Button
          size="sm"
          onClick={() => {
            if (!running) setSeconds(0)
            setRunning(!running)
          }}
        >
          {running ? "Finish" : "Run again"}
        </Button>
      </div>
    </div>
  )
}
