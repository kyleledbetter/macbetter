import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
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
} from "../src/components/dialog"

function NewEvent({ onOpenChange }: { onOpenChange?: (open: boolean, details: { returnValue?: string }) => void }) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>New Event…</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>Add an event to your Work calendar.</DialogDescription>
        </DialogHeader>
        <DialogBody>
          <input aria-label="Title" defaultValue="Design review" />
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

test("opens a named panel with header, body and footer, and Add reports its value", async () => {
  const user = userEvent.setup()
  const onOpenChange = vi.fn()
  render(<NewEvent onOpenChange={onOpenChange} />)

  await user.click(screen.getByRole("button", { name: "New Event…" }))
  const dialog = screen.getByRole("dialog", { name: "New Event" })
  expect(dialog.className).toContain("sd-dialog")
  expect(dialog.dataset.size).toBe("lg")
  expect(dialog.dataset.presentation).toBe("dialog")
  expect(dialog.querySelector(".sd-dialog-header .sd-dialog-title")).not.toBeNull()
  expect(dialog.querySelector(".sd-dialog-body")).not.toBeNull()
  expect(document.querySelector(".sd-dialog-backdrop")).not.toBeNull()

  const add = screen.getByRole("button", { name: "Add" })
  expect(add.className).toContain("sd-dialog-close")
  expect(add.dataset.variant).toBe("primary")
  expect(screen.getByRole("button", { name: "Cancel" }).dataset.variant).toBe("cancel")

  await user.click(add)
  expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ returnValue: "save" }))
  expect(screen.queryByRole("dialog")).toBeNull()
})

test("Escape closes it and returns focus to the trigger", async () => {
  const user = userEvent.setup()
  render(<NewEvent />)

  const trigger = screen.getByRole("button", { name: "New Event…" })
  trigger.focus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("dialog", { name: "New Event" })).toBeTruthy()

  await user.keyboard("{Escape}")
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("Tab stays inside the open dialog", async () => {
  const user = userEvent.setup()
  render(<NewEvent />)

  await user.click(screen.getByRole("button", { name: "New Event…" }))
  const dialog = screen.getByRole("dialog", { name: "New Event" })
  for (let i = 0; i < 4; i++) {
    await user.tab()
    expect(dialog.contains(document.activeElement)).toBe(true)
  }
})
