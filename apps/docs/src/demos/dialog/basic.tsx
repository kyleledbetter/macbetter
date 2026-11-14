import { Button } from "@dreambase/stardust/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dreambase/stardust/dialog"
import { Field, FieldLabel } from "@dreambase/stardust/field"
import { TextField } from "@dreambase/stardust/text-field"

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>New Event…</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>Add an event to your Work calendar.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div style={{ display: "grid", gap: 12 }}>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <TextField defaultValue="Design review" />
            </Field>
            <Field>
              <FieldLabel>Location</FieldLabel>
              <TextField placeholder="Add a location" />
            </Field>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose variant="cancel">Cancel</DialogClose>
          <DialogClose variant="primary" value="save">
            Add
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
