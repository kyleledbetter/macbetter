import {
  Carousel,
  CarouselContent,
  CarouselIndicator,
  CarouselIndicatorGroup,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@dreambase/stardust/carousel"

const stories = [
  { id: "focus", eyebrow: "Get started", title: "Set up Focus for deep work", color: "var(--sd-indigo)" },
  { id: "photos", eyebrow: "Tips", title: "Find any photo by what's in it", color: "var(--sd-orange)" },
  { id: "keychain", eyebrow: "Security", title: "Move to passkeys in five minutes", color: "var(--sd-green)" },
  { id: "journal", eyebrow: "Wellbeing", title: "Start a journal you'll keep", color: "var(--sd-pink)" },
  { id: "shortcuts", eyebrow: "Power user", title: "Automate your morning with Shortcuts", color: "var(--sd-teal)" },
]

export default function Example() {
  return (
    <Carousel aria-label="Featured stories" style={{ width: "100%", maxWidth: 720 }}>
      <CarouselViewport>
        <CarouselContent>
          {stories.map((story) => (
            <CarouselItem key={story.id}>
              <article
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: 220,
                  padding: 20,
                  borderRadius: "var(--sd-group-radius)",
                  background: `linear-gradient(160deg, ${story.color}, color-mix(in oklch, ${story.color} 50%, black))`,
                  color: "white",
                }}
              >
                <span style={{ font: "var(--sd-text-footnote)", fontWeight: 600, textTransform: "uppercase", opacity: 0.85 }}>
                  {story.eyebrow}
                </span>
                <span style={{ font: "var(--sd-text-title-2)" }}>{story.title}</span>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselViewport>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselIndicatorGroup aria-label="Choose a story">
        {stories.map((story) => (
          <CarouselIndicator key={story.id} aria-label={story.title} />
        ))}
      </CarouselIndicatorGroup>
    </Carousel>
  )
}
