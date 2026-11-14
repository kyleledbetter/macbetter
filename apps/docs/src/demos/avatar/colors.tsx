import { Avatar } from "@dreambase/stardust/avatar"

const people = ["Ines Laurent", "Kenji Sato", "Lena Fischer", "Omar Haddad", "Sofia Rossi", "Wen Li"]

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 12 }}>
        {people.map((name) => (
          <Avatar key={name} size="lg" name={name} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {people.map((name) => (
          <Avatar key={name} size="lg" name={name} color="auto" />
        ))}
      </div>
    </div>
  )
}
