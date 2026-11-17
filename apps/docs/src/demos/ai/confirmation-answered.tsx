import { Confirmation } from "macbetter/confirmation"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 560 }}>
      <Confirmation state="allowed" outcome="Allowed once" />
      <Confirmation state="denied" outcome="Denied: Mail can't send messages" />
    </div>
  )
}
