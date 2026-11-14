import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "../src/components/carousel"

const stories = ["Focus", "Photos", "Passkeys"]

function Stories() {
  return (
    <Carousel aria-label="Featured stories" layout="full">
      <CarouselViewport>
        <CarouselContent>
          {stories.map((story) => (
            <CarouselItem key={story}>{story}</CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselIndicatorGroup aria-label="Choose a story">
        {stories.map((story, index) => (
          <CarouselIndicator key={story} page={index + 1} aria-label={story} />
        ))}
      </CarouselIndicatorGroup>
    </Carousel>
  )
}

test("names its arrows and draws their chevrons", () => {
  const { container } = render(<Stories />)
  const root = container.querySelector(".sd-carousel") as HTMLElement
  expect(root.dataset.layout).toBe("full")

  const previous = screen.getByRole("button", { name: "Previous" })
  const next = screen.getByRole("button", { name: "Next" })
  expect(previous.className).toBe("sd-carousel-button sd-carousel-previous")
  expect(next.className).toBe("sd-carousel-button sd-carousel-next")
  expect(next.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  expect(container.querySelector(".sd-carousel-viewport")).not.toBeNull()
  expect(container.querySelectorAll(".sd-carousel-item")).toHaveLength(3)
})

test("page dots are a tablist, and dots past the page count hide", async () => {
  const user = userEvent.setup()
  render(<Stories />)
  const dots = screen.getAllByRole("tab", { hidden: true })
  expect(screen.getByRole("tablist", { name: "Choose a story" }).className).toBe("sd-carousel-indicators")
  expect(dots[0].className).toBe("sd-carousel-indicator")
  expect(dots[0].getAttribute("aria-selected")).toBe("true")
  expect(dots[0].hasAttribute("data-selected")).toBe(true)
  const next = screen.getByRole("button", { name: "Next" })
  next.focus()
  await user.keyboard("{Enter}")
  expect(document.activeElement).toBe(next)
  expect(next.getAttribute("aria-disabled")).toBe("true")
  expect(next.hasAttribute("data-disabled")).toBe(true)
  // jsdom measures every slide into one page, so only the first dot shows.
  expect(dots.slice(1).every((dot) => dot.hidden)).toBe(true)
})
