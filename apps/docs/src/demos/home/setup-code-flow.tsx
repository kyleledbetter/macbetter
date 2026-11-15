"use client"

import { Button } from "macbetter/button"
import { Field, FieldDescription, FieldLabel } from "macbetter/field"
import { SetupCodeField, SetupCodeScanner } from "macbetter/setup-code"
import { useState } from "react"

export default function Example() {
  const [manual, setManual] = useState(false)
  const [code, setCode] = useState("")

  return (
    <div style={{ display: "grid", gap: 16, justifyItems: "center", width: "min(100%, 340px)" }}>
      {manual ? (
        <Field>
          <FieldLabel>Setup code</FieldLabel>
          <SetupCodeField value={code} onValueChange={setCode} />
          <FieldDescription>The 8-digit code is on the accessory, its box or its manual.</FieldDescription>
        </Field>
      ) : (
        <SetupCodeScanner instruction="Position the setup code on the accessory or its box in the frame." />
      )}
      <Button variant="plain" onClick={() => setManual(!manual)}>
        {manual ? "Scan a Code" : "Enter Code Manually"}
      </Button>
    </div>
  )
}
