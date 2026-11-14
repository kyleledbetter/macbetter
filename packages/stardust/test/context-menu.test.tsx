import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "../src/components/context-menu"
import { MenuItem } from "../src/components/menu"

function Note() {
  return (
    <ContextMenu>
      <ContextMenuTrigger tabIndex={0} aria-label="Weekend trip">
        Weekend trip
      </ContextMenuTrigger>
      <ContextMenuContent>
        <MenuItem value="pin">Pin Note</MenuItem>
        <MenuItem value="delete">Delete</MenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

test("a right-click opens the menu with the shared menu styles", () => {
  render(<Note />)
  const area = screen.getByLabelText("Weekend trip")
  expect(area.className).toBe("sd-menu-context-trigger sd-context-menu-trigger")

  fireEvent.contextMenu(area, { clientX: 20, clientY: 20 })
  const menu = screen.getByRole("menu")
  expect(menu.className).toBe("sd-menu-content sd-context-menu-content")
  expect(area.hasAttribute("data-closed")).toBe(false)
})

// Browsers turn Shift+F10 and the context-menu key into a contextmenu event on the focused element.
test("a keyboard-made contextmenu opens it, arrows move, Escape closes and returns focus", async () => {
  const user = userEvent.setup()
  render(<Note />)
  const area = screen.getByLabelText("Weekend trip")
  area.focus()
  fireEvent.contextMenu(area)
  expect(screen.getByRole("menu")).toBeTruthy()
  await user.keyboard("{ArrowDown}")
  expect(document.activeElement?.textContent).toBe("Delete")
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("menu")).toBeNull()
  expect(document.activeElement).toBe(area)
})
