import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Avatar, AvatarGroup } from "../src/components/avatar"

test("shows initials on a gradient until an image loads, and names the person", () => {
  const { container } = render(<Avatar name="Ada Lovelace" size="lg" color="blue" status="away" />)
  const root = container.querySelector(".mb-avatar") as HTMLElement
  expect(root.dataset.size).toBe("lg")
  expect(root.dataset.shape).toBe("circle")
  expect(root.dataset.color).toBe("blue")
  expect(screen.getByText("AL").getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByText("Ada Lovelace").className).toBe("mb-visually-hidden")
  expect(container.querySelector(".mb-avatar-fallback")).toBeTruthy()
  expect(container.querySelector('.mb-avatar-status[data-status="away"]')?.textContent).toBe("Away")
})

test("picks a stable color from the name and draws an app icon shape", () => {
  const { container } = render(
    <>
      <Avatar name="Macbetter" shape="app" color="auto" />
      <Avatar name="Macbetter" color="auto" />
    </>
  )
  const [first, second] = Array.from(container.querySelectorAll<HTMLElement>(".mb-avatar"))
  expect(first?.dataset.shape).toBe("app")
  expect(first?.dataset.color).not.toBe("gray")
  expect(first?.dataset.color).toBe(second?.dataset.color)
  expect(screen.getAllByText("M")).toHaveLength(2)
})

test("a group collapses past its max into a count", () => {
  render(
    <AvatarGroup aria-label="Editors" max={3} size="sm">
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
      <Avatar name="Katherine Johnson" />
    </AvatarGroup>
  )
  const group = screen.getByRole("group", { name: "Editors" })
  expect(group.dataset.size).toBe("sm")
  expect(screen.getByText("+2")).toBeTruthy()
  expect(screen.getByText("and 2 more")).toBeTruthy()
  expect(screen.queryByText("Alan Turing")).toBeNull()
})

test("an avatar rendered as a button opens a profile from the keyboard", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<Avatar name="Ada Lovelace" render={<button type="button" aria-label="Ada Lovelace" />} onClick={onClick} />)
  const button = screen.getByRole("button", { name: "Ada Lovelace" })
  expect(button.className).toContain("mb-avatar")
  button.focus()
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
})
