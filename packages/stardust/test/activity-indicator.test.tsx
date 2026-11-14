import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { ActivityIndicator } from "../src/components/activity-indicator"

test("is an indeterminate progress named Loading, with eight spokes", () => {
  const { container } = render(<ActivityIndicator size="lg" />)
  const spinner = screen.getByRole("progressbar", { name: "Loading" })
  expect(spinner.className).toBe("sd-activity-indicator")
  expect(spinner.dataset.size).toBe("lg")
  expect(spinner.hasAttribute("aria-valuenow")).toBe(false)
  expect(spinner.hasAttribute("data-indeterminate")).toBe(true)
  const spokes = container.querySelectorAll(".sd-activity-indicator-spokes rect")
  expect(spokes).toHaveLength(8)
  // Each spoke starts an eighth of a turn after the one before, so the lit one travels round.
  const delays = [...spokes].map((spoke) => (spoke as SVGElement).style.animationDelay)
  expect(new Set(delays).size).toBe(8)
})

test("takes a label of its own", () => {
  render(<ActivityIndicator aria-label="Signing in" />)
  expect(screen.getByRole("progressbar", { name: "Signing in" })).toBeTruthy()
})

test("is not a tab stop", async () => {
  const user = userEvent.setup()
  render(
    <>
      <ActivityIndicator />
      <button type="button">Cancel</button>
    </>
  )
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }))
})
