import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Separator, SeparatorLabel } from "../src/components/separator"

test("is a hairline separator with its orientation and inset", () => {
  render(
    <>
      <Separator inset="leading" />
      <Separator orientation="vertical" inset className="mine" />
    </>
  )
  const [horizontal, vertical] = screen.getAllByRole("separator")
  expect(horizontal.className).toBe("sd-separator")
  expect(horizontal.getAttribute("aria-orientation")).not.toBe("vertical")
  expect(horizontal.dataset.inset).toBe("leading")
  expect(vertical.className).toBe("sd-separator mine")
  expect(vertical.getAttribute("aria-orientation")).toBe("vertical")
  expect(vertical.dataset.inset).toBe("both")
})

test("a labeled separator reads its label and hides its lines", () => {
  render(<SeparatorLabel>or</SeparatorLabel>)
  expect(screen.queryByRole("separator")).toBeNull()
  expect(screen.getByText("or").className).toBe("sd-separator-label")
})

test("is never a tab stop", async () => {
  const user = userEvent.setup()
  render(
    <>
      <button type="button">Privacy</button>
      <Separator orientation="vertical" />
      <button type="button">Terms</button>
    </>
  )
  await user.tab()
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Terms" }))
})
