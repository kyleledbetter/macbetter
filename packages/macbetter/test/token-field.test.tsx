import { render, screen, waitFor } from "@testing-library/react"
import { expect, test } from "vitest"
import { createTokenInputController } from "@ui-sdk/react/token-input"
import { TokenField } from "../src/components/token-field"

test("draws tokens with the field's class, and names the editor", () => {
  const { container } = render(
    <TokenField
      aria-label="To"
      size="sm"
      removable
      defaultValue={[{ type: "token", value: "hollis@example.com", label: "Hollis Grant" }]}
    />
  )

  const editor = screen.getByRole("textbox", { name: "To" })
  expect(editor.className).toContain("mb-token-field")
  expect(editor.dataset.size).toBe("sm")
  expect(container.querySelector(".mb-token-field-token")?.textContent).toContain("Hollis Grant")
  expect(container.querySelector(".mb-token-field-token-remove svg")).toBeTruthy()
})

test("text before a comma becomes a token", async () => {
  const controller = createTokenInputController()
  render(<TokenField aria-label="Tags" controller={controller} />)

  controller.insert("finance, weekly")
  // An insert from code is left alone; typing a separator is what tokenizes.
  expect(controller.getValue()).toEqual(["finance, weekly"])

  const editor = screen.getByRole("textbox", { name: "Tags" })
  editor.focus()
  editor.blur()
  await waitFor(() =>
    expect(controller.getValue().map((part) => (typeof part === "string" ? part : part.label))).toEqual([
      "finance",
      "weekly",
    ])
  )
})

const labels = (value: ReturnType<ReturnType<typeof createTokenInputController>["getValue"]>) =>
  value.map((part) => (typeof part === "string" ? part : part.label))

test("custom separators and createToken decide what becomes a token", async () => {
  const controller = createTokenInputController()
  render(
    <TokenField
      aria-label="Recipients"
      controller={controller}
      tokenizeOn={[";"]}
      createToken={(text) => (text.includes("@") ? { type: "token", value: text, label: text.split("@")[0] } : null)}
    />
  )
  controller.insert("hollis@example.com; ines@example.com")
  const editor = screen.getByRole("textbox", { name: "Recipients" })
  editor.focus()
  editor.blur()
  await waitFor(() => expect(labels(controller.getValue())).toEqual(["hollis", "ines"]))

  controller.setValue(["not an address"])
  editor.focus()
  editor.blur()
  await Promise.resolve()
  expect(controller.getValue()).toEqual(["not an address"])
})

test("tokenizeOn={false} leaves typed text alone", async () => {
  const controller = createTokenInputController()
  render(<TokenField aria-label="Notes" controller={controller} tokenizeOn={false} />)
  controller.insert("finance, weekly")
  const editor = screen.getByRole("textbox", { name: "Notes" })
  editor.focus()
  editor.blur()
  await Promise.resolve()
  expect(controller.getValue()).toEqual(["finance, weekly"])
})

test("a Field label names the editor", async () => {
  const { Field, FieldLabel } = await import("../src/components/field")
  render(
    <Field>
      <FieldLabel>Tags</FieldLabel>
      <TokenField placeholder="Add a tag" />
    </Field>
  )
  expect(screen.getByRole("textbox", { name: "Tags" }).className).toContain("mb-token-field")
})
