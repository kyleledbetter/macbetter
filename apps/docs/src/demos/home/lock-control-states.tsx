import { LockControl } from "macbetter/lock-control"

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
      <LockControl name="Front door" state="secured" />
      <LockControl name="Back door" state="secured" target="unsecured" />
      <LockControl name="Side door" state="jammed" />
    </div>
  )
}
