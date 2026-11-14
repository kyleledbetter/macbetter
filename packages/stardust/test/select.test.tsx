import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "../src/components/select"

function ScrollBars({ multiple }: { multiple?: boolean }) {
  return (
    <Select defaultValue="scrolling">
      <SelectLabel>Show scroll bars</SelectLabel>
      <SelectTrigger />
      <SelectContent>
        <SelectGroup>
          <SelectGroupLabel>Options</SelectGroupLabel>
          <SelectItem value="automatic">Automatically</SelectItem>
          <SelectItem value="scrolling">When scrolling</SelectItem>
          <SelectItem value="always">Always</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

test("the pop-up button shows the value and renders its chevron cap", () => {
  render(<ScrollBars />)
  const trigger = screen.getByRole("combobox", { name: "Show scroll bars" })
  expect(trigger.className).toBe("sd-select-trigger")
  expect(trigger.dataset.variant).toBe("auto")
  expect(trigger.textContent).toBe("When scrolling")
  expect(trigger.querySelector(".sd-select-trigger-cap svg")).not.toBeNull()
})

test("opens a menu with a check beside the selected item; the keyboard picks another", async () => {
  const user = userEvent.setup()
  render(<ScrollBars />)
  const trigger = screen.getByRole("combobox", { name: "Show scroll bars" })
  await user.click(trigger)

  const list = screen.getByRole("listbox")
  expect(list.className).toBe("sd-menu-content sd-select-content")
  const selected = screen.getByRole("option", { name: "When scrolling" })
  expect(selected.className).toBe("sd-menu-item sd-menu-checkable sd-select-item")
  expect(selected.querySelector(".sd-menu-item-indicator[data-selected] svg")).not.toBeNull()
  expect(screen.getByRole("group").className).toBe("sd-menu-group")

  await user.keyboard("{ArrowDown}{Enter}")
  expect(screen.queryByRole("listbox")).toBeNull()
  expect(trigger.textContent).toBe("Always")
})

test("multiple selection keeps the list open and checks each choice", async () => {
  const user = userEvent.setup()
  render(
    <Select multiple defaultValue={["mentions"]}>
      <SelectLabel>Notify me about</SelectLabel>
      <SelectTrigger variant="bezeled" />
      <SelectContent>
        <SelectItem value="mentions">Mentions</SelectItem>
        <SelectItem value="replies">Replies</SelectItem>
      </SelectContent>
    </Select>
  )
  const trigger = screen.getByRole("combobox", { name: "Notify me about" })
  expect(trigger.dataset.variant).toBe("bezeled")
  await user.click(trigger)
  await user.click(screen.getByRole("option", { name: "Replies" }))
  expect(screen.getByRole("listbox")).toBeTruthy()
  expect(screen.getByRole("option", { name: "Replies" }).getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("option", { name: "Mentions" }).getAttribute("aria-selected")).toBe("true")
})

test("with items on the root, the button shows the label before the list has ever opened", () => {
  render(
    <Select items={[{ value: "when-scrolling", label: "When scrolling" }]} defaultValue="when-scrolling">
      <SelectLabel>Show scroll bars</SelectLabel>
      <SelectTrigger />
      <SelectContent>
        <SelectItem value="when-scrolling">When scrolling</SelectItem>
      </SelectContent>
    </Select>
  )
  expect(screen.getByRole("combobox", { name: "Show scroll bars" }).textContent).toBe("When scrolling")
})

test("Escape closes without changing the value and focus returns to the button", async () => {
  const user = userEvent.setup()
  render(<ScrollBars />)
  const trigger = screen.getByRole("combobox", { name: "Show scroll bars" })
  await user.click(trigger)
  await user.keyboard("{ArrowDown}{Escape}")
  expect(screen.queryByRole("listbox")).toBeNull()
  expect(trigger.textContent).toBe("When scrolling")
  expect(document.activeElement).toBe(trigger)
})

test("trigger sizes and the plain variant are data attributes; className merges", () => {
  render(
    <Select defaultValue="date">
      <SelectLabel>Sort by</SelectLabel>
      <SelectTrigger variant="plain" size="sm" className="toolbar-sort" />
      <SelectContent>
        <SelectItem value="date">Date</SelectItem>
      </SelectContent>
    </Select>
  )
  const trigger = screen.getByRole("combobox", { name: "Sort by" })
  expect(trigger.className).toBe("sd-select-trigger toolbar-sort")
  expect(trigger.dataset.variant).toBe("plain")
  expect(trigger.dataset.size).toBe("sm")
})
