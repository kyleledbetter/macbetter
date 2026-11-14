import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Slider, SliderControl, SliderValue } from "../src/components/slider"

test("composes its own track, fill and named thumb", () => {
  const { container } = render(<Slider defaultValue={40} size="sm" thumbLabel="Volume" />)
  const root = container.querySelector(".sd-slider") as HTMLElement
  expect(root.dataset.size).toBe("sm")
  expect(container.querySelector(".sd-slider-track")).not.toBeNull()
  expect(container.querySelector(".sd-slider-indicator")).not.toBeNull()
  expect(container.querySelectorAll(".sd-slider-thumb")).toHaveLength(1)
  expect(screen.getByRole("slider", { name: "Volume" })).toBeTruthy()
})

test("draws a thumb per value of a range, and ticks at every step", () => {
  const { container } = render(
    <Slider defaultValue={[20, 60]} step={25} ticks thumbLabel={["Minimum", "Maximum"]} />
  )
  expect(screen.getByRole("slider", { name: "Minimum" })).toBeTruthy()
  expect(screen.getByRole("slider", { name: "Maximum" })).toBeTruthy()
  expect(container.querySelectorAll(".sd-slider-tick")).toHaveLength(5)
})

test("the arrow keys step the value", async () => {
  const user = userEvent.setup()
  render(
    <Slider defaultValue={50} step={5}>
      <SliderValue />
      <SliderControl thumbLabel="Brightness" />
    </Slider>
  )
  const thumb = screen.getByRole("slider", { name: "Brightness" })
  thumb.focus()
  await user.keyboard("{ArrowRight}")
  expect((thumb as HTMLInputElement).value).toBe("55")
  expect(document.querySelector(".sd-slider-value")?.textContent).toBe("55")
})
