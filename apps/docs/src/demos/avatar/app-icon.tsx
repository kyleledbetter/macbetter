import { Avatar, AvatarFallback, AvatarImage } from "@dreambase/stardust/avatar"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <Avatar shape="app" size="xl">
        <AvatarImage src="/dreambase-logo-mark.svg" alt="Dreambase" style={{ background: "#0a1c13", padding: "18%" }} />
        <AvatarFallback>D</AvatarFallback>
      </Avatar>
      <Avatar shape="app" size="xl" name="Marketing" color="orange" />
      <Avatar shape="app" size="lg" name="Platform Team" color="indigo" />
      <Avatar shape="app" size="md" name="Support" color="green" />
      <Avatar shape="app" size="sm" name="Finance" color="teal" />
    </div>
  )
}
