import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { expect, test } from "vitest"
import { Progress, ProgressCircle, ProgressLabel, ProgressValue } from "../src/components/progress"

test("draws its own track and fill under the label and value", () => {
  const { container } = render(
    <Progress value={40} size="lg" tone="neutral">
      <ProgressLabel>Exporting video</ProgressLabel>
      <ProgressValue />
    </Progress>
  )
  const bar = screen.getByRole("progressbar", { name: "Exporting video" })
  expect(bar.className).toBe("sd-progress")
  expect(bar.dataset.size).toBe("lg")
  expect(bar.dataset.tone).toBe("neutral")
  expect(bar.getAttribute("aria-valuenow")).toBe("40")
  expect(container.querySelector(".sd-progress-track > .sd-progress-indicator")).toBeTruthy()
  expect(container.querySelector(".sd-progress-label")).toBeTruthy()
  expect(container.querySelector(".sd-progress-value")?.textContent).toBe("40%")
})

test("an indeterminate bar has no value", () => {
  const { container } = render(<Progress value={null} aria-label="Connecting" />)
  const bar = screen.getByRole("progressbar", { name: "Connecting" })
  expect(bar.hasAttribute("aria-valuenow")).toBe(false)
  expect(container.querySelector(".sd-progress-indicator")?.hasAttribute("data-indeterminate")).toBe(true)
})

test("a circle fills its ring to the value and holds its center content", () => {
  const { container } = render(
    <ProgressCircle value={3} min={1} max={5} aria-label="Downloading">
      <span>Stop</span>
    </ProgressCircle>
  )
  const ring = screen.getByRole("progressbar", { name: "Downloading" })
  expect(ring.className).toBe("sd-progress-circle")
  expect(container.querySelector(".sd-progress-circle-fill")?.getAttribute("stroke-dasharray")).toBe("50 100")
  expect(screen.getByText("Stop")).toBeTruthy()
})

test("follows a value driven from the keyboard", async () => {
  const user = userEvent.setup()
  function Upload() {
    const [done, setDone] = useState(1)
    return (
      <>
        <button type="button" onClick={() => setDone(done + 1)}>
          Upload next
        </button>
        <Progress value={done * 20} aria-label="Uploading photos" />
      </>
    )
  }
  render(<Upload />)
  screen.getByRole("button", { name: "Upload next" }).focus()
  await user.keyboard("{Enter}")
  expect(screen.getByRole("progressbar", { name: "Uploading photos" }).getAttribute("aria-valuenow")).toBe("40")
})
