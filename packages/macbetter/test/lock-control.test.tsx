import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { LockControl } from "../src/components/lock-control"

test("names the action and shows the state in words", () => {
  const { container, rerender } = render(<LockControl name="Front door" state="secured" />)
  const root = container.querySelector(".mb-lock-control") as HTMLElement
  expect(root.dataset.position).toBe("locked")
  expect(screen.getByRole("button", { name: "Unlock Front door" }).className).toContain("mb-lock-control-button")
  expect(container.querySelector(".mb-lock-control-status")?.textContent).toBe("Locked")

  rerender(<LockControl name="Front door" state="secured" target="unsecured" />)
  expect(root.hasAttribute("data-pending")).toBe(true)
  expect(root.dataset.position).toBe("unlocked")
  expect(container.querySelector(".mb-lock-control-status")?.textContent).toBe("Unlocking…")

  rerender(<LockControl name="Front door" state="jammed" />)
  expect(container.querySelector(".mb-lock-control-status")?.textContent).toBe("Jammed")
  expect(screen.getByRole("button", { name: "Lock Front door" })).toBeTruthy()
})

test("Enter asks before unlocking; Cancel keeps it locked and Unlock unlocks", async () => {
  const user = userEvent.setup()
  const onTargetChange = vi.fn()
  render(<LockControl name="Front door" state="secured" onTargetChange={onTargetChange} />)

  screen.getByRole("button", { name: "Unlock Front door" }).focus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("alertdialog", { name: "Unlock Front door?" })).toBeTruthy()
  await user.click(screen.getByRole("button", { name: "Cancel" }))
  expect(screen.queryByRole("alertdialog")).toBeNull()
  expect(onTargetChange).not.toHaveBeenCalled()

  await user.click(screen.getByRole("button", { name: "Unlock Front door" }))
  await user.click(screen.getByRole("button", { name: "Unlock" }))
  expect(onTargetChange).toHaveBeenCalledWith("unsecured")
})

test("locking never asks", async () => {
  const user = userEvent.setup()
  const onTargetChange = vi.fn()
  render(<LockControl name="Back door" state="unsecured" onTargetChange={onTargetChange} />)
  await user.click(screen.getByRole("button", { name: "Lock Back door" }))
  expect(screen.queryByRole("alertdialog")).toBeNull()
  expect(onTargetChange).toHaveBeenCalledWith("secured")
})
