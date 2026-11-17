import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Inspector,
  InspectorBody,
  InspectorClose,
  InspectorHeader,
  InspectorSection,
  InspectorSectionTitle,
  InspectorTitle,
} from "../src/components/inspector"
import { Window, WindowBody } from "../src/components/window"

test("is a complementary landmark named by its title, with sections and a trailing action", () => {
  render(
    <Window aria-label="Launch plan">
      <WindowBody>Plan</WindowBody>
      <Inspector variant="floating" className="mine">
        <InspectorHeader>
          <InspectorTitle>Details</InspectorTitle>
        </InspectorHeader>
        <InspectorBody>
          <InspectorSection>
            <InspectorSectionTitle action={<button type="button">Add Output</button>}>Outputs</InspectorSectionTitle>
          </InspectorSection>
        </InspectorBody>
      </Inspector>
    </Window>
  )

  const panel = screen.getByRole("complementary", { name: "Details" })
  expect(panel.tagName).toBe("ASIDE")
  expect(panel.className).toBe("mb-inspector mine")
  expect(panel.dataset.variant).toBe("floating")
  expect(panel.previousElementSibling?.className).toBe("mb-window-body")
  expect(screen.getByRole("heading", { level: 2, name: "Details" }).className).toBe("mb-inspector-title")
  const section = screen.getByRole("heading", { level: 3, name: "Outputs" })
  expect(section.parentElement?.className).toBe("mb-inspector-section-header")
  expect(section.nextElementSibling?.className).toBe("mb-inspector-section-action")
  expect(screen.getByRole("button", { name: "Add Output" })).toBeTruthy()
})

test("defaults to the edge variant, and an explicit label wins over the title", () => {
  render(
    <Inspector aria-label="File info">
      <InspectorTitle>Details</InspectorTitle>
    </Inspector>
  )
  const panel = screen.getByRole("complementary", { name: "File info" })
  expect(panel.dataset.variant).toBe("edge")
})

test("the close button is named and runs from the keyboard", async () => {
  const user = userEvent.setup()
  const onClose = vi.fn()
  render(
    <Inspector>
      <InspectorHeader>
        <InspectorTitle>Details</InspectorTitle>
        <InspectorClose onClick={onClose} />
      </InspectorHeader>
    </Inspector>
  )
  const close = screen.getByRole("button", { name: "Close Inspector" })
  expect(close.className).toContain("mb-inspector-close")
  await user.tab()
  expect(document.activeElement).toBe(close)
  await user.keyboard(" ")
  expect(onClose).toHaveBeenCalledTimes(1)
})
