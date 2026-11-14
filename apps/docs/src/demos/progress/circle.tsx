import { ProgressCircle } from "macbetter/progress"
import { SquareIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <ProgressCircle size="sm" value={25} aria-label="Uploading attachment" />
      <ProgressCircle value={60} aria-label="Downloading Keynote" />
      <ProgressCircle size="lg" value={72} aria-label="Downloading Final Cut Pro">
        <SquareIcon aria-hidden="true" fill="currentColor" strokeWidth={0} />
      </ProgressCircle>
      <ProgressCircle size="lg" value={null} aria-label="Waiting to download" />
    </div>
  )
}
