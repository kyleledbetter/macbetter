import { CameraScene, CameraView } from "macbetter/camera-view"

export default function Example() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, width: "min(100%, 560px)" }}>
      <CameraView name="Driveway" state="snapshot" timestamp="9:38 AM">
        <CameraScene variant="driveway" />
      </CameraView>
      <CameraView name="Kitchen" state="connecting">
        <CameraScene variant="kitchen" />
      </CameraView>
      <CameraView name="Backyard" live>
        <CameraScene variant="backyard" time="night" />
      </CameraView>
      <CameraView name="Garage" state="offline" />
    </div>
  )
}
