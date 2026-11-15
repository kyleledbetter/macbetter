import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Menu, MenuContent, MenuItem, MenuTrigger } from "../src/components/menu"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitle,
  WindowTitlebar,
  WindowTitlebarLeading,
  WindowTitlebarTrailing,
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

test("a title bar without traffic lights takes leading and trailing slots around a centered title", () => {
  const { container } = render(
    <Window aria-label="Pages">
      <WindowTitlebar>
        <WindowTitlebarLeading>Back</WindowTitlebarLeading>
        <WindowTitle align="center" subtitle="Edited">
          Q3 Launch Plan
        </WindowTitle>
        <WindowTitlebarTrailing>Share</WindowTitlebarTrailing>
      </WindowTitlebar>
    </Window>
  )

  const titlebar = container.querySelector(".mb-window-titlebar") as HTMLElement
  expect(titlebar.querySelector(".mb-window-traffic-lights")).toBeNull()
  expect([...titlebar.children].map((child) => child.className)).toEqual([
    "mb-window-titlebar-leading",
    "mb-window-title",
    "mb-window-titlebar-trailing",
  ])
})

test("the sidebar header holds an app name whose icon is decorative", () => {
  render(
    <Window aria-label="Ledger">
      <WindowSidebar>
        <WindowSidebarHeader>
          <WindowAppName icon={<svg data-testid="icon" />}>Ledger</WindowAppName>
        </WindowSidebarHeader>
      </WindowSidebar>
      <WindowBody />
    </Window>
  )

  const name = screen.getByText("Ledger")
  expect(name.className).toBe("mb-window-app-name-text")
  const appName = name.parentElement as HTMLElement
  expect(appName.className).toBe("mb-window-app-name")
  expect(appName.parentElement?.className).toBe("mb-window-sidebar-header")
  expect(screen.getByTestId("icon").parentElement?.getAttribute("aria-hidden")).toBe("true")
})

test("an app name inside a menu trigger becomes a workspace switcher that opens from the keyboard", async () => {
  const user = userEvent.setup()
  const onAction = vi.fn()
  render(
    <WindowSidebarHeader>
      <Menu onAction={onAction}>
        <MenuTrigger variant="plain" tone="neutral" aria-label="Workspace: Northwind">
          <WindowAppName icon={<svg />}>Northwind</WindowAppName>
        </MenuTrigger>
        <MenuContent>
          <MenuItem value="acme">Acme Studio</MenuItem>
        </MenuContent>
      </Menu>
    </WindowSidebarHeader>
  )

  const trigger = screen.getByRole("button", { name: "Workspace: Northwind" })
  trigger.focus()
  await user.keyboard("{Enter}")
  await user.click(await screen.findByRole("menuitem", { name: "Acme Studio" }))
  expect(onAction).toHaveBeenCalledWith("acme", expect.anything())
})
