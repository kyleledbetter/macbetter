import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { TextArea } from "../src/components/text-area"

test("grows from minRows to maxRows and takes new lines", async () => {
  const user = userEvent.setup()
  render(<TextArea aria-label="Notes" minRows={2} maxRows={5} variant="filled" />)

  const area = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement
  expect(area.className).toBe("mb-text-area")
  expect(area.dataset.variant).toBe("filled")
  expect(area.rows).toBe(2)
  expect(area.style.getPropertyValue("--mb-text-area-min-rows")).toBe("2")
  expect(area.style.getPropertyValue("--mb-text-area-max-rows")).toBe("5")

  await user.click(area)
  await user.keyboard("One{Enter}Two")
  expect(area.value).toBe("One\nTwo")
})
