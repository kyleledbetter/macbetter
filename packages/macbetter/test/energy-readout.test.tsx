import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { EnergyReadout } from "../src/components/energy-readout"

const hours = ["2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"].map((label, i) => ({ label, cleaner: i >= 2 && i <= 4 }))

test("sums up the cleaner hours in words and labels every bar", () => {
  const { container } = render(<EnergyReadout forecast={hours} now={0} usage={{ value: "18.4 kWh", label: "Used today" }} />)
  expect(screen.getByRole("heading", { name: "Grid Forecast" })).toBeTruthy()
  expect(screen.getByText("Cleaner energy 4 PM–6 PM")).toBeTruthy()
  const bars = container.querySelectorAll(".mb-energy-readout-bar")
  expect(bars).toHaveLength(6)
  expect(bars[0].textContent).toBe("2 PM: Less clean, Now")
  expect(bars[2].hasAttribute("data-cleaner")).toBe(true)
  expect(screen.getByText("18.4 kWh")).toBeTruthy()
})
