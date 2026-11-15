import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { ThermostatControl } from "../src/components/thermostat-control"

test("shows the target, what it's doing and the mode picker", () => {
  const { container } = render(
    <ThermostatControl name="Hallway thermostat" mode="heat" target={21} current={19} state="heating" />
  )
  const root = container.querySelector(".mb-thermostat-control") as HTMLElement
  expect(root.dataset.mode).toBe("heat")
  expect(root.dataset.state).toBe("heating")
  expect(container.querySelector(".mb-thermostat-control-caption")?.textContent).toBe("Heating to")
  expect(container.querySelector(".mb-thermostat-control-target")?.textContent).toBe("21°")
  expect(container.querySelector(".mb-thermostat-control-now")?.textContent).toBe("Currently 19°")
  expect(container.querySelector(".mb-thermostat-control-status")?.textContent).toBe("Heating")
  expect(screen.getByRole("group", { name: "Hallway thermostat" })).toBeTruthy()
  expect(screen.getByRole("slider", { name: "Heat to" })).toBeTruthy()
  expect(screen.getByRole("radio", { name: "Auto" })).toBeTruthy()
})

test("the arrow keys step the target in Celsius, half a degree at a time", async () => {
  const user = userEvent.setup()
  const onTargetChange = vi.fn()
  render(<ThermostatControl mode="cool" target={24} current={26} onTargetChange={onTargetChange} />)
  const thumb = screen.getByRole("slider", { name: "Cool to" })
  thumb.focus()
  await user.keyboard("{ArrowDown}")
  expect(onTargetChange).toHaveBeenLastCalledWith(23.5)
})

test("reads in Fahrenheit while reporting Celsius, with two thumbs in auto", async () => {
  const user = userEvent.setup()
  const onRangeChange = vi.fn()
  const { container } = render(
    <ThermostatControl mode="auto" unit="fahrenheit" range={[20, 24]} current={22} onRangeChange={onRangeChange} />
  )
  expect(container.querySelector(".mb-thermostat-control-target")?.textContent).toBe("68–75°")
  const heat = screen.getByRole("slider", { name: "Heat to" })
  expect(screen.getByRole("slider", { name: "Cool to" })).toBeTruthy()
  heat.focus()
  await user.keyboard("{ArrowUp}")
  const [low, high] = onRangeChange.mock.lastCall?.[0] as [number, number]
  expect(low).toBeCloseTo(20.56, 1)
  expect(high).toBeCloseTo(23.89, 1)
})

test("off disables the dial and shows the room's temperature", () => {
  const { container } = render(<ThermostatControl mode="off" current={18.5} />)
  expect(container.querySelector(".mb-thermostat-control-target")?.textContent).toBe("18.5°")
  expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(true)
})
