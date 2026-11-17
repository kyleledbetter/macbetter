import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { MenuItem } from "../src/components/menu"
import {
  PromptInput,
  PromptInputAccessory,
  PromptInputAdd,
  PromptInputAttachments,
  PromptInputButton,
  PromptInputField,
  type PromptInputStatus,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
} from "../src/components/prompt-input"

function Composer({
  status,
  onSubmit,
  onStop,
  glow,
  triggers,
}: {
  status?: PromptInputStatus
  onSubmit?: (message: { text: string; files: File[] }) => void
  onStop?: () => void
  glow?: boolean
  triggers?: React.ComponentProps<typeof PromptInputField>["triggers"]
}) {
  return (
    <PromptInput status={status} onSubmit={onSubmit} onStop={onStop} glow={glow} size="lg">
      <PromptInputAttachments />
      <PromptInputField placeholder="Ask anything" triggers={triggers} />
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputAdd>
            <MenuItem value="project">Add to project</MenuItem>
          </PromptInputAdd>
        </PromptInputTools>
        <PromptInputTools>
          <PromptInputButton aria-label="Dictate">
            <svg />
          </PromptInputButton>
          <PromptInputSubmit />
        </PromptInputTools>
      </PromptInputToolbar>
      <PromptInputAccessory>Choose project</PromptInputAccessory>
    </PromptInput>
  )
}

test("Return sends the text and clears the field; Shift-Return adds a line", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<Composer onSubmit={onSubmit} />)

  const field = screen.getByRole("textbox", { name: "Message" })
  await user.type(field, "Plan a trip{Shift>}{Enter}{/Shift}to Lisbon")
  expect((field as HTMLTextAreaElement).value).toBe("Plan a trip\nto Lisbon")
  expect(onSubmit).not.toHaveBeenCalled()

  await user.keyboard("{Enter}")
  expect(onSubmit).toHaveBeenCalledWith({ text: "Plan a trip\nto Lisbon", files: [] })
  expect((field as HTMLTextAreaElement).value).toBe("")
})

test("an empty field doesn't send, and the send button is disabled until there's text", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<Composer onSubmit={onSubmit} />)

  const send = screen.getByRole("button", { name: "Send" })
  expect(send.hasAttribute("data-disabled") || (send as HTMLButtonElement).disabled).toBe(true)
  const field = screen.getByRole("textbox", { name: "Message" })
  await user.type(field, "   {Enter}")
  expect(onSubmit).not.toHaveBeenCalled()

  await user.type(field, "Hello")
  expect(send.hasAttribute("data-disabled")).toBe(false)
  await user.click(send)
  expect(onSubmit).toHaveBeenCalledWith({ text: "   Hello", files: [] })
})

test("while a reply streams the submit button is Stop, and Return doesn't send", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  const onStop = vi.fn()
  const { container } = render(<Composer status="streaming" glow onSubmit={onSubmit} onStop={onStop} />)

  const form = container.querySelector("form") as HTMLFormElement
  expect(form.className).toBe("mb-prompt-input")
  expect(form.dataset.status).toBe("streaming")
  expect(form.dataset.size).toBe("lg")
  expect(form.hasAttribute("data-glowing")).toBe(true)
  expect(screen.queryByRole("button", { name: "Send" })).toBeNull()

  await user.type(screen.getByRole("textbox", { name: "Message" }), "And Porto?{Enter}")
  expect(onSubmit).not.toHaveBeenCalled()

  const stop = screen.getByRole("button", { name: "Stop" })
  expect(stop.getAttribute("type")).toBe("button")
  await user.click(stop)
  expect(onStop).toHaveBeenCalledTimes(1)
})

test("glows only while the reply is on its way", () => {
  const { container } = render(<Composer status="ready" glow />)
  const form = container.querySelector("form") as HTMLFormElement
  expect(form.hasAttribute("data-glow")).toBe(true)
  expect(form.hasAttribute("data-glowing")).toBe(false)
})

test("the accessory strip is placed under the box, and parts carry their classes", () => {
  const { container } = render(<Composer />)
  const box = container.querySelector(".mb-prompt-input-box") as HTMLElement
  const accessory = container.querySelector(".mb-prompt-input-accessory") as HTMLElement
  expect(box.contains(accessory)).toBe(false)
  expect(box.closest("form")?.lastElementChild).toBe(accessory)
  expect(box.querySelector(".mb-prompt-input-field")).not.toBeNull()
  expect(box.querySelector(".mb-prompt-input-toolbar .mb-prompt-input-tools")).not.toBeNull()
  expect(screen.getByRole("button", { name: "Dictate" }).className).toContain("mb-prompt-input-button")
})

test("the add button opens a menu whose first item adds files, and Escape closes it", async () => {
  const user = userEvent.setup()
  render(<Composer />)

  const add = screen.getByRole("button", { name: "Add" })
  await user.click(add)
  const items = screen.getAllByRole("menuitem")
  expect(items.map((item) => item.textContent)).toEqual(["Add photos and files", "Add to project"])
  await user.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  expect(document.activeElement).toBe(add)
})

test("attached files show as chips and send with the text", async () => {
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  const onSubmit = vi.fn()
  const { container } = render(<Composer onSubmit={onSubmit} />)

  const file = new File(["a,b"], "itinerary.csv", { type: "text/csv" })
  await user.upload(container.querySelector('input[type="file"]') as HTMLInputElement, file)
  const list = screen.getByRole("list", { name: "Attachments" })
  expect(list.textContent).toContain("itinerary.csv")
  expect(list.querySelector(".mb-attachment[data-variant='chip']")).not.toBeNull()

  await user.click(screen.getByRole("button", { name: "Send" }))
  expect(onSubmit).toHaveBeenCalledWith({ text: "", files: [file] })
  expect(screen.queryByRole("list", { name: "Attachments" })).toBeNull()
})

// ui-sdk's Trigger Menu doesn't open in jsdom (its own docs example doesn't either), so choosing a
// suggestion with Return is checked in a real browser; this checks the field is wired to it.
test("with triggers, the field becomes the trigger menu's input", () => {
  render(<Composer triggers={[{ char: "@", items: [{ value: "budget", label: "Budget.xlsx" }] }]} />)
  const field = screen.getByRole("textbox", { name: "Message" })
  expect(field.getAttribute("aria-haspopup")).toBe("listbox")
  expect(field.getAttribute("aria-autocomplete")).toBe("list")
  expect(field.className).toBe("mb-prompt-input-field")
})
