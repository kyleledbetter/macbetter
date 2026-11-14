import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Calendar } from "../src/components/calendar"

test("pre-composes the header, named steps and circular days", () => {
  const { container } = render(<Calendar defaultValue="2026-11-20" today="2026-11-14" size="sm" />)

  const root = container.querySelector(".sd-calendar") as HTMLElement
  expect(root.dataset.size).toBe("sm")
  expect(container.querySelector(".sd-calendar-header .sd-calendar-heading")?.textContent).toBe("November 2026")
  expect(screen.getByRole("button", { name: "Previous month" }).className).toContain("sd-calendar-step")
  expect(screen.getByRole("button", { name: "Next month" }).querySelector("svg")).toBeTruthy()
  const selected = container.querySelector(".sd-calendar-day[data-selected]") as HTMLElement
  expect(selected.querySelector(".sd-calendar-day-label")?.textContent).toBe("20")
  expect(container.querySelector(".sd-calendar-day[data-today]")?.textContent).toBe("14")
  expect(container.querySelectorAll(".sd-calendar-day[data-outside]")).toHaveLength(0)
})

test("arrow keys move between days and Enter picks one", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  const { container } = render(<Calendar defaultValue="2026-11-20" today="2026-11-14" onValueChange={onValueChange} />)

  ;(container.querySelector('[data-value="2026-11-20"]') as HTMLElement).focus()
  await user.keyboard("{ArrowRight}{Enter}")
  expect(onValueChange).toHaveBeenCalledWith("2026-11-21", expect.objectContaining({ reason: "item-press" }))
})

test("renders a grid per month", () => {
  const { container } = render(<Calendar mode="range" months={2} defaultMonth="2026-11" />)
  expect(container.querySelectorAll(".sd-calendar-grid")).toHaveLength(2)
})
