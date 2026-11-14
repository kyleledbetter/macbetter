import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { expect, test } from "vitest"
import { Gauge, GaugeLabel, GaugeValue } from "../src/components/gauge"

test("a linear gauge draws its track and reads its value", () => {
  const { container } = render(
    <Gauge value={68}>
      <GaugeLabel>Storage</GaugeLabel>
      <GaugeValue />
    </Gauge>
  )
  const meter = screen.getByRole("meter", { name: "Storage" })
  expect(meter.className).toBe("mb-gauge")
  expect(meter.dataset.variant).toBe("linear")
  expect(meter.hasAttribute("data-level")).toBe(false)
  expect(container.querySelector(".mb-gauge-track > .mb-gauge-indicator")).toBeTruthy()
  expect(container.querySelector(".mb-gauge-value")?.textContent).toBe("68%")
})

test("a level indicator lights its segments and colors them by thresholds", () => {
  const { container, rerender } = render(
    <Gauge variant="level" value={45} low={20} high={80} optimum={10} segments={10} aria-label="CPU" />
  )
  const meter = screen.getByRole("meter", { name: "CPU" })
  expect(container.querySelectorAll(".mb-gauge-segment")).toHaveLength(10)
  expect(container.querySelectorAll(".mb-gauge-segment[data-lit]")).toHaveLength(5)
  expect(meter.dataset.level).toBe("suboptimal")
  rerender(<Gauge variant="level" value={92} low={20} high={80} optimum={10} aria-label="CPU" />)
  expect(meter.dataset.level).toBe("critical")
  rerender(<Gauge variant="level" value={12} low={20} high={80} optimum={10} aria-label="CPU" />)
  expect(meter.dataset.level).toBe("optimum")
})

test("higher is better when the optimum is above high", () => {
  render(<Gauge value={15} low={20} high={60} optimum={100} aria-label="Battery" />)
  expect(screen.getByRole("meter", { name: "Battery" }).dataset.level).toBe("critical")
})

test("a circular gauge draws an open arc, or a gradient with a marker", () => {
  const { container, rerender } = render(<Gauge variant="circular" value={25} aria-label="Air quality" />)
  expect(container.querySelector(".mb-gauge-arc-fill")?.getAttribute("stroke-dasharray")).toBe("25 100")
  // The edge under the fill, which light mode draws around a yellow reading, follows the same length.
  expect(container.querySelector(".mb-gauge-arc-edge")?.getAttribute("stroke-dasharray")).toBe("25 100")
  rerender(<Gauge variant="circular" gradient value={25} low={30} high={70} optimum={100} aria-label="Air quality" />)
  const meter = screen.getByRole("meter", { name: "Air quality" })
  expect(meter.dataset.gradient).toBe("reverse")
  expect(container.querySelector(".mb-gauge-gradient")).toBeTruthy()
  expect(container.querySelector(".mb-gauge-marker")).toBeTruthy()
})

test("follows a reading changed from the keyboard", async () => {
  const user = userEvent.setup()
  function Volume() {
    const [level, setLevel] = useState(30)
    return (
      <>
        <button type="button" onClick={() => setLevel(level + 10)}>
          Louder
        </button>
        <Gauge value={level} aria-label="Volume" />
      </>
    )
  }
  render(<Volume />)
  screen.getByRole("button", { name: "Louder" }).focus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("meter", { name: "Volume" }).getAttribute("aria-valuenow")).toBe("40")
})
