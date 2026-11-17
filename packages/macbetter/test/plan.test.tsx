import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Plan, PlanStep, PlanTitle } from "../src/components/plan"

function Example() {
  return (
    <Plan>
      <PlanTitle>Move the billing tables</PlanTitle>
      <PlanStep status="done">Back up the database</PlanStep>
      <PlanStep status="skipped" detail="No archived rows">Copy archived invoices</PlanStep>
      <PlanStep status="active">Migrate invoices</PlanStep>
      <PlanStep>Switch reads to the new table</PlanStep>
    </Plan>
  )
}

test("names the steps by the title and counts what's finished", () => {
  const { container } = render(<Example />)
  const list = screen.getByRole("list", { name: "Move the billing tables" })
  expect(list.className).toBe("mb-plan-steps")
  expect(container.querySelector(".mb-plan-progress")?.textContent).toBe("2 of 4")
  expect(screen.getAllByRole("listitem")).toHaveLength(4)
})

test("each step says its status in words and marks the active one current", async () => {
  render(<Example />)
  const items = screen.getAllByRole("listitem")
  expect(items[0]?.dataset.status).toBe("done")
  expect(items[0]?.querySelector(".mb-plan-marker svg")).not.toBeNull()
  expect(await screen.findByRole("listitem", { name: /^Back up the database ?, Done$/ })).toBe(items[0])
  expect(screen.getByRole("listitem", { name: /^Copy archived invoices ?, Skipped$/ })).toBe(items[1])
  expect(items[2]?.getAttribute("aria-current")).toBe("step")
  expect(items[2]?.querySelector('.mb-plan-ring[data-motion="essential"]')).not.toBeNull()
  expect(items[3]?.dataset.status).toBe("pending")
})

test("one tab stop, starting on the active step, and arrow keys move between steps", async () => {
  const user = userEvent.setup()
  render(<Example />)
  await user.tab()
  const items = screen.getAllByRole("listitem")
  expect(document.activeElement).toBe(items[2])
  await user.keyboard("{ArrowDown}")
  expect(document.activeElement).toBe(items[3])
  await user.keyboard("{Home}")
  expect(document.activeElement).toBe(items[0])
})
