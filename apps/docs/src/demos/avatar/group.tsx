import { Avatar, AvatarGroup } from "macbetter/avatar"


export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <AvatarGroup aria-label="Editing this document" size="md">
        <Avatar name="Maya Okafor" src="/demos/avatar-maya.svg" />
        <Avatar name="Theo Brandt" src="/demos/avatar-theo.svg" />
        <Avatar name="Sofia Rossi" src="/demos/avatar-sofia.svg" />
        <Avatar name="Priya Raman" color="auto" />
      </AvatarGroup>
      <AvatarGroup aria-label="Members of Design Review" size="sm" max={5}>
        <Avatar name="Maya Okafor" src="/demos/avatar-maya.svg" />
        <Avatar name="Theo Brandt" src="/demos/avatar-theo.svg" />
        <Avatar name="Sofia Rossi" src="/demos/avatar-sofia.svg" />
        <Avatar name="Kenji Sato" src="/demos/avatar-kenji.svg" />
        <Avatar name="Lena Fischer" />
        <Avatar name="Omar Haddad" />
        <Avatar name="Wen Li" />
        <Avatar name="Jonas Weber" />
      </AvatarGroup>
    </div>
  )
}
