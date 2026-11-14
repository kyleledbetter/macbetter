"use client"

import { Progress, ProgressLabel, ProgressValue } from "macbetter/progress"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 20, width: "100%", maxWidth: 360 }}>
      <Progress value={1.2} max={4.8} format={{ style: "unit", unit: "gigabyte", maximumFractionDigits: 1 }}>
        <ProgressLabel>macOS Tahoe 26.1</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={45} max={60} format={(minutes) => `About ${60 - minutes} minutes left`}>
        <ProgressLabel>Time Machine backup</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
