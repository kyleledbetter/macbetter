import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Rating } from "../src/components/rating"

test("draws five stars with its own symbol, and the arrow keys change the score", async () => {
  const user = userEvent.setup()
  const { container } = render(<Rating aria-label="Your rating" size="lg" defaultValue={3} />)

  const group = screen.getByRole("radiogroup", { name: "Your rating" })
  expect(group.className).toBe("sd-rating")
  expect(group.dataset.size).toBe("lg")
  expect(container.querySelectorAll(".sd-rating-item")).toHaveLength(5)
  expect(container.querySelectorAll('.sd-rating-symbol[data-part="fill"]')).toHaveLength(5)

  await user.tab()
  await user.keyboard("{ArrowRight}")
  expect(screen.getByRole("radio", { name: "4 stars" }).getAttribute("aria-checked")).toBe("true")
})

test("a read-only score is one image", () => {
  render(<Rating readOnly defaultValue={4.6} getValueLabel={(value, max) => `${value} out of ${max}`} />)
  expect(screen.getByRole("img", { name: "4.6 out of 5" })).toBeTruthy()
})
