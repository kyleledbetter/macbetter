import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, Label } from "../src/components/field"
import { TextField } from "../src/components/text-field"

test("names and describes its control, and carries the layout", () => {
  render(
    <FieldGroup layout="horizontal">
      <Field layout="horizontal" name="email">
        <FieldLabel>Email:</FieldLabel>
        <TextField type="email" />
        <FieldDescription>Used to sign in.</FieldDescription>
      </Field>
    </FieldGroup>
  )

  const input = screen.getByRole("textbox", { name: "Email:" })
  expect(input).toHaveProperty("name", "email")
  expect(screen.getByText("Used to sign in.").id).toBe(input.getAttribute("aria-describedby")?.split(" ")[0])
  const field = input.closest(".mb-field") as HTMLElement
  expect(field.dataset.layout).toBe("horizontal")
  expect((field.parentElement as HTMLElement).className).toContain("mb-field-group")
  expect((field.parentElement as HTMLElement).dataset.layout).toBe("horizontal")
  expect(screen.getByText("Email:").className).toContain("mb-field-label")
  expect(screen.getByText("Used to sign in.").tagName).toBe("DIV")
})

test("clicking the label focuses the field, and a submit shows the error", async () => {
  const user = userEvent.setup()
  render(
    <form onSubmit={(event) => event.preventDefault()}>
      <Field>
        <FieldLabel>Name</FieldLabel>
        <TextField required />
        <FieldError match="valueMissing">Enter a name.</FieldError>
      </Field>
      <button type="submit">Save</button>
    </form>
  )

  await user.click(screen.getByText("Name"))
  expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Name" }))
  await user.keyboard("{Enter}")
  expect(screen.getByText("Enter a name.").className).toContain("mb-field-error")
})

test("Label names a control outside a field", () => {
  render(
    <>
      <Label htmlFor="city">City</Label>
      <TextField id="city" />
    </>
  )
  expect(screen.getByRole("textbox", { name: "City" })).toBeTruthy()
})
