import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { SegmentedControl, SegmentedControlItem } from "../src/components/segmented-control"

function Calendar() {
  return (
    <SegmentedControl aria-label="Calendar view" defaultValue="week" size="sm" block>
      <SegmentedControlItem value="day">Day</SegmentedControlItem>
      <SegmentedControlItem value="week">Week</SegmentedControlItem>
      <SegmentedControlItem value="month">Month</SegmentedControlItem>
    </SegmentedControl>
  )
}

test("renders its own indicator and carries size and block", () => {
  render(<Calendar />)
  const group = screen.getByRole("radiogroup", { name: "Calendar view" })
  expect(group.className).toBe("mb-segmented-control")
  expect(group.dataset.size).toBe("sm")
  expect(group.hasAttribute("data-block")).toBe(true)
  expect(group.querySelector(".mb-segmented-control-indicator")).not.toBeNull()
  expect(screen.getByRole("radio", { name: "Week" }).className).toBe("mb-segmented-control-item")
})

test("arrow keys move the choice", async () => {
  const user = userEvent.setup()
  render(<Calendar />)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Week" }))
  await user.keyboard("{ArrowRight}")
  expect(screen.getByRole("radio", { name: "Month" }).getAttribute("aria-checked")).toBe("true")
})
