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
  const fan = container.querySelector(".sd-activity-indicator-fan")
  expect(fan?.getAttribute("data-motion")).toBe("essential")
  const spokes = container.querySelectorAll(".sd-activity-indicator-fan rect")
  expect(spokes).toHaveLength(8)
  expect(spokes[0]?.getAttribute("opacity")).toBe("1")
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
