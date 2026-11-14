import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { PageControl } from "../src/components/page-control"

test("renders one named dot per page, with the variant", () => {
  render(<PageControl aria-label="Photos" pageCount={12} variant="glass" />)
  const nav = screen.getByRole("navigation", { name: "Photos" })
  expect(nav.className).toContain("sd-page-control")
  expect(nav.dataset.variant).toBe("glass")
  const dots = screen.getAllByRole("button")
  expect(dots).toHaveLength(12)
  expect(dots[0].getAttribute("aria-label")).toBe("Page 1 of 12")
  expect(dots[0].getAttribute("aria-current")).toBe("page")
  expect(dots[0].className).toContain("sd-page-control-dot")
})

test("Enter on a dot goes to its page", async () => {
  const user = userEvent.setup()
  const onPageChange = vi.fn()
  render(<PageControl aria-label="Welcome pages" pageCount={4} onPageChange={onPageChange} />)
  const third = screen.getByRole("button", { name: "Page 3 of 4" })
  third.focus()
  await user.keyboard("{Enter}")
  expect(onPageChange).toHaveBeenCalledWith(3, expect.anything())
  expect(third.getAttribute("aria-current")).toBe("page")
})
