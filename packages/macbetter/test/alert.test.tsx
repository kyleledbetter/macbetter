import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertTrigger,
} from "../src/components/alert"

function EmptyTrash({ onOpenChange }: { onOpenChange?: (open: boolean, details: { returnValue?: string }) => void }) {
  return (
    <Alert onOpenChange={onOpenChange}>
      <AlertTrigger>Empty Trash…</AlertTrigger>
      <AlertContent variant="sheet">
        <AlertIcon>★</AlertIcon>
        <AlertTitle>Erase the items in the Trash?</AlertTitle>
        <AlertDescription>You can’t undo this action.</AlertDescription>
        <AlertActions>
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction variant="primary" tone="destructive" value="confirm">
            Empty Trash
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )
}

test("opens a named alert with macbetter's parts and closes with the agreeing answer", async () => {
  const user = userEvent.setup()
  const onOpenChange = vi.fn()
  render(<EmptyTrash onOpenChange={onOpenChange} />)

  await user.click(screen.getByRole("button", { name: "Empty Trash…" }))
  const alert = screen.getByRole("alertdialog", { name: "Erase the items in the Trash?" })
  expect(alert.className).toContain("mb-alert")
  expect(alert.dataset.variant).toBe("sheet")
  expect(document.querySelector(".mb-alert-backdrop")).not.toBeNull()
  expect(alert.querySelector(".mb-alert-icon")?.getAttribute("aria-hidden")).toBe("true")
  expect(alert.querySelector(".mb-alert-actions")?.getAttribute("data-orientation")).toBe("auto")

  const confirm = screen.getByRole("button", { name: "Empty Trash" })
  expect(confirm.className).toContain("mb-alert-action")
  expect(confirm.dataset.variant).toBe("primary")
  expect(confirm.dataset.tone).toBe("destructive")

  await user.click(confirm)
  expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ returnValue: "confirm" }))
  expect(screen.queryByRole("alertdialog")).toBeNull()
})

test("starts on Cancel and Escape returns focus to the trigger", async () => {
  const user = userEvent.setup()
  render(<EmptyTrash />)

  const trigger = screen.getByRole("button", { name: "Empty Trash…" })
  trigger.focus()
  await user.keyboard("{Enter}")
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }))

  await user.keyboard("{Escape}")
  expect(screen.queryByRole("alertdialog")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("names and describes the alert, and passes orientation through", async () => {
  const user = userEvent.setup()
  render(
    <Alert>
      <AlertTrigger>Close Document</AlertTrigger>
      <AlertContent>
        <AlertTitle>Save changes to “Q3 Roadmap”?</AlertTitle>
        <AlertDescription>Your changes will be lost if you don’t save them.</AlertDescription>
        <AlertActions orientation="vertical">
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction variant="primary" value="save">
            Save
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )

  await user.click(screen.getByRole("button", { name: "Close Document" }))
  const alert = screen.getByRole("alertdialog", { name: "Save changes to “Q3 Roadmap”?" })
  expect(alert.dataset.variant).toBe("alert")
  expect(alert.getAttribute("aria-modal")).toBe("true")
  const description = document.getElementById(alert.getAttribute("aria-describedby") ?? "")
  expect(description?.textContent).toBe("Your changes will be lost if you don’t save them.")
  expect(alert.querySelector(".mb-alert-actions")?.getAttribute("data-orientation")).toBe("vertical")
  expect(screen.getByRole("button", { name: "Save" }).dataset.tone).toBe("accent")
})
