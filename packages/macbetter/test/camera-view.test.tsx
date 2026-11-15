import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { CameraScene, CameraTile, CameraView } from "../src/components/camera-view"

test("shows Live while streaming, and the time of a snapshot", () => {
  const { rerender, container } = render(<CameraView name="Front door" room="Entry" live timestamp="9:41 AM" />)
  const view = container.firstElementChild as HTMLElement
  expect(view.tagName).toBe("FIGURE")
  expect(view.className).toBe("mb-camera-view")
  expect(screen.getByText("Live")).toBeTruthy()
  expect(screen.queryByText("9:41 AM")).toBeNull()
  expect(container.querySelector(".mb-camera-scene")).toBeTruthy()

  rerender(<CameraView name="Front door" state="snapshot" timestamp="9:41 AM" />)
  expect(screen.queryByText("Live")).toBeNull()
  expect(screen.getByText("9:41 AM")).toBeTruthy()

  rerender(<CameraView name="Front door" state="offline" />)
  expect(screen.getByText("Camera not available")).toBeTruthy()
  expect(view.dataset.state).toBe("offline")
})

test("a camera tile opens from the keyboard, and drawn scenes are decorative", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <CameraTile name="Driveway" live onClick={onClick}>
      <CameraScene variant="driveway" time="night" />
    </CameraTile>
  )
  const tile = screen.getByRole("button", { name: /Driveway/ })
  expect(tile.className).toContain("mb-camera-tile")
  tile.focus()
  await user.keyboard(" ")
  expect(onClick).toHaveBeenCalledTimes(1)
  const scene = tile.querySelector("svg.mb-camera-scene") as SVGElement
  expect(scene.getAttribute("aria-hidden")).toBe("true")
  expect(scene.dataset.time).toBe("night")
})
