import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Chat, ChatContent, ChatGreeting, ChatScrollButton, ChatViewport } from "../src/components/chat"

function Thread({ busy }: { busy?: boolean }) {
  return (
    <Chat busy={busy} className="mine">
      <ChatViewport>
        <ChatContent>
          <p>Hello</p>
          <button type="button">Copy</button>
        </ChatContent>
      </ChatViewport>
      <ChatScrollButton />
    </Chat>
  )
}

test("the thread is a polite log, named, that follows the end", () => {
  const { container } = render(<Thread />)
  const log = screen.getByRole("log", { name: "Conversation" })
  expect(log.getAttribute("aria-live")).toBe("polite")
  expect(log.className).toBe("mb-chat-viewport")
  expect(log.hasAttribute("aria-busy")).toBe(false)
  const root = container.querySelector(".mb-chat") as HTMLElement
  expect(root.className).toBe("mb-chat mine")
  expect(root.hasAttribute("data-sticking")).toBe(true)
  expect(root.querySelector(".mb-chat-content")?.textContent).toContain("Hello")
  expect(root.querySelector(".mb-scroll-view-scrollbar")).not.toBeNull()
})

test("while a reply streams the log is busy, so screen readers wait for the whole reply", () => {
  const { container } = render(<Thread busy />)
  expect(screen.getByRole("log").getAttribute("aria-busy")).toBe("true")
  expect((container.querySelector(".mb-chat") as HTMLElement).hasAttribute("data-busy")).toBe(true)
})

test("the jump-to-latest button is a named glass circle, out of reach at the end", () => {
  render(<Thread />)
  const button = screen.getByRole("button", { name: "Scroll to latest", hidden: true })
  expect(button.className).toBe("mb-glass mb-chat-scroll-button")
  expect(button.dataset.shape).toBe("circle")
  expect(button.hasAttribute("inert")).toBe(true)
  expect(button.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
})

test("Tab reaches content inside the log rather than the viewport itself", async () => {
  const user = userEvent.setup()
  render(<Thread />)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Copy" }))
})

test("the greeting is a heading with a decorative icon and its children under it", () => {
  const { container } = render(
    <ChatGreeting icon={<svg />} title="Good morning, Maya" level={2}>
      <form aria-label="Composer" />
    </ChatGreeting>
  )
  const heading = screen.getByRole("heading", { level: 2, name: "Good morning, Maya" })
  expect(heading.className).toBe("mb-chat-greeting-title")
  expect(container.querySelector(".mb-chat-greeting-icon")?.getAttribute("aria-hidden")).toBe("true")
  expect(container.querySelector(".mb-chat-greeting-body form")).not.toBeNull()
})
