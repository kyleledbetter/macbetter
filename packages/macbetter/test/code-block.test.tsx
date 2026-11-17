import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, test, vi } from "vitest"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopy,
  CodeBlockHeader,
  CodeBlockTitle,
} from "../src/components/code-block"

const source = `export function total(items) {\n  return items.reduce((sum, item) => sum + item.price, 0)\n}\n`

afterEach(() => {
  vi.useRealTimers()
})

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true })
}

test("splits plain text into lines and carries wrap, line numbers and max height", () => {
  const { container } = render(
    <CodeBlock wrap lineNumbers maxHeight={240} className="mine">
      <CodeBlockHeader>
        <CodeBlockTitle language="JavaScript">cart.js</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>{source}</CodeBlockContent>
    </CodeBlock>
  )

  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-code-block mine")
  expect(root.hasAttribute("data-wrap")).toBe(true)
  expect(root.hasAttribute("data-line-numbers")).toBe(true)
  expect(root.style.getPropertyValue("--mb-code-block-max-height")).toBe("240px")
  expect(container.querySelectorAll(".mb-code-block-line")).toHaveLength(3)
  expect(container.querySelector("code")?.textContent).toBe(source.trimEnd())
  expect(screen.getByText("cart.js").className).toBe("mb-code-block-title-text")
  expect(screen.getByText("JavaScript").className).toBe("mb-code-block-language")
  // A scrolling region has to be reachable from the keyboard.
  expect(container.querySelector("pre")?.tabIndex).toBe(0)
})

test("takes highlighted markup and drops a highlighter's own pre and code", () => {
  const html = `<pre class="shiki" style="background:#fff"><code><span class="line"><span style="color:red">const</span> a = 1</span></code></pre>`
  const { container } = render(
    <CodeBlock>
      <CodeBlockContent html={html} />
    </CodeBlock>
  )
  expect(container.querySelectorAll("pre")).toHaveLength(1)
  expect(container.querySelectorAll("code")).toHaveLength(1)
  expect(container.querySelector("code > .line")?.textContent).toBe("const a = 1")
})

test("copy writes the shown code, turns into a check, and turns back", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  const writeText = vi.fn(async () => {})
  stubClipboard(writeText)
  render(
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>cart.js</CodeBlockTitle>
        <CodeBlockCopy />
      </CodeBlockHeader>
      <CodeBlockContent>{source}</CodeBlockContent>
    </CodeBlock>
  )

  const copy = screen.getByRole("button", { name: "Copy code" })
  expect(copy.className).toContain("mb-code-block-copy")
  copy.focus()
  await user.keyboard("{Enter}")
  expect(writeText).toHaveBeenCalledWith(source.trimEnd())
  expect(screen.getByRole("button", { name: "Copied" }).hasAttribute("data-copied")).toBe(true)

  await act(async () => {
    vi.advanceTimersByTime(2000)
  })
  expect(screen.getByRole("button", { name: "Copy code" }).hasAttribute("data-copied")).toBe(false)
})

test("a failed copy stays quiet and keeps the copy label", async () => {
  const user = userEvent.setup()
  stubClipboard(async () => {
    throw new Error("Denied")
  })
  render(
    <CodeBlock>
      <CodeBlockCopy value="npm install macbetter" />
      <CodeBlockContent>npm install macbetter</CodeBlockContent>
    </CodeBlock>
  )
  await user.click(screen.getByRole("button", { name: "Copy code" }))
  expect(screen.getByRole("button", { name: "Copy code" }).hasAttribute("data-copied")).toBe(false)
})
