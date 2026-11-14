import { Avatar } from "macbetter/avatar"


export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Avatar size="lg" name="Maya Okafor" src="/demos/avatar-maya.svg" status="online" />
      <Avatar size="lg" name="Theo Brandt" src="/demos/avatar-theo.svg" status="away" />
      <Avatar size="lg" name="Priya Raman" color="auto" status="busy" />
      <Avatar size="lg" name="Jonas Weber" status="offline" />
    </div>
  )
}
