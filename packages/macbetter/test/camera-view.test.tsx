import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderToStaticMarkup } from "react-dom/server"
import { expect, test, vi } from "vitest"
import { CameraScene, CameraTile, CameraView } from "../src/components/camera-view"

test("shows Live while streaming, and the time of a snapshot", () => {
  const { rerender, container } = render(<CameraView name="Front door" room="Entry" live timestamp="9:41 AM" />)
  const view = container.firstElementChild as HTMLElement
  expect(view.tagName).toBe("FIGURE")
  expect(view.className).toBe("mb-camera-view")
  expect(screen.getByText("Live")).toBeTruthy()
  expect(screen.queryByText("9:41 AM")).toBeNull()
  // Without a picture, an abstract placeholder: the lens variant, decorative, seeded by the camera's name.
  const placeholder = container.querySelector(".mb-camera-view-frame > .mb-artwork") as HTMLElement
  expect(placeholder.dataset.variant).toBe("lens")
  expect(placeholder.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")

  rerender(<CameraView name="Front door" state="snapshot" timestamp="9:41 AM" />)
  expect(screen.queryByText("Live")).toBeNull()
  expect(screen.getByText("9:41 AM")).toBeTruthy()

  rerender(<CameraView name="Front door" state="offline" />)
  expect(screen.getByText("Camera not available")).toBeTruthy()
  expect(view.dataset.state).toBe("offline")
})

test("a camera tile opens from the keyboard, and shows the picture it's given", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <CameraTile name="Driveway" live onClick={onClick}>
      <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" data-testid="still" />
    </CameraTile>
  )
  const tile = screen.getByRole("button", { name: /Driveway/ })
  expect(tile.className).toContain("mb-camera-tile")
  tile.focus()
  await user.keyboard(" ")
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(tile.querySelector('.mb-camera-view-frame > [data-testid="still"]')).toBeTruthy()
  expect(tile.querySelector(".mb-artwork")).toBeNull()
})

test("the placeholder is the same for the same camera, and CameraScene still renders it", () => {
  const html = (name: string) => renderToStaticMarkup(<CameraView name={name} />).replace(/mb-art-[A-Za-z0-9_-]+?-(?=[a-z])/g, "")
  expect(html("Front door")).toBe(html("Front door"))
  expect(html("Front door")).not.toBe(html("Backyard"))

  const { container } = render(<CameraScene variant="driveway" time="night" />)
  const scene = container.querySelector(".mb-camera-scene") as HTMLElement
  expect(scene.dataset).toMatchObject({ variant: "lens", time: "night", palette: "slate" })
  expect(scene.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
})
