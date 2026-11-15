import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { SensorGroup, SensorReadout } from "../src/components/sensor-readout"

test("reads a level, and an alert carries its level for the stylesheet", () => {
  render(
    <SensorGroup data-testid="group">
      <SensorReadout label="Battery" value="18%" level="warning" meter={{ value: 18 }} />
      <SensorReadout label="Leak" value="Leak Detected" detail="Under the sink" level="alert" layout="tile" />
    </SensorGroup>
  )
  expect(screen.getByTestId("group").className).toBe("mb-sensor-group")
  const meter = screen.getByRole("meter", { name: "Battery" })
  expect(meter.getAttribute("aria-valuenow")).toBe("18")
  const leak = screen.getByText("Leak Detected").closest(".mb-sensor-readout") as HTMLElement
  expect(leak.dataset.level).toBe("alert")
  expect(leak.dataset.layout).toBe("tile")
  expect(screen.getByText("Under the sink")).toBeTruthy()
})
