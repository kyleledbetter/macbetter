import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "../src/components/tooltip"

test("names an icon button and shows on keyboard focus with its shortcut", async () => {
  const user = userEvent.setup()
  render(
    <Tooltip shortcut="mod+b">
      <TooltipTrigger>
        <svg aria-hidden="true" />
      </TooltipTrigger>
      <TooltipContent>
        Bold
        <TooltipShortcut />
      </TooltipContent>
    </Tooltip>
  )

  await user.tab()
  const button = screen.getByRole("button", { name: /Bold/ })
  expect(document.activeElement).toBe(button)
  const tip = screen.getByRole("tooltip")
  expect(tip.className).toContain("sd-tooltip")
  expect(tip.dataset.side).toBe("bottom")
  expect(tip.querySelector(".sd-tooltip-shortcut")?.textContent).not.toBe("")

  await user.keyboard("{Escape}")
  expect(tip.hasAttribute("data-open")).toBe(false)
  expect(document.activeElement).toBe(button)
})
