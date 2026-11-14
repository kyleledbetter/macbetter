import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../src/components/sheet"

function Places({ detents }: { detents?: ("medium" | "large")[] }) {
  return (
    <Sheet detents={detents}>
      <SheetTrigger>Find a Place</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Places Nearby</SheetTitle>
          <SheetClose variant="primary">Done</SheetClose>
        </SheetHeader>
        <SheetBody>Blue Bottle Coffee</SheetBody>
      </SheetContent>
    </Sheet>
  )
}

test("a sheet with two detents gets a grabber button that steps between them", async () => {
  const user = userEvent.setup()
  render(<Places detents={["medium", "large"]} />)

  await user.click(screen.getByRole("button", { name: "Find a Place" }))
  const sheet = screen.getByRole("dialog", { name: "Places Nearby" })
  expect(sheet.className).toContain("sd-sheet")
  expect(sheet.dataset.side).toBe("bottom")
  expect(sheet.hasAttribute("data-large")).toBe(true)
  expect(document.querySelector(".sd-sheet-backdrop")).not.toBeNull()

  const grabber = screen.getByRole("button", { name: "Resize sheet" })
  expect(grabber.className).toContain("sd-sheet-grabber")
  // jsdom has no layout, so the detents themselves are checked in a browser.
  await user.click(grabber)
  expect(screen.getByRole("dialog", { name: "Places Nearby" })).toBe(sheet)

  const done = screen.getByRole("button", { name: "Done" })
  expect(done.dataset.variant).toBe("primary")
  await user.click(done)
  expect(screen.queryByRole("dialog")).toBeNull()
})

test("a sheet without detents draws a decorative grabber and closes on Escape", async () => {
  const user = userEvent.setup()
  render(<Places />)

  const trigger = screen.getByRole("button", { name: "Find a Place" })
  trigger.focus()
  await user.keyboard("{Enter}")
  const sheet = screen.getByRole("dialog", { name: "Places Nearby" })
  expect(screen.queryByRole("button", { name: "Resize sheet" })).toBeNull()
  expect(sheet.querySelector(".sd-sheet-grabber")?.getAttribute("aria-hidden")).toBe("true")

  await user.keyboard("{Escape}")
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("opening focuses the sheet's content, not the grabber", async () => {
  const user = userEvent.setup()
  render(<Places detents={["medium", "large"]} />)

  screen.getByRole("button", { name: "Find a Place" }).focus()
  await user.keyboard("{Enter}")
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Done" }))
})

test("an end inspector is a named dialog on the trailing edge without a grabber", async () => {
  const user = userEvent.setup()
  render(
    <Sheet side="end" modal={false}>
      <SheetTrigger>Show Inspector</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inspector</SheetTitle>
          <SheetClose>Hide</SheetClose>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )

  await user.click(screen.getByRole("button", { name: "Show Inspector" }))
  const sheet = screen.getByRole("dialog", { name: "Inspector" })
  expect(sheet.dataset.side).toBe("right")
  expect(sheet.querySelector(".sd-sheet-grabber")).toBeNull()
  // Non-modal: no scrim over the page it sits beside.
  expect(document.querySelector(".sd-sheet-backdrop")).toBeNull()
  await user.click(screen.getByRole("button", { name: "Hide" }))
  expect(screen.queryByRole("dialog")).toBeNull()
})
