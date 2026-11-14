import { Avatar, AvatarFallback, AvatarImage } from "macbetter/avatar"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Avatar shape="app" size="xl">
        <AvatarImage src="/app-icon-square.svg" alt="Macbetter" />
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
      <Avatar shape="app" size="xl" name="Marketing" color="orange" />
      <Avatar shape="app" size="lg" name="Platform Team" color="indigo" />
      <Avatar shape="app" size="md" name="Support" color="green" />
      <Avatar shape="app" size="sm" name="Finance" color="teal" />
    </div>
  )
}
