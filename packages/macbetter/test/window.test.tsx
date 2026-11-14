import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Window,
  WindowBody,
  WindowSidebar,
  WindowTitle,
  WindowTitlebar,
  WindowTrafficLights,
} from "../src/components/window"

test("draws a named window with its parts and variants", () => {
  render(
    <Window aria-label="Finder" inactive>
      <WindowSidebar>Sidebar</WindowSidebar>
      <WindowTitlebar variant="compact" bordered={false}>
        <WindowTrafficLights />
        <WindowTitle align="center" subtitle="12 items">
          Documents
        </WindowTitle>
      </WindowTitlebar>
      <WindowBody>Files</WindowBody>
    </Window>
  )

  const window = screen.getByRole("group", { name: "Finder" })
  expect(window.className).toBe("mb-window")
  expect(window.hasAttribute("data-inactive")).toBe(true)
  const titlebar = window.querySelector(".mb-window-titlebar") as HTMLElement
  expect(titlebar.dataset.variant).toBe("compact")
  expect(titlebar.hasAttribute("data-bordered")).toBe(false)
  expect((window.querySelector(".mb-window-title") as HTMLElement).dataset.align).toBe("center")
  expect(screen.getByText("12 items").className).toBe("mb-window-subtitle")
  expect(window.querySelector(".mb-window-sidebar")).not.toBeNull()
  expect(window.querySelector(".mb-window-body")?.textContent).toBe("Files")
})

test("traffic lights are decorative without handlers", () => {
  const { container } = render(<WindowTrafficLights />)
  const lights = container.querySelector(".mb-window-traffic-lights") as HTMLElement
  expect(lights.getAttribute("aria-hidden")).toBe("true")
  expect(lights.querySelectorAll(".mb-window-traffic-light")).toHaveLength(3)
  expect(screen.queryAllByRole("button")).toHaveLength(0)
})

test("traffic lights become named buttons that work from the keyboard", async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  const onZoom = vi.fn()
  render(<WindowTrafficLights onClose={onClose} onZoom={onZoom} />)

  expect(screen.getByRole("group", { name: "Window controls" })).toBeTruthy()
  await user.click(screen.getByRole("button", { name: "Close" }))
  screen.getByRole("button", { name: "Zoom" }).focus()
  await user.keyboard("{Enter}")

  expect(onClose).toHaveBeenCalledTimes(1)
  expect(onZoom).toHaveBeenCalledTimes(1)
  expect(screen.queryByRole("button", { name: "Minimize" })).toBeNull()
})
