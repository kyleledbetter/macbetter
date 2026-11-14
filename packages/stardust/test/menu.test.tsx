import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "../src/components/menu"

function NoteMenu({ onAction }: { onAction?: (value: string) => void }) {
  return (
    <Menu onAction={onAction}>
      <MenuTrigger>Note</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename">
          <MenuItemIcon>
            <svg />
          </MenuItemIcon>
          Rename
        </MenuItem>
        <MenuItem value="delete" destructive>
          Delete
        </MenuItem>
        <MenuSeparator />
        <MenuCheckboxItem value="previews" defaultChecked>
          Show Previews
        </MenuCheckboxItem>
        <MenuRadioGroup defaultValue="date">
          <MenuRadioItem value="date">Date</MenuRadioItem>
          <MenuRadioItem value="title">Title</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSub>
          <MenuSubTrigger>Move To</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="work">Work</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
  )
}

test("the trigger is a pull-down button with a chevron, and opens a styled menu", async () => {
  const user = userEvent.setup()
  render(<NoteMenu />)

  const trigger = screen.getByRole("button", { name: "Note" })
  expect(trigger.className).toBe("sd-button sd-menu-trigger")
  expect(trigger.dataset.variant).toBe("bezeled")
  expect(trigger.querySelector(".sd-menu-trigger-indicator svg")).not.toBeNull()

  await user.click(trigger)
  const menu = screen.getByRole("menu")
  expect(menu.classList.contains("sd-menu-content")).toBe(true)
  expect(screen.getByRole("menuitem", { name: "Rename" }).className).toBe("sd-menu-item")
  expect(screen.getByRole("menuitem", { name: "Delete" }).hasAttribute("data-destructive")).toBe(true)
  expect(screen.getByRole("separator").className).toBe("sd-menu-separator")
})

test("checkbox and radio items render their own checkmarks, kept mounted for the gutter", async () => {
  const user = userEvent.setup()
  render(<NoteMenu />)
  await user.click(screen.getByRole("button", { name: "Note" }))

  const previews = screen.getByRole("menuitemcheckbox", { name: "Show Previews" })
  expect(previews.classList.contains("sd-menu-checkable")).toBe(true)
  expect(previews.querySelector(".sd-menu-item-indicator svg")).not.toBeNull()

  const title = screen.getByRole("menuitemradio", { name: "Title" })
  const indicator = title.querySelector(".sd-menu-item-indicator")
  expect(indicator?.hasAttribute("data-unchecked")).toBe(true)

  await user.click(previews)
  expect(previews.getAttribute("aria-checked")).toBe("false")
  expect(screen.getByRole("menu")).toBeTruthy()
})

test("the submenu trigger renders a chevron; keyboard runs an item and returns focus", async () => {
  const user = userEvent.setup()
  const onAction = vi.fn()
  render(<NoteMenu onAction={onAction} />)

  const trigger = screen.getByRole("button", { name: "Note" })
  trigger.focus()
  await user.keyboard("{Enter}")
  const sub = screen.getByRole("menuitem", { name: "Move To" })
  expect(sub.querySelector(".sd-menu-sub-trigger-indicator svg")).not.toBeNull()

  expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Rename" }))
  await user.keyboard("{Enter}")
  expect(onAction).toHaveBeenCalledWith("rename", expect.anything())
  expect(screen.queryByRole("menu")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("escape closes the menu", async () => {
  const user = userEvent.setup()
  render(<NoteMenu />)
  await user.click(screen.getByRole("button", { name: "Note" }))
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("menu")).toBeNull()
})

test("a trigger can drop the chevron and keep a caller's class", () => {
  render(
    <Menu>
      <MenuTrigger indicator={false} variant="plain" className="mine" aria-label="More">
        <svg />
      </MenuTrigger>
      <MenuContent />
    </Menu>
  )
  const trigger = screen.getByRole("button", { name: "More" })
  expect(trigger.className).toBe("sd-button sd-menu-trigger mine")
  expect(trigger.querySelector(".sd-menu-trigger-indicator")).toBeNull()
})

// jsdom has no Web Animations; the sheet dims the page with one.
Element.prototype.animate ??= function () {
  return {
    cancel() {},
    finish() {},
    pause() {},
    play() {},
    commitStyles() {},
    currentTime: 0,
    finished: Promise.resolve(),
  } as unknown as Animation
}

test("presentation='sheet' keeps the menu's parts and marks the sheet layout", async () => {
  const user = userEvent.setup()
  render(
    <Menu presentation="sheet">
      <MenuTrigger>Share Photo</MenuTrigger>
      <MenuContent>
        <MenuItem value="copy">Copy</MenuItem>
        <MenuSub>
          <MenuSubTrigger>Add to Album</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="trips">Trips</MenuItem>
          </MenuSubContent>
        </MenuSub>
      </MenuContent>
    </Menu>
  )
  await user.click(screen.getByRole("button", { name: "Share Photo" }))
  const menu = screen.getByRole("menu")
  expect(menu.classList.contains("sd-menu-content")).toBe(true)
  expect(menu.dataset.presentation).toBe("sheet")
  expect(screen.getByRole("menuitem", { name: "Copy" }).className).toBe("sd-menu-item")
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("menu")).toBeNull()
})
