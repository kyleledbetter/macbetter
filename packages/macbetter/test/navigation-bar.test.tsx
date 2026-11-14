import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "../src/components/navigation-bar"

test("a large title is the one heading; the inline copy is hidden", () => {
  render(
    <NavigationStack>
      <NavigationBar title="Library" largeTitle />
    </NavigationStack>
  )

  const heading = screen.getByRole("heading", { name: "Library", level: 1 })
  expect(heading.className).toBe("mb-navigation-bar-large-title")
  expect(screen.getAllByText("Library")).toHaveLength(2)
  expect(document.querySelector(".mb-navigation-bar-title")?.getAttribute("aria-hidden")).toBe("true")
  expect(document.querySelector(".mb-navigation-bar")?.hasAttribute("data-large-title")).toBe(true)
  expect(document.querySelector(".mb-navigation-stack")).not.toBeNull()
})

test("an inline title is the heading, at the level asked for", () => {
  render(<NavigationBar title="Wi-Fi" headingLevel={2} />)

  const heading = screen.getByRole("heading", { name: "Wi-Fi", level: 2 })
  expect(heading.className).toBe("mb-navigation-bar-title")
  expect(document.querySelector(".mb-navigation-bar-large-title")).toBeNull()
})

test("the back button is named by the previous title and works from the keyboard", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <NavigationBar title="Wi-Fi">
      <NavigationBarBackButton onClick={onClick}>Settings</NavigationBarBackButton>
      <NavigationBarTrailing>
        <button type="button">Edit</button>
      </NavigationBarTrailing>
    </NavigationBar>
  )

  const back = screen.getByRole("button", { name: "Settings" })
  expect(back.className).toBe("mb-navigation-bar-back")
  expect(back.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  await user.tab()
  expect(document.activeElement).toBe(back)
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Edit" }))
})

test("titles are real heading elements", () => {
  render(
    <NavigationStack>
      <NavigationBar title="Library" largeTitle headingLevel={2} />
    </NavigationStack>
  )
  expect(screen.getByRole("heading", { name: "Library" }).tagName).toBe("H2")
  expect(screen.getAllByRole("heading")).toHaveLength(1)
})

test("without scroll-driven animations, the stack tracks its scroll position", async () => {
  vi.stubGlobal("CSS", { supports: () => false })
  try {
    render(
      <NavigationStack data-testid="stack">
        <NavigationBar title="Library" largeTitle />
      </NavigationStack>
    )
    const stack = screen.getByTestId("stack")
    const large = document.querySelector<HTMLElement>(".mb-navigation-bar-large-title")!
    Object.defineProperty(large, "offsetHeight", { value: 52 })
    expect(stack.hasAttribute("data-scrolled")).toBe(false)

    stack.scrollTop = 20
    stack.dispatchEvent(new Event("scroll"))
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect(stack.style.getPropertyValue("--mb-navigation-offset")).toBe("20px")
    expect(stack.hasAttribute("data-scrolled")).toBe(false)

    stack.scrollTop = 120
    stack.dispatchEvent(new Event("scroll"))
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect(stack.style.getPropertyValue("--mb-navigation-offset")).toBe("120px")
    expect(stack.hasAttribute("data-scrolled")).toBe(true)
  } finally {
    vi.unstubAllGlobals()
  }
})

test("with scroll-driven animations, the stack leaves the work to CSS", () => {
  vi.stubGlobal("CSS", { supports: () => true })
  try {
    render(
      <NavigationStack data-testid="stack">
        <NavigationBar title="Library" largeTitle />
      </NavigationStack>
    )
    const stack = screen.getByTestId("stack")
    stack.scrollTop = 120
    stack.dispatchEvent(new Event("scroll"))
    expect(stack.hasAttribute("data-scrolled")).toBe(false)
    expect(stack.style.getPropertyValue("--mb-navigation-offset")).toBe("")
  } finally {
    vi.unstubAllGlobals()
  }
})
