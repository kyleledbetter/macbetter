import { SetupCode } from "macbetter/setup-code"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
      <SetupCode code="48291376" />
      <SetupCode code="34970112332" format="matter" label="Pairing code" />
    </div>
  )
}
