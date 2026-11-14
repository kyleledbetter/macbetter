import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { NumberField, Stepper } from "../src/components/stepper"

test("a number field names its input and both steppers", async () => {
  const user = userEvent.setup()
  const { container } = render(<NumberField aria-label="Copies" defaultValue={1} min={1} size="sm" />)

  expect((container.firstElementChild as HTMLElement).className).toBe("mb-number-field")
  expect((container.firstElementChild as HTMLElement).dataset.size).toBe("sm")
  const input = screen.getByRole("textbox", { name: "Copies" }) as HTMLInputElement
  expect(input.className).toBe("mb-number-field-input")
  expect(screen.getByRole("button", { name: "Decrease" }).hasAttribute("data-disabled")).toBe(true)
  await user.click(screen.getByRole("button", { name: "Increase" }))
  expect(input.value).toBe("2")
})

test("the stepper alone steps with the arrow keys on its hidden field", async () => {
  const user = userEvent.setup()
  render(<Stepper aria-label="Guests" defaultValue={2} decrementLabel="Fewer guests" incrementLabel="More guests" />)

  const input = screen.getByRole("textbox", { name: "Guests" }) as HTMLInputElement
  expect(input.className).toBe("mb-stepper-input")
  expect(screen.getByRole("button", { name: "More guests" })).toBeTruthy()
  input.focus()
  await user.keyboard("{ArrowUp}")
  expect(input.value).toBe("3")
})

test("each button carries its step and both glyph sets, for the platform stylesheet to pick", () => {
  const { container } = render(<NumberField aria-label="Rows" defaultValue={8} />)
  const buttons = container.querySelectorAll<HTMLElement>(".mb-stepper-button")
  expect([...buttons].map((button) => button.dataset.step)).toEqual(["decrement", "increment"])
  for (const button of buttons) {
    expect(button.querySelector('[data-glyph="chevron"]')).toBeTruthy()
    expect(button.querySelector('[data-glyph="sign"]')).toBeTruthy()
  }
})
