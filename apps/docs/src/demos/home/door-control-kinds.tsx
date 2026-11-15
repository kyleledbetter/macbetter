import { DoorControl } from "macbetter/door-control"

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
      <DoorControl name="Garage door" kind="garage" state="stopped" obstructed />
      <DoorControl name="Patio door" kind="door" state="open" />
      <DoorControl name="Side gate" kind="gate" state="closed" />
    </div>
  )
}
