"use client"

import { Button } from "macbetter/button"
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
} from "macbetter/dialog"
import { Field, FieldLabel } from "macbetter/field"
import { TextField } from "macbetter/text-field"

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
