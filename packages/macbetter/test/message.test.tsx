import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Message,
  MessageAction,
  MessageActionCopy,
  MessageActionMenu,
  MessageActions,
  MessageActionToggle,
  MessageAttachments,
  MessageBubble,
  MessageContent,
  MessageMeta,
} from "../src/components/message"
import { MenuItem } from "../src/components/menu"

function Reply({ onRetry }: { onRetry?: () => void }) {
  return (
    <Message from="assistant" latest>
      <MessageContent>Lisbon in three days.</MessageContent>
      <MessageActions>
        <MessageActionCopy text="Lisbon in three days." />
        <MessageActionToggle label="Good response">
          <svg />
        </MessageActionToggle>
        <MessageAction label="Retry" onClick={onRetry}>
          <svg />
        </MessageAction>
      </MessageActions>
      <MessageMeta>Atlas 4</MessageMeta>
    </Message>
  )
}

test("a person's turn is a trailing bubble, and parts carry their classes", () => {
  const { container } = render(
    <Message from="user">
      <MessageAttachments />
      <MessageContent>
        <MessageBubble variant="neutral">Plan a trip</MessageBubble>
      </MessageContent>
    </Message>
  )
  const message = container.querySelector("article") as HTMLElement
  expect(message.className).toBe("mb-message")
  expect(message.dataset.from).toBe("user")
  expect(message.querySelector(".mb-message-attachments")).not.toBeNull()
  const bubble = screen.getByText("Plan a trip")
  expect(bubble.className).toBe("mb-message-bubble")
  expect(bubble.dataset.variant).toBe("neutral")
})

test("the assistant's turn has no bubble, and latest keeps its actions in view", () => {
  const { container } = render(<Reply />)
  const message = container.querySelector(".mb-message") as HTMLElement
  expect(message.dataset.from).toBe("assistant")
  expect(message.hasAttribute("data-latest")).toBe(true)
  expect(container.querySelector(".mb-message-bubble")).toBeNull()
  expect(screen.getByText("Atlas 4").className).toBe("mb-message-meta")
})

test("actions are a toolbar with one tab stop, named icon buttons and arrow keys between them", async () => {
  const user = userEvent.setup()
  const onRetry = vi.fn()
  render(<Reply onRetry={onRetry} />)

  const toolbar = screen.getByRole("toolbar", { name: "Message actions" })
  expect(toolbar.className).toBe("mb-message-actions")
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Copy" }))
  await user.keyboard("{ArrowRight}")
  const good = screen.getByRole("button", { name: "Good response" })
  expect(document.activeElement).toBe(good)
  await user.keyboard(" ")
  expect(good.getAttribute("aria-pressed")).toBe("true")
  await user.keyboard("{ArrowRight}{Enter}")
  expect(onRetry).toHaveBeenCalledTimes(1)
  await user.tab()
  expect(document.activeElement).toBe(document.body)
  expect(screen.getByRole("button", { name: "Retry" }).className).toBe("mb-message-action")
})

test("each action shows its label as a tooltip on focus", async () => {
  const user = userEvent.setup()
  render(<Reply />)
  await user.tab()
  expect(document.querySelector(".mb-tooltip[data-open]")?.textContent).toBe("Copy")
})

test("copy writes the text and shows a check, then goes back", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  const writeText = vi.fn(() => Promise.resolve())
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
  const onCopy = vi.fn()
  render(<MessageActions><MessageActionCopy text={() => "Copied text"} onCopy={onCopy} /></MessageActions>)

  // Pressed from the keyboard: a pointer here trips ui-sdk's strict-mode check on the tooltip's hover reason.
  screen.getByRole("button", { name: "Copy" }).focus()
  await user.keyboard("{Enter}")
  expect(writeText).toHaveBeenCalledWith("Copied text")
  expect(onCopy).toHaveBeenCalledWith("Copied text")
  const copied = screen.getByRole("button", { name: "Copied" })
  expect(copied.hasAttribute("data-copied")).toBe(true)
  vi.advanceTimersByTime(2100)
  expect(await screen.findByRole("button", { name: "Copy" })).toBeTruthy()
  vi.useRealTimers()
})

test("the more action opens its menu from the toolbar with ArrowDown, and Escape closes it", async () => {
  const user = userEvent.setup()
  const onAction = vi.fn()
  render(
    <MessageActions>
      <MessageActionCopy text="Hi" />
      <MessageActionMenu onAction={onAction}>
        <MenuItem value="share">Share</MenuItem>
      </MessageActionMenu>
    </MessageActions>
  )
  await user.tab()
  await user.keyboard("{ArrowRight}")
  const more = screen.getByRole("button", { name: "More" })
  expect(document.activeElement).toBe(more)
  expect(more.className).toBe("mb-message-action")
  await user.keyboard("{ArrowDown}")
  expect(screen.getByRole("menu")).toBeTruthy()
  await user.keyboard("{Escape}")
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  expect(document.activeElement).toBe(more)
  await user.keyboard("{Enter}")
  await user.keyboard("{Enter}")
  expect(onAction).toHaveBeenCalledWith("share", expect.anything())
})
