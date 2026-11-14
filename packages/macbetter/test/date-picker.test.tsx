import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { DateField, DatePicker, TimeField } from "../src/components/date-picker"

test("date and time fields render classed segments", () => {
  const { container } = render(
    <>
      <DateField aria-label="Birthday" defaultValue="1994-03-08" size="sm" />
      <TimeField aria-label="Reminder" defaultValue="08:30" />
    </>
  )
  const [date, time] = container.querySelectorAll<HTMLElement>(".mb-date-field")
  expect(date?.dataset.size).toBe("sm")
  expect(time?.className).toContain("mb-time-field")
  expect(date?.querySelectorAll(".mb-date-field-segment").length).toBeGreaterThanOrEqual(5)
})

test("the calendar opens from its button, and a picked day reaches the segments", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  const { container } = render(
    <DatePicker aria-label="Start date" defaultValue="2026-11-14" today="2026-11-14" onValueChange={onValueChange} />
  )

  const trigger = container.querySelector(".mb-date-picker-trigger") as HTMLElement
  await user.click(trigger)
  const content = container.ownerDocument.querySelector(".mb-date-picker-content") as HTMLElement
  expect(content.hasAttribute("data-open")).toBe(true)
  expect(content.querySelector(".mb-calendar-heading")?.textContent).toBe("November 2026")

  await user.click(content.querySelector('[data-value="2026-11-20"]') as HTMLElement)
  expect(onValueChange).toHaveBeenCalledWith("2026-11-20", expect.objectContaining({ reason: "item-press" }))
  const day = [...container.querySelectorAll<HTMLInputElement>("input.mb-date-field-segment")].find(
    (segment) => segment.getAttribute("aria-label")?.toLowerCase().includes("day") || segment.dataset.type === "day"
  )
  expect(day?.value).toBe("20")

  await user.click(trigger)
  await user.keyboard("{Escape}")
  expect(trigger.hasAttribute("data-open")).toBe(false)

  day?.focus()
  await user.keyboard("{Alt>}{ArrowDown}{/Alt}")
  expect(trigger.hasAttribute("data-open")).toBe(true)
})

test("compact shows the date on a button", () => {
  render(<DatePicker variant="compact" aria-label="Start date" defaultValue="2026-11-14" locale="en-US" />)
  const button = screen.getByRole("button", { name: "Start date, Nov 14, 2026" })
  expect(button.className).toContain("mb-date-picker-button")
  expect(button.textContent).toBe("Nov 14, 2026")
})

test("segments take the direction of the locale that formats them, not the page", () => {
  const { container } = render(
    <div dir="rtl">
      <DateField aria-label="Birthday" defaultValue="1994-03-08" locale="en-US" />
      <TimeField aria-label="Reminder" defaultValue="08:30" locale="he-IL" />
      <DatePicker aria-label="Start date" defaultValue="2026-11-14" locale="en-US" />
    </div>
  )
  const [date, time] = container.querySelectorAll<HTMLElement>(".mb-date-field")
  expect(date?.getAttribute("dir")).toBe("ltr")
  expect(time?.getAttribute("dir")).toBe("rtl")
  expect(container.querySelector(".mb-date-picker-segments")?.getAttribute("dir")).toBe("ltr")
})
