import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Listbox, ListboxItem } from "../src/components/listbox"

test("rows carry Stardust classes and a checkmark; arrows move the selection", async () => {
  const user = userEvent.setup()
  render(
    <Listbox aria-label="Default web browser" defaultValue="safari">
      <ListboxItem value="safari">Safari</ListboxItem>
      <ListboxItem value="firefox">Firefox</ListboxItem>
    </Listbox>
  )
  expect(screen.getByRole("listbox", { name: "Default web browser" }).className).toBe("sd-listbox")
  const safari = screen.getByRole("option", { name: "Safari" })
  expect(safari.className).toBe("sd-listbox-item")
  expect(safari.querySelector(".sd-listbox-item-indicator svg")).not.toBeNull()

  safari.focus()
  await user.keyboard("{ArrowDown}")
  expect(document.activeElement).toBe(screen.getByRole("option", { name: "Firefox" }))
})

test("multiple selection marks each chosen row and merges className", async () => {
  const user = userEvent.setup()
  render(
    <Listbox aria-label="Sync" multiple defaultValue={["photos"]} className="settings-list">
      <ListboxItem value="photos">Photos</ListboxItem>
      <ListboxItem value="notes">Notes</ListboxItem>
      <ListboxItem value="mail" disabled>
        Mail
      </ListboxItem>
    </Listbox>
  )
  const list = screen.getByRole("listbox", { name: "Sync" })
  expect(list.className).toBe("sd-listbox settings-list")
  expect(list.getAttribute("aria-multiselectable")).toBe("true")
  await user.click(screen.getByRole("option", { name: "Notes" }))
  expect(screen.getByRole("option", { name: "Notes" }).getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("option", { name: "Photos" }).getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("option", { name: "Mail" }).getAttribute("aria-disabled")).toBe("true")
})
