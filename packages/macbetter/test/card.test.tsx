import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../src/components/card"

test("composes a card with a heading, description, content and footer", () => {
  const { container } = render(
    <Card variant="elevated" className="mine">
      <CardHeader>
        <CardTitle>Software Update</CardTitle>
        <CardDescription>macOS 26.1 is ready to install.</CardDescription>
      </CardHeader>
      <CardContent>Restart required.</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )

  const card = container.firstElementChild as HTMLElement
  expect(card.className).toBe("mb-card mine")
  expect(card.dataset.variant).toBe("elevated")
  expect(screen.getByRole("heading", { level: 3, name: "Software Update" }).className).toBe("mb-card-title")
  expect(screen.getByText("macOS 26.1 is ready to install.").tagName).toBe("P")
  expect(container.querySelector(".mb-card-header")).not.toBeNull()
  expect(screen.getByText("Restart required.").className).toBe("mb-card-content")
  expect(screen.getByText("Footer").className).toBe("mb-card-footer")
})

test("defaults to the grouped variant", () => {
  const { container } = render(<Card>Storage</Card>)
  expect((container.firstElementChild as HTMLElement).dataset.variant).toBe("grouped")
})
