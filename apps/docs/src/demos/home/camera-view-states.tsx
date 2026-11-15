import { Artwork } from "macbetter/artwork"
import { CameraView } from "macbetter/camera-view"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, width: "min(100%, 560px)" }}>
      <CameraView name="Driveway" state="snapshot" timestamp="9:38 AM" />
      <CameraView name="Kitchen" state="connecting" />
      <CameraView name="Backyard" live>
        {/* At night a camera switches to a gray infrared picture; the placeholder can show that too. */}
        <Artwork seed="Backyard" variant="lens" time="night" />
      </CameraView>
      <CameraView name="Garage" state="offline" />
    </div>
  )
}
