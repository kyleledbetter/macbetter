import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { expect, test, vi } from "vitest"
import {
  Command,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
  CommandShortcut,
} from "../src/components/command-palette"

function Palette({ onRun }: { onRun: (value: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <CommandPalette open={open} onOpenChange={setOpen}>
      <CommandPaletteTrigger>Search</CommandPaletteTrigger>
      <CommandPaletteContent title="Search apps">
        <Command
          onAction={(value) => {
            onRun(value)
            setOpen(false)
          }}
        >
          <CommandInput aria-label="Search apps" placeholder="Spotlight Search" />
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Applications</CommandGroupLabel>
              <CommandItem value="notes">Notes</CommandItem>
              <CommandItem value="mail" shortcut="mod+m">
                Mail
                <CommandShortcut />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandPaletteContent>
    </CommandPalette>
  )
}

test("the trigger is a search-shaped button that opens the palette with ⌘K by default", async () => {
  const user = userEvent.setup()
  render(<Palette onRun={() => {}} />)
  const trigger = screen.getByRole("button", { name: /Search/ })
  expect(trigger.className).toBe("mb-command-palette-trigger")
  expect(trigger.getAttribute("aria-keyshortcuts")).toMatch(/K/)

  await user.click(trigger)
  const dialog = screen.getByRole("dialog", { name: "Search apps" })
  expect(dialog.className).toBe("mb-command-palette")
  const input = screen.getByRole("combobox", { name: "Search apps" })
  expect(input.className).toBe("mb-command-input")
  expect(input.parentElement?.className).toBe("mb-command-search")
  expect(input.parentElement?.querySelector("svg")).not.toBeNull()
})

test("typing filters, Enter runs the highlighted command and closes the palette", async () => {
  const user = userEvent.setup()
  const onRun = vi.fn()
  render(<Palette onRun={onRun} />)
  await user.click(screen.getByRole("button", { name: /Search/ }))
  await user.type(screen.getByRole("combobox", { name: "Search apps" }), "mai")
  expect(screen.queryByRole("option", { name: "Notes" })).toBeNull()
  expect(screen.getByRole("option", { name: /Mail/ }).className).toBe("mb-command-item")
  await user.keyboard("{Enter}")
  expect(onRun).toHaveBeenCalledWith("mail")
  expect(screen.queryByRole("dialog")).toBeNull()
})

test("Command works on its own, outside a palette", () => {
  render(
    <Command>
      <CommandInput aria-label="Search" />
      <CommandList>
        <CommandItem value="notes">Notes</CommandItem>
      </CommandList>
    </Command>
  )
  expect(screen.getByRole("listbox").className).toBe("mb-command-list")
  expect(screen.getByRole("option", { name: "Notes" }).closest(".mb-command")).not.toBeNull()
})

test("Escape clears the search first, then closes and returns focus to the trigger", async () => {
  const user = userEvent.setup()
  render(<Palette onRun={() => {}} />)
  const trigger = screen.getByRole("button", { name: /Search/ })
  await user.click(trigger)
  const input = screen.getByRole("combobox", { name: "Search apps" })
  expect(document.activeElement).toBe(input)
  await user.type(input, "no")
  await user.keyboard("{Escape}")
  expect((input as HTMLInputElement).value).toBe("")
  expect(screen.getByRole("dialog")).toBeTruthy()
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("the shortcut renders inside the trigger and the item; className merges", async () => {
  const user = userEvent.setup()
  render(<Palette onRun={() => {}} />)
  const trigger = screen.getByRole("button", { name: /Search/ })
  expect(trigger.querySelector(".mb-command-palette-trigger-shortcut")?.textContent).not.toBe("")
  await user.click(trigger)
  const mail = screen.getByRole("option", { name: /Mail/ })
  expect(mail.querySelector(".mb-command-shortcut")?.textContent).not.toBe("")
})
