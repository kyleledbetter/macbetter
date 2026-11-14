import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "../src/components/popover"

function Share({ arrow }: { arrow?: boolean }) {
  return (
    <Popover>
      <PopoverTrigger>Share</PopoverTrigger>
      <PopoverContent arrow={arrow}>
        <PopoverTitle>Share “Q3 Roadmap”</PopoverTitle>
        <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        <PopoverClose>Copy Link</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

test("opens a named popover with its arrow, and Escape returns focus", async () => {
  const user = userEvent.setup()
  render(<Share />)

  const trigger = screen.getByRole("button", { name: "Share" })
  trigger.focus()
  await user.keyboard("{Enter}")
  const popover = screen.getByRole("dialog", { name: "Share “Q3 Roadmap”" })
  expect(popover.className).toContain("mb-popover")
  expect(popover.hasAttribute("data-arrow")).toBe(true)
  expect(popover.querySelector(".mb-popover-arrow")).not.toBeNull()
  expect(popover.querySelector(".mb-popover-description")).not.toBeNull()

  await user.keyboard("{Escape}")
  expect(screen.queryByRole("dialog")).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

test("leaves the arrow out when asked, and Close closes it", async () => {
  const user = userEvent.setup()
  render(<Share arrow={false} />)

  await user.click(screen.getByRole("button", { name: "Share" }))
  const popover = screen.getByRole("dialog")
  expect(popover.querySelector(".mb-popover-arrow")).toBeNull()

  const close = screen.getByRole("button", { name: "Copy Link" })
  expect(close.className).toContain("mb-popover-close")
  await user.click(close)
  expect(screen.queryByRole("dialog")).toBeNull()
})
