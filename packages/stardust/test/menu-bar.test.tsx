import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { MenuBar, MenuBarContent, MenuBarTrigger } from "../src/components/menu-bar"
import { Menu, MenuItem } from "../src/components/menu"

function Bar() {
  return (
    <MenuBar aria-label="Notes">
      <Menu>
        <MenuBarTrigger app>Notes</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="about">About Notes</MenuItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>File</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="new">New Note</MenuItem>
        </MenuBarContent>
      </Menu>
    </MenuBar>
  )
}

test("renders a named menu bar with a bold app menu", () => {
  render(<Bar />)
  const bar = screen.getByRole("menubar", { name: "Notes" })
  expect(bar.className).toBe("sd-menu-bar")
  const app = screen.getByRole("menuitem", { name: "Notes" })
  expect(app.className).toBe("sd-menu-bar-trigger")
  expect(app.hasAttribute("data-app")).toBe(true)
  expect(screen.getByRole("menuitem", { name: "File" }).hasAttribute("data-app")).toBe(false)
})

test("arrow keys move between menus and open them", async () => {
  const user = userEvent.setup()
  render(<Bar />)
  screen.getByRole("menuitem", { name: "Notes" }).focus()
  await user.keyboard("{ArrowRight}")
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "File" }))
  await user.keyboard("{ArrowDown}")
  const menu = screen.getByRole("menu")
  expect(menu.className).toBe("sd-menu-content sd-menu-bar-content")
  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "New Note" }))
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("menu")).toBeNull()
})
