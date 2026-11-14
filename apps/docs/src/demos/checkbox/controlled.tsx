"use client"

import { Button } from "macbetter/button"
import { Checkbox } from "macbetter/checkbox"
import { useState } from "react"

export default function Example() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
      <Checkbox checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)}>
        I agree to the Terms of Service
      </Checkbox>
      <Button variant="filled" disabled={!agreed}>
        Create Account
      </Button>
    </div>
  )
}
