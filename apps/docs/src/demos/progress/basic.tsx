import { Progress, ProgressLabel, ProgressValue } from "macbetter/progress"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Progress value={62}>
        <ProgressLabel>Exporting “Q3 Review.mov”</ProgressLabel>
        <ProgressValue />
      </Progress>
    </div>
  )
}
