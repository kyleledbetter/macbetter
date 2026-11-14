import { Button } from "macbetter/button"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetOutlet,
  SheetTitle,
  SheetTrigger,
} from "macbetter/sheet"
import { Field, FieldLabel } from "macbetter/field"
import { TextField } from "macbetter/text-field"

const messages = [
  { from: "Inès", text: "The proofs are back from the printer." },
  { from: "Kofi", text: "Lunch on Thursday?" },
  { from: "Wren", text: "Pushed the fix for the release build." },
]

export default function Example() {
  return (
    <Sheet detents={["large"]}>
      <SheetOutlet style={{ width: "100%", padding: 16, background: "var(--mb-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>Inbox</strong>
          <SheetTrigger render={<Button variant="filled" size="sm" />}>Compose</SheetTrigger>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 10 }}>
          {messages.map((message) => (
            <li key={message.from}>
              <div style={{ fontWeight: 600 }}>{message.from}</div>
              <div style={{ color: "var(--mb-label-secondary)" }}>{message.text}</div>
            </li>
          ))}
        </ul>
      </SheetOutlet>
      <SheetContent>
        <SheetHeader>
          <SheetClose>Cancel</SheetClose>
          <SheetTitle>New Message</SheetTitle>
          <SheetClose variant="primary" value="send">
            Send
          </SheetClose>
        </SheetHeader>
        <SheetBody>
          <Field>
            <FieldLabel>To</FieldLabel>
            <TextField defaultValue="Design team" />
          </Field>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
