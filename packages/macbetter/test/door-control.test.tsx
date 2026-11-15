import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { DoorControl } from "../src/components/door-control"

test("names the action, shows moving and obstructed states in words", () => {
  const { container, rerender } = render(<DoorControl name="Garage door" state="closed" />)
  const root = container.querySelector(".mb-door-control") as HTMLElement
  expect(root.dataset.kind).toBe("garage")
  expect(root.dataset.position).toBe("closed")
  expect(screen.getByRole("button", { name: "Open Garage door" })).toBeTruthy()

  rerender(<DoorControl name="Garage door" state="opening" />)
  expect(root.hasAttribute("data-pending")).toBe(true)
  expect(container.querySelector(".mb-door-control-status")?.textContent).toBe("Opening…")
  expect(screen.getByRole("button", { name: "Close Garage door" })).toBeTruthy()

  rerender(<DoorControl name="Garage door" state="stopped" obstructed />)
  expect(root.hasAttribute("data-obstructed")).toBe(true)
  expect(container.querySelector(".mb-door-control-status")?.textContent).toBe("Obstruction detected")
})

test("Space asks before opening when confirmOpen is set", async () => {
  const user = userEvent.setup()
  const onTargetChange = vi.fn()
  render(<DoorControl name="Garage door" state="closed" confirmOpen onTargetChange={onTargetChange} />)
  screen.getByRole("button", { name: "Open Garage door" }).focus()
  await user.keyboard(" ")
  expect(screen.getByRole("alertdialog", { name: "Open Garage door?" })).toBeTruthy()
  await user.click(screen.getByRole("button", { name: "Open" }))
  expect(onTargetChange).toHaveBeenCalledWith("open")
})

test("closing runs at once", async () => {
  const user = userEvent.setup()
  const onTargetChange = vi.fn()
  render(<DoorControl name="Side gate" kind="gate" state="open" confirmOpen onTargetChange={onTargetChange} />)
  await user.click(screen.getByRole("button", { name: "Close Side gate" }))
  expect(onTargetChange).toHaveBeenCalledWith("closed")
})
