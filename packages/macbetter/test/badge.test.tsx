import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Badge, BadgeAnchor, NotificationBadge } from "../src/components/badge"

test("carries its variant, color and size, and draws a dot for the dot variant", () => {
  const { container } = render(
    <>
      <Badge variant="filled" color="green" size="sm">
        Paid
      </Badge>
      <Badge variant="dot" color="red">
        Offline
      </Badge>
    </>
  )
  const paid = screen.getByText("Paid")
  expect(paid.className).toBe("mb-badge")
  expect(paid.dataset.variant).toBe("filled")
  expect(paid.dataset.color).toBe("green")
  expect(paid.dataset.size).toBe("sm")
  expect(container.querySelectorAll(".mb-badge-dot")).toHaveLength(1)
})

test("a notification badge caps its count and says what it counts", () => {
  render(
    <>
      <NotificationBadge count={3} label="unread messages" />
      <NotificationBadge count={140} label="updates" />
    </>
  )
  expect(screen.getByText("3 unread messages").className).toBe("mb-visually-hidden")
  expect(screen.getByText("99+").getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByText("More than 99 updates")).toBeTruthy()
})

test("a zero count renders nothing, and no count is a dot", () => {
  const { container } = render(
    <BadgeAnchor>
      <NotificationBadge count={0} />
      <NotificationBadge />
    </BadgeAnchor>
  )
  const badges = container.querySelectorAll(".mb-notification-badge")
  expect(badges).toHaveLength(1)
  expect(badges[0]?.hasAttribute("data-dot")).toBe(true)
  expect(container.firstElementChild?.className).toBe("mb-badge-anchor")
})

test("sits on a button without taking focus", async () => {
  const user = userEvent.setup()
  render(
    <button type="button">
      Inbox <NotificationBadge count={4} label="unread" />
    </button>
  )
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: /Inbox/ }))
})
