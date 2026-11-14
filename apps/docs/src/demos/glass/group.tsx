import { Button } from "macbetter/button"
import { Glass, GlassGroup } from "macbetter/glass"
import { Separator } from "macbetter/separator"
import { LocateFixedIcon, MinusIcon, PlusIcon, ShareIcon, StarIcon, Trash2Icon } from "lucide-react"

export default function Example() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 300,
        borderRadius: 18,
        overflow: "hidden",
        backgroundImage: "url(/demos/wallpaper-meadow.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <GlassGroup aria-label="Photo actions" style={{ position: "absolute", insetInlineStart: 16, insetBlockStart: 16 }}>
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Share">
          <ShareIcon aria-hidden="true" />
        </Button>
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Favorite">
          <StarIcon aria-hidden="true" />
        </Button>
        <Separator orientation="vertical" />
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Delete">
          <Trash2Icon aria-hidden="true" />
        </Button>
      </GlassGroup>
      <GlassGroup
        aria-label="Zoom"
        orientation="vertical"
        style={{ position: "absolute", insetInlineEnd: 16, insetBlockStart: 16 }}
      >
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Zoom in">
          <PlusIcon aria-hidden="true" />
        </Button>
        <Separator />
        <Button variant="plain" tone="neutral" shape="circle" aria-label="Zoom out">
          <MinusIcon aria-hidden="true" />
        </Button>
      </GlassGroup>
      <Glass
        shape="circle"
        interactive
        render={<button type="button" aria-label="Show my location" />}
        style={{
          position: "absolute",
          insetInlineEnd: 16,
          insetBlockEnd: 16,
          display: "grid",
          placeItems: "center",
          width: 48,
          padding: 0,
          color: "var(--mb-accent-text)",
        }}
      >
        <LocateFixedIcon aria-hidden="true" size={22} />
      </Glass>
    </div>
  )
}
