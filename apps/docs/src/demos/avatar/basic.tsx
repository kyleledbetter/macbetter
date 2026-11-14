import { Avatar } from "macbetter/avatar"


export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar size="xl" name="Maya Okafor" src="/demos/avatar-maya.svg" />
      <Avatar size="lg" name="Theo Brandt" src="/demos/avatar-theo.svg" />
      <Avatar size="md" name="Priya Raman" />
      <Avatar size="sm" name="Jonas Weber" />
      <Avatar size="xs" />
    </div>
  )
}
