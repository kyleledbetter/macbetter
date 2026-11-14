"use client"

import { Button } from "@dreambase/stardust/button"
import { Field, FieldError, FieldLabel } from "@dreambase/stardust/field"
import { TextField } from "@dreambase/stardust/text-field"

export default function Example() {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 320 }}
      onSubmit={(event) => event.preventDefault()}
    >
      <Field name="invite">
        <FieldLabel>Invite by email</FieldLabel>
        <TextField type="email" required placeholder="name@example.com" />
        <FieldError match="valueMissing">Enter an email address.</FieldError>
        <FieldError match="typeMismatch">Enter an email address like name@example.com.</FieldError>
      </Field>
      <Button type="submit" variant="filled" style={{ alignSelf: "flex-end" }}>
        Send Invite
      </Button>
    </form>
  )
}
