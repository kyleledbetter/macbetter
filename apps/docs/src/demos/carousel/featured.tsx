import { Artwork } from "@dreambase/stardust/artwork"
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
  { id: "focus", eyebrow: "Get started", title: "Set up Focus for deep work", variant: "orbit", palette: "dusk" },
  { id: "photos", eyebrow: "Tips", title: "Find any photo by what's in it", variant: "bloom", palette: "sunset" },
  { id: "keychain", eyebrow: "Security", title: "Move to passkeys in five minutes", variant: "topo", palette: "forest" },
  { id: "journal", eyebrow: "Wellbeing", title: "Start a journal you'll keep", variant: "strata", palette: "berry" },
  { id: "shortcuts", eyebrow: "Power user", title: "Automate your morning with Shortcuts", variant: "prism", palette: "ocean" },
] as const

export default function Example() {
  return (
    <Carousel aria-label="Featured stories" style={{ width: "100%", maxWidth: 720 }}>
      <CarouselViewport>
        <CarouselContent>
          {stories.map((story) => (
            <CarouselItem key={story.id}>
              <Artwork
                seed={story.id}
                variant={story.variant}
                palette={story.palette}
                aspect={16 / 10}
                radius="var(--sd-group-radius)"
              >
                <span style={{ font: "var(--sd-text-footnote)", fontWeight: 600, textTransform: "uppercase", opacity: 0.85 }}>
                  {story.eyebrow}
                </span>
                <span style={{ font: "var(--sd-text-title-2)" }}>{story.title}</span>
              </Artwork>
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
