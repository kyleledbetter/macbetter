import { Progress, ProgressLabel } from "@dreambase/stardust/progress"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Progress value={null}>
        <ProgressLabel>Connecting to server…</ProgressLabel>
      </Progress>
    </div>
  )
}
